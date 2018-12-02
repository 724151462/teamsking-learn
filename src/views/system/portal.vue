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
    mounted() {
      console.log(this.$route)
      switch(this.$route.name) {
        case '选择模板':
          this.activeIndex = '1'
          break;
        case '平台信息':
          this.activeIndex = '2'
          break;
        case '轮播图':
          this.activeIndex = '3'
          break;
        case '课程推荐':
          this.activeIndex = '4'
          break;
        case '名师风采':
          this.activeIndex = '5'
          break;
      }

    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        if(key === '1') {
          this.$router.push('mould')
        }else if(key === '2') {
          this.$router.push('platform')
        }
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
