<template>
  <div style="display: inline-block;margin: 0 10px">
    <el-button type="primary" @click="goUp" id="male">{{btnText}}</el-button>
    <!-- <div>{{schedule}}</div> -->
    <input style="display: none" type="file" :id="inputs" @change="upInput"/>
  </div>
</template>

<script>
  /**
   * 这里只能传单文件，多文件需要修改逻辑，需for调用 forInputs 方法
   * */
  import oss from 'ali-oss'
  import { ossAliSts } from '../api/oss'
  export default {
    props:{
      //可上传大小
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
    data(){
      return{
        schedule:0, //上传进度
        ossData:null,
        fileData:null,
        isError:3,
        //需要返回的文件信息
        fileName:'',
        fileSize:'',
        // fileName:'',
      }
    },
    methods:{
      goUp () {
        document.getElementById(this.inputs).click()
      },
      upInput (event) {
        console.log('1',event)
        if(event){
          this.fileData = event
          this.fileName =event.target.files[0].name
          this.fileSize =event.target.files[0].size
        }
        //这里加一个获取验签信息的错误处理
        if (Number(this.isError) === 0) {
          this.errors()
          return false
        }
        if (this.ossData === null && Number(this.isError) !== 0) {
          this.ossCheck()
          return false
        }
        let file = this.fileData.target.files[0]
        let name = new Date().getTime() + file.name.replace(/[\-\s+\_\+\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g, '')
        if(this.fileType !== '') {
          let chekcType = this.fileType.split(',').some(element=> {
            return file.type === element
          })
          if(!chekcType) {
              this.$message({
                message: '文件格式错误',
                type: 'error'
              })
              this.inputNull()
              return false
            }
        }
        if (file.size > this.size) {
          this.$message({
            message: '上传文件超出可上传范围，请重新选择文件上传',
            type: 'error'
          })
          return false
        }
        let client = new oss(this.ossData)
        //多文件上传请修改这里
        this.forInputs(client,name,file)
      },
      forInputs (client,name,file) {
        let loading = this.$loading({
          lock: true,
          text: '正在努力上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let self = this
        // 判断上传文件的分类
        let dir = this.resType(name)
        // 'base-dir/' +'object-name' ， 如果要指定上传目录，第一个参数就这样传
        client.multipartUpload(dir, file, {
          progress(p, checkpoint){
            //反回的 p 是当前进度，大概1s会返回一个进度的样子，下面处理了下百分比，checkpoint 是具体的数据流上传，不做暂停效果可以不考虑用它
            console.log('进度返回', p, checkpoint)
            self.schedule = (p.toFixed(2) * 100) + '%'
          }
        }).then((results) => {
          loading.close()
          // console.log('then返回',results)
          //http://tskedu-course.oss-cn-beijing.aliyuncs.com/ + name = 完整的url
          // self.$message({
          //   message:'上传成功',
          //   type:'success'
          // })
          Number(self.isError) !== 2 ? (self.isError = 2) : ''
          let url = 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/' + dir
          this.inputNull()
          self.$emit('ossUp', url, this.fileName, this.fileSize)
        }).catch(error=>{
          console.log(error)
          //返回错误之后如验签过期则直接进行请求，否则提示管理员来处理
          self.ossCheck('error')
        })
      },
      inputNull () {
        let dom = document.getElementById(this.inputs)
        dom.value = '';
        // dom.outerHTML = dom.outerHTML;
        this.fileData = null
      },
      ossCheck (e) {
        // console.log('e的监控数据',e , this.isError)
        if (Number(this.isError) === 0) {
          this.errors()
          return false
        }
        this.isError -= 1
        ossAliSts().then(res => {
          if (Number(res.code) === 200) {
            this.ossData = JSON.parse(res.data)
            // console.log('给到', this.ossData)
            this.upInput()
          } else {
            this.ossCheck()
          }
        }).catch(error => {
          //验签数据错误 / 过期，执行重试，3次后直接返回错误
          this.ossCheck()
        })
      },
      //判断文件类型,返回上传目录
      resType(name){
        let dir = ''
        if(this.fileKind==='avatar'){
          dir = 'teskedu/avatar/'+name
        }else if(this.fileKind==='resource'){
          let index= name.lastIndexOf('.'),
            imgArr = ['jpeg','jpg','png'],
            audioArr=['mp3','wav'],
            videoArr=['mp4','avi','rmvb','wmv','mkv'],
            docArr=['pdf','txt','doc','docx','xls','xlsx','ppt','pptx'];
          let curType = name.substring(index+1,name.length).toLowerCase()

          if(imgArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/img/'+name
          }else if(videoArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/video/'+name
          }else if(docArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/doc/'+name
          }else if(audioArr.find((item)=>{return curType == item})){
            dir = 'teskedu/resource/audio/'+name
          }else{
            this.$message.error('请上传受支持的资源文件')
            return false
          }
        } else if (this.fileKind ==='certificate'){
          dir = 'teskedu/img/certificate/'+name
        } else{
          dir = name
        }

        return dir
      },
      errors () {
        this.$message({
          message: '验签获取错误，请联系管理员',
          type: 'error'
        })
        this.inputNull()
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  #logo
    display:none
  #pic
    display:none
  #inputs
    display:none
  #creImg
    display:none
</style>
