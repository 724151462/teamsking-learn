<template>
  <div class="upCourseUp-activity">
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          width="100">
        <template slot-scope="scope">
          <img :src="scope.row.icon" class="img">
        </template>
      </el-table-column>
      <el-table-column
          width="220">
        <template slot-scope="scope">
          <div class="title">{{scope.row.style}}</div>
          <div class="time">{{scope.row.time}}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <div class="title">{{scope.row.style}}题目</div>
          <div class="time">来自{{scope.row.car}}</div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="60">
        <template slot-scope="scope">
          <a class="adds">添加</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        tableData:[
          {
            icon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=108228188,2741176027&fm=27&gp=0.jpg',
            style:'作业',
            time:'2018-09-07',
            timu:'123题目',
            car:'第一章第一节'
          },
          {
            icon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=108228188,2741176027&fm=27&gp=0.jpg',
            style:'测验',
            time:'2018-09-07',
            timu:'123题目',
            car:'第一章第一节'
          },
        ]
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','activity')
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .upCourseUp-activity
    .img
      width:60px
      height:50px

    .title
      font-size:16px

    .time
      font-size: 14px
      color: #9c9c9c

    .adds
      color:#76CAE8
</style>