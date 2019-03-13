<template>
  <div class="login-warp">
    <div class="login" :style="bgImg">
      <div class="login-center">
        <div class="left">
          <img :src="require('@/assets/images/login_left.png')" class="left-img" alt>
        </div>
        <div class="right">
          <div></div>
          <div style="position: relative;height: 100%">
            <el-form :model="data" ref="data" class="login-box">
              <img :src="require('@/assets/images/logo.png')" class="logo-img" alt>
              <el-form-item label prop="tenantId">
                <el-select
                  filterable
                  class="input-item"
                  v-model="searchKey"
                  :filter-method="schoolInit"
                  placeholder="请选择学校"
                >
                  <el-option
                    v-for="item in schoolList"
                    :key="item.tenantId"
                    :label="item.tenantName"
                    :value="item.tenantName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label prop="userName">
                <el-input placeholder="工号/电话号码" v-model="data.userName" class="input-item"></el-input>
              </el-form-item>
              <el-form-item label prop="password" style="margin-bottom: 10px">
                <el-input
                  type="password"
                  placeholder="密码"
                  v-model="data.password"
                  class="input-item"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                <div class="input-item" style="text-align: left">
                  <span class="login-text" @click="forgotPass.dialogVisible = true">忘记密码?</span>
                </div>
              </el-form-item>
              <el-form-item style>
                <el-button type="primary" @click="goLogin" class="input-item">马上登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-button type="danger" style="position: fixed;left:50%;top: 20px;" @click="goLoginDebug">测试登陆</el-button>
    <el-dialog
      title="找回密码"
      :visible.sync="forgotPass.dialogVisible"
      :before-close="noRest"
      width="500px"
    >
      <!--通过手机号修改密码-->
      <div class="forgot-box" v-show="!forgotPass.isMail">
        <el-input
          type="text"
          placeholder="手机号"
          class="forgot-item"
          v-model="forgotPass.forgotForm.mobile"
          style="width: 300px"
        ></el-input>
        <div>
          <el-input
            type="text"
            placeholder="验证码"
            v-model="forgotPass.forgotForm.code"
            class="forgot-item"
            style="width: 210px;margin-right: 20px"
          ></el-input>
          <el-button
            type="primary"
            :disabled="forgotPass.codeBtn"
            @click="getMobileCode"
            plain
          >{{forgotPass.codeBtn ? `${forgotPass.codeBtnTime}s` : '获取'}}</el-button>
        </div>
        <el-input
          type="password"
          placeholder="设置新密码"
          class="forgot-item"
          v-model="forgotPass.forgotForm.password"
          style="width: 300px"
        ></el-input>
        <el-input
          type="password"
          placeholder="确认新密码"
          class="forgot-item"
          v-model="forgotPass.forgotForm.rePassWord"
          style="width: 300px;margin-bottom: 10px"
        ></el-input>
        <p style="color: red">新密码请使用字母+数字的组合</p>
        <div style="color: #b5b5b5;user-select: none">使用账号绑定的
          <el-button type="text" @click="changeMobile">手机号</el-button>或
          <el-button type="text" style="margin-left:0" @click="changeMail">邮箱</el-button>找回密码
        </div>
        <el-button style size="small" type="primary" @click="mobileRest">重置密码</el-button>
      </div>
      <!--通过邮箱找回密码-->
      <div class="forgot-box" v-show="forgotPass.isMail">
        <el-input
          type="text"
          placeholder="邮箱"
          class="forgot-item"
          v-model="forgotPass.forgotForm.email"
          style="width: 300px"
        ></el-input>
        <div v-if="!forgotPass.isEmailRest">
          <el-input
            type="text"
            placeholder="验证码"
            v-model="forgotPass.forgotForm.code"
            class="forgot-item"
            style="width: 210px;margin-right: 20px"
          ></el-input>
          <el-button
            type="primary"
            :disabled="forgotPass.codeBtn"
            @click="getMailCode"
            plain
          >{{forgotPass.codeBtn ? `${forgotPass.codeBtnTime}s` : '获取'}}</el-button>
        </div>
        <div v-else>
          <el-input
            type="password"
            placeholder="设置新密码"
            class="forgot-item"
            v-model="forgotPass.forgotForm.password"
            style="width: 300px"
          ></el-input>
          <el-input
            type="password"
            placeholder="确认新密码"
            class="forgot-item"
            v-model="forgotPass.forgotForm.rePassWord"
            style="width: 300px;margin-bottom: 10px"
          ></el-input>
        </div>
        <p style="color: red">新密码请使用字母+数字的组合</p>
        <div style="color: #b5b5b5;user-select: none">使用账号绑定的
          <el-button
            type="text"
            @click="()=>{forgotPass.isMail = false;forgotPass.forgotForm.mail = ''}"
          >手机号</el-button>或
          <el-button
            type="text"
            style="margin-left:0"
            @click="()=>{forgotPass.isMail = true;forgotPass.forgotForm.mobile = ''}"
          >邮箱</el-button>找回密码
        </div>
        <el-button
          size="small"
          type="primary"
          @click="forgotPass.isEmailRest ? emailRest() : emailRestCheck()"
        >{{this.forgotPass.isEmailRest ? '重置密码' : '下一步'}}</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noRest">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { logins, loginDebug, getTenant } from "@/api/login";
import { sysUserMenuList } from "@/api/system";
import {
  setToken,
  getToken,
  twoWeeksExchange,
  twoWeeksGetExchange,
  saveUserInfo
} from "@/utils/auth";
import { getErrorMsg } from "@/utils/utils";
import MenuUtils from "@/utils/MenuUtils";
// import { static_routes } from "@/router/static_routes.json";
// import {compare} from '@/utils/MenuUtils'
import {
  mobileForgot,
  emailForgot,
  resetPass,
  emailFotgotCheck,
  mobileFotgotCheck
} from "../../api/user";

var routers = [];
export default {
  data() {
    return {
      bgImg: {
        backgroundImage: "url(" + require("@/assets/images/login_bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%"
      },
      forgotPass: {
        dialogVisible: false,
        isMail: false,
        codeBtn: false,
        codeBtnTime: 0,
        isEmailRest: false,
        forgotForm: {
          email: "",
          password: "",
          rePassWord: "",
          mobile: "",
          code: ""
        }
      },
      leftImg: require("@/assets/images/login_left.png"),
      schoolList: [], //租户列表
      searchKey: "", //搜索
      data: {
        userName: "",
        password: "",
        tenantId: ""
      },
      rules: {
        tenantId: [
          { required: true, message: "请选择所属学校", trigger: "blur" }
        ],
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    this.schoolInit();
  },
  methods: {
    schoolInit(key = "") {
      let data = { searchKey: key };
      getTenant(data)
        .then(res => {
          // console.log(res)
          if (res.code === 200) {
            this.schoolList = res.data;
          } else {
            this.$message.error("获取学校信息失败，请重试");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goLogin() {
      let tenant = this.schoolList.find(value => {
        return value.tenantName == this.searchKey;
      });
      let tenantId = tenant ? tenant.tenantId : "",
        data = {
          tenantId: tenantId,
          loginAccount: this.data.userName,
          passwd: this.data.password
        };
      logins(data)
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            // console.log(res)
            twoWeeksExchange(res.data.token, res.data.refreshToken);
            saveUserInfo(res.data.userId);
            sysUserMenuList().then(response => {
              console.log(static_routes);
              let static_routes = [
                {
                  menuId: 1,
                  name: "课程中心",
                  parentId: 0,
                  url: "/course",
                  perms: null,
                  type: 0,
                  icon: null,
                  orderNo: 1,
                  comment: null,
                  menuCode: null,
                  showCode: null,
                  level: 1,
                  redirect: "/course/list",
                  component: "layout/header",
                  open: null,
                  list: [
                    {
                      menuId: 90,
                      name: "试题管理",
                      parentId: 1,
                      url: "/test",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: "/course/resource/test",
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 91,
                          name: "试题列表",
                          parentId: 90,
                          url: "/course/resource/test",
                          perms: "course:libraryquiz:list",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: "",
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "course/resourse/test/test",
                          open: null,
                          list: null,
                          parentName: "试题管理",
                          isLeaf: null
                        },
                        {
                          menuId: 95,
                          name: "保存试题",
                          parentId: 90,
                          url: "/course/resource/addtest/:catalog",
                          perms: "course:libraryquiz:save",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: 2,
                          level: null,
                          redirect: null,
                          component: "course/resourse/test/addTest",
                          open: null,
                          list: null,
                          parentName: "试题管理",
                          isLeaf: null
                        },
                        {
                          menuId: 97,
                          name: "修改试题",
                          parentId: 90,
                          url: "/course/resource/edittest/:quiz",
                          perms: "course:libraryquiz:update",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: 2,
                          level: null,
                          redirect: null,
                          component: "course/resourse/test/editTest",
                          open: null,
                          list: null,
                          parentName: "试题管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "课程中心",
                      isLeaf: null
                    },
                    {
                      menuId: 103,
                      name: "资源管理",
                      parentId: 1,
                      url: "/resource",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 105,
                          name: "资源列表",
                          parentId: 103,
                          url: "/course/resource/resource",
                          perms: "course:libraryresource:list",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "course/resourse/resourse/resourse",
                          open: null,
                          list: null,
                          parentName: "资源管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "课程中心",
                      isLeaf: null
                    },
                    {
                      menuId: 114,
                      name: "活动管理",
                      parentId: 1,
                      url: "/activity",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 115,
                          name: "活动列表",
                          parentId: 114,
                          url: "/course/activity/activity",
                          perms: "course:interaction",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "course/resourse/activity/activity",
                          open: null,
                          list: null,
                          parentName: "活动管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "课程中心",
                      isLeaf: null
                    },
                    {
                      menuId: 173,
                      name: "课程列表",
                      parentId: 1,
                      url: "/course/list",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: "",
                      menuCode: null,
                      showCode: null,
                      level: 2,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 209,
                          name: "课程容器",
                          parentId: 173,
                          url: "/course/list/chapter",
                          perms: "",
                          type: 0,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: 2,
                          level: 2,
                          redirect: "",
                          component: "course/courseMain",
                          open: null,
                          list: [
                            {
                              menuId: 46,
                              name: "互动",
                              parentId: 209,
                              url: "/course/list/interact",
                              perms: "course:interaction",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interact",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 50,
                              name: "教学管理",
                              parentId: 209,
                              url: "/course/list/teach",
                              perms: null,
                              type: 0,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: "/course/list/teach/grade",
                              component: "course/teach",
                              open: null,
                              list: [
                                {
                                  menuId: 33,
                                  name: "查看测试",
                                  parentId: 50,
                                  url: "/course/list/teach/test",
                                  perms: "course:exam:info,course:exam:list",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/test",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 35,
                                  name: "查看头脑风暴",
                                  parentId: 50,
                                  url: "/course/list/teach/storm",
                                  perms: "course:storm:info",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/storm",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 41,
                                  name: "查看投票",
                                  parentId: 50,
                                  url: "/course/list/teach/questionnaire",
                                  perms: "course:vote:info",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component:
                                    "course/teachContent/questionnaire",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 43,
                                  name: "查看作业",
                                  parentId: 50,
                                  url: "/course/list/teach/homework",
                                  perms:
                                    "course:homework:info,course:homework:list",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/homeworkList",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 61,
                                  name: "查看成绩",
                                  parentId: 50,
                                  url: "/course/list/teach/grade",
                                  perms: "course:coursescore:info",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/grade",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 69,
                                  name: "作业详情",
                                  parentId: 50,
                                  url: "/course/list/teach/homeworkdetail",
                                  perms: "course:homeworksubmission:info",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component:
                                    "course/teachContent/homeworkDetail",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 79,
                                  name: "笔记列表",
                                  parentId: 50,
                                  url: "/course/list/teach/notes",
                                  perms: "course:note:list",
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/notes",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 210,
                                  name: "查看视频",
                                  parentId: 50,
                                  url: "/course/list/teach/video",
                                  perms: null,
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/videos",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                },
                                {
                                  menuId: 212,
                                  name: "测试详情",
                                  parentId: 50,
                                  url: "/course/list/teach/testmark",
                                  perms: null,
                                  type: 1,
                                  icon: null,
                                  orderNo: null,
                                  comment: null,
                                  menuCode: null,
                                  showCode: null,
                                  level: null,
                                  redirect: null,
                                  component: "course/teachContent/testMark",
                                  open: null,
                                  list: null,
                                  parentName: "教学管理",
                                  isLeaf: null
                                }
                              ],
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 51,
                              name: "成员列表",
                              parentId: 209,
                              url: "/course/list/member",
                              perms: "course:courseuser:list",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/member",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 58,
                              name: "查看小组方案",
                              parentId: 209,
                              url: "/course/list/member/manage",
                              perms:
                                "course:courseteam:list,course:coursescheme:list,course:courseteamuser:list",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/memberContent/groupPlan",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 83,
                              name: "通知列表",
                              parentId: 209,
                              url: "/course/list/notice",
                              perms: "course:course:info",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/notice",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 211,
                              name: "讨论查看",
                              parentId: 209,
                              url: "/course/list/discuss",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/discuss",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 213,
                              name: "发布投票",
                              parentId: 209,
                              url: "/course/list/interact/vote",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/vote",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 214,
                              name: "发布头脑风暴",
                              parentId: 209,
                              url: "/course/list/interact/brainstorm",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/brainStorm",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 215,
                              name: "发布作业",
                              parentId: 209,
                              url: "/course/list/interact/homework",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/homeWork",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 216,
                              name: "发布测试",
                              parentId: 209,
                              url: "/course/list/interact/test",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/test",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 217,
                              name: "投票结果",
                              parentId: 209,
                              url: "/course/list/interact/voteresult",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/voteResult",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 218,
                              name: "头脑风暴结果",
                              parentId: 209,
                              url: "/course/list/interact/brainresult",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/brainResult",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 219,
                              name: "作业结果",
                              parentId: 209,
                              url: "/course/list/interact/homeworkresult",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/workResult",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 220,
                              name: "测试结果",
                              parentId: 209,
                              url: "/course/list/interact/testresult",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "course/interactContent/testResult",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            },
                            {
                              menuId: 12,
                              name: "章节内容",
                              parentId: 209,
                              url: "/course/list/chapter",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: 1,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: 3,
                              redirect: null,
                              component: "course/chapter",
                              open: null,
                              list: null,
                              parentName: "课程容器",
                              isLeaf: null
                            }
                          ],
                          parentName: "课程列表",
                          isLeaf: null
                        },
                        {
                          menuId: 3,
                          name: "课程列表",
                          parentId: 173,
                          url: "/course/list",
                          perms: "course:course:list",
                          type: 0,
                          icon: null,
                          orderNo: 1,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: "",
                          component: "course/list",
                          open: null,
                          list: [],
                          parentName: "课程列表",
                          isLeaf: null
                        },
                        {
                          menuId: 4,
                          name: "创建课程",
                          parentId: 173,
                          url: "/course/addcourse",
                          perms: "course:course:save",
                          type: 0,
                          icon: null,
                          orderNo: 1,
                          comment: null,
                          menuCode: null,
                          showCode: 2,
                          level: null,
                          redirect: null,
                          component: "course/addCourse",
                          open: null,
                          list: [],
                          parentName: "课程列表",
                          isLeaf: null
                        }
                      ],
                      parentName: "课程中心",
                      isLeaf: null
                    },
                    {
                      menuId: 174,
                      name: "课程评价",
                      parentId: 1,
                      url: "/appraisal/list",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: 2,
                      redirect: "",
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 86,
                          name: "课程评价",
                          parentId: 174,
                          url: "/appraisal/list",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: "",
                          component: "course/appraisal",
                          open: null,
                          list: null,
                          parentName: "课程评价",
                          isLeaf: null
                        }
                      ],
                      parentName: "课程中心",
                      isLeaf: null
                    }
                  ],
                  parentName: null,
                  isLeaf: null
                },
                {
                  menuId: 169,
                  name: "学习中心",
                  parentId: 0,
                  url: "/learn",
                  perms: "user:list",
                  type: 0,
                  icon: null,
                  orderNo: 2,
                  comment: null,
                  menuCode: null,
                  showCode: null,
                  level: 1,
                  redirect: "/learn/inclass",
                  component: "layout/header",
                  open: null,
                  list: [
                    {
                      menuId: 170,
                      name: "学习管理",
                      parentId: 169,
                      url: "/learn/inclass",
                      perms: "user:xxx",
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: 2,
                      redirect: "",
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 171,
                          name: "课堂",
                          parentId: 170,
                          url: "/learn/inclass",
                          perms: "user:xxx",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: 3,
                          redirect: "",
                          component: "learn/inClass",
                          open: null,
                          list: null,
                          parentName: "学习管理",
                          isLeaf: null
                        },
                        {
                          menuId: 187,
                          name: "课后",
                          parentId: 170,
                          url: "/learn/afterclass",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "learn/afterClass",
                          open: null,
                          list: null,
                          parentName: "学习管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "学习中心",
                      isLeaf: null
                    }
                  ],
                  parentName: null,
                  isLeaf: null
                },
                {
                  menuId: 120,
                  name: "校管中心",
                  parentId: 0,
                  url: "/school",
                  perms: "",
                  type: 0,
                  icon: null,
                  orderNo: 3,
                  comment: null,
                  menuCode: null,
                  showCode: null,
                  level: 1,
                  redirect: "/school/student",
                  component: "layout/header",
                  open: null,
                  list: [
                    {
                      menuId: 121,
                      name: "用户管理",
                      parentId: 120,
                      url: "/school/student",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 123,
                          name: "学生管理",
                          parentId: 121,
                          url: "/school/student",
                          perms: "sys:student:list",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/student",
                          open: null,
                          list: null,
                          parentName: "用户管理",
                          isLeaf: null
                        },
                        {
                          menuId: 133,
                          name: "教师管理",
                          parentId: 121,
                          url: "/school/teacher",
                          perms: "sys:teacher:info",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/teacher",
                          open: null,
                          list: null,
                          parentName: "用户管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "校管中心",
                      isLeaf: null
                    },
                    {
                      menuId: 177,
                      name: "门户配置",
                      parentId: 120,
                      url: "/portal",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: 2,
                      redirect: "/school/portal/mould",
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 147,
                          name: "设置门户模板",
                          parentId: 177,
                          url: "/school/portal/mould",
                          perms: "sys:tenant:update",
                          type: 0,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: 2,
                          redirect: null,
                          component: "school/portal",
                          open: null,
                          list: [
                            {
                              menuId: 148,
                              name: "门户模板列表",
                              parentId: 147,
                              url: "/school/portal/mould",
                              perms: "sys:tenant:info",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: 3,
                              redirect: null,
                              component: "school/portalMould",
                              open: null,
                              list: null,
                              parentName: "设置门户模板",
                              isLeaf: null
                            },
                            {
                              menuId: 150,
                              name: "获取平台信息",
                              parentId: 147,
                              url: "/school/portal/platform",
                              perms: "sys:tenant:info",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "school/portalPlatform",
                              open: null,
                              list: null,
                              parentName: "设置门户模板",
                              isLeaf: null
                            },
                            {
                              menuId: 152,
                              name: "获取租户轮播图",
                              parentId: 147,
                              url: "/school/portal/banner",
                              perms: "sys:tenantcarousel:info",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "school/portalBanner",
                              open: null,
                              list: null,
                              parentName: "设置门户模板",
                              isLeaf: null
                            },
                            {
                              menuId: 155,
                              name: "名师推荐列表",
                              parentId: 147,
                              url: "/school/portal/teacher",
                              perms: "sys:recommend:list",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "school/portalTeacher",
                              open: null,
                              list: null,
                              parentName: "设置门户模板",
                              isLeaf: null
                            },
                            {
                              menuId: 178,
                              name: "课程推荐列表",
                              parentId: 147,
                              url: "/school/portal/recommend",
                              perms: "sys:recommend:list",
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "school/portalRecommend",
                              open: null,
                              list: null,
                              parentName: "设置门户模板",
                              isLeaf: null
                            }
                          ],
                          parentName: "门户配置",
                          isLeaf: null
                        }
                      ],
                      parentName: "校管中心",
                      isLeaf: null
                    },
                    {
                      menuId: 179,
                      name: "消息管理",
                      parentId: 120,
                      url: "/school/notice",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 180,
                          name: "消息管理",
                          parentId: 179,
                          url: "/school/notice",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/schoolNotice",
                          open: null,
                          list: null,
                          parentName: "消息管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "校管中心",
                      isLeaf: null
                    },
                    {
                      menuId: 181,
                      name: "课程管理",
                      parentId: 120,
                      url: "/school/course/course",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 159,
                          name: "课程管理",
                          parentId: 181,
                          url: "/school/course/course",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/course",
                          open: null,
                          list: null,
                          parentName: "课程管理",
                          isLeaf: null
                        },
                        {
                          menuId: 162,
                          name: "证书审核",
                          parentId: 181,
                          url: "/school/course/certificate",
                          perms: "sys:certificate:info",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/certificate",
                          open: null,
                          list: null,
                          parentName: "课程管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "校管中心",
                      isLeaf: null
                    },
                    {
                      menuId: 182,
                      name: "组织架构",
                      parentId: 120,
                      url: "/school/structure/academy",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 183,
                          name: "院管理",
                          parentId: 182,
                          url: "/school/structure/academy",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/academy",
                          open: null,
                          list: null,
                          parentName: "组织架构",
                          isLeaf: null
                        },
                        {
                          menuId: 184,
                          name: "系管理",
                          parentId: 182,
                          url: "/school/structure/department",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/department",
                          open: null,
                          list: null,
                          parentName: "组织架构",
                          isLeaf: null
                        },
                        {
                          menuId: 185,
                          name: "专业管理",
                          parentId: 182,
                          url: "/school/structure/speciality",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/speciality",
                          open: null,
                          list: null,
                          parentName: "组织架构",
                          isLeaf: null
                        },
                        {
                          menuId: 186,
                          name: "班级管理",
                          parentId: 182,
                          url: "/school/structure/class",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "school/class",
                          open: null,
                          list: null,
                          parentName: "组织架构",
                          isLeaf: null
                        }
                      ],
                      parentName: "校管中心",
                      isLeaf: null
                    }
                  ],
                  parentName: null,
                  isLeaf: null
                },
                {
                  menuId: 164,
                  name: "系统管理",
                  parentId: 0,
                  url: "/system",
                  perms: null,
                  type: 0,
                  icon: null,
                  orderNo: 4,
                  comment: null,
                  menuCode: null,
                  showCode: null,
                  level: 1,
                  redirect: "/system/tenantManager",
                  component: "layout/header",
                  open: null,
                  list: [
                    {
                      menuId: 165,
                      name: "租户管理",
                      parentId: 164,
                      url: "/system/tenantManager",
                      perms: "xxx",
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: 2,
                      redirect: "",
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 166,
                          name: "租户管理",
                          parentId: 165,
                          url: "/system/tenantManager",
                          perms: "xxx",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: 3,
                          redirect: null,
                          component: "system/tenantManager",
                          open: null,
                          list: null,
                          parentName: "租户管理",
                          isLeaf: null
                        },
                        {
                          menuId: 188,
                          name: "租户账号管理",
                          parentId: 165,
                          url: "/system/tenantAccountManager",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/tenantAccountManager",
                          open: null,
                          list: null,
                          parentName: "租户管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "系统管理",
                      isLeaf: null
                    },
                    {
                      menuId: 167,
                      name: "权限管理",
                      parentId: 164,
                      url: "/system/power",
                      perms: "xx",
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: 2,
                      redirect: "",
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 168,
                          name: "菜单管理",
                          parentId: 167,
                          url: "/system/menu",
                          perms: "xx",
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: 2,
                          redirect: "",
                          component: "system/menu",
                          open: null,
                          list: null,
                          parentName: "权限管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "系统管理",
                      isLeaf: null
                    },
                    {
                      menuId: 189,
                      name: "系统管理",
                      parentId: 164,
                      url: "/system/courseCategory",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 190,
                          name: "课程分类",
                          parentId: 189,
                          url: "/system/courseCategory",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/courseCategory",
                          open: null,
                          list: null,
                          parentName: "系统管理",
                          isLeaf: null
                        },
                        {
                          menuId: 191,
                          name: "帮助中心管理",
                          parentId: 189,
                          url: "/system/help",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/help",
                          open: null,
                          list: null,
                          parentName: "系统管理",
                          isLeaf: null
                        },
                        {
                          menuId: 192,
                          name: "消息管理",
                          parentId: 189,
                          url: "/system/notice",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/sysNotice",
                          open: null,
                          list: null,
                          parentName: "系统管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "系统管理",
                      isLeaf: null
                    },
                    {
                      menuId: 193,
                      name: "用户中心",
                      parentId: 164,
                      url: "/system/student",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 194,
                          name: "学生管理",
                          parentId: 193,
                          url: "/system/student",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/student",
                          open: null,
                          list: null,
                          parentName: "用户中心",
                          isLeaf: null
                        },
                        {
                          menuId: 195,
                          name: "教师管理",
                          parentId: 193,
                          url: "/system/teacher",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/teacher",
                          open: null,
                          list: null,
                          parentName: "用户中心",
                          isLeaf: null
                        },
                        {
                          menuId: 196,
                          name: "学校管理员",
                          parentId: 193,
                          url: "/system/school",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/school",
                          open: null,
                          list: null,
                          parentName: "用户中心",
                          isLeaf: null
                        },
                        {
                          menuId: 197,
                          name: "系统管理员",
                          parentId: 193,
                          url: "/system/manager",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/system",
                          open: null,
                          list: null,
                          parentName: "用户中心",
                          isLeaf: null
                        },
                        {
                          menuId: 198,
                          name: "标签管理",
                          parentId: 193,
                          url: "/system/tag",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/tag",
                          open: null,
                          list: null,
                          parentName: "用户中心",
                          isLeaf: null
                        }
                      ],
                      parentName: "系统管理",
                      isLeaf: null
                    },
                    {
                      menuId: 199,
                      name: "权限管理",
                      parentId: 164,
                      url: "/system/menu",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 200,
                          name: "菜单管理",
                          parentId: 199,
                          url: "/system/menu",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/menu",
                          open: null,
                          list: null,
                          parentName: "权限管理",
                          isLeaf: null
                        },
                        {
                          menuId: 201,
                          name: "角色管理",
                          parentId: 199,
                          url: "/system/role",
                          perms: null,
                          type: 1,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/role",
                          open: null,
                          list: null,
                          parentName: "权限管理",
                          isLeaf: null
                        }
                      ],
                      parentName: "系统管理",
                      isLeaf: null
                    },
                    {
                      menuId: 202,
                      name: "门户配置",
                      parentId: 164,
                      url: "/system/school",
                      perms: null,
                      type: 0,
                      icon: null,
                      orderNo: null,
                      comment: null,
                      menuCode: null,
                      showCode: null,
                      level: null,
                      redirect: null,
                      component: "layout/index",
                      open: null,
                      list: [
                        {
                          menuId: 203,
                          name: "模板配置",
                          parentId: 202,
                          url: "/system/portal/mould",
                          perms: null,
                          type: 0,
                          icon: null,
                          orderNo: null,
                          comment: null,
                          menuCode: null,
                          showCode: null,
                          level: null,
                          redirect: null,
                          component: "system/portal",
                          open: null,
                          list: [
                            {
                              menuId: 204,
                              name: "模板配置",
                              parentId: 203,
                              url: "/system/portal/mould",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "system/portalMould",
                              open: null,
                              list: null,
                              parentName: "模板配置",
                              isLeaf: null
                            },
                            {
                              menuId: 205,
                              name: "平台信息",
                              parentId: 203,
                              url: "/system/portal/platform",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "system/portalPlatform",
                              open: null,
                              list: null,
                              parentName: "模板配置",
                              isLeaf: null
                            },
                            {
                              menuId: 206,
                              name: "轮播图",
                              parentId: 203,
                              url: "/system/portal/banner",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "system/portalBanner",
                              open: null,
                              list: null,
                              parentName: "模板配置",
                              isLeaf: null
                            },
                            {
                              menuId: 207,
                              name: "课程推荐",
                              parentId: 203,
                              url: "/system/portal/recommend",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "system/portalRecommend",
                              open: null,
                              list: null,
                              parentName: "模板配置",
                              isLeaf: null
                            },
                            {
                              menuId: 208,
                              name: "名师风采",
                              parentId: 203,
                              url: "/system/portal/teacher",
                              perms: null,
                              type: 1,
                              icon: null,
                              orderNo: null,
                              comment: null,
                              menuCode: null,
                              showCode: null,
                              level: null,
                              redirect: null,
                              component: "system/portalTeacher",
                              open: null,
                              list: null,
                              parentName: "模板配置",
                              isLeaf: null
                            }
                          ],
                          parentName: "门户配置",
                          isLeaf: null
                        }
                      ],
                      parentName: "系统管理",
                      isLeaf: null
                    }
                  ],
                  parentName: null,
                  isLeaf: null
                }
              ];
              // sessionStorage.setItem('menuList',JSON.stringify(response.data))
              sessionStorage.setItem("menuList", JSON.stringify(static_routes));
              // let routes = MenuUtils(response.data)
              let routes = MenuUtils(static_routes);
              // console.log(routes)
              this.$store.commit("setAllMenu", routes);
              this.$router.addRoutes(routes);
              this.$router.replace("/course");
            });
          } else {
            this.$message({
              message: getErrorMsg(res.msg),
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goLoginDebug() {
      let data = {
        tenantId: 1,
        loginAccount: "admin",
        passwd: "abc123"
      };
      logins(data)
        .then(res => {
          // console.log(res)
          if (res.code === 200) {
            console.log("登录成功");
            twoWeeksExchange(res.data.token, res.data.refreshToken);
            saveUserInfo(res.data.userId);
            this.$router.replace("/course");
          } else {
            this.$message({
              message: getErrorMsg(res.msg),
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //切换为手机号方式
    changeMobile() {
      this.forgotPass.isMail = false;
      (this.forgotPass.codeBtn = false),
        (this.forgotPass.codeBtnTime = 0),
        (this.forgotPass.forgotForm.email = "");
      this.forgotPass.forgotForm.password = "";
      this.forgotPass.forgotForm.rePassWord = "";
      this.forgotPass.forgotForm.mobile = "";
      this.forgotPass.forgotForm.code = "";
    },
    //切换为邮箱方式
    changeMail() {
      this.forgotPass.isMail = true;
      (this.forgotPass.codeBtn = false),
        (this.forgotPass.codeBtnTime = 0),
        (this.forgotPass.forgotForm.email = "");
      this.forgotPass.forgotForm.password = "";
      this.forgotPass.forgotForm.rePassWord = "";
      this.forgotPass.forgotForm.mobile = "";
      this.forgotPass.forgotForm.code = "";
    },
    //手机号重置密码,获取验证码
    getMobileCode() {
      mobileForgot({ mobile: this.forgotPass.forgotForm.mobile })
        .then(res => {
          if (res.code === 200) {
            this.$message.success("验证码发送成功");
            //限时
            this.forgotPass.codeBtn = true;
            this.forgotPass.codeBtnTime = 60;
            let time = setInterval(() => {
              if (this.forgotPass.codeBtnTime > 0) {
                this.forgotPass.codeBtnTime -= 1;
              } else {
                this.forgotPass.codeBtn = false;
                clearInterval(time);
                this.forgotPass.codeBtnTime = 0;
              }
            }, 1000);
          } else {
            this.$message.error(getErrorMsg(res.msg));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMailCode() {
      let loading = this.$loading({
        lock: true,
        text: "正在发送验证码，请稍候",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      emailForgot({ mail: this.forgotPass.forgotForm.email })
        .then(res => {
          loading.close();
          if (res.code === 200) {
            this.$message.success("验证码成功发送至邮箱");
            //限时
            this.forgotPass.codeBtn = true;
            this.forgotPass.codeBtnTime = 60;
            let time = setInterval(() => {
              if (this.forgotPass.codeBtnTime > 0) {
                this.forgotPass.codeBtnTime -= 1;
                console.log(this.forgotPass.codeBtnTime);
              } else {
                this.forgotPass.codeBtn = false;
                clearInterval(time);
                this.forgotPass.codeBtnTime = 0;
              }
            }, 1000);
          } else {
            this.$message.error(getErrorMsg(res.msg));
          }
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    //手机号重置密码
    mobileRest() {
      let data = {
        mobile: this.forgotPass.forgotForm.mobile,
        captcha: this.forgotPass.forgotForm.code,
        newPasswd: this.forgotPass.forgotForm.password,
        passwdCheck: this.forgotPass.forgotForm.rePassWord
      };
      mobileFotgotCheck(data)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("密码重置成功");
            this.data.userName = this.forgotPass.forgotForm.mobile;
            this.noRest();
          } else {
            this.$message.error(getErrorMsg(res.msg));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //邮箱验证码验证
    emailRestCheck() {
      let data = {
        mail: this.forgotPass.forgotForm.email,
        captcha: this.forgotPass.forgotForm.code
      };
      emailFotgotCheck(data)
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            this.forgotPass.isEmailRest = true;
          } else {
            this.$message.error(getErrorMsg(res.msg));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //邮箱重置密码
    emailRest() {
      let data = {
        mail: this.forgotPass.forgotForm.email,
        newPasswd: this.forgotPass.forgotForm.password,
        passwdCheck: this.forgotPass.forgotForm.rePassWord
      };
      resetPass(data)
        .then(res => {
          if (res.code === 200) {
            this.$message.success("密码重置成功");
            this.data.userName = this.forgotPass.forgotForm.email;
            this.noRest();
          } else {
            this.$message.error(getErrorMsg(res.msg));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //取消重置密码
    noRest() {
      this.forgotPass.dialogVisible = false;
      this.forgotPass.forgotForm.email = "";
      this.forgotPass.forgotForm.password = "";
      this.forgotPass.forgotForm.rePassWord = "";
      this.forgotPass.forgotForm.code = "";
      this.forgotPass.forgotForm.mobile = "";
      this.forgotPass.codeBtnTime = 0;
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.login-warp {
  width: inherit;
  height: inherit;

  .login {
    width: 100%;
    position: relative;
    height: 100%;

    .login-center {
      min-width: 600px;
      min-height: 350px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      box-shadow: #a1a1a1 0 0 10px;
      color: #ffffff;
      border-radius: 20px;
      display: flex;

      .left {
        background-color: #3a8ee6;
        width: 50%;
        float: left;

        .left-img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        width: 50%;
        /* float right */
        background-color: white;
        display: inline-block;
        text-align: center;

        .login-box {
          position: absolute;
          width: 80%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);

          .input-item {
            margin: 0 auto;
            width: 100%;
            max-width: 300px;
          }

          .login-text {
            color: #909399;
            text-align: left;
            cursor: pointer;
            margin: 10px 0;
            user-select: none;
            font-size: 13px;
          }

          .login-btn {
            cursor: pointer;
            background: linear-gradient(to right, #6fb2ff, #095fff);
            user-select: none;
          }
        }

        .logo-img {
          height: 45px;
          margin: 20px 0;
        }
      }
    }
  }

  .forgot-box {
    width: 320px;
    margin: 0 auto;

    .forgot-item {
      margin-bottom: 20px;
    }
  }
}
</style>