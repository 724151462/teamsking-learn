<template>
  <div class="teaching">
    <div class="header">
      <router-link
        :class="list.isNav === isNav ? 'list yes' : 'list'"
        v-for="list in nav"
        :to="list.url">{{list.name}}</router-link>
    </div>
    <div class="buttom">
      <router-view v-on:teachingNav="teachingNavs"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        nav:[
          {
            name:'成绩管理',
            url:'/course/upCourses/teaching/grade',
            isNav:'grade'
          },
          {
            name:'笔记管理',
            url:'/course/upCourses/teaching/notes',
            isNav:'notes'
          },
          {
            name:'作业管理',
            url:'/course/upCourses/teaching/operation',
            isNav:'operation'
          },
          {
            name:'测验',
            url:'/course/upCourses/teaching/test',
            isNav:'test'
          },
          {
            name:'头脑风暴',
            url:'/course/upCourses/teaching/storm',
            isNav:'storm'
          },
          {
            name:'投票问卷',
            url:'/course/upCourses/teaching/questionnaire',
            isNav:'questionnaire'
          },
          {
            name:'视频',
            url:'/course/upCourses/teaching/videos',
            isNav:'videos'
          },
        ],
        isNav:'grade'
      }
    },
    created(){
      this.$emit('upCoursesNav','teaching')
    },
    methods:{
      teachingNavs(e){
        this.isNav = e
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .teaching
    padding-top:10px

    .header
      background: #f4f4f4
      display: inline-block
      padding: 10px 5px 0 10px

      .list
        width: 120px
        height: 40px
        line-height: 40px
        text-align: center
        display: inline-block

      .yes
        background: #ffffff

    .buttom
      border: 1px solid #f4f4f4
      width: calc(100% - 20px)
      padding: 10px
</style>
