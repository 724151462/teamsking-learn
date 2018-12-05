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
  body .el-tooltip__popper
    max-width 200px
    #app
      width: 100%
      height:100%

      .course-tab-container .el-collapse-item__header
        border-bottom:none;
      .course-tab-container .el-collapse
        border: none;
      .interact .el-collapse-item__header
        background-color rgb(237,241,244)
      .interact .el-collapse-item__content
        padding-bottom: 0px;
      .interact .el-tooltip__popper
        cursor pointer

    /*试题管理*/
    .test .cell
      text-align center
    .test .cell span div
      overflow: hidden!important;
      white-space: nowrap!important;
      text-overflow: ellipsis!important;
</style>
  #app .courseCategory .el-table__expanded-cell
    padding:0 0 0 48px

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
  /*资源管理---->试题管理*/
  .test .el-dialog__header, .test .el-dialog__footer{
    background-color #ebeef5
  }
