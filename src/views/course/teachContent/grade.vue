<template>
  <div>
    <div class="grade-head">
      <div>
        <span>学生人数: 55人</span>
        <el-button type="success">导入线下成绩</el-button>
        <el-button type="success" @click="downloadModel">下载导入模板</el-button>
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
      :default-sort="{prop: 'score', order: 'descending'}"
    >
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" @show="getStudentId(scope.row)" placement="bottom-end">
            <div>学生信息：</div>
            <p>姓名: {{ scope.row.studentInfo.realName || '' }}</p>
            <p>手机: {{ scope.row.studentInfo.mobile || '' }}</p>
            <p>院系: {{ scope.row.studentInfo.collegeName || '' }}</p>
            <p>专业: {{ scope.row.studentInfo.specialityName || '' }}</p>
            <p>班级: {{ scope.row.studentInfo.className  || '' }}</p>
            <p>学校: {{ scope.row.studentInfo.tenantName  || '' }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.realName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="总成绩" sortable width="180"></el-table-column>
      <el-table-column prop="videoScore" label="视频成绩" sortable width="180">
        <template slot="header" slot-scope="header">
          <span>视频成绩</span>
          <br>
          <span style="font-size:12px">(权重{{scoreRight.videoPercent}}%)</span>
        </template>
      </el-table-column>
      <el-table-column prop="quizScore" label="测试成绩" sortable>
        <template slot="header" slot-scope="header">
          <span>测试成绩</span>
          <br>
          <span style="font-size:12px">(权重{{scoreRight.quizPercent}}%)</span>
        </template>
      </el-table-column>
      <el-table-column prop="homeworkScore" label="作业成绩" sortable>
        <template slot="header" slot-scope="header">
          <span>作业成绩</span>
          <br>
          <span style="font-size:12px">(权重{{scoreRight.homeworkPercent}}%)</span>
        </template>
      </el-table-column>
      <el-table-column prop="stormScore" label="头脑风暴成绩" sortable>
        <template slot="header" slot-scope="header">
          <span>头脑风暴成绩</span>
          <br>
          <span style="font-size:12px">(权重{{scoreRight.stormPercent}}%)</span>
        </template>
      </el-table-column>
      <el-table-column prop="voteScore" label="投票问卷成绩" sortable>
        <template slot="header" slot-scope="header">
          <span>投票问卷成绩</span>
          <br>
          <span style="font-size:12px">(权重{{scoreRight.votePercent}}%)</span>
        </template>
      </el-table-column>
      <el-table-column prop="offlineScore" label="线下成绩" sortable>
        <template slot="header" slot-scope="header">
          <span>线下成绩</span>
          <br>
          <span style="font-size:12px">(权重{{scoreRight.offlinePercent}}%)</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { scoreList, scoreRight, scoreModel, markStudentInfo } from "@/api/course";
import {sysStudentInfo} from "@/api/school"
export default {
  data() {
    return {
      scoreParams: {
        courseId: this.$route.query.id
      },
      right: 20,
      form: {
        search: ""
      },
      // 权重
      scoreRight: {},
      //数据
      tableData: [
        {
          score: "78",
          realName: "王小虎1",
          videoScore: "43",
          quizScore: "42",
          homeworkScore: "17",
          stormScore: "15",
          voteScore: "23",
          offlineScore: "33",
          studentInfo: {}
        },
      ]
    };
  },
  created() {
    this.$emit("teachingNav", "grade");
  },
  mounted() {
    // 成绩列表
    scoreList(this.scoreParams).then(response => {
      response.data.pageData.forEach(element=> {
        element.studentInfo = {
          realName: ''
        }
      })
      this.tableData = response.data.pageData;
    });
    // 成绩权重
    scoreRight(this.scoreParams).then(response => {
      this.scoreRight = response.data;
    });
  },
  methods: {
    getStudentId(item) {
      markStudentInfo({userId: item.userId, courseId: item.courseId})
      .then(response=> {
        this.tableData.forEach(element => {
          if(element.userId === item.userId) {
            // element = Object.assign(element, response.data)
            this.$set(element, 'studentInfo', response.data)
          }
        });
        console.log('data', this.tableData)
        // this.
      })
    },
    studentSearch() {},
    formatter(row, column) {
      return row.address;
    },
    downloadModel() {
      scoreModel()
      .then(res=> {
        let blob = new Blob([res.body], {
            type: "application/vnd.ms-excel",
        });　　　　
        let objectUrl = URL.createObjectURL(blob);　　　　　
        window.location.href = objectUrl;
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.grade-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

