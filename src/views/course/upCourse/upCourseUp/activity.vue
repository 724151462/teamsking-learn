<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%">
      <el-table-column
          width="180">
        <template slot-scope="scope">
          <img :src="scope.row.icon">
        </template>
      </el-table-column>
      <el-table-column
          width="180">
        <template slot-scope="scope">
          <div>{{scope.row.style}}</div>
          <div>{{scope.row.time}}</div>
        </template>
      </el-table-column>
      <el-table-column
          width="180">
        <template slot-scope="scope">
          <div>{{scope.row.style}}题目</div>
          <div>来自{{scope.row.car}}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="180">
        <template>
          <a>添加</a>
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
      this.$emit('resourceNav','activity  ')
    }
  }
</script>

<style scoped>

</style>