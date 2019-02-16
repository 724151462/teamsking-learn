<template>
  <nav class="nav">
    <div class="nav-item" :class="{ active: active == 1 }">
      <router-link :to="{path: '/user/index'}">
        个人设置
      </router-link>
    </div>
    <div
      class="nav-item"
      :class="{ active: active == 2 }">
      <router-link :to="{path: '/user/message'}">
        消息管理
      </router-link>
    </div>
    <div class="nav-item" :class="{ active: active == 3 }">
      <router-link :to="{path: '/user/certificate'}">
        我的证书
      </router-link>
    </div>
  </nav>
</template>
<script>
  export default {
    name: "userHeader",
    props: ['active']
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .nav
    padding 20px
    padding-left 100px
    margin-bottom 20px
    border-bottom: 2px solid #c0c4cc;
    .active
      color #3a8ee6
    .nav-item
      display inline-block
      font-size 18px
      cursor pointer
      margin-right 100px
      &:hover
        color #3a8ee6
</style>