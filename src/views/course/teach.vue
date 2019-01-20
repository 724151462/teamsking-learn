<template>
  <div class="teaching">
    <div class="header">
      <router-link
        :class="list.isNav === isNav ? 'list yes' : 'list'"
        v-for="(list, index) in nav"
        :key="index"
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
            url:{name: "成绩管理", query: {id: this.$route.query.id}},
            isNav:'grade'
          },
          {
            name:'笔记管理',
            url: {name: "笔记管理", query: {id: this.$route.query.id}},
            isNav:'notes'
          },
          {
            name:'作业管理',
            url: {name: "作业管理", query: {id: this.$route.query.id}},
            isNav:'operation'
          },
          {
            name:'测验',
            url: {name: "测试管理", query: {id: this.$route.query.id}},
            isNav:'test'
          },
          {
            name:'头脑风暴',
            url: {name: "头脑风暴", query: {id: this.$route.query.id}},
            isNav:'storm'
          },
          {
            name:'投票问卷',
            url: {name: "投票问卷", query: {id: this.$route.query.id}},
            isNav:'questionnaire'
          },
          {
            name:'视频',
            url:{name: "视频", query: {id: this.$route.query.id}},
            isNav:'videos'
          },
        ],
        isNav:'grade'
      }
    },
    created(){
      this.$emit('upCoursesNav','teach')
    },
    methods:{
      teachingNavs(e){
        console.log(e)
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
