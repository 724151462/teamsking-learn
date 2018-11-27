<template>
  <div class="upChapterList">
    <div v-for="list in chapter" class="chapter-list">
      <div class="chapter-title-b">
        {{list.chapterName}}
        <span class="right-button">
          <el-button type="primary" size="mini">添加节</el-button>
          <el-button type="primary" size="mini">删除</el-button>
          <i class="el-icon-arrow-up"></i>
        </span>
      </div>
      <!--这里是章里面的节信息-->
      <div v-for="item in list.catalogSection" class="joint-list">
        <div class="joint-title">
          {{item.sectionName}}
          <span class="right">
            <el-button type="primary" size="mini">添加内容</el-button>
          </span>
        </div>
        <!-- 10:视频，20:文档，30:测试，40:作业/任务，50:头脑风暴， 60:投票问卷 -->
        <div class="joint-list-activity" v-for="joint in item.catalogItem">
          <div class="left" v-if="Number(joint.contentType) === 30">测验</div>
          <div class="left" v-if="Number(joint.contentType) === 40">作业</div>
          <div class="left" v-if="Number(joint.contentType) === 50">讨论</div>
          <div class="left" v-if="Number(joint.contentType) === 10">视频</div>
          <div class="right">
            <div class="title">{{joint.resourceTitle}}</div>
            <div v-if="Number(joint.contentType) === 30">
<!--
              <span>共{{joint.allChapter}}题</span>
              <span>有效次数：{{joint.isStatus}}</span>
-->
              <span>提交时间:{{joint.updateId}}</span>
            </div>
            <div v-if="Number(joint.contentType) === 2">
              <span>普通作业：{{Number(joint.ispg) === 1 ? '老师' : '助教'}}批改</span>
              <span>提交时间：{{joint.goTime}}</span>
            </div>
            <div v-if="Number(joint.contentType) === 3">
              提交时间：{{joint.goTime}}
            </div>
            <div v-if="Number(joint.contentType) === 10" class="time-length">
              时长：{{joint.resourceLength}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { chaptersList } from '../../../../api/course'
  export default {
    data(){
      return{
        chapter:[
          {
            name:'第一章',
            joint:[
              {
                name:'第一节',
                types:[
                  {
                    type:'1', //类型 1 测验 2 作业 3 讨论 4 视频 5 试题
                    title:'我是测验',
                    allChapter:'2', //共 x 题
                    isStatus:'3', //有效次数 大于999 等于 无限次
                    goTime:'2018-1-1',  //提交时间
                  },
                  {
                    type:'2', //类型 1 测验 2 作业 3 讨论 4 视频 5 试题
                    title:'我是作业',
                    ispg:'1', //作业批改人 1 老师 2 助教
                    goTime:'2018-1-1',  //提交时间
                  },
                  {
                    type:'3', //类型 1 测验 2 作业 3 讨论 4 视频 5 试题
                    title:'我是作业',
                    goTime:'2018-1-1',  //提交时间
                  },
                  {
                    type:'4', //类型 1 测验 2 作业 3 讨论 4 视频 5 试题
                    title:'我是视频',
                    times:'59'
                  },
                ]
              }
            ]
          },
          {
            name:'第二章',
            joint:[
              {
                name:'第一节',
                types:[
                  {
                    type:'1', //类型 1 测验 2 作业 3 讨论 4 视频 5 试题
                    title:'我是测验',
                    allChapter:'2', //共 x 题
                    isStatus:'3', //有效次数 大于999 等于 无限次
                    goTime:'2018-1-1',  //提交时间
                  }
                ]
              }
            ]
          },
        ],
        isAddButton:false,
        courseid:''
      }
    },
    created(){
      if(this.$route.query.courseid && this.$route.query.courseid !== ''){
        this.courseid = this.$route.query.courseid
        this.getList()
      }
      let self = this
/*
      this.$nextTick(function () {
        self.upDom()
      })
*/
    },
    methods:{
      getList () {
        chaptersList(this.courseid).then(res=>{
          console.log(res)
          if(Number(res.code) === 200){
            this.chapter = res.data
          }else{
            this.$message({
              message:'获取章节失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
/*
      upDom(){
        // let dom = document.querySelectorAll('.has-gutter')
        let allDom = document.getElementById('upChapterList')
        let dom = document.getElementsByClassName('has-gutter')
        // console.log(dom)
        for (let i = 0; i < dom.length; i++){
          // removeChild
          allDom.removeChild(dom[i])
          // dom[i].style.background = 'red'
        }
      }
*/
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .upChapterList
    padding-top:10px
    max-width:1000px

    .chapter-list
      .chapter-title-b
        overflow:hidden
        border-bottom:1px solid #E4E4E4
        line-height:40px
        font-size:22px

        .right-button
          float:right

      .joint-list
        padding-bottom:10px
        padding-top:10px
        margin-left:20px

        .joint-title
          border-bottom:1px solid #E4E4E4
          padding-bottom:10px
          overflow:hidden

          .right
            float:right
            padding-right:20px

        .joint-list-activity
          padding-top:10px
          padding-bottom:10px
          display: flex
          flex-direction:row
          align-items:center
          border-bottom:1px solid #E4E4E4

          .left
            width:50px
            height:50px
            background: red
            color:#ffffff
            -webkit-border-radius: 50%
            -moz-border-radius: 50%
            border-radius: 50%
            line-height:50px
            text-align: center
            margin-right:10px

          .right
            .time-length
              font-size: 14px
              color:#a5a3a3
              padding-top:5px
</style>
