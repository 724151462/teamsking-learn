<template>
  <div>
    <div>成绩管理（这里进行webscoket测试）、（oss测试）</div>
    <el-button @click="getList">初始化</el-button>
    <upossg v-on:ossUp="yesOss"></upossg>
  </div>
</template>

<script>
  import upossg from '../../../../components/up-oss-old.vue'
  export default {
    components: {
      upossg
    },
    data(){
      return{
        url:'wss://echo.websocket.org',
        ws:null,
        ossData:{}
      }
    },
    created(){
      this.$emit('teachingNav','grade')
    },
    methods:{
      yesOss (e) {
        console.log('接收到的url', e)
      },
      getList () {
        this.ws = new WebSocket(this.url)
        this.ws.onopen = function(val) {
          this.ws.send('hello')
        }
        this.ws.onmessage = function (evt) {
          console.log( "Received Message: 2" + evt.data);
          this.ws.close()
        }

        this.ws.onclose = function (evt) {
          console.log("Connection closed.3")
        }
      }
    }
  }
</script>

<style scoped>

</style>
