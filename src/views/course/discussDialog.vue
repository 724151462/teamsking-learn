<template>
  <div class="warp">
    <div class="header">
      <span style="display:inline-block;margin: 5px 10px">
        <router-link :to="{path: '/course/list/discuss', query:{id: this.$route.query.id}}">讨论</router-link>> 讨论详情
      </span>
    </div>
    <div class="content">
      <div>请问我来迟了，作业无法提交怎么办</div>
      <div>
        <span>发布人：陈晨</span>
        <span>阅读：100人</span>
        <span>发布日期：2018-05-12</span>
      </div>
      <div style="height: 350px">
        <div class="discuss-warp">
          <div></div>
          <div class="reply"></div>
        </div>
      </div>
      <div>
        评论框
      </div>
    </div>
  </div>
</template>

<script>
  import {
    discussIssue,
    discussReply
  } from '@/api/course'
  export default {
    name: "discussDialog",
    mounted() {
      discussIssue({discussId: this.$route.query.disId})
      discussReply({discussId: this.$route.query.disId})
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .warp
    width: 100%;
    margin: 0 auto
    .header
      height 50px;
      background rgb(215, 215, 215)
      line-height 50px;
      .back
        cursor: pointer
        margin-right 30px;
    .content
      border: 1px solid rgb(215, 215, 215)
</style>