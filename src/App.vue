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

  #app .courseCategory .el-table__expanded-cell
    padding:0 0 0 48px

</style>
