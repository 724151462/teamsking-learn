<template>
  <div style="height: 100%;width:100%;background:#F6F7F9;">
    <!-- <el-header style="padding:0">
      <headers :navs="nav"></headers>
    </el-header>-->
    <el-container
      style="
          background:#ffffff;
          height: calc(100% - 80px);
          width:calc(100% - 40px);
          margin-top: 20px;
          margin-left:20px;
          margin-right:20px;"
    >
      <el-aside
        width="220px"
        style="
            height:100%;
            border-right:1px solid #fff;
            position: fixed"
      >
        <el-menu
          router
          unique-opened
          collapse-transition
          @open="handleOpen"
          :default-openeds="defaultOpens"
          ref="menu"
        >
          <template v-for="issue in nodes">
            <!-- issue.name:{{issue.name}}<br>leftNavState:{{$store.state.leftNavState}} -->
            <template v-if="issue.name === $store.state.leftNavState">
              <!-- 注意：这里就是leftNavState状态作用之处，当该值与router的根路由的name相等时加载相应菜单组 -->
              <template v-for="(item,index) in issue.children">
                <el-submenu v-if="!item.leaf" :index="String(index)" :key="index">
                  <template slot="title">
                    <i :class="item.iconCls"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>
                  <template v-for="term in item.children">
                    <el-menu-item
                     v-if="term.showCode !== 2"
                    :key="term.path"
                    :index="term.path"
                    :class="$route.path===term.path?'is-active':''"

                  >
                    <i :class="term.iconCls"></i>
                    <span slot="title">{{term.name}}</span>
                    </el-menu-item>
                  </template>    
                </el-submenu>
                <el-menu-item
                  v-else-if="item.leaf&&item.children&&item.children.length"
                  :index="item.children[0].path"
                  :class="$route.path===item.children[0].path?'is-active':''"
                >
                  <i :class="item.iconCls"></i>
                  <span slot="title">{{item.children[0].name}}</span>
                </el-menu-item>
              </template>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-main style="margin-left: 220px">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headers from "./header.vue";
import { constantRouterMap } from "@/router/index";
import { mapGetters } from "vuex";

export default {
  components: {
    headers
  },
  data() {
    return {
      nodes: [],
      defaultOpens: [String(sessionStorage.getItem("defaultOpens"))] || []
    };
  },
  computed: {
    ...mapGetters(["currentMenu"])
  },
  created() {
    //这里没有直接使用this.$router.options.routes，是因为addRoute的路由规则，在这里this.$router.options.routes获取不到
		//有兴趣的可以看一下源码，是为什么获取不到，但是却又有规则了 
		//另外在开发的时候，可能由于是热部署，也会不断重复的给nodes添加元素，造成导航条有重复的，简单解决，可以设置一个开关
		// let isLoadNodes = sessionStorage.getItem('isLoadNodes')
		// if (!isLoadNodes) {
			let data = this.$store.state.allMenu
			this.nodes.push(...data)
			console.log(this.nodes)
			sessionStorage.setItem('isLoadNodes', 'true')
		// }
  },
  methods: {
    handleOpen(...params) {
      // console.log(params)
      sessionStorage.setItem("defaultOpens", params[0]);
    },
    curentOpen(val) {
      console.log(val);
    }
  },
  watch: {
    $route: function(to, from) {
      // 路由改变时执行
      console.info(
        "$store.state.leftNavState:" + this.$store.state.leftNavState
      );
      // this.defaultOpens = [String(sessionStorage.getItem("defaultOpens"))];
      if(to.matched[0].path !== from.matched[0].path) {
        sessionStorage.setItem('defaultOpens', 0)
        this.defaultOpens = [String(sessionStorage.getItem("defaultOpens"))];
      }
      
      console.log(this.defaultOpens);
    },
    defaultOpens: function(val) {
      console.log(val);
      // return String(sessionStorage.getItem('defaultOpens'))
    }
  }
};
</script>
