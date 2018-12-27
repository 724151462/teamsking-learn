<template>
  <div class="userIndex">
    <el-tabs v-model="activeName" @tab-click="toMessage">
      <el-tab-pane label="个人设置" name="first" class="tab-name">
        <div>
          <p>头像</p>
          <div  style="padding-left: 100px;width: 100px;margin: 25px 0;">
            <img src="" alt="" class="user-avatar">
            <div style="text-align: center;font-size: 14px;"><el-button type="text" class="red-text">修改头像</el-button></div>
          </div>
        </div>
        <div class="form-warp">
          <p>个人信息</p>
          <div style="padding-left: 55px;width: 280px">
            <el-form ref="form" :model="infoForm" label-width="80px">
              <el-form-item label="姓名：">
                {{infoForm.realName}}
              </el-form-item>
              <el-form-item label="性别：">
                <el-radio-group v-model="infoForm.gender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="infoForm.nickName" :placeholder="infoForm.nickName" class="input-width"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div  style="padding-left: 55px;width: 280px">
            <el-form :inline="true" :model="infoForm" style="padding-left:38px;width: 450px;">
              <el-form-item label="邮箱">
                <el-input v-model="infoForm.email" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="text" class="red-text" style="display: inline-block" @click="bindEmail">修改邮箱>>></el-button>
              </el-form-item>
            </el-form>
            <el-form :inline="true" :model="infoForm" style="padding-left:25px;width: 450px;">
              <el-form-item label="手机号">
                <el-input v-model="infoForm.mobile" class="input-width"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="text" class="red-text" style="display: inline-block" @click="goBindMobile">绑定手机>>></el-button>
              </el-form-item>
            </el-form>
            <el-form-item label="证书添加"></el-form-item>
          </div>
          <div style="text-align: right"><el-button type="primary" >保存</el-button></div>
        </div>

        <!--电话号码等修改。-->
        <div class="form-warp">
          <div  style="padding-left: 55px;width: 280px">
            <el-form :model="jobForm" label-width="100px">
              <el-form-item label="职称">
                <el-input type="text" v-model="jobForm.jobTitle" :placeholder="jobForm.jobTitle"></el-input>
              </el-form-item>
              <el-form-item label="职龄">
                <el-input type="password" v-model="jobForm.jobTear" :placeholder="jobForm.jobTear"></el-input>
              </el-form-item>
              <el-form-item label="所属院">
                <el-select v-model="jobForm.yuan" placeholder="请选择">
                  <el-option
                    v-for="item in collegeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属系">
                <el-select v-model="jobForm.xi" placeholder="请选择">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: right"><el-button type="primary" >保存</el-button></div>
        </div>
        <!--密码修改-->
        <div class="form-warp">
          <p>修改密码</p>
          <div style="padding-left:55px;width: 300px">
            <el-form :model="passForm" :rules="rules" ref="passForm" label-width="100px">

              <el-form-item label="当前密码" prop="oldPasswd">
                <el-input type="text" v-model="passForm.oldPasswd"></el-input>
              </el-form-item>

              <el-form-item label="新密码" prop="newPasswd">
                <el-input type="password" v-model="passForm.newPasswd"></el-input>
              </el-form-item>

              <el-form-item label="确认密码" prop="checking">
                <el-input type="password" v-model="passForm.checking"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: right"><el-button type="primary" @click="changePassword()">保存</el-button></div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="消息管理" name="second"></el-tab-pane>
    </el-tabs>

    <!--绑定手机弹窗-->
    <el-dialog
      title="绑定手机号"
      :visible.sync="changeMobileDialog"
      width="30%">
      <el-form :model="changePassForm" :rules="rules" ref="changePassForm" label-width="100px">

        <el-form-item label="手机号" prop="changeMobile">
          <el-input type="text" v-model="changePassForm.changeMobile"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <el-input type="password" v-model="changePassForm.captcha"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="this.changeMobileDialog = false">取 消</el-button>
        <el-button type="primary" @click="bindMobile">确 定</el-button>
      </span>
    </el-dialog>
    <!--绑定邮箱弹窗-->
    <el-dialog
      title="绑定邮箱"
      :visible.sync="changeMobileDialog"
      width="30%">
      <el-form :model="changeEmailForm" :rules="rules" ref="changePassForm" label-width="100px">
        <el-form-item label="邮箱" prop="changeMobile">
          <el-input type="text" v-model="changeEmailForm.changeEmail"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input type="password" v-model="changeEmailForm.captcha"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="this.changeMobileDialog = false">取 消</el-button>
        <el-button type="primary" @click="bindMobile">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {sysCollegeList, sysDepartmentList} from '@/api/school'
  // import {changeUserPassword, getUserInfo , getBindCode , } from '@/api/user'
  import * as userApi from '@/api/user'

  export default {
    name: "index",
    data() {
      return {
        activeName: 'first',
        infoForm:{
          realName: '黄某某',
          nickName:'',
          gender: '男',
          email:'',
          userId: 1351,
          mobile:'',
        },
        jobForm:{
          jobTitle:'',  // 职称
          jobTear:'',  // 职龄
          yuan:'', // 院
          xi:'',  // 系
          selfInt:''// 自我介绍
        },
        passForm:{
          checking: "",
          newPasswd: "",
          oldPasswd: ""
        },
        //修改绑定电话号码
        changePassForm:{
          changeMobile:'',
          captcha:''
        },
        changeEmailForm:{
          changeEmail:'',
          captcha:''
        },
        rules:{
          checking: { required: true, message: '请再次输入密码', trigger: 'blur' },
          newPasswd: { required: true, message: '请输入新密码', trigger: 'blur' },
          oldPasswd: { required: true, message: '请输入旧密码', trigger: 'blur' },
          changeMobile: { required: true, message: '请输入', trigger: 'blur' },
          captcha: { required: true, message: '请输入', trigger: 'blur' },
        },
        collegeList:"", //院列表
        departmentList:"", //系列表
        changeMobileDialog: false, //跟换电话

      };
    },
    methods:{
      //获取用户信息
      initUserInfo(){
        let data = getUserId()
        userApi.getMeInfo().then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.realName = res.data.realName
          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$message({
              message:msgs[0].message,
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //获取院列表
      initCollege(){
        sysCollegeList().then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$message.success('密码修改成功')
          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$message({
              message:msgs[0].message,
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //获取系列表
      initDepartment(){

      },
      toMessage () {
        if(this.activeName === 'second'){
          this.$router.push('message')
        }
      },
      //修改本人的用户信息
      changeUserInfo(){
        let data = {
          avatar: this.info.avatar,
          gender: this.infoForm.gender,
          nickName: this.infoForm.nickName,
          userId: this.infoForm.userId
        }
        console.log(data)
        userApi.changeUserInfo(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$notify.success({
              title: '成功',
              message:'用户信息修改成功'
            });

          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$notify.error({
              title: '错误',
              message:msgs[0].message
            });
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      // 修改密码
      changePassword(){
        let data  = {
          checking: String(this.passForm.checking),
          newPasswd: String(this.passForm.newPasswd),
          oldPasswd: String(this.passForm.oldPasswd)
        }
        userApi.changeUserPassword(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$message.success('密码修改成功')
            this.$notify.success({
              title: '成功',
              message:'密码修改成功'
            });

          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$notify.error({
              title: '错误',
              message:msgs[0].message
            });
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //修改邮箱
      bindEmail(){
        userApi.bindMobile(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$notify.success({
              title: '成功',
              message:'验证码已发送'
            });

            this.changeMobileDialog = true
            this.changePassForm.changeMobile = this.infoForm.mobile

          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$notify.error({
              title: '错误',
              message:msgs[0].message
            });
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      // 修改手机号
      bindMobile(){
        let data = this.changePassForm
        userApi.bindMobile(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$notify.success({
              title: '成功',
              message:'更换绑定号码成功'
            });
            this.changeMobileDialog = false
          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$notify.error({
              title: '错误',
              message:msgs[0].message
            });
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //获取绑定验证码
      goBindMobile(){
        let data = {
          mobile:String(this.infoForm.mobile)
        }
        userApi.getBindCode(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$notify.success({
              title: '成功',
              message:'验证码已发送'
            });
            this.changeMobileDialog = true
            this.changePassForm.changeMobile = this.infoForm.mobile
          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$notify.error({
              title: '错误',
              message:msgs[0].message
            });
          }
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .el-main
    padding 0!important
  .el-tabs__header
    marging-bottm 0!important
  .userIndex
    padding 20px;
    padding-right 200px;
    .user-avatar
      width 100px
      height 100px
      display block
      border-radius 50%
      background-color: aquamarine
    .input-width
      width 200px
    .form-warp
      border-bottom 1px solid #ccc
      padding 30px 0
</style>