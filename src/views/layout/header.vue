<template>
  <div>
    <div class="header">
      <div style="display: flex;flex: 1">
        <router-link to="/course" class="login">
          <span>天擎智课</span>
          <span class="sizes">后台管理</span>
        </router-link>
        <el-menu
          :default-active="defaultActiveIndex"
          background-color="rgb(70,76,92)"
          style="font-size:20px"
          text-color="#fff"
          active-text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          :router="true"
        >
          <el-menu-item :index="item.path" v-for="item in nav">{{item.name}}</el-menu-item>
          <!-- <el-menu-item index="/learn">学习管理</el-menu-item>
          <el-menu-item index="/school">校管中心</el-menu-item>
          <el-menu-item index="/system">系统管理</el-menu-item> -->
          <!-- <el-menu-item v-for="(item,index) in $router.options.routes" v-if="item.type&&item.menuShow" :key="index" :index="item.children[0].path" 
                                >
                    <i :class="item.iconCls"></i><span slot="title">{{item.name}}</span>
          </el-menu-item>-->
        </el-menu>
      </div>
      <div style="margin-right: 30px;margin-top: 15px;color: white;">
        <router-link :to="{path: '/user/message'}" style="display: inline-block;vertical-align: middle">
          <el-badge :value="$store.state.msgNum" class="item" v-if="$store.state.msgNum > 0">
            <i class="el-icon-bell" style="font-size: 30px;cursor: pointer"></i>
          </el-badge>
          <el-badge v-else>
            <i class="el-icon-bell" style="font-size: 30px;cursor: pointer"></i>
          </el-badge>
        </router-link>
      </div>
      <el-dropdown class="avator">
        <span class="el-dropdown-link userinfo-inner">
            <img :src="require('../../assets/images/user.png')" alt>
            <span>{{this.realName}}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/user/index">个人中心</router-link>
            <!--<div ><span style="color: #555;font-size: 14px;"></span></div>-->
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="doLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { menuList, logout } from "@/api/login";
import { constantRouterMap } from "@/router/index";
import { removeToken, getUserId, removeUserId } from "@/utils/auth";
import { getUserInfo, getMeInfo, userInit } from "../../api/user";
import {unReadyMsg} from '@/api/course'
import {getErrorMsg} from "../../utils/utils";

export default {
  props: ["navs"],
  data() {
    return {
      defaultActiveIndex: "/course",
      nav: [
        {
          name: "课程中心",
          url: "/course",
          isNav: "course"
        },
        {
          name: "学习管理",
          url: "/learn/index",
          isNav: "learn"
        },
        {
          name: "校管中心",
          url: "/school",
          isNav: "school"
        },
        {
          name: "系统管理",
          url: "/system",
          isNav: "system"
        }
      ],
      realName: "",
      menuList: constantRouterMap,
      nameInit: "",
      msgNumber:1,
      nameDialog: true
    };
  },
  created() {
    // menuList().then((response)=>{
    // console.log(this.storeNav, '``````', response.data)
    this.nav = this.$router.options.routes.filter(item=> {
        if(item.level ===1) {
          return item
        }
      }
    )
    this.$store.commit("setAllMenu", this.menuList);
    this.fetchNavData();
    this.getUserInfo();
    this.getMsg();
  },
  methods: {
    navChange() {
      this.storeNav = this.$store.state.navHeader;
    },
    jumpTo(url) {
      console.log(url);
      this.$router.push(url);
    },
    //退出登录
    doLogout() {
      removeToken();
      removeUserId();
      this.$router.push("/login");
    },
    handleSelect(index) {
      this.defaultActiveIndex = index;
    },
    fetchNavData() {
      // 初始化菜单激活项
      var n = this.$route.path.split("/").length - 1;
      var cur_path = n > 3 ? this.$store.state.leftNavState : this.$route.path; //获取当前路由
      console.log("curpath", cur_path);
      console.log("cookiepath", this.$store.state.leftNavState);
      var routers = this.$router.options.routes; // 获取路由对象
      var nav_type = "courseCenter",
        nav_name = "course";
      // console.log('routers', routers)
      for (var i = 0; i < routers.length; i++) {
        var children = routers[i].children;
        if (children) {
          for (var j = 0; j < children.length; j++) {
            var grand_children = children[j].children;

            if (grand_children) {
              for (var k = 0; k < grand_children.length; k++) {
                console.log('grand_children',grand_children[k].path, '===curpath' + cur_path)
                if (grand_children[k].path === cur_path) {
                  console.log("topNavState", routers[i]);
                  // nav_type = routers[i].type;
                  nav_name = routers[i].name;
                  break;
                }
              }
            }
          }
          // var foo1 = function(list){
          //     if(list.children){
          //         foo1(list.children)
          //     }else{}
          // }
        }
      }
      this.$store.state.topNavState = nav_type; // 改变topNavState状态的值
      if (n <= 3) {
        this.$store.state.leftNavState = nav_name; // 改变leftNavState状态的值
      }
      console.log("nav_type", nav_type, "nav_name", nav_name);
      this.defaultActiveIndex = "/" + nav_name;
    },
    //根据Cookie获取用户信息
    getUserInfo() {
      let data = getUserId();
      getMeInfo().then(res => {
        // console.log(res);
        if (Number(res.code) === 200) {
          this.realName = res.data.realName;
          sessionStorage.setItem("realName", res.data.realName);
          sessionStorage.setItem("tenantId", res.data.gender);
        } else {
          // this.$message.error('请登录')
          // this.$message.error(getErrorMsg(res.msg));
        }
      });
    },
    getMsg(){
      unReadyMsg()
        .then((res)=>{
          console.log(res)
          if (Number(res.code) === 200) {
            this.msgNumber = res.data
            this.$store.commit('SET_MSG', res.data)
          } else {
            this.$message.error('请登录')

            // this.$message.error(getErrorMsg(res.msg));
          }
        })
        .catch((err)=>{
          console.log(err)
        })
    },
  },
  watch: {
    $route: function(to, from) {
      // 路由改变时执行
      //console.info("to.path:" + to.path);
      this.fetchNavData();
      this.getUserInfo();
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.el-menu-item {
  text-align: center;
  font-size: 1em;
}

.is-active {
  background: rgb(94, 98, 110) !important;
  border: none !important;
}

.header {
  width: 100%;
  height: 60px;
  background: #464C5C;
  display: flex;
  justify-content: space-between;

  .login {
    color: #ffffff;
    font-size: 30px;
    line-height: 60px;
    padding-left: 20px;
    margin-right: 80px;

    .sizes {
      font-size: 16px;
      margin-left: 10px;
      margin-top: 20px;
      position: relative;
      bottom: -3px;
    }
  }

  .list {
    display: inline-block;
    font-size: 18px;
    color: #ffffff;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
  }

  .yes-list {
    background: #697583;
  }
}

.avator {
  display: flex;
  align-items: center;
  color: #fff;
  margin-right: 3%;
  cursor: pointer;

  .userinfo-inner {
    display: flex;
    align-items: center;
    color: #fff;
  }
}
</style>
