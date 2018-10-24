<template>
  <div class="upCourseUp-videos">
    <div class="top-bottom">
      <!--<el-button type="primary">添加</el-button>-->
      <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <div>
      <el-table
          :data="data"
          border>
        <el-table-column
            v-for="list in tables"
            :prop="list.prop"
            :label="list.name"
            :width="list.width">
        </el-table-column>
        <el-table-column
            label="操作"
            width="120"
        >
          <template slot-scope="scope">
            <a class="preview" @click="alertVideo(scope.row)">预览</a>
            <a class="down">下载</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--视频播放组件-->
    <el-dialog
        :visible.sync="isDocument"
        width="70%">

      <div>这里打开弹窗</div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        tables:[
          {
            name:'文档名称',
            prop:'name',
            // width:120
          },
          {
            name:'文档类型',
            prop:'time',
            width:120
          },
          {
            name:'发布人',
            prop:'fbr',
            width:120
          },
          {
            name:'发布时间',
            prop:'fbtime',
            width:120
          },
        ],
        data:[
          {
            name:'xx文档',  //视频名称
            time:'word',    //视频时长
            fbr:'x老师',  //发布人
            fbtime:'2018-1-1',  //发布时间
          }
        ],
        isDocument:false,  //是否打开弹窗预览
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','document')
    },
    methods:{
      //上传成功后直接刷新文档库内容
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        console.log(file)
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
      alertVideo(e){
        //这里获取到视频地址传送给子组件进行操作
        // console.log(e)
        this.isDocument = true
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  @import "../../../../assets/css/course/resource.styl"
</style>