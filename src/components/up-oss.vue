<template>
  <div style="display: inline-block;margin: 0 10px">
    <el-button type="primary" @click="goUp" id="main">{{btnText}}</el-button>
    <!-- <div>{{schedule}}</div> -->
    <input type="file" :id="inputs" @change="upInput"/>
  </div>
</template>

<script>
  import oss from 'ali-oss'
  import axios from 'axios'
  import { webUpload} from '../api/oss'

  export default {
    name: "up-oss",
    props:{
      size:{
        default:2 * 1024 * 1024 * 1024
      },
      btnText: {
        default: "上传"
      },
      inputs: {
        default: "inputs"
      },
      fileType: {
        default: ''
      },
      fileKind: {
        default: 'default'
      }
    },
    data () {
      return {
        schedule:0, //上传进度
        ossData:null,
        fileData:null,
        imageData:{
          accessid: "",
          dir: "",
          expire: "",
          host: "",
          policy: "",
          signature: "",
        },
        isError:3,
        //需要返回的文件信息
        fileName:'',
        fileSize:'',
        dir:'',
        // fileName:'',
      }
    },
    methods:{
      //触发上传按钮
      goUp () {
        document.getElementById(this.inputs).click()
      },
      //清空输入框
      inputNull (event) {
        let dom = document.getElementById(this.inputs)
        dom.value = '';
        // dom.outerHTML = dom.outerHTML;
        this.fileData = null
      },
      //捕获到文件
      upInput(event){
        if(event){
          this.fileData = event
          this.fileName = new Date().getTime() + event.target.files[0].name
          this.fileSize =event.target.files[0].size
        }
        this.ossCheck()
      },
      //获取签证
      ossCheck(name){
        let dir = this.resType(this.fileName)
        this.dir = dir
        let loading = this.$loading({
          lock: true,
          text: '正在努力上传文件',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        webUpload({ossPath:dir})
          .then(res=>{
            console.log(res)
            if(Number(res.code) === 200) {
              let request = new FormData()
              this.imageData = res.data

              request.append('key', res.data.dir + this.fileName)
              request.append('policy', res.data.policy)
              request.append('OSSAccessKeyId', res.data.accessid)
              request.append('success_action_status', '200')
              request.append('Signature', res.data.signature)
              request.append('file', this.fileData.target.files[0])

              return request
            }else {
              this.$message.error('获取验签失败，请重试')
            }
          })
          .then(request=>{
            this.startUp(request)
          })
          .then((res)=>{
            loading.close()
            let url = this.imageData.host + '/' + this.imageData.dir + this.fileName
            this.inputNull()
            this.$emit('ossUp', url, this.fileName, this.fileSize)
          })
          .catch(err=>{
            console.log(err)
            this.$message.error('获取验签失败，请重试')
          })
      },
      //上传文件到OSS
      startUp(request){
        axios({
          method: 'post',
          url: this.imageData.host,
          data: request,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((err)=>{
          //console.log('上传成功')
        }).catch(function (error) {
          //console.log(error);
        });
      },
      //检验文件类型，生成dir
      resType(name){
        let dir = ''
        if(this.fileKind==='avatar'){
          dir = 'teskedu/avatar/'
        }else if(this.fileKind==='resource'){
          let index= name.lastIndexOf('.'),
            imgArr = ['jpeg','jpg','png'],
            audioArr=['mp3','wav'],
            videoArr=['mp4','avi','rmvb','wmv','mkv'],
            docArr=['pdf','txt','doc','docx','xls','xlsx','ppt','pptx'];
          let curType = name.substring(index+1,name.length).toLowerCase()

          if(imgArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/img/'
          }else if(videoArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/video/'
          }else if(docArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/doc/'
          }else if(audioArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/audio/'
          }else{
            this.$message.error('请上传受支持的文件类型')
            return false
          }
        } else if (this.fileKind ==='certificate'){
          dir = 'teskedu/img/certificate/'
        } else{
          dir = name
        }
        return dir
      },
    }
  }
</script>

<style scoped>

</style>