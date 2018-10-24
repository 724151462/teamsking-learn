<template>
  <div class="upCourseUp-videos">
    <div class="top-bottom">
      <el-button type="primary" @click="isAddVideo = true">添加</el-button>
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
            prop:'name',
            // width:120
          },
          {
            name:'视频时长',
            prop:'time',
            width:120
          },
          {
            name:'是否有字幕',
            prop:'isz',
            width:120
          },
          {
            name:'视频简介',
            prop:'jj',
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
            name:'xx视频',  //视频名称
            time:'1:30',    //视频时长
            isz:1,    //是否有字幕 1有 2 没有
            jj:'我是简介',  //视频简介
            fbr:'x老师',  //发布人
            fbtime:'2018-1-1',  //发布时间
          }
        ],
        isVideo:false,  //是否打开视频弹窗预览视频
        titleMp4:'预览的视频名称',  //预览的视频名称
        propsMp4:'http://vjs.zencdn.net/v/oceans.mp4',  //这个是给子组件的视频地址
        isAddVideo:false, //是否打开添加视频弹窗
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','videos')
    },
    methods:{
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