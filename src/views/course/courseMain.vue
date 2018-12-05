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
      console.log(this.$route.query.id)
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
            this.$router.push({name: '章节内容'})
            break;
            case '2':
            this.$router.push({name: '互动'})
            break;
            case '3':
            this.$router.push({name: '成员'})
            break;
            case '4':
            this.$router.push({name: '教学管理'})
            break;
            case '5':
            this.$router.push({name: '通知管理'})
            break;
            case '6':
            this.$router.push({name: '讨论中心'})
            break;
        }
      }
    }
  }
</script>

<style lang="stylus">
.course-tab-container
  margin-top: 20px
.margin-sides
  margin 10px 20px 10px 0
.delBtn
  font-size 12px
  color #fff
  background-color rgb(255,94,0)
  padding 3px 6px
  cursor pointer
  border-radius 3px
  margin-left 10px
.small-input
  width 60px !important
.tip
  margin-left: 10px
  font-size: 12px
  color gray
</style>
