<template>
  <div>
    <div>成绩管理（这里进行webscoket测试）、（oss测试）</div>
    <el-button @click="getList">初始化</el-button>
    <upossg v-on:ossUp="yesOss"></upossg>
<!--
    <el-button @click="thisOss">获取验签</el-button>
    <input type="file" placeholder="上传" @change="yesGoUp" />
-->
  </div>
</template>

<script>
/*
  import { ossAli, ossAliSts } from '../../../../api/oss'
  import oss from 'ali-oss'
*/
  import upossg from '../../../../components/up-oss.vue'
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
/*
      yesGoUp (event) {
        console.log('上传的文件流',event.target.files)
        console.log('大小',event.target.files[0].size)
        //解构文件类型
        let fileType = event.target.files[0].name
        let strs = new Array()
        strs = fileType.split('.')
        //大小控制在2g
        let size = 2 * 1024 * 1024 * 1024
        if (event.target.files[0].size > size) {
          this.$message({
            message: '文件不得大于2G',
            type: 'error'
          })
          return false
        }
        //拿到文件类型
        let types = strs[strs.length - 1]
        // this.thisOss(types,event.target.files[0])
        console.log(strs[strs.length -1],size)
        this.upData(types, event.target.files[0])
      },
      //获取上传需要的验签
      thisOss () {
        ossAliSts().then(res=>{
          console.log(res)
          if (Number(res.code) === 200) {
            //这里可以考虑吧上传的配置数据放到vuex来进行全局调用,现在先放到data里面
            this.ossData = JSON.parse(res.data)
          } else {
            this.$message({
              message:'获取验签失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //上传执行方法
      upData (data,file) {
        //实例化,每传一个文件进行实例化一次
        let client = new oss({
          accessKeyId: 'LTAIZsHOKiz23lz71',  //LTAIZsHOKiz23lz7
          accessKeySecret: 'f3T9brhGBYiZuXBrG8giojj6ixesbg',
          region: 'oss-cn-beijing',
          bucket: 'tskedu-course'
        });
        console.log('数据',client)
        client.multipartUpload(file.name, file, {
          progress(p, checkpoint){
            console.log('进度返回', p, checkpoint)
          }
        }).then((results) => {
          console.log('then返回',results)
        }).catch(error=>{
          console.log('错误信息', error)
          this.$message({
            message: '验签数据错误',
            type: 'error'
          })
        })
      },
*/
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
