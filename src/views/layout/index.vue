<template>
  <div style="height: 100%;width:100%;background:#F6F7F9;">
    <el-header style="padding:0">
      <headers :navs="nav"></headers>
    </el-header>
    <el-container
        style="
          background:#ffffff;
          height: calc(100% - 80px);
          width:calc(100% - 40px);
          margin-top: 20px;
          margin-left:20px;
          margin-right:20px;">
        <el-aside width="200px"
          style="
            height:100%;
            border-right:1px solid #D7D7D7;">
              <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                @select="handleSelect"
                router
                >
                <template  v-for="(item, index) in currentMenu">
                  <el-submenu v-if="item.list" :key="index"  :index="String(index)">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span>{{String(index) + item.name}}</span>
                    </template>
                    <el-menu-item-group v-for="(subItem,i) in item.list" v-if="subItem.name" :key="i">
                      <el-menu-item :index="item.url">{{subItem.name}}</el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                  <el-menu-item v-else :key="index" :index="item.url">
                    <i class="el-icon-setting"></i>
                    <span>{{String(index) + item.name}}</span>
                  </el-menu-item>
                </template>
            </el-menu>
        </el-aside>
        <el-main>
          <router-view v-on:floorStatus="floorStatus"></router-view>
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
        nav:''
      }
    },
    computed: {
      ...mapGetters([
        'currentMenu'
      ])
    },
    mounted() {
      this.nav = this.$store.state.navHeader
      console.log('state.navHeader',this.$store.state.navHeader)
      console.log('allmenu', this.$store.state.allMenu)
      console.log('router', this.$route)
    },
    methods:{
      floorStatus (e) {
        this.nav = e
      },
      handleSelect(key, keyPath) {
        console.log(key,keyPath)
      }
    }
  }
</script>
