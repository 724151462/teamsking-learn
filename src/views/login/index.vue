<template>
  <div class="login-warp">
    <div class="login" :style="bgImg">
      <div class="login-center">
        <div class="left">
          <img :src="require('@/assets/images/login_left.png')" class="left-img" alt="">
        </div>
        <div class="right">
          <div>
            <img :src="require('@/assets/images/logo.png')" class="logo-img" alt="">
          </div>
          <div style="position: relative;height: calc(100% - 85px)">
            <el-form :model="data" :rules="rules" ref="data" class="login-box">
              <el-form-item label="" prop="tenantId">
                <el-select
                  filterable
                  class="input-item"
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
              <el-form-item label="" prop="userName">
                <el-input placeholder="请输入/用户名/工号/邮箱" v-model="data.userName" class="input-item"></el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input placeholder="请输入密码" v-model="data.password" class="input-item"></el-input>
              </el-form-item>
              <div>忘记密码?</div>
              <el-form-item>
                <div class="el-button">马上登录</div>
                <el-button type="primary" style="margin-left: 100px" @click="goLogin" class="input-item">登陆</el-button>
                <!--<el-button type="primary" style="margin-left: 100px" @click="goLoginDebug">测试登陆</el-button>-->
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { logins, loginDebug, getTenant} from '@/api/login'
  import { setToken, getToken, twoWeeksExchange, twoWeeksGetExchange, saveUserInfo} from '@/utils/auth'
  import {getErrorMsg} from "@/utils/utils";

  export default {
    data () {
      return {
        bgImg: {
          backgroundImage: "url(" + require("@/assets/images/login_bg.jpg") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        },
        leftImg: require("@/assets/images/login_left.png"),
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
        // console.log(res)
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
        logins(data).then(res => {
          // console.log(res)
          if (res.code === 200) {
            console.log('登录成功')
            twoWeeksExchange(res.data.token)
            saveUserInfo(res.data.userId)
            this.$router.replace('/course')
          } else {
            this.$message({
              message:getErrorMsg(res.msg),
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
          // console.log(res)
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
          // console.log(res)
          if (res.code === 200) {
            this.schoolList = res.data
          }else{
            this.$message.error(getErrorMsg(res.msg))
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .login-warp
    width inherit
    height inherit
    .login
      width 100%
      position: relative
      height:100%
      .login-center
        min-width:600px
        min-height 350px
        position: absolute
        top: 50%
        left: 50%
        transform:translate(-50%,-50%)
        overflow hidden
        box-shadow: #a1a1a1 0 0 10px;
        color:#ffffff
        border-radius 20px;
        display flex
        .left
          background-color #3a8ee6
          width 50%
          float left
          .left-img
            width 100%;
            height 100%
        .right
          width 50%
          /*float right*/
          background-color white
          display inline-block
          text-align center
          .login-box
            position: absolute;
            width 80%
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            .input-item
              margin 0 auto
              width 100%
              max-width 300px
          .logo-img
            height 45px
            margin 20px 0
</style>