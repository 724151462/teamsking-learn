<template>
  <div class="replyList">
    <div class="center" v-for="list in [replyData]" :key="list">
      <div class="top">
        <div class="img">
          <img :src="list.img">
        </div>
        <div class="centers">
          {{list.name}}回复内容:{{list.center}}
        </div>
        <div class="right">
          {{list.time}}
          <i class="el-icon-delete"></i>
        </div>
      </div>

      <div class="top two-list" v-for="item in list.replyList" :key="item">
        <div class="img">
          <img :src="item.img">
        </div>
        <div class="centers">
          {{item.name}}回复{{list.name}}内容:{{item.center}}
        </div>
        <div class="right">
          {{item.time}}
          <i class="el-icon-delete"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:["replyData"]
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .replyList
    padding-top:10px

    .center
      border-bottom:1px solid #E4E4E4

      .top
        padding-bottom:5px
        overflow:hidden

        .img
          width:30px
          height:30px
          display: inline-block
          margin-right: 10px
          vertical-align:middle

          img
            width: 100%
            height:auto

        .centers
          display: inline-block

        .right
          float: right
          padding-top:10px
          color:#bfbfbf

          .el-icon-delete
            margin-left:40px

      .two-list
        padding-left:40px
</style>