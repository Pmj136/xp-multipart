<template>
	<view>
		<button @click="mpSelectImg">选择图片</button>
	</view>
</template>

<script>
	import {
		multipartUpload as upload
	} from "@/utils/xp-multipart.js"
	export default {
		methods: {
			mpSelectImg() {
				uni.chooseImage({
					count: 2,
					success(res) {
						upload({
							url: "http://localhost:6891/upload",
							fields: {
								username: "张三",
								age: 28
							},
							files: {
								avatar: res.tempFilePaths[0]
							},
							success(res) {}
						})
					}
				})
			}
		}
	}
</script>

<style scoped>

</style>
