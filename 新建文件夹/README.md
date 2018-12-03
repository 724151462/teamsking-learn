涉及上传内容均未接入，具体接入请参考下面的上传组件 up-oss

    //公共上传接口（分片上传）上传成功用 ossUp 方法接收
    components/up-oss.vue
    
    登陆页面相关密码值目前先注释，后台开启相关值需要输入再放出来

    //视频播放组件
    components/video-pay
        sources.src    //视频播放地址
        poster  //封面地址
        
        这个组件传入 isMp4（视频地址）、cover（封面地址）就可以了