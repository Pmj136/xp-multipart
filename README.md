# xp-multipart

uniapp官方提供的uni.uploadFile一次只能上传一个文件，xp-multipart既可以用来发送普通的表单数据
(可替代uni.request)，也可以同时上传多个图片文件

## 一、概述
 底层依然使用uni.request 进行封装，因此小程序管理后台设置了request的合法域名可以正常使用

## 二、在项目中使用

```js

import {
    multipartUpload as upload
} from "@/utils/xp-multipart.js"

//1、回调函数
uni.chooseImage({//选择一张图片
    success(res) {
        upload({
            url: "http://localhost:6891/upload", //后端接口
            fields: {
                username: "张三",
                age: 24
            },
            files: {
                avatar: res.tempFilePaths[0] //h5平台为 res.tempFiles[0]
            },
            success(res) {
                console.log(res)
            }
        })
    }
})

//2、你也可以链式调用
uni.chooseImage({
    success(res) {//选择一张图片
        upload({
            url: "http://localhost:6891/upload", //后端接口
            fields: {
                username: "张三",
                age: 24
            },
            files: {
                avatar: res.tempFilePaths[0] //h5平台为 res.tempFiles[0]
            }
        }).then(res => {
            console.log(res)
        })
    }
})

```
### 附上后端接口示例（这里用的是spring-boot）
```java
    @PostMapping("/upload")
    public String upload(@RequestParam("username") String name,
                         @RequestParam("age") Integer age,
                         MultipartFile avatar) {
        System.out.println(name);
        System.out.println(age);
        System.out.println(avatar.getOriginalFilename());
        return "success";
    }
```
### 喜欢的话给个star吧！