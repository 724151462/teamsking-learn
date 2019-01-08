<template>
  <div class="check">
    <div class="check-time">
      <div class="time">
        <div class="time-text">00:00</div>
      </div>
    </div>
    <div>
      <el-button type="primary">结束签到并进入课堂</el-button>
    </div>
    <div>12人签到</div>
    <div>签到头像</div>
    <div class="fullScreen" @click="fullScreen">
      <img :src="isFullScreen ? imgSrc.unfull : imgSrc.full" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "check",
    data(){
      return{
        isFullScreen: false,//是否全屏
        imgSrc :{
          full: require("@/assets/images/full.png"),
          unfull: require("@/assets/images/unfull.png"),
        }
      }
    },
    methods: {
      enterClass() {
        this.$router.push({path: "/course/classchapter",query: {id: this.$route.query.id}})
      },
      fullScreen(){
        if (document.fullscreenElement) {
          document.exitFullscreen()
          this.isFullScreen = false
        } else {
          document.documentElement.requestFullscreen()
          this.isFullScreen = true
        }
      }
    }

  }
</script>

<style lang="stylus" scoped>
  .check
    height 90%
    .check-time
      display: flex;
      min-height 300px;
      height 40%
      justify-content: center; /* 水平居中 */
      align-items: center;     /* 垂直居中 */
      .time
        height 70%
        width 30%
        display flex
        align-items center
        background-color: rgb(117, 186, 255);
        border-radius: 8px;
        border 17px solid rgb(213, 234, 255);
        .time-text
          height 100%
          width 100%
          font-size:160px;
          vertical-align: middle

    .fullScreen
      position fixed
      bottom 20px;
      right 20px;
</style>