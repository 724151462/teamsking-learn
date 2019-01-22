<template>
  <div class="login">
    <div class="login-center">
      <el-form :model="data" :rules="rules" ref="data" label-width="100px">
        <el-form-item label="所属学校：" prop="tenantId">
          <!--<el-select v-model="data.tenantId" filterable  placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in schoolList"-->
              <!--:key="item.tenantId"-->
              <!--:label="item.tenantName"-->
              <!--filter-method=""-->
              <!--:value="item.tenantId">-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-select
            filterable
            v-model="data.tenantId"
            :filter-method="searchTenant"
            placeholder="请选择">
            <el-option
              v-for="item in schoolList"
              :key="item.tenantId"
              :label="item.tenantName"
              :value="item.tenantId">
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
          <el-button type="primary" style="margin-left: 100px" @click="goLoginDebug">测试登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { logins, loginDebug, getTenant} from '@/api/login'
  import { setToken, getToken, twoWeeksExchange, twoWeeksGetExchange, saveUserInfo} from '@/utils/auth'
  export default {
    data () {
      return {
        schoolList: [],   //租户列表
        searchKey:'', //搜索
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
          ]
        }
      }
    },
    created () {
      getTenant().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.schoolList = res.data
        }else{
          this.$message.error('获取学校信息失败，请重试')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      goLogin () {
        let data = {
          tenantId: this.data.tenantId,
          loginAccount: this.data.userName,
          passwd: this.data.password
        }
        //账户：090729
        logins(data).then(res => {
          console.log(res)
          if (res.code === 200) {
            console.log('登录成功')
            twoWeeksExchange(res.data.token)
            saveUserInfo(res.data.userId)
            this.$router.replace('/course')
          } else {
            this.$message({
              message: '用户名密码错误，请重新输入',
              type: 'error'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      goLoginDebug(){
        let data = {
          userName: 'admin',
          password: 'admin'
        }
        loginDebug(data).then(res => {
          console.log(res)
          if (res.code === 200) {
            twoWeeksExchange(res.data.token)
            saveUserInfo(res.data.userId)
            this.$router.replace('/course')
          } else {
            this.$message({
              message: '用户名密码错误，请重新输入',
              type: 'error'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      searchTenant(query){
        let data = {searchKey: query}
        getTenant(data).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.schoolList = res.data
          }else{
            this.$message.error('获取学校信息失败，请重试')
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