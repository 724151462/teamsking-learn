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
  /*课程中心-->添加授课老师*/
  .addTeacher .type-warp input{
    padding-right: 38px;
  }
  .addTeacher .info-warp textarea{
    padding-bottom: 46px;
  }
  /*添加课程*/
  .addCourse .accredit-input{
    color: red;
  }
  .addCourse .accredit-input .el-input{
    color : red;
  }
  .addCourse .accredit-input .el-input input{
    border-radius: 30px;
  }
</style>