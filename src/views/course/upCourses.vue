<template>
  <div class="course-up">
    <div class="nav">
        <router-link v-for="list in nav" class="list" :to="list.url">{{list.name}}</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        nav:[
          {
            name:'课程资源',
            url:'/course/upCourses'
          },
          {
            name:'章节内容',
            url:'/course/upCourses/chapter'
          },
          {
            name:'活动',
            url:'/course/upCourses/activityUp'
          },
          {
            name:'成员',
            url:'/course/upCourses/member'
          },
          {
            name:'教学管理',
            url:'/course/upCourses/teaching'
          },
          {
            name:'通知管理',
            url:'/course/upCourses/notice'
          },
          {
            name:'讨论中心',
            url:'/course/upCourses/discuss'
          },
        ]
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
</style>