<template>
  <div>
    <div class="launch">
      <span>发起：</span>
      <div class="item-container">
        <div>
          <img :src="require('../../assets/images/vote.png')" alt="">
          <span>投票</span>
        </div>
        <div>
          <img :src="require('../../assets/images/brainStorme.png')" alt="">
          <span>头脑风暴</span>
        </div>
        <div>
          <img :src="require('../../assets/images/homeWork.png')" alt="">
          <span>作业/小组测试</span>
        </div>
        <div>
          <img :src="require('../../assets/images/test.png')" alt="">
          <span>测试</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" type="text/stylus" scoped>
.launch
  display flex
  align-items center
  justify-content space-between
  .item-container
    display flex
    align-items center
    justify-content space-between
    div
      display flex
      align-items center
</style>