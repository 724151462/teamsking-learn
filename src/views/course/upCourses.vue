<template>
  <div class="course-up">
    <div class="nav">
        <router-link v-for="list in nav" :class="navs === list.isNav ? 'list yes' : 'list'" :to="list.url">{{list.name}}</router-link>
    </div>
    <router-view v-on:upCoursesNav="upCoursesNav"></router-view>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        nav:[
          {
            name:'课程资源',
            url:'/course/upCourses',
            isNav:'resource'
          },
          {
            name:'章节内容',
            url:'/course/upCourses/chapter',
            isNav:'chapter'
          },
          {
            name:'活动',
            url:'/course/upCourses/activityUp',
            isNav:'activityUp'
          },
          {
            name:'成员',
            url:'/course/upCourses/member',
            isNav:'member'
          },
          {
            name:'教学管理',
            url:'/course/upCourses/teaching',
            isNav:'teaching'
          },
          {
            name:'通知管理',
            url:'/course/upCourses/notice',
            isNav:'notice'
          },
          {
            name:'讨论中心',
            url:'/course/upCourses/discuss',
            isNav:'discuss'
          },
        ],
        navs:'resource'
      }
    },
    methods:{
      upCoursesNav(e){
        this.navs = e
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .course-up
    .nav
      .list
        font-size:22px
        margin-right:20px

      .yes
        color:#538F8C
</style>