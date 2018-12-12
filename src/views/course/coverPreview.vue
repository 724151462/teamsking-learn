<template>

  <!--
  show: false,
  dialogConfig: {
      btnShow: true,
      title: '查看笔记',
      width: '40',
      labelWidth: '120',
      top: '20',
      inputWidth: '70',
      eventType: ''
  },
  dataObj: {
      notesTitle: '笔记123',
      fbr: '小明',
      fbsj: '2018-11-29',
      noteContent: 'werwrq'
  },
  formData: [
            {
              key: '笔记标题：',
              inputType: 'string',
              value: 'notesTitle'
            },
            {
              key: '发布人：',
              inputType: 'string',
              value: 'fbr'
            },
            {
              key: '发布日期：',
              inputType: 'string',
              value: 'fbsj'
            },
            {
              key: '笔记内容：',
              inputType: 'string',
              value: 'notesContent'
            },
            {
              key:'笔记图片',
              inputType:'img',
              value:'imgSrc',
              imgWidth: 50
            },
          ]


  <adialog :dialogConfig="dialogConfig"
        :dataObj="dataObj"
        :formData="formData"
        @showComponentInfo="showComponentInfo"
        :show.sync="show">
        </adialog>
  -->
  <el-dialog
    title="选择课程封面"
    :visible.sync="visible"
    width="910px"
    @close="$emit('closeCoverPreview')">
      <!--<el-upload-->
        <!--class="avatar-uploader"-->
        <!--action="https://jsonplaceholder.typicode.com/posts/"-->
        <!--:show-file-list="false"-->
        <!--:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">-->

        <!--<img v-if="Course.courseCover" :src="Course.courseCover" class="avatar">-->
        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      <!--</el-upload>-->
    <!--<el-upload-->
      <!--action="https://jsonplaceholder.typicode.com/posts/"-->
      <!--style="margin-bottom: 20px"-->
      <!--list-type="picture-card"-->
      <!--:show-file-list="true"-->
      <!--:on-preview="handlePictureCardPreview"-->
      <!--:before-upload="beforeAvatarUpload"-->
      <!--:on-remove="handleRemove">-->
      <!--<i class="el-icon-plus"></i>-->
    <!--</el-upload>-->
    <!--<el-dialog :visible.sync="dialogVisible">-->
      <!--<img width="100%" :src="dialogImageUrl" alt="">-->
    <!--</el-dialog>-->
    <el-button type="primary" @click="innerVisible= true">本地上传</el-button>
    <div style="display: inline-flex;flex-wrap:wrap">
      <div v-for="src in imgSrc" :key="src.id" style="margin-bottom: 20px;margin-right: 10px;">
        <img :src="src.imgUrl" alt="" style="width: 280px;height: 160px;cursor: pointer;">
      </div>
    </div>
    <!--图片裁剪框-->
    <el-dialog
      width="80%"
      title="封面图上传"
      :visible.sync="innerVisible"
      append-to-body>
      <div class="cropper-content">
        <div class="cropper">
          <vue-cropper ref="cropper"
                       :img="imgSrc[0].imgUrl"
                       :autoCrop = true
                       :autoCropWidth ="280"
                       :autoCropHeight="160"
                       :fixed="false"
                       :fixedBox="true"
                       :outputSize="1"
                       @realTime="realTime"></vue-cropper>
        </div>
        <div>
          <p>封面图片预览</p>
          <div class="show-preview" :style="{'width': previews.w+ 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
            <!--<p>图片预览</p>-->
            <div :style="previews.div" class="preview">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </div>

      </div>
      <div>
        <el-button @click="cut()">裁剪</el-button>

        <el-button @click="down('blob')">下载</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { VueCropper }  from 'vue-cropper'

  export default {
    components:{
      VueCropper
    },
    data () {
      return {
        visible: this.show,
        imgSrc:[
          {imgUrl: require("@/assets/images/cover/1.jpg")},
          {imgUrl: require("@/assets/images/cover/2.jpg")},
          {imgUrl: require("@/assets/images/cover/3.jpg")},
          {imgUrl: require("@/assets/images/cover/4.jpg")},
          {imgUrl: require("@/assets/images/cover/5.jpg")},
          {imgUrl: require("@/assets/images/cover/6.jpg")}
        ],
        imageUrl:'',
        innerVisible:false, // 图片裁剪框
        dialogImageUrl: '',
        dialogVisible: false,
        previews:{
          url:'',
          width:'',
          height:''
        }
      };
    },
    props: ['show'],
    created(){
    },
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
      //课程图，裁剪
      realTime(data) {
        console.log(data)
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
      border 2px solid red
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