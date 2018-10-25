<template>
  <div class="course-resource">
    <div class="headers">
      <router-link v-for="list in nav" :to="list.url" :class="isNav === list.isNav ? 'list yes' : 'list'">{{list.name}}</router-link>
    </div>
    <div class="bottom">
      <router-view v-on:resourceNav="resourceNavs"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        nav:[
          {
            name:'视频库',
            url:'/course/upCourses/resource/videos',
            isNav:'videos'
          },
          {
            name:'文档库',
            url:'/course/upCourses/resource/document',
            isNav:'document'
          },
          {
            name:'习题库',
            url:'/course/upCourses/resource/exercise',
            isNav:'exercise'
          },
          {
            name:'活动库',
            url:'/course/upCourses/resource/activity',
            isNav:'activity'
          },
        ],
        isNav:''
      }
    },
    created(){
      this.$emit('upCoursesNav','resource')
    },
    methods:{
      resourceNavs(e){
        console.log(e)
        this.isNav = e
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .course-resource
    margin-top:20px

    .headers
      background:#F4F4F4
      display:inline-block
      padding:10px 5px 0 10px

      .list
        width:120px
        height:40px
        line-height:40px
        text-align: center
        display:inline-block

      .yes
        background:#ffffff

    .bottom
      border:1px solid #F4F4F4
      width:calc(100% - 20px)
      padding:10px
</style>