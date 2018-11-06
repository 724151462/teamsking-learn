<template>
  <div class="course-up">
    <div class="nav">
      <a v-for="list in nav" :class="navs === list.isNav ? 'list yes' : 'list'" @click="goUrl(list.url)">{{list.name}}</a>
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
        navs:'resource',
        courseid:''
      }
    },
    created(){
      if(this.$route.query.courseid && this.$route.query.courseid !== ''){
        this.courseid = this.$route.query.courseid
      }
    },
    methods:{
      goUrl (e) {
        this.$router.push({
          path:e,
          query:{
            courseid:this.courseid
          }
        })
      },
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
