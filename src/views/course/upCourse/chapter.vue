<template>
  <div>
    <div>
      <span>教学模式:</span>
      <el-radio v-model="radio" label="1">开放模式</el-radio>
      <el-radio v-model="radio" label="2">传统学习</el-radio>
      <el-radio v-model="radio" label="3">顺序学习</el-radio>
      <el-radio v-model="radio" label="4">条件闯关</el-radio>
      <span>
        <el-button type="primary">保存</el-button>
        <el-button type="primary">发布</el-button>
      </span>
    </div>
    <div>
      <el-button type="primary">添加章</el-button>
    </div>
    <upChapter></upChapter>
  </div>
</template>

<script>
  import upChapter from './upChapter/upChapterList.vue'
  export default {
    components:{
      upChapter
    },
    data(){
      return{
        radio:'1',
        //章节信息结构
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
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    created(){
      this.$emit('upCoursesNav','chapter')
    }
  }
</script>

<style scoped>

</style>