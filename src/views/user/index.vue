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
          </div>
          <div style="text-align: right"><el-button type="primary" >保存</el-button></div>
        </div>
        <div  style="padding-left: 55px;width: 280px">
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
          <el-form-item label="证书添加"></el-form-item>
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
                <el-input v-model="jobForm.yuan" :placeholder="infoForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="所属系">
                <el-input v-model="jobForm.xi" :placeholder="infoForm.userName"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: right"><el-button type="primary" >保存</el-button></div>
        </div>

        <div class="form-warp">
          <p>修改密码</p>
          <div style="padding-left:55px;width: 300px">
            <el-form :model="passForm" label-width="100px">

              <el-form-item label="当前密码">
                <el-input type="text" v-model="passForm.oldPasswd"></el-input>
              </el-form-item>

              <el-form-item label="新密码">
                <el-input type="password" v-model="passForm.newPasswd"></el-input>
              </el-form-item>

              <el-form-item label="确认密码">
                <el-input type="password" v-model="passForm.checking"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="text-align: right"><el-button type="primary" @click="changePassword()">保存</el-button></div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="消息管理" name="second"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {sysCollegeList, sysDepartmentList} from '@/api/school'
  import {changeUserPassword} from '@/api/user'
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
          checking: "",
          newPasswd: "",
          oldPasswd: ""
        },
        collegeList:"", //院列表
        departmentList:"", //系列表
      };
    },
    methods:{
      //初始时获取院系信息
      initInfo(){
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
      //获取院信息
      initCollege(){

      },
      //获取系信息
      initDepartment(){

      },
      toMessage () {
        if(this.activeName === 'second'){
          this.$router.push('message')
        }
      },
      // 修改密码
      changePassword(){
        let data  = this.passForm
        changeUserPassword(data).then(res=>{
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