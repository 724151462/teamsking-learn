<template>
  <div class="userIndex">
    <el-tabs v-model="activeName" @tab-click="toMessage">
      <el-tab-pane label="个人设置" name="first" class="tab-name">
        <div>
          <p>头像</p>
          <div  style="padding-left: 100px;width: 100px;margin: 25px 0;">
            <img src="" alt="" class="user-avatar">
            <div style="text-align: center;font-size: 14px;"><el-button type="text" class="red-text">上传头像</el-button></div>
          </div>
        </div>
        <div>
          <p>个人信息</p>
          <div style="padding-left: 55px;width: 280px">
            <el-form ref="form" :model="infoForm" label-width="80px">
              <el-form-item label="姓名：">
                {{infoForm.name}}
              </el-form-item>
              <el-form-item label="性别：">
                <el-radio-group v-model="infoForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="infoForm.userName" :placeholder="infoForm.userName" class="input-width"></el-input>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="infoForm" style="padding-left:38px;width: 450px;">
              <el-form-item label="邮箱">
                <el-input v-model="infoForm.email" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="text" class="red-text" style="display: inline-block">修改邮箱>>></el-button>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="infoForm" style="padding-left:25px;width: 450px;">
              <el-form-item label="手机号">
                <el-input v-model="infoForm.phoneNumber" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="text" class="red-text" style="display: inline-block">绑定手机>>></el-button>
              </el-form-item>
            </el-form>
              <el-form-item label="证书添加">
              </el-form-item>
          </div>
        </div>
        <div>
          <p>修改密码</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消息管理" name="second"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        activeName: 'first',
        infoForm:{
          name: '黄某某',
          userName:'Tendeng',
          sex: '男',
          email:'59959@qq.com',
          phoneNumber:'15554855216',
        },
        jobForm:{
          jobTitle:'',  // 职称
          jobTear:'',  // 职龄
          yuan:'', // 院
          xi:'',  // 系
          selfInt:''// 自我介绍
        },
        passForm:{
          nowPass: '',
          newPass:'',
          rePass:''
        }
      };
    },
    methods:{
      toMessage () {
        if(this.activeName === 'second'){
          this.$router.push('message')
        }
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .el-button:focus, .el-button:hover
    color: red
  .red-text
    color red
  .userIndex
    .user-avatar
      width 100px
      height 100px
      display block
      border-radius 50%
      background-color: aquamarine
    .input-width
      width 200px
</style>