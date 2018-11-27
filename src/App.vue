<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
  }
</script>
<style lang="stylus" type="text/stylus">
  @import "assets/css/reset.styl"

  #app
    width: 100%
    height:100%
  /*创建课程-->添加授课老师*/
  .addTeacher .type-warp input{
    padding-right: 38px;
  }
  .addTeacher .info-warp textarea{
    padding-bottom: 46px;
  }
  /*创建课程-->添加课程*/
  .addCourse .accredit-input{
    color: red;
  }
  .addCourse .accredit-input .el-input{
    color : red;
  }
  .addCourse .accredit-input .el-input input{
    border-radius: 30px;
  }
  /*试题管理--->表格列样式*/
  .test .cell{
    overflow: hidden!important;
    white-space: nowrap!important;
    text-overflow: ellipsis!important;
    text-align center;
  }
  /*课程评价---->表格列样式*/
  .appraisal .cell{
    text-align center;
  }
  /*资源管理---->活动管理*/
  .activity .el-collapse-item__wrap{
    border-bottom: 0
  }
</style>
