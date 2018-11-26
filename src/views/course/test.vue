<template>
  <div class="test">
    <div class="title">
      <div style="display: inline-block;float: left">试题管理</div>
      <div style="float: right;display: inline-block" class="btn-warp">
        <el-button type="success">下载模板</el-button>
        <el-button >导入</el-button>
        <el-button type="primary">添加</el-button>
      </div>
    </div>
    <el-table
      :data="tableData3"
      height="85%"
      border
      :fit="false"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="所属课程"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="所属章节"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="难度"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="章节类型">
      </el-table-column>
      <el-table-column
        prop="address"
        label="题目类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="答案"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData3: [
          {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        testList:[
          {

          }
        ]
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .test
    padding:0 5% 20px 50px
    .title
      overflow hidden
      border-bottom 2px solid gray
      padding-bottom 10px
    .btn-warp
      padding-right 50px

</style>

