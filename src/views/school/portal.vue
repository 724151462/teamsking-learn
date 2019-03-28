<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">平台信息</el-menu-item>
      <el-menu-item index="2">轮播图</el-menu-item>
      <el-menu-item index="3">课程推荐</el-menu-item>
      <el-menu-item index="4">名师风采</el-menu-item>
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
          case '/school/portal/platform':
            this.activeIndex = '1'
            break;
          case '/school/portal/banner':
            this.activeIndex = '2'
            break;
          case '/school/portal/recommend':
            this.activeIndex = '3'
            break;
          case '/school/portal/teacher':
            this.activeIndex = '4'
            break;
        }
      }
      
        
    },
    methods: {
      handleSelect(key, keyPath) {
        switch(key) {
          case '1':
            this.$router.push('/school/portal/platform')
            break;
          case '2':
            this.$router.push('/school/portal/banner')
            break;
          case '3':
            this.$router.push('/school/portal/recommend')
            break;
          case '4':
            this.$router.push('/school/portal/teacher')
            break;
        }
      }
    }
  }
</script>