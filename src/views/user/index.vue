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
                <el-input v-model="infoForm.nickName" class="input-width"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div  style="padding-left: 55px;margin-bottom:22px;width: 400px">
            <span class="span-label">邮箱</span>
            <el-input class="input-width" :placeholder="infoForm.email" v-model="newForm.email"> </el-input>
            <el-button type="text" class="red-text" style="display: inline-block;margin-left: 15px;" @click="goBindEmail">修改邮箱>>></el-button>
          </div>
          <div style="padding-left:55px;margin-bottom:22px;width: 400px">
            <span class="span-label">手机号</span>
            <el-input class="input-width" :placeholder="infoForm.mobile" v-model="newForm.mobile"> </el-input>
            <el-button type="text" class="red-text" style="display: inline-block;margin-left: 15px;" @click="goMobile">绑定手机>>></el-button>
          </div>
          <div  style="padding-left: 55px;width: 400px;display: flex">
            <div><span class="span-label">证书添加</span></div>
            <div><i class="el-icon-plus avatar-uploader-icon"></i></div>
            <div>
              <label for="male">
              <i class="el-icon-circle-plus-outline up-label"></i>
            </label>
              <up-oss style="display: none"></up-oss>
            </div>
          </div>
          <div style="text-align: right"><el-button type="primary" >保存</el-button></div>
        </div>
        <!--院系信息-->
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
              <el-form-item label="自我介绍">
                <el-input
                  type="textarea"
                  :maxlength="500"
                  :autosize="{ minRows: 4, maxRows: 6}"
                  placeholder="请输入内容"
                  v-model="jobForm.selfInt">
                </el-input>
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
      :modal="false"
      title="绑定手机号"
      :visible.sync="changeMobileDialog"
      width="30%">
      <el-form :model="changeMobileForm" :rules="rules" label-width="100px">

        <el-form-item label="手机号" prop="changeMobile">
          <el-input type="text" class="input-width" v-model="changeMobileForm.changeMobile"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <el-input class="input-width" v-model="changeMobileForm.captcha"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        style="margin-left: 40px"
        :disabled="mobileBtn"
        size="small" type="primary" @click="goBindMobile">获取验证码</el-button>
      <span v-show="mobileBtnTime != 0" style="margin-left: 10px"><span style="color:red">{{this.mobileBtnTime}}</span>秒后可重新取验证码，验证码十分钟内有效</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.changeMobileDialog = false}">取 消</el-button>
        <el-button type="primary" @click="bindMobile">确 定</el-button>
      </span>
    </el-dialog>
    <!--绑定邮箱弹窗-->
    <el-dialog
      :modal="false"
      title="绑定邮箱"
      :visible.sync="changeEmailDialog"
      width="30%">
      <el-form :model="changeEmailForm" :rules="rules" label-width="100px">
        <el-form-item label="邮箱" prop="changeEmail">
          <el-input type="text" v-model="changeEmailForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input type="password" v-model="changeEmailForm.captcha"></el-input>
        </el-form-item>
      </el-form>

        <el-button
          style="margin-left: 40px"
          :disabled="emailBtn"
          size="small"
          type="primary" @click="getMailCode">获取验证码</el-button>
      <span v-show="emailBtnTime != 0" style="margin-left: 10px"><span style="color:red">{{this.emailBtnTime}}</span>秒后可重新取验证码，验证码十分钟内有效</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>{changeEmailDialog = false;newForm.email=''}">取 消</el-button>
        <el-button type="primary" @click="changeMail">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改手机时确认密码的弹窗-->
    <el-dialog
        :modal="false"
        title="确认密码"
        :visible.sync="checkMobileDialog"
        width="30%">
        <span>身份认证</span>
        <el-input class="input-width" type="password" placeholder="请输入登录密码" v-model="password"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>{checkMobileDialog = false;this.password=''}">取 消</el-button>
        <el-button type="primary" @click="checkPass">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改邮箱时确认密码的弹窗-->
    <el-dialog
      :modal="false"
      title="确认密码"
      :visible.sync="checkEmailDialog"
      width="30%">
      <span>身份认证</span>
      <el-input class="input-width" type="password" placeholder="请输入登录密码" v-model="mailPass"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="()=>{checkEmailDialog = false;this.password=''}">取 消</el-button>
        <el-button type="primary" @click="checkMailPass">确 定</el-button>
      </span>
    </el-dialog>
    <!--证书上传弹窗-->
    <el-dialog
        title="上传证书"
        :visible.sync="uploadDialog"
        width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="uploadDialog = false">取 消</el-button>
    <el-button type="primary" @click="uploadDialog = false">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import {sysCollegeList, sysDepartmentList} from '@/api/school'
  import Cookie from 'js-cookie'
  import * as userApi from '@/api/user'
  import UpOss from "../../components/up-oss";

  export default {
    name: "index",
    components:{
      UpOss
    },
    mounted (){
      this.initUserInfo()
    },
    data() {
      return {
        activeName: 'first',
        infoForm:{
          avatar: null,
          email: null,
          gender: 1,
          idCard: null,
          mobile: null,
          nickName: null,
          realName: "",
          userId: 1351,
        },
        newForm:{
          mobile: '',
          email: '',
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
        changeMobileForm:{
          changeMobile:'',
          captcha:''
        },
        changeEmailForm:{
          mail:'',
          captcha:''
        },
        rules:{
          checking: { required: true, message: '请再次输入密码', trigger: 'blur' },
          newPasswd: { required: true, message: '请输入新密码', trigger: 'blur' },
          oldPasswd: { required: true, message: '请输入旧密码', trigger: 'blur' },
          changeMobile: { required: true, message: '请输入', trigger: 'blur' },
          changeEmail: { required: true, message: '请输入', trigger: 'blur' },
          captcha: { required: true, message: '请输入', trigger: 'blur' },
        },
        collegeList:"", //院列表
        departmentList:"", //系列表
        mobileBtn: false,
        mobileBtnTime: 0,
        emailBtn: false,
        emailBtnTime: 0,
        changeMobileDialog: false, //换电话
        changeEmailDialog: false, //更换邮箱
        checkMobileDialog:false,  //手机检查密码
        checkEmailDialog:false, //邮箱检查密码
        uploadDialog:false, //上传证书弹窗
        password:'',
        mailPass:'',
        userInfo:{},
        certificate:{
            "certificateId": 0,
            "certificateName": "string",
            "certificateNo": "string",
            "imgUrls": [
                {
                    "certificateImgId": 0,
                    "imgUrl": "string",
                    "order": 0,
                    "saveDate": "string"
                }
            ],
            "issuingAuthority": "string",
            "issuingDate": "2019-01-04T16:56:58.577Z"
        }
      };
    },
    methods:{
      //获取用户信息
      initUserInfo(){
        let data = Cookie.get('userId')
        let loading = this.$loading({
          lock: true,
          text: '正在获取用户信息',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        userApi.getMeInfo().then(res=>{
          loading.close()
          if(Number(res.code) === 200) {
            console.log(res.data)

            this.userInfo = JSON.parse(JSON.stringify(res.data))
            this.infoForm = JSON.parse(JSON.stringify(res.data))
          }else if(Number(res.code) === 440){
            let msgs = JSON.parse(res.msg)
            this.$message({
              message:msgs[0].message,
              type:'error'
            })
          }
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
      //手机换绑时验证密码
      checkPass(){
        let data = {passwd:this.mailPass}
        this.mailPass = ''
        let loading = this.$loading({
          lock: true,
          text: '验证密码',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        userApi.checkMobilePass(data).then(res=>{
          loading.close()
          if(Number(res.code) === 200) {
            this.$message.success('密码验证成功，请继续');
            this.checkMobileDialog = false
            this.changeMobileDialog = true
          }else {
            this.$message.error(res.msg);
          }
        })
      },
      //邮箱换绑时
      checkMailPass(){
        let data = {email:this.mailPass}
        this.mailPass = ''
        let loading = this.$loading({
          lock: true,
          text: '验证密码',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        userApi.checkMailPass(data).then(res=>{
          loading.close()
          if(Number(res.code) === 200) {
            this.$message.success('密码验证成功，请继续');
            this.checkEmailDialog = false
            this.changeEmailDialog = true
          }else {
            this.$message.error(res.msg);
          }
        })
      },
      //修改邮箱
      goBindEmail(){
        let flag = this.userInfo.email
        if(!flag){
          this.changeEmailDialog = true
          this.changeEmailForm.mail = this.newForm.email
        }else{
          this.checkEmailDialog = true
          this.changeEmailForm.mail = this.newForm.email
        }
      },
      //往邮箱发送验证码
      getMailCode(){
        let loading = this.$loading({
          lock: true,
          text: '正在发送验证码',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let data = {mail:String(this.changeEmailForm.mail)}
        console.log(data)
        userApi.getEmailBindCode(data).then(res=>{
          console.log(res)
          loading.close()
          if(Number(res.code) === 200) {
            this.$message.success('验证码已发送至邮箱，请查收');
            //限时
            this.emailBtn = true
            this.emailBtnTime = 30
            let time = setInterval(() =>{
              if(this.emailBtnTime>0){
                this.emailBtnTime -=1
              }else{
                this.emailBtn = false
                clearInterval(time)
                this.emailBtnTime = 0
              }
            }, 1000)
          }else if(Number(res.code) === 1000){
            this.$message.error(res.msg)
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //修改绑定邮箱
      changeMail(){
        let data = {
          mail: this.changeEmailForm.mail,
          captcha:this.changeEmailForm.captcha
        }
        let loading = this.$loading();
        userApi.bindEmail(data).then(res=>{
          loading.close()
          if(Number(res.code) === 200) {
            this.$message.success('邮箱绑定成功');
            this.newForm.mail = ''
            this.initUserInfo()
            this.changeEmailDialog = false
          }else if(Number(res.code) === 1000){
            this.$message.error('绑定号码失败')
          }
        })
      },
      //更换手机号
      goMobile(){
        let flag = this.userInfo.mobile
        if(!flag){
          this.changeMobileDialog = true
          this.changeMobileForm.changeMobile = this.infoForm.mobile
          // this.newForm.mobile = ''

        }else{
          this.checkMobileDialog = true
          this.changeMobileForm.changeMobile = this.newForm.mobile
          // this.newForm.mobile = ''
        }
      },
      // 修改手机号
      bindMobile(){
        let loading = this.$loading();
        let data = {
          mobile: this.changeMobileForm.changeMobile,
          captcha:this.changeMobileForm.captcha
        }
        userApi.bindMobile(data).then(res=>{
          loading.close()
          if(Number(res.code) === 200) {
            this.$message.success('绑定号码成功')
            this.newForm.mobile = ''
            this.initUserInfo()
            this.changeMobileDialog = false
          }else if(Number(res.code) === 1000){
            // let msgs = JSON.parse(res.msg)
            // this.$message({
            //   message:msgs[0].message,
            //   type:'error'
            // })
            this.$message.error('绑定号码失败')
          }
        })
      },
      //获取绑定验证码
      goBindMobile(){
        let loading = this.$loading({
          lock: true,
          text: '正在获取验证码',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let data = {mobile:String(this.changeMobileForm.changeMobile)}
        userApi.getBindCode(data).then(res=>{
          loading.close()

          if(Number(res.code) === 200) {
            this.$message.success('验证码已发送');

            //限时
            this.mobileBtn = true
            this.mobileBtnTime = 30
            let time = setInterval(() =>{
              if(this.mobileBtnTime>0){
                this.mobileBtnTime -=1
              }else{
                this.mobileBtn = false
                clearInterval(time)
                this.mobileBtnTime = 0
              }
            }, 1000)

          }else if(Number(res.code) === 1000){
            this.$message.error(res.msg)
          }
        })
      },
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
      .span-label
        display inline-block
        text-align: right;
        /*float: left;*/
        font-size: 14px;
        width 80px
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
      .up-label
        width: 50px;
        height: 50px;
        font-size: 50px;
        color: #409EFF
      .avatar-uploader-icon
        font-size: 28px
        color: #8c939d
        width: 280px
        height: 160px
        line-height: 160px
        text-align: center
        border:1px solid #ded5d5

</style>
