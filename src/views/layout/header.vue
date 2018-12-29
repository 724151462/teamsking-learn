<template>
    <div class="header">
      <div style="display: flex">
        <router-link to="/course" class="login">
            <span>天擎智教</span>
            <span class="sizes">后台管理</span>
        </router-link>
        <el-menu :default-active="defaultActiveIndex" background-color="rgb(70,76,92)"
          text-color="#fff"
          active-text-color="#ffd04b" 
          class="el-menu-demo" 
          mode="horizontal" 
          @select="handleSelect" 
          :router="true">
          <el-menu-item index="/course">课程中心</el-menu-item>
          <el-menu-item index="/learn">学习管理</el-menu-item>
          <el-menu-item index="/school">校管中心</el-menu-item>
          <el-menu-item index="/system">系统管理</el-menu-item>
          <!-- <el-menu-item v-for="(item,index) in $router.options.routes" v-if="item.type&&item.menuShow" :key="index" :index="item.children[0].path" 
                                >
                    <i :class="item.iconCls"></i><span slot="title">{{item.name}}</span>
                  </el-menu-item> -->
        </el-menu>
      </div>
        <el-dropdown class="avator">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="require('../../assets/images/user.png')" alt=""> <span>{{this.realName}}</span>   <i class="el-icon-caret-bottom"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/user/index">
                个人中心
              </router-link>
              <!--<div ><span style="color: #555;font-size: 14px;"></span></div>-->
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="doLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
  import {menuList, logout} from '@/api/login'
  import {constantRouterMap} from '@/router/index'
  import { removeToken , getUserId, removeUserId} from '@/utils/auth'
  import {getUserInfo,getMeInfo} from "../../api/user";

  export default {
    props:['navs'],
    data(){
      return{
		  defaultActiveIndex: '/course',
        nav:[
          {
            name:'课程中心',
            url:'/course',
            isNav:'course'
          },
          {
            name:'学习管理',
            url:'/learn/index',
            isNav:'learn'
          },
          {
            name:'校管中心',
            url:'/school',
            isNav:'school'
          },
          {
            name:'系统管理',
            url:'/system',
            isNav:'system'
          }
        ],
        realName:'',
        menuList: constantRouterMap
      }
    },
    created(){
      // menuList().then((response)=>{
      //   console.log(this.storeNav, '``````', response.data)
		this.$store.commit('setAllMenu',this.menuList)
    this.fetchNavData();
		this.getUserInfo();
    },
    methods:{
		navChange() {
			this.storeNav = this.$store.state.navHeader
    },
    jumpTo(url){
		  console.log(url)
      this.$router.push(url)
    },
    //退出登录
    doLogout() {
      removeToken()
      removeUserId()
      this.$router.push('/login')
    },
		handleSelect(index){
			this.defaultActiveIndex = index;
		},
    fetchNavData () { // 初始化菜单激活项
      var n=(this.$route.path.split('/')).length-1;
      var cur_path = n > 3 ? this.$store.state.leftNavState : this.$route.path; //获取当前路由
      console.log('curpath',cur_path)
      console.log('cookiepath',this.$store.state.leftNavState)
			var routers = this.$router.options.routes; // 获取路由对象
			var nav_type = "courseCenter", nav_name = "课程列表";
			// console.log('routers', routers)
			for (var i = 0; i < routers.length; i++) {
			var children = routers[i].children;
			if(children){
				for (var j = 0; j < children.length; j++) {
				var grand_children = children[j].children;
				
				if(grand_children){
					for (var k = 0; k < grand_children.length; k++) {
					// console.log('grand_children',grand_children[k].path)
					if (grand_children[k].path === cur_path) {
            console.log('topNavState', routers[i])
						nav_type = routers[i].type;
            nav_name = routers[i].name;
						break;
					}
					}
				}
				}
			}
      }
      this.$store.state.topNavState = nav_type;  // 改变topNavState状态的值	
      if(n <=  3) {
        this.$store.state.leftNavState = nav_name;  // 改变leftNavState状态的值
      }
			console.log('nav_type',nav_type,'nav_name', nav_name)
			this.defaultActiveIndex = "/" + nav_name;
		},
    //根据Cookie获取用户信息
    getUserInfo(){
      let data = getUserId()
      getMeInfo().then(res=>{
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
    }
	},
	watch: {
      '$route': function(to, from){ // 路由改变时执行
        //console.info("to.path:" + to.path);
        this.fetchNavData();
        this.getUserInfo();
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
    .header
        width:100%
        height:60px
        background: #464C5C
        display: flex
        justify-content space-between
        .login
            color: #ffffff
            font-size:30px
            line-height:60px
            padding-left:20px
            margin-right:80px

            .sizes
              font-size:16px
              margin-left:10px
              margin-top:20px
              position: relative
              bottom:-3px

        .list
            display:inline-block
            font-size:18px
            color:#ffffff
            height:60px
            line-height:60px
            padding-left:10px
            padding-right:10px
            margin-right:10px

        .yes-list
            background: #697583
    .avator 
      display flex
      align-items center
      color #fff
      margin-right 3%
      cursor pointer
      .userinfo-inner
        display flex
        align-items center
        color #fff
</style>
