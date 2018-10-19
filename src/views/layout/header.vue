<template>
    <div class="header">
        <router-link to="/course" class="login">天擎智教</router-link>
        <router-link :to="list.url" v-for="list in nav" class="list">{{list.name}}</router-link>
    </div>
</template>

<script>
  export default {
    data(){
      return{
        nav:[
          {
            name:'课程中心',
            url:'/course',
          },
          {
            name:'学习管理',
            url:''
          },
          {
            name:'校管中心',
            url:'/school'
          },
          {
            name:'系统管理',
            url:'/system'
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
        background: #595E6C
        display: flex

        .login
            color: #ffffff
            font-size:30px
            line-height:60px
            padding-left:20px
            margin-right:30px

        .list
            display:inline-block
            background: #697583
            font-size:18px
            color:#ffffff
            height:60px
            line-height:60px
            padding-left:10px
            padding-right:10px
            margin-right:10px

        .yes-list
            background: #15B5B1
</style>