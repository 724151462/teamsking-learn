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
            border-right:1px solid #D7D7D7;">这里是侧边栏</el-aside>
        <el-main>
          <router-view v-on:floorStatus="floorStatus"></router-view>
        </el-main>
    </el-container>
  </div>
</template>

<script>
  import headers from './header.vue'
  export default {
    components:{
      headers
    },
    data(){
      return{
        nav:''
      }
    },
    methods:{
      floorStatus (e) {
        this.nav = e
      }
    }
  }
</script>
