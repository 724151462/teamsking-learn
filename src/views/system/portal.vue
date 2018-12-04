<template>
  <div>

    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">选择模板</el-menu-item>
      <el-menu-item index="2">平台信息</el-menu-item>
      <el-menu-item index="3">轮播图</el-menu-item>
      <el-menu-item index="4">课程推荐</el-menu-item>
      <el-menu-item index="5">名师风采</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
      };
    },
    watch: {
      '$route'(){
        switch(this.$route.path) {
          case '/system/portal/mould':
            this.activeIndex = '1'
            break;
          case '/system/portal/platform':
            this.activeIndex = '2'
            break;
          case '/system/portal/banner':
            this.activeIndex = '3'
            break;
          case '/system/portal/recommend':
            this.activeIndex = '4'
            break;
          case '/system/portal/teacher':
            this.activeIndex = '5'
            break;
        }
      }
      
        
    },
    methods: {
      handleSelect(key, keyPath) {
        switch(key) {
          case '1':
            this.$router.push('mould')
            break;
          case '2':
            this.$router.push('platform')
            break;
          case '3':
            this.$router.push('banner')
            break;
          case '4':
            this.$router.push('recommend')
            break;
          case '5':
            this.$router.push('teacher')
            break;
        }
      }
      }
  }
</script>