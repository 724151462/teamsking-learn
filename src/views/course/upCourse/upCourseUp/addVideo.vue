<template>
  <div>
    <el-form :model="data" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="视频标题" required>
        <el-input v-model="data.name" style="width: 220px;"></el-input>
        <div>建议命名模式，如：“第一讲 计算机基础知识”</div>
      </el-form-item>

      <el-form-item label="添加视频" required>
        <div>这里是有视频数据的list</div>
        <el-button type="primary" @click="isDialog = true">添加视频</el-button>
        <div>仅支持单个视频</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="routerClose(0)">取 消</el-button>
      <el-button type="primary" @click="innerVisible = true">确定</el-button>
    </div>
    <el-dialog
        width="70%"
        :visible.sync="isDialog"
        append-to-body>
      <div class="center">
        <div class="left">
          <div>
            <el-button type="primary">上传视频</el-button>
            <div class="go-video">请上传格式为MP4且小于2G的视频</div>
            <el-button type="primary">上传视频字幕</el-button>
            <div class="go-srt">请上传srt格式的字幕</div>
          </div>
        </div>
        <div class="right">
          <!--有视频的显示-->
          <courseVideo :props="data.videoAddress" v-if="data.videoAddress !== ''"></courseVideo>
          <!--没有视频的显示-->
          <div v-else class="no-data">暂无视频</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import courseVideo from '../../../../components/video-pay.vue'
  export default {
    components:{
      courseVideo
    },
    data(){
      return{
        data:{
          title:'', //视频标题
          videoAddress:'http://vjs.zencdn.net/v/oceans.mp4',  //视频地址
          videoZM:'', //视频字幕地址
        },
        options:[
          {
            value: '选项1',
            label: '黄金糕'
          }
        ],
        isDialog:false
      }
    },
    methods:{
      routerClose(e){
        if (Number(e) === 0) {
          this.$emit('addVideoClose','close')
          return false
        }

      },
      //图片上传方法
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
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
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .center
    display: flex
    flex-direction: row
    justify-content:space-around

    .left
      width:30%
      font-size:14px

      .go-video
        padding-top: 10px
        margin-bottom:50px

      .go-srt
        padding-top:10px

    .right
      width:50%
      color:#ffffff

      .no-data
        width:300px
        height:200px
        line-height:200px
        text-align:center
        background: #333333

  .avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden

  .avatar-uploader .el-upload:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 78px
    height: 78px
    line-height: 78px
    text-align: center
    border:1px solid #ded5d5

  .avatar
    width: 178px
    height: 178px
    display: block

  .dialog-footer
    text-align:right

</style>