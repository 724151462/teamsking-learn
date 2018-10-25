<template>
  <div class="member">
    <div class="navs">
      <el-input v-model="input" placeholder="请输入内容"></el-input>
      <el-button type="primary">搜索</el-button>
      <el-button type="primary">成员小组方案管理</el-button>
      <el-button type="primary">导入成员</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        data:[],
        input:''
      }
    },
    created(){
      this.$emit('upCoursesNav','member')
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .member
    .navs
      text-align:right
</style>