<template>
  <div>
    <div class="grade-head">
      <div>
        <span>学生人数: 55人</span>
        <el-button type="success">导入线下成绩</el-button>
        <el-button type="success">下载导入模板</el-button>
      </div>
      <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
        <el-form-item label="输入搜索：">
          <el-input v-model="form.search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="studentSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'totalGrade', order: 'descending'}"
      >
      <el-table-column
        prop="realName"
        label="学生"
        width="180">
      </el-table-column>
      <el-table-column
        prop="totalGrade"
        label="总成绩"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="vedioGrade"
        label="视频成绩"
        sortable
        width="180">
        <template slot="header" slot-scope="header">
            <span>视频成绩</span>
            <br>
            <span style="font-size:12px">(权重{{right}}%)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="testGrade"
        label="测试成绩"
        sortable>
        <template slot="header" slot-scope="header">
            <span>测试成绩</span>
            <br>
            <span style="font-size:12px">(权重{{right}}%)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="homeworkGrade"
        label="作业成绩"
        sortable>
        <template slot="header" slot-scope="header">
            <span>作业成绩</span>
            <br>
            <span style="font-size:12px">(权重{{right}}%)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stormGrade"
        label="头脑风暴成绩"
        sortable>
        <template slot="header" slot-scope="header">
            <span>头脑风暴成绩</span>
            <br>
            <span style="font-size:12px">(权重{{right}}%)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="quesGrade"
        label="投票问卷成绩"
        sortable>
        <template slot="header" slot-scope="header">
            <span>投票问卷成绩</span>
            <br>
            <span style="font-size:12px">(权重{{right}}%)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="xxGrade"
        label="线下成绩"
        sortable>
        <template slot="header" slot-scope="header">
            <span>线下成绩</span>
            <br>
            <span style="font-size:12px">(权重{{right}}%)</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      right: 20,
      form: {
        search: '',
      },
      tableData: [{
        totalGrade: '78',
        realName: '王小虎1',
        vedioGrade: '43',
        testGrade: '42',
        homeworkGrade: '17',
        stormGrade: '15',
        quesGrade: '23',
        xxGrade: '33'
      }, {
        totalGrade: '98',
        realName: '王小虎2',
        vedioGrade: '40',
        testGrade: '34',
        homeworkGrade: '11',
        stormGrade: '44',
        quesGrade: '31',
        xxGrade: '23'
      }, {
        totalGrade: '77',
        realName: '王小虎3',
        vedioGrade: '54',
        testGrade: '21',
        homeworkGrade: '15',
        stormGrade: '34',
        quesGrade: '32',
        xxGrade: '55'
      }, {
        totalGrade: '88',
        realName: '王小虎4',
        vedioGrade: '31',
        testGrade: '10',
        homeworkGrade: '13',
        stormGrade: '55',
        quesGrade: '45',
        xxGrade: '22'
      }]
    }
  },
  methods: {
    studentSearch() {

    },
    formatter(row, column) {
      return row.address;
    }
  }
}
</script>

<style lang="stylus" scoped>
.grade-head
  display flex
  align-items center
  justify-content space-between
</style>

