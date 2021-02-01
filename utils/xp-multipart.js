import mines from "mime-db"

const br = '\r\n'
const br2 = '\r\n\r\n'
const boundary = generateBoundary()
const splitBoundary = "--" + boundary

export async function multipartUpload({
	url,
	header,
	fields,
	files,
	success,
	fail
}) {
	let data = await toBuf(fields, files)
	return uni.request({
		url,
		data,
		method: "POST",
		header: {
			...header,
			'Content-Type': 'multipart/form-data; boundary=' + boundary
		},
		success(c) {
			success(c)
		},
		fail(f) {
			fail(f)
		}
	})
}

function isH5() {
	let platform = "MP-WEIXIN"
	// #ifdef H5
	platform = "H5"
	// #endif
	return platform === "H5"
}
/**
 * 转换成二进制流
 * @param {Object} fields
 */
async function toBuf(fields, files) {
	let buffers = []
	buffers.push(fields2Buf(fields))

	for (const key in files) {
		let buf,
			header
		// #ifdef H5
		let obj = files[key]
		const {
			type: contentType,
			name: filename
		} = obj
		header = `${splitBoundary}${br}Content-Disposition:form-data;name="${key}";filename="${filename}"${br}`
		header += `Content-Type: ${contentType}${br2}`
		buf = await getFileBuf(files[key])
		// #endif

		// #ifdef MP-WEIXIN
		const filePath = files[key]
		const contentType = getType(filePath)

		let filename = ''
		const matchArr = filePath.match(/(?:(?!\/).)*$/)
		if (matchArr) filename = matchArr[0]
		header = `${splitBoundary}${br}Content-Disposition:form-data;name="${key}";filename="${filename}"${br}`
		header += `Content-Type: ${contentType}${br2}`

		buf = await getFileBuf(filePath)
		// #endif
		buffers.push(toUTF8Bytes(header))
		buffers.push(new Uint8Array(buf))
		buffers.push(toUTF8Bytes(br))
	}

	buffers.push(toUTF8Bytes(splitBoundary + "--")) //结尾
	
	const len = buffers.reduce((prev, cur) => {
		return prev + cur.length
	}, 0)
	let arrayBuffer = new ArrayBuffer(len)
	let buffer = new Uint8Array(arrayBuffer)
	let sum = 0

	for (let i = 0; i < buffers.length; i++) {
		for (let j = 0; j < buffers[i].length; j++) {
			buffer[sum + j] = buffers[i][j]
		}
		sum += buffers[i].length
	}
	return arrayBuffer
}

function fields2Buf(fields) {
	let data = ''
	for (const key in fields) {
		data += `${splitBoundary}${br}`
		data += `Content-Disposition: form-data; name="${key}"${br2}`
		data += `${fields[key]}${br}`
	}
	return toUTF8Bytes(data)
}

function getFileBuf(parma) {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		wx.getFileSystemManager().readFile({
			filePath: parma,
			success(res) {
				resolve(res.data)
			},
			fail(err) {
				console.error(err.errMsg)
			}
		})
		// #endif
		// #ifdef H5
		const fr = new FileReader()
		fr.readAsArrayBuffer(parma);
		fr.onload = e => {
			resolve(e.target.result)
		}
		fr.onerror = e => {
			console.error(e.errMsg)
		}
		// #endif
	})
}
/**
 * 生成boundary
 */
function generateBoundary() {
	let boundary = "----WebKitFormBoundary"
	const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	const len = chars.length
	for (let i = 0; i < 16; i++) {
		boundary += chars.charAt(~~(Math.random() * len));
	}
	return boundary;
}

/**
 * 字符串转UTF-8 二进制流
 * @param {String} str
 */
function toUTF8Bytes(str) {
	let bytes = [];
	for (let i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		if (0x00 <= code && code <= 0x7f) {
			bytes.push(code);
		} else if (0x80 <= code && code <= 0x7ff) {
			bytes.push((192 | (31 & (code >> 6))));
			bytes.push((128 | (63 & code)))
		} else if ((0x800 <= code && code <= 0xd7ff) || (0xe000 <= code && code <= 0xffff)) {
			bytes.push((224 | (15 & (code >> 12))));
			bytes.push((128 | (63 & (code >> 6))));
			bytes.push((128 | (63 & code)))
		}
	}
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] &= 0xff;
	}
	return bytes
}
/**
 * 获取文件类型
 * @param {Object} url
 */
function getType(url) {
	const index = url.lastIndexOf(".");
	const ext = url.substr(index + 1);
	for (let k in mines) {
		if (mines[k].extensions == undefined) continue
		if (mines[k].extensions.indexOf(ext) !== -1) return k
	}
	return null
}
