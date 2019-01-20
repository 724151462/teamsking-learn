<template>
  <div>
    <div class="title">
      <div>课程包广场</div>
    </div>
    <div>
      <div  style="width:300px;margin: 30px auto">
        <el-input v-model="input" placeholder="请输入内容" style="width: 200px"></el-input>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    <div>
      <div class="tag-warp">
        <div>标签：</div>
        <div></div>
      </div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "packgeMain",
    data () {
      return{
        packgeName: ''
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .title
    border-bottom 2px solid gray
    padding-bottom 20px
  .tag-warp
    & div
      width 100px
      text-align right
</style>