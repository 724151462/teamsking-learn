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
      .course-tab-container .el-collapse-item__header
        border-bottom:none;
      .course-tab-container .el-collapse
        border: none;
      .interact .el-collapse-item__header
        background-color rgb(237,241,244)
      .interact .el-collapse-item__content
        padding-bottom: 0;
      .interact .el-tooltip__popper
        cursor pointer
    .header
      .el-badge__content
        border 0
    /*试题管理*/
    .test .cell,.resource .cell ,.activity .cell
      text-align center
    .test .cell span div,.resource .cell span div, .activity .cell span div
      overflow: hidden!important;
      white-space: nowrap!important;
      text-overflow: ellipsis!important;
    .test,.resource,.activity
      .el-tree-node__content
        height 50px!important
        border-bottom 1px solid #e3e8ee
        &:hover .hide-button
          opacity 1
    .teacher-dialog
      & .el-dialog__body
        min-height 300px;
    .model-resource
      .el-breadcrumb__inner
        font-size: 1.2em;
        cursor pointer!important
        user-select none
        &:hover
          color: #409EFF!important
    .model-checked
      .header
        .nav-search
          .el-input__inner
            height 32px
            line-height 32px
    .student
      .my-select
        padding 0
        div
          padding 0
          span
            // display none
          input 
            padding-left 0
            border 0
            border-radius 0
            border-bottom 1px solid #dcdfe6
  .el-table .warning-row {
    background: oldlace !important;
  }

  .el-table .success-row {
    background: #f0f9eb !important;
  }
  .modelStrome .el-textarea__inner
    min-height 200px !important
  .modelVote .el-textarea__inner
    min-height 200px !important
</style>

