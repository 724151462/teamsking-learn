<template>
  <div>
    <div>成绩管理（这里进行webscoket测试）</div>
    <el-button @click="getList">初始化</el-button>
    <el-button @click="goText">发送</el-button>
    <el-button @click="goClose">断开</el-button>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        url:'wss://echo.websocket.org',
        ws:null
      }
    },
    created(){
      this.$emit('teachingNav','grade')
    },
    methods:{
      goText () {

      },
      goClose () {},
      getList () {
        this.ws = new WebSocket(this.url)
        this.ws.onopen = function(val) {
          this.ws.send('hello')
        }
/*
        let ws = new WebSocket(this.url)
        ws.onopen = function (val) {
          console.log(val)
          ws.send('hello')
        }
        ws.onmessage = function(evt) {
          console.log( "Received Message: 2" + evt.data);
          // console.log( "Received Message: 2" + evt.data);
          ws.close();
        };

        ws.onclose = function(evt) {
          console.log("Connection closed.3");
        };
*/
      }
    }
  }
</script>

<style scoped>

</style>
