<template>
  <div>
    <h3>{{currentCourse}}</h3>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">章节内容</el-menu-item>
      <el-menu-item index="2">互动</el-menu-item>
      <el-menu-item index="3">成员</el-menu-item>
      <el-menu-item index="4">教学管理</el-menu-item>
      <el-menu-item index="5">通知管理</el-menu-item>
      <el-menu-item index="6">讨论中心</el-menu-item>
    </el-menu>
    <router-view @courseName="courseName"></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        currentCourse: ''
      };
    },
    mounted() {
      //console.log(this.$route.path)
      switch(this.$route.path) {
        case '/course/list/chapter':
          this.activeIndex = '1'
          break;
        case '/course/list/interact':
          this.activeIndex = '2'
          break;
        case '/course/list/member':
          this.activeIndex = '3'
          break;
        case '/course/list/teach/grade':
          this.activeIndex = '4'
          break;
        case '/course/list/notice':
          this.activeIndex = '5'
          break;
        case '/course/list/discuss':
          this.activeIndex = '6'
          break;
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        switch(key) {
            case '1':
            this.$router.push({
              path: '/course/list/chapter',
              query: {id: this.$route.query.id}
            })
            break;
            case '2':
            this.$router.push({
              path: '/course/list/interact',
              query: {id: this.$route.query.id}
            })
            break;
            case '3':
            this.$router.push({
              path: '/course/list/member',
              query: {id: this.$route.query.id}
            })
            break;
            case '4':
            this.$router.push({
              path: '/course/list/teach',
              query: {id: this.$route.query.id}
            })
            break;
            case '5':
            this.$router.push({
              path: '/course/list/notice',
              query: {id: this.$route.query.id}
            })
            break;
            case '6':
            this.$router.push({
              path: '/course/list/discuss',
              query: {id: this.$route.query.id}
            })
            break;
        }
      },
      courseName(val) {
        console.log
        this.currentCourse = val
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
