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
        console.log('fdas',this.$route)
        switch(this.$route.path) {
          case '/school/portal/mould':
            this.activeIndex = '1'
            break;
          case '/school/portal/platform':
            this.activeIndex = '2'
            break;
          case '/school/portal/banner':
            this.activeIndex = '3'
            break;
          case '/school/portal/recommend':
            this.activeIndex = '4'
            break;
          case '/school/portal/teacher':
            this.activeIndex = '5'
            break;
        }
      }
      
        
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(123,key, keyPath);
        switch(key) {
          case '1':
            this.$router.push('/school/portal/mould')
            break;
          case '2':
            this.$router.push('/school/portal/platform')
            break;
          case '3':
            this.$router.push('/school/portal/banner')
            break;
          case '4':
            this.$router.push('/school/portal/recommend')
            break;
          case '5':
            this.$router.push('/school/portal/teacher')
            break;
        }
      }
    }
  }
</script>