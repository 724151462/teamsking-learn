<template>
  <el-dialog
    title="选择课程封面"
    :visible.sync="visible"
    width="920px"
    @close="$emit('closeCoverPreview')">
    <div style="display: inline-flex;flex-wrap:wrap">
      <div class="upload-warp" @click="innerVisible= true">
        <i class="el-icon-upload upload-icon">
          <span style="font-size: 16px">本地上传</span>
        </i>
      </div>
      <div v-for="src in imgSrc" :key="src.id" class="cover-img-warp" style="margin-bottom: 20px;margin-right: 10px;position: relative">
        <img :src="src.assetUrl" alt="" style="width: 280px;height: 160px;cursor: pointer;">
        <div class="img-mark" @click="cover(src.assetUrl)">设为封面</div>
      </div>
    </div>
    <!--图片裁剪框-->
    <el-dialog
      width="1020px"
      title="封面图上传"
      :before-close="handleRemove"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="cropper-content">
        <div class="cropper">
          <vue-cropper ref="cropper"
                       :img="option.img"
                       :autoCrop = true
                       :autoCropWidth ="280"
                       :autoCropHeight="160"
                       :fixed="false"
                       :fixedBox="true"
                       :outputSize="1"
                       @realTime="realTime"></vue-cropper>
        </div>
        <div style="margin-left: 40px;">
          <p>封面图片预览</p>
          <div class="show-preview">
            <div :style="{'width': previews.w+ 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}">
              <!--<p>图片预览</p>-->
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img">
              </div>
            </div>
          </div>
          <p>说明：上传的封面图片宽为:280,高为:160px</p>
          <p>可在左侧图片框内用鼠标滚轮控制图片大小</p>
        </div>
      </div>
      <div style="margin-top: 40px;">
        <label class="el-button el-button--primary" for="uploads">选择本地图片</label>
        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
               @change="uploadImg($event, 1)">
        <el-button @click="down('blob')" type="primary" style="margin-left: 20px;" size="medium">开始上传</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import axios from 'axios'
  import { webUpload} from '@/api/oss'
  import { VueCropper }  from 'vue-cropper'
  import {coverList} from '@/api/course'
  export default {
    components:{
      VueCropper
    },
    data () {
      return {
        visible: this.show,
        imgSrc:[
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/1.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/2.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/3.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/4.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/5.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/6.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/7.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/8.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/9.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/10.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/11.jpg'},
          { assetUrl: 'https://tskedu-course.oss-cn-beijing.aliyuncs.com/teskedu/img/courseCover/12.jpg'},
        ],
        innerVisible:false, // 图片裁剪框
        dialogImageUrl: '',
        dialogVisible: false,
        option:{
          img : ''
        },
        previews:{
          url:'',
          width:'',
          height:''
        },
        imageData:{
          accessid: "",
          dir: "",
          expire: "",
          host: "",
          policy: "",
          signature: "",
        },
        fileName :'',
        imgData :'',
        imgName : '',
        currImgSrc: ''
      };
    },
    props: ['show'],
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleRemove() {
        console.log('关闭')
        let dom = document.getElementById('uploads')
        dom.value = '';
        // dom.outerHTML = dom.outerHTML;
        this.imgData = ''
        this.option.img = ''
        this.innerVisible = false;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //图片裁剪
      realTime(data) {
        this.previews = data;
      },
      down(type) {
        // event.preventDefault()
        var aLink = document.createElement('a')
        aLink.download = 'demo'
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.imgData = data
            this.upInput(data)
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.imgData = data
            this.upInput(data)
            // this.downImg = data
            // aLink.href = data
            // aLink.click()
          })
        }
      },
      cut(){
        this.$refs.cropper.startCrop()
        // 获取截图的blob数据
        this.$refs.cropper.getCropBlob((data) => {
          // do something
          console.log(data)
        })
      },
      uploadImg(e, num) {
        //上传图片
        this.fileName = e.target.files[0].name
        var file = e.target.files[0]
        if (!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是jpeg,jpg,png中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      },
      cover(url){
        this.$emit('chooseCover', url)
      },
      //捕获到文件
      upInput(event){
        this.imgName = new Date().getTime() + 'cover' + this.fileName
        this.ossCheck()
      },
      //获取签证
      ossCheck(name){
        let dir = 'teskedu/img/courseCover'
        this.dir = dir
        let loading = this.$loading({
          lock: true,
          text: '正在努力上传文件',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        webUpload({ossPath:dir})
          .then(res=>{
            //console.log(res)
            if(Number(res.code) === 200) {
              let request = new FormData()
              this.imageData = res.data
              this.imageData.key = res.data.dir + '/' + this.imgName
              request.append('key', res.data.dir + '/' + this.imgName)
              request.append('policy', res.data.policy)
              request.append('OSSAccessKeyId', res.data.accessid)
              request.append('success_action_status', '200')
              request.append('Signature', res.data.signature)
              request.append('file', this.imgData)

              return request
            }else {
              loading.close()
              this.$message.error('获取验签失败，请重试')
            }
          })
          .then(request=>{
            this.startUp(request)
          })
          .then((res)=>{
            loading.close()
            let url = this.imageData.host + '/' + this.imageData.key
            setTimeout(()=>{
              this.imgSrc.unshift({assetUrl: url})
              this.innerVisible = false
            },500)
          })
          .catch(err=>{
            loading.close()
            console.log(err)
            this.$message.error('获取验签失败，请重试')
          })
      },
      //上传文件到OSS
      startUp(request){
        axios({
          method: 'post',
          url: this.imageData.host,
          data: request,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((err)=>{
          console.log('上传成功')
        }).catch(function (error) {
          //console.log(error);
        });
      },
    },
    watch: {
      show () {
        this.visible = this.show;
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .cropper-content
    display flex
    .cropper
      width 400px
      height 300px
    .show-preview
      width 280px
      margin 20px 0;
      height 160px
      border 1px solid #d9d9d9
  .upload-warp
    text-align center
    color: #409EFF;
    cursor pointer
    height 160px
    width 280px
    margin-bottom: 20px;
    margin-right: 10px;
    border 1px dashed #d9d9d9
    .upload-icon
      font-size 28px
      text-align center
      line-height 160px
  .cover-img-warp
    .img-mark
      height 160px
      width 280px
      /*background lightgray*/
      background: rgba(0,0,0,0.4)
      position absolute
      text-align center
      cursor pointer
      line-height 160px
      opacity 0
      font-size 16px
      font-weight bold
      top 0
      color #409EFF
    .img-mark:hover
      opacity 1


  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>