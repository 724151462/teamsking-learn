<template>
  <div class="container">
    <div class="player">
      <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"
                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
                     @ended="onPlayerEnded($event)"
      >
      </video-player>
    </div>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  export default {
    props:{
      isMp4:{
        default:''
      },
      cover:{
        default:'poster.jpg'
      },
      state:{
        default:false
      }
    },
    data(){
      return{
        videoStatus: this.state,
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.2, 1.5, 1.8, 2.0],
          autoplay: false,
          muted: false,
          loop: false,
          preload: 'auto',
          language: 'zh-CN',
          aspectRatio: '16:9',
          fluid: true,
          sources: [{
            type: "video/mp4",
            src: this.isMp4 //你的m3u8地址（必填）
          }],
          poster: this.cover,
          width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试',
        }
      }
    },
    mounted() {
      console.log(this.isMp4)
    },
    components: {
      videoPlayer
    },
    methods: {
      getParentUrl(url) {
        this.playerOptions.sources[0].src = url
      },
      onPlayerPlay(player) {
        // this.playerOptions.sources[0].src = this.isMp4
        console.log('play', this.isMp4)
        // alert("play");
      },
      onPlayerPause(player){
        // alert("pause");
        console.log(this.$refs.videoPlayer.player)
      },
      onPlayerEnded(player) {
        console.log(player)
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
    },
    watch: {
      isMp4: function (val) {
        // const myPlayer = this.$refs.videoPlayer.player
        if (val !== '') {
          this.$refs.videoPlayer.player.src(val)
        }
      },
      state: function (val) {
        console.log(val)
        // this.myResult = val
        if (val) {
          this.$refs.videoPlayer.player.pause()
          this.$emit('resetStatus', false)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .container
    background-color: #efefef
    min-height: 80%

</style>
