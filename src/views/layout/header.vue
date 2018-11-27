<template>
    <div class="header">
        <router-link to="/course" class="login">
            <span>天擎智教</span>
            <span class="sizes">后台管理</span>
        </router-link>
        <router-link :to="list.url" v-for="(list, index) in nav" :class="navs === list.isNav ? 'list yes-list' : 'list'" :key="index">{{list.name}}</router-link>
    </div>
</template>

<script>
  export default {
    props:['navs'],
    data(){
      return{
        nav:[
          {
            name:'课程中心',
            url:'/course',
            isNav:'course'
          },
          {
            name:'学习管理',
            url:'/learn',
            isNav:'learn'
          },
          {
            name:'校管中心',
            url:'/school',
            isNav:'school'
          },
          {
            name:'系统管理',
            url:'/system',
            isNav:'system'
          }
        ],
      }
    },
    created(){
    },
    methods:{
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
    .header
        width:100%
        height:60px
        background: #464C5C
        display: flex

        .login
            color: #ffffff
            font-size:30px
            line-height:60px
            padding-left:20px
            margin-right:80px

            .sizes
              font-size:16px
              margin-left:10px
              margin-top:20px
              position: relative
              bottom:-3px

        .list
            display:inline-block
            font-size:18px
            color:#ffffff
            height:60px
            line-height:60px
            padding-left:10px
            padding-right:10px
            margin-right:10px

        .yes-list
            background: #697583
</style>
