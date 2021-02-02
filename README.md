# xp-multipart

## 一、概述

- uniapp官方提供的uni.uploadFile一次只能上传一个图片，xp-multipart既可以用来发送普通的表单数据，也可以同时上传多个图片文件

- 为<font color=#FF0000>微信小程序</font>封装的，其余平台暂未考虑；<font color=#00ff00>app和h5</font>直接使用uni.uploadFile即可

- 底层依然使用uni.request 进行封装，因此小程序管理后台设置了request的合法域名可以正常使用

## 二、在项目中使用

- url 接口地址
- fields 表单数据
- files 文件图片
- header 请求头（函数中content-type为multipart/form-data，不可也无需再设置）

若以回调函数的形式(success,fail,complete)获取结果，将不再返回Promise，反之则返回Promise


```js

import {
    multipartUpload as upload
} from "@/utils/xp-multipart.js"

//1、回调函数
uni.chooseImage({
    count: 2,//选择两张图片
    success(res) {
        upload({
            url: "http://localhost:6891/upload", //后端接口
            fields: {
                username: "张三",
                age: 24
            },
            files: {
                avatar: res.tempFilePaths[0],
                img: res.tempFilePaths[1]
            },
            success(res) {
                console.log(res)
            },
            fail(err) {
                console.log(err)
            },
            complete(ret) {
                console.log(ret)
            }
        })
    }
})

//2、你也可以链式调用
uni.chooseImage({
    count: 2,//选择两张图片
    success(res) {
        upload({
            url: "http://localhost:6891/upload", //后端接口
            fields: {
                username: "张三",
                age: 24
            },
            files: {
                avatar: res.tempFilePaths[0],
                img: res.tempFilePaths[1]
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
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