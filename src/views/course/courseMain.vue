<template>
  <div>
    
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">章节内容</el-menu-item>
      <el-menu-item index="2">互动</el-menu-item>
      <el-menu-item index="3">成员</el-menu-item>
      <el-menu-item index="4">教学管理</el-menu-item>
      <el-menu-item index="5">通知管理</el-menu-item>
      <el-menu-item index="6">讨论中心</el-menu-item>
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
        case '章节内容':
          this.activeIndex = '1'
          break;
        case '互动':
          this.activeIndex = '2'
          break;
        case '成员':
          this.activeIndex = '3'
          break;
        case '教学管理':
          this.activeIndex = '4'
          break;
        case '通知管理':
          this.activeIndex = '5'
          break;
        case '讨论中心':
          this.activeIndex = '6'
          break;
      }
        
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        switch(key) {
            case '1':
            this.$router.push('chapter')
            break;
            case '2':
            this.$router.push('interact')
            break;
            case '3':
            this.$router.push('member')
            break;
            case '4':
            this.$router.push('teach')
            break;
            case '5':
            this.$router.push('notice')
            break;
            case '6':
            this.$router.push('discuss')
            break;
        }
      }
    }
  }
</script>

<style lang="stylus">
.course-tab-container
    margin-top: 20px
</style>
