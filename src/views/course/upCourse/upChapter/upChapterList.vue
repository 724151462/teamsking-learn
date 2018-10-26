<template>
  <div class="upChapterList">
    <div v-for="list in chapter" class="chapter-list">
      <div class="chapter-title">
        {{list.name}}
        <span class="right-button">
          <el-button type="primary" size="mini">添加节</el-button>
          <el-button type="primary" size="mini">删除</el-button>
        </span>
      </div>
      <!--这里是章里面的节信息-->
      <div v-for="item in list.joint" class="joint-list">
        <div class="joint-title">{{item.name}}</div>
        <div class="joint-list-activity" v-for="joint in item.types">
          <div class="left">{{Number(joint.type) === 1 ? '测验' : ''}}</div>
          <div class="left">{{Number(joint.type) === 2 ? '作业' : ''}}</div>
          <div class="left">{{Number(joint.type) === 3 ? '讨论' : ''}}</div>
          <div class="left">{{Number(joint.type) === 4 ? '视频' : ''}}</div>
          <div class="left">{{Number(joint.type) === 5 ? '试题' : ''}}</div>
          <div class="right">
            <div class="title">{{joint.title}}</div>
            <div v-if="Number(joint.type) === 1">
              <span>共{{joint.allChapter}}题</span>
              <span>有效次数：{{joint.isStatus}}</span>
              <span>提交时间:{{joint.goTime}}</span>
            </div>
            <div v-if="Number(joint.type) === 2">
              <span>普通作业：{{Number(joint.ispg) === 1 ? '老师' : '助教'}}批改</span>
              <span>提交时间：{{joint.goTime}}</span>
            </div>
            <div v-if="Number(joint.type) === 3">
              提交时间：{{joint.goTime}}
            </div>
            <div v-if="Number(joint.type) === 4">
              时长：{{joint.times}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        ]
      }
    },
    created(){
      let self = this
      this.$nextTick(function () {
        self.upDom()
      })
    },
    methods:{
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
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .has-gutter
    height:0
    background: red
</style>