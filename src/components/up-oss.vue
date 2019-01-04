<template>
  <div style="display: inline-block;margin: 0 10px">
    <el-button type="primary" @click="goUp">{{btnText}}</el-button>
    <!-- <div>{{schedule}}</div> -->
    <input type="file" :id="inputs" @change="upInput"/>
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
      }
    },
    data(){
      return{
        schedule:0, //上传进度
        ossData:null,
        fileData:null,
        isError:3
      }
    },
    methods:{
      goUp () {
        if(this.inputs === undefined) {
          document.getElementById('inputs').click()
        }else{
          document.getElementById(this.inputs).click()
        }
      },
      upInput (event) {
        console.log('1',event)
        if(event){
          this.fileData = event
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
        let name = new Date().getTime() + file.name
        if (file.size > this.size) {
          this.$message({
            message: '上传文件超出可上传范围，请重新选择文件上传',
            type: 'error'
          })
          this.inputNull()
          return false
        }
        let client = new oss(this.ossData)
        //多文件上传请修改这里
        this.forInputs(client,name,file)
      },
      forInputs (client,name,file) {
        let self = this
        client.multipartUpload(name, file, {
          progress(p, checkpoint){
            //反回的 p 是当前进度，大概1s会返回一个进度的样子，下面处理了下百分比，checkpoint 是具体的数据流上传，不做暂停效果可以不考虑用它
            console.log('进度返回', p, checkpoint)
            self.schedule = (p.toFixed(2) * 100) + '%'
          }
        }).then((results) => {
          console.log('then返回',results)
          //http://tskedu-course.oss-cn-beijing.aliyuncs.com/ + name = 完整的url
          self.$message({
            message:'上传成功',
            type:'success'
          })
          Number(self.isError) !== 2 ? (self.isError = 2) : ''
          let url = 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/' + name
          self.$emit('ossUp', url, name)
        }).catch(error=>{
          console.log(error)
          //返回错误之后如验签过期则直接进行请求，否则提示管理员来处理
          self.ossCheck('error')
        })
      },
      inputNull () {
        let dom = document.getElementById('inputs')
        dom.value = ''
        dom.outerHTML = dom.outerHTML
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
</style>
