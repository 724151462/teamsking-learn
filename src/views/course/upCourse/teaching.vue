<template>
  <div>
    <div>123</div>
    <div>
      <router-link
        v-for="list in nav"
        :to="list.url">{{list.name}}</router-link>
    </div>
    <div>
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

<style scoped>

</style>