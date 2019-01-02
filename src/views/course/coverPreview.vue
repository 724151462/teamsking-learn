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
      <div v-for="src in imgSrc" :key="src.assetId" class="cover-img-warp" style="margin-bottom: 20px;margin-right: 10px;position: relative">
        <img :src="src.assetUrl" alt="" style="width: 280px;height: 160px;cursor: pointer;">
        <div class="img-mark" @click="cover(src.imgUrl)">设为封面</div>
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
  import { VueCropper }  from 'vue-cropper'
  import {coverList} from '@/api/course'
  export default {
    created(){
      coverList().then(res=>{
        console.log(res)
        if(Number(res.code) === 200) {
          this.imgSrc = res.data
        }else if(Number(res.code) === 440){
          let msgs = JSON.parse(res.msg)
          this.$message({
            message:msgs[0].message,
            type:'error'
          })
        }
      })
    },
    components:{
      VueCropper
    },
    data () {
      return {
        visible: this.show,
        imgSrc:[
          {assetId: 0, assetUrl: ''}
        ],
        innerVisible:false, // 图片裁剪框
        dialogImageUrl: '',
        dialogVisible: false,
        option:{
          img : '' || require("@/assets/images/cover/1.jpg"),
        },
        previews:{
          url:'',
          width:'',
          height:''
        }
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
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data
            aLink.href = data
            aLink.click()
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