<template>
  <div style="height: 100%;width:100%;background:#F6F7F9;">
    <!-- <el-header style="padding:0">
      <headers :navs="nav"></headers>
    </el-header> -->
    <el-container
        style="
          background:#ffffff;
          height: calc(100% - 80px);
          width:calc(100% - 40px);
          margin-top: 20px;
          margin-left:20px;
          margin-right:20px;">
        <el-aside width="220px"
          style="
            height:100%;
            border-right:1px solid #fff;">
              <el-menu router unique-opened collapse-transition @open="handleOpen" :default-openeds="defaultOpens">
        <template v-for="(issue,index) in $router.options.routes">
          <!-- issue.name:{{issue.name}}<br>leftNavState:{{$store.state.leftNavState}} -->
          <template v-if="issue.name === $store.state.leftNavState"><!-- 注意：这里就是leftNavState状态作用之处，当该值与router的根路由的name相等时加载相应菜单组 -->
            <template v-for="(item,index) in issue.children">
              <el-submenu v-if="!item.leaf" :index="String(index)">
                <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
                <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path"
                              :class="$route.path===term.path?'is-active':''" v-if="term.menuShow" ref="menu">
                  <i :class="term.iconCls"></i><span slot="title">{{term.name}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length&&item.menuShow" ref="menu" :index="item.children[0].path"
                            :class="$route.path===item.children[0].path? 'is-active' : ''">
                <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
    </el-container>
  </div>
</template>

<script>
  import headers from './header.vue'
  import {constantRouterMap} from '@/router/index'
  import { mapGetters } from 'vuex'
  export default {
    components:{
      headers
    },
    data(){
      return{
        defaultOpens: [String(sessionStorage.getItem('defaultOpens'))] || []
      }
    },
    computed: {
      ...mapGetters([
        'currentMenu'
      ]),
       
    },
    methods:{
      handleOpen(...params) {
        // console.log(params)
        sessionStorage.setItem('defaultOpens', params[0])
      },
      curentOpen(val) {
        console.log(val)
      }
    },
    watch: {
      '$route': function(to, from){ // 路由改变时执行
        console.info("$store.state.leftNavState:" + this.$store.state.leftNavState);
        this.defaultOpens = [String(sessionStorage.getItem('defaultOpens'))]
        console.log(this.defaultOpens)
      },
      defaultOpens: function(val){
        console.log(val)
        // return String(sessionStorage.getItem('defaultOpens'))
      }
    }
  }
</script>
