<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<button @click="mpSelectImg">选择图片</button>
		<!-- #endif -->

		<!-- #ifdef H5 -->
		<button @click="h5SelectImg">选择图片</button>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		multipartUpload as upload
	} from "@/utils/xp-multipart.js"
	export default {
		methods: {
			h5SelectImg() {
				uni.chooseImage({
					count: 2,
					success(res) {
						upload({
							url: "http://localhost:6891/upload", //后端图片接口
							fields: {
								username: "张三",
								age: 28
							},
							files: {
								avatar: res.tempFiles[0]
							},
							success(res) {}
						})
					}
				})
			},
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
