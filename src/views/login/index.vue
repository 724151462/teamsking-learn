<template>
  <div class="login">
    <div class="login-center">
      <el-form :model="data" :rules="rules" ref="data" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号：" prop="userName">
          <el-input placeholder="请输入账号" v-model="data.userName" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input placeholder="请输入密码" v-model="data.password" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-left: 100px" @click="goLogin">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { logins, loginDebug } from '@/api/login'
  import { setToken, getToken } from '@/utils/auth'
  export default {
    data () {
      return {
        data: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 8, message: '不得小于 8 字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      goLogin () {
/*
        for (let i in this.data) {
          if (JSON.stringify(this.data[i]) === '""') {
            this.$message({
              message: '请输入完整',
              type: 'error'
            })
            return false
          }
        }
*/
        loginDebug(this.data).then(res => {
          console.log(res)
          if (res.code === 200) {
            setToken(res.data.token)
            console.log(getToken())
            this.$router.replace('/course')
/*
            let url = window.location.href.toString()
            let urls = (url.split('#'))[0] + '#/course'
            console.log(urls)
            window.location.href = urls
*/
            // console.log(url.split('#'))

/*
            let self = this
            setTimeout(function(){
              self.$router.push({
                path:'/course'
              })
            },1000)
*/
          } else {
            this.$message({
              message: '用户名密码错误，请重新输入',
              type: 'error'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .login
    position: relative
    height:100%
    background:#000000

    .login-center
      width:500px
      position: absolute
      top: 50%
      left: 50%
      transform:translate(-50%,-50%)
      color:#ffffff
</style>