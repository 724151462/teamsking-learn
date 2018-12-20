<template>
  <div class="login">
    <div class="login-center">
      <el-form :model="data" :rules="rules" ref="data" label-width="100px" class="demo-ruleForm">
        <el-form-item label="所属学校：" prop="tenantId">
          <el-select v-model="data.tenantId" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号：" prop="userName">
          <el-input placeholder="请输入/用户名/工号/邮箱" v-model="data.userName" style="width: 300px;"></el-input>
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
        options2: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶',
          disabled: true
        }],
        data: {
          userName: '',
          password: '',
          tenantId: ''
        },
        rules: {
          tenantId:[{required: true, message: '请选择所属学校', trigger: 'blur'}],
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