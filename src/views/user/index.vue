<template>
  <div class="userIndex">
    <el-tabs v-model="activeName" @tab-click="toMessage">
      <el-tab-pane label="个人设置" name="first" class="tab-name">个人设置</el-tab-pane>
      <el-tab-pane label="消息管理" name="second"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        activeName: 'first'
      };
    },
    methods:{
      toMessage () {
        if(this.activeName === 'second'){
          this.$router.push('message')
        }
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
</style>