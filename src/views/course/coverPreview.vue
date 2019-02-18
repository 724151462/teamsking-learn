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
  import oss from 'ali-oss'
  import { ossAliSts } from '@/api/oss'
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
        ossData:null,
        fileData:null,
        isError:3,
        imgData :'',
        currImgSrc: ''
      };
    },
    props: ['show'],
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
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
            // this.downImg = window.URL.createObjectURL(data)
            // aLink.href = window.URL.createObjectURL(data)
            // aLink.click()
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
        // this.option.img
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
      upInput (event) {
        console.log('1',event)
        if(event){
          this.fileData = event
        }
        //这里加一个获取验签信息的错误处理
        if (Number(this.isError) === 0) {
          this.errors()
          return false
        }
        if (this.ossData === null && Number(this.isError) !== 0) {
          this.ossCheck()
          return false
        }
        let file = new File([event], event.size , {type: event.type})
        console.log(file)
        let curType = event.type.split('/')
        let name = `${new Date().getTime()}${file.name}.${curType[1]}`
        // let name = new Date().getTime() + file.name + curType[1]
        if (file.size > this.size) {
          this.$message({
            message: '上传文件超出可上传范围，请重新选择文件上传',
            type: 'error'
          })
          // this.inputNull()
          return false
        }
        let client = new oss(this.ossData)
        name = 'teskedu/img/courseCover/' + name
        //多文件上传请修改这里
        this.forInputs(client,name,file)
      },
      forInputs (client,name,file) {

        let self = this
        client.multipartUpload(name, file, {
          progress(p, checkpoint){
            //反回的 p 是当前进度，大概1s会返回一个进度的样子，下面处理了下百分比，checkpoint 是具体的数据流上传，不做暂停效果可以不考虑用它
            console.log('进度返回', p, checkpoint)
            self.schedule = (p.toFixed(2) * 100) + '%'
          }
        }).then((results) => {
          console.log('then返回',results)
          // http://tskedu-course.oss-cn-beijing.aliyuncs.com/ + name = 完整的url
          self.$message({
            message:'上传成功',
            type:'success'
          })
          Number(self.isError) !== 2 ? (self.isError = 2) : ''
          let url = 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/' + name
          this.imgSrc.unshift({assetUrl: url})
          this.innerVisible = false
        }).catch(error=>{
          console.log(error)
          //返回错误之后如验签过期则直接进行请求，否则提示管理员来处理
          self.ossCheck('error')
        })
      },
      ossCheck (e) {
        console.log('e的监控数据',e , this.isError)
        if (Number(this.isError) === 0) {
          this.errors()
          return false
        }
        this.isError -= 1
        ossAliSts().then(res => {
          if (Number(res.code) === 200) {
            this.ossData = JSON.parse(res.data)
            console.log('给到验签', this.ossData)
            this.upInput(this.imgData)
          } else {
            this.ossCheck()
          }
        }).catch(error => {
          //验签数据错误 / 过期，执行重试，3次后直接返回错误
          this.ossCheck()
        })
      },
      errors () {
        this.$message({
          message: '验签获取错误，请联系管理员',
          type: 'error'
        })
      }
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