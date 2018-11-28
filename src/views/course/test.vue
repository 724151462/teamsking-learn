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
      tooltip-effect="dark"
      class="test-table">
      <el-table-column
        prop="date"
        min-width="120px"
        label="所属课程">
      </el-table-column>
      <el-table-column
        prop="name"
        label="所属章节">
      </el-table-column>
      <el-table-column
        prop="name"
        label="难度">
      </el-table-column>
      <el-table-column
        prop="address"
        width="200"
        label="题干">
      </el-table-column>
      <el-table-column
        prop="name"
        label="题目类型"
        min-width="120">
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
          <el-button type="text" size="small" @click="testView = true">查看</el-button>
          <el-button type="text" size="small" @click="toAddTest">编辑</el-button>
          <el-button type="text" size="small" @click="testDelete = true">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--试题查看弹窗-->
    <el-dialog
      title="试题查看"
      :visible.sync="testView"
      width="50%">
       <div class="test-body">
         <p><span style="margin-right: 20px"><b>(单选题)</b></span>1、在下列设备中，不能作为危机输入设备的是?</p>
         <br>
         <div class="options">
           <span>A、扫描仪</span>
           <span>B、扫描仪</span>
           <span>C、扫描仪</span>
           <span>D、扫描仪</span>
         </div>
       </div>
      <span slot="footer" class="dialog-footer" style="text-align: left">
        <p>正确答案:<span>C</span></p>
        <p>解析:<span>鼠标是一种常用的输入设备</span></p>
      </span>
    </el-dialog>
    <!--删除确认框-->
    <el-dialog
      title="删除试题"
      :visible.sync="testDelete"
      width="40%">
      <span style="font-size: 16px">确认删除该试题？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="testDelete = false">取 消</el-button>
    <el-button type="primary">确 定</el-button>
    </span>
    </el-dialog>
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
          address: '上海市普陀区18 弄题干祭祀的计算机就iiii 计就就 计就i  cpu金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普18 弄题干祭祀的计算机就iiii 计就就 计就i  cpu陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄题干祭祀的计算机就iiii 计就就 计就i  cpu'
        }],
        testList:[
          {

          }
        ],
        testView: false , //试题查看弹窗
        testDelete: false, //删除试题
      }
    },
    methods:{
      toAddTest () {
        this.$router.push('/course/addtest');
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
    .test-table
      width 100%
      margin 0 auto
      margin-top 40px
    .test-body
      padding 40px
      font-size 15px
      .options
        & span
          margin-right 30px
        & span:last-chid
          margin-right 0
    .dialog-footer
      & p
        color red
        padding-right 40px
        padding-left 20px
        & span
          color black
</style>

