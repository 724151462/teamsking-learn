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
      padding-bottom: 0px;
    .interact .el-tooltip__popper
      cursor pointer
</style>