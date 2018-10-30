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
        <el-button size="small" type="primary">添加</el-button>
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
            align="center"
            :width="list.width">
        </el-table-column>
        <el-table-column
            label="操作"
            width="160"
            align="center"
        >
          <template slot-scope="scope">
            <a class="preview" :href="scope.row.resourceUrl">预览</a>
            <a class="preview" @click="deletes(scope.row)">删除</a>
            <!--<a class="preview" @click="alertVideo(scope.row)" href="scope.row.resourceUrl">预览</a>-->
            <a class="down" :href="scope.row.resourceUrl">下载</a>
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
  import { resourcePage, deletedResource } from '../../../../api/course'
  export default {
    data(){
      return{
        tables:[
          {
            name:'文档名称',
            prop:'resourceTitle',
            // width:120
          },
          {
            name:'文档类型',
            prop:'contentType',
            width:120
          },
          {
            name:'发布人',
            prop:'creatorId',
            width:120
          },
          {
            name:'发布时间',
            prop:'createTime',
            width:120
          },
        ],
        data:[],
        isDocument:false,  //是否打开弹窗预览
        courseid:'',
        listQuery:{
          resourceType:20, // 10:video 20:doc 30:audio
          pageIndex:1,
          pageSize:10
        }
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','document')
      if(this.$route.query.courseid && this.$route.query.courseid !== '') {
        this.courseid = this.$route.query.courseid
        this.getList()
      }
    },
    methods:{
      deletes (e) {
        deletedResource(e.resourceId).then(res=>{
          // console.log(res)
          if(Number(res.code) === 200){
            this.getList()
            this.$message({
              message:'删除成功',
              type:'success'
            })
          }else{
            this.$message({
              message:res.msg,
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      getList () {
        resourcePage(this.courseid,this.listQuery).then(res=>{
          if(Number(res.code) === 200){
            this.data = res.data.pageData
          }else{
            this.$message({
              message:'获取文档数据错误',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
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
