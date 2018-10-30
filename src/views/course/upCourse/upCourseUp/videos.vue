<template>
  <div class="upCourseUp-videos">
    <div class="top-bottom">
      <el-button type="primary" @click="isAddVideo = true">添加</el-button>
    </div>
    <div>
      <el-table
          :data="data"
          border>
        <template v-for="list in tables">
          <template v-if="list.formatter">
            <el-table-column
              :label="list.name"
              align="center">
              <template scope="scope">
                <div>
                  {{list.formatter(scope.row[list.prop],scope.row)}}
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
                align="center"
                :label="list.name"
                :prop="list.prop"
                :width="list.width"
            >
            </el-table-column>
          </template>
        </template>
        <el-table-column
          label="操作"
          align="center"
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
        :title="titleMp4"
        :visible.sync="isVideo"
        width="70%">

      <videosPays :isMp4="propsMp4"></videosPays>

    </el-dialog>
    <!--添加视频-->
    <el-dialog
        title="添加视频"
        :visible.sync="isAddVideo"
        width="70%">

      <addVideos @addVideoClose="addVideoClick"></addVideos>

    </el-dialog>
  </div>
</template>

<script>
  import videosPays from '../../../../components/video-pay.vue'
  import addVideos from './addVideo.vue'
  import { resourcePage } from '../../../../api/course'
  export default {
    components:{
      videosPays,
      addVideos
    },
    data(){
      return{
        tables:[
          {
            name:'视频名称',
            prop:'resourceTitle',
            // width:120
          },
          {
            name:'视频时长',
            prop:'resourceLength',
            width:120
          },
          {
            name:'是否有字幕',
            prop:'srtUrl',  //值为空则无字幕，不为空则有字幕
            width:120,
            formatter:function(val){
              if(val !== ''){
                return '有'
              }else{
                return '无'
              }
            }
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
        isVideo:false,  //是否打开视频弹窗预览视频
        titleMp4:'预览的视频名称',  //预览的视频名称
        propsMp4:'http://vjs.zencdn.net/v/oceans.mp4',  //这个是给子组件的视频地址
        isAddVideo:false, //是否打开添加视频弹窗
        listQuery:{
          resourceType:10, // 10:video 20:doc 30:audio
          pageIndex:1,
          pageSize:10
        },
        courseid:''
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','videos')
      if(this.$route.query.courseid && this.$route.query.courseid !== ''){
        this.courseid = this.$route.query.courseid
        this.getList()
      }
    },
    methods:{
      getList () {
        resourcePage(this.courseid,this.listQuery).then(res=>{
          if(Number(res.code) === 200){
            this.data = res.data.pageData
          }else{
            this.$message({
              message:'视频资源获取出错',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //接受回传
      addVideoClick(e){
        console.log('接受回传',e)
        if (e === 'close') {
          this.isAddVideo = false
        }
      },
      alertVideo(e){
        //这里获取到视频地址传送给子组件进行操作
        // console.log(e)
        this.isVideo = true
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  @import "../../../../assets/css/course/resource.styl"
</style>
