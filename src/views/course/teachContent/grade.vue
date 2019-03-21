<template>
  <div>
    <!--加载动画-->
    <div v-show="showLoading">
      <div class="tq_loading__mask"></div>
      <div class="tq_loading-wrapper">
        <div class="tq_loading__loading-wrapper">
          <square :background="'#409eff'"></square>
        </div>
        <div class="tq_loading__text">
          正在加载
        </div>
      </div>
    </div>
    <div class="grade-head">
      <div class="import-btn">
        <span>学生人数: {{tableData.length}}人</span>
        <el-upload
          ref="upload"
          accept=".xls, .xlsx"
          action
          :on-change="upload"
          :show-file-list="false"
          :auto-upload="false"
          id="file"
        >
          <el-button type="success">导入线下成绩</el-button>
        </el-upload>

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
            <p>班级: {{ scope.row.studentInfo.className || '' }}</p>
            <p>学校: {{ scope.row.studentInfo.tenantName || '' }}</p>
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
    <el-dialog title="导入结果" :visible.sync="dialogShow" :data="resData" width="50%">
      <el-table :data="resData">
        <el-table-column prop="studentNo" label="学号"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="score" label="成绩"></el-table-column>
        <el-table-column prop="tenantName" label="租户名称"></el-table-column>
        <el-table-column prop="errorData" label="错误信息"></el-table-column>
      </el-table>
      <el-button @click="ensureImport">确认导入</el-button>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/utils/auth";
import XLSX from "xlsx";
import {
  scoreList,
  scoreRight,
  scoreModel,
  markStudentInfo,
  scoreUpload,
  scoreModify
} from "@/api/course";
import { sysStudentInfo } from "@/api/school";
import { mapGetters } from "vuex";
import Square from "@/components/cubeShadow.vue";
export default {
  data() {
    return {
      file: "",
      dialogShow: false,
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
        // {
        //   score: "78",
        //   realName: "王小虎1",
        //   videoScore: "43",
        //   quizScore: "42",
        //   homeworkScore: "17",
        //   stormScore: "15",
        //   voteScore: "23",
        //   offlineScore: "33",
        //   studentInfo: {}
        // }
      ],
      // 导入后返回的data
      resData: []
    };
  },
  computed: {
    ...mapGetters(["showLoading"])
  },
  created() {
    this.$emit("teachingNav", "grade");
    
  },
  mounted() {
    this.$store.commit("SHOWLOADING");
    // 成绩列表
    scoreList(this.scoreParams).then(response => {
      response.data.pageData.forEach(element => {
        element.studentInfo = {
          realName: ""
        };
      });
      this.tableData = response.data.pageData;
      this.$store.commit("HIDELOADING");
    });
    // 成绩权重
    scoreRight(this.scoreParams).then(response => {
      this.scoreRight = response.data;
    });
  },
  components: {
    Square
  },
  methods: {
    getStudentId(item) {
      console.log(item)
      this.tableData.forEach(element => {
        if (element.userId === item.userId && !element.isHovered) {
          markStudentInfo({ userId: item.userId, courseId: item.courseId }).then(
            response => {
              // element = Object.assign(element, response.data)
              this.$set(element, "studentInfo", response.data);
              this.$set(element, "isHovered", true);
              // this.
            }
          );
        }
      });
    },
    studentSearch() {},
    formatter(row, column) {
      return row.address;
    },
    downloadModel() {
      var oReq = new XMLHttpRequest();
      oReq.open(
        "GET",
        "http://192.168.10.48:9008/api/v1/sys/course/score/excel",
        true
      );
      oReq.setRequestHeader("token", getToken());
      oReq.responseType = "blob";
      oReq.onload = function(oEvent) {
        var content = oReq.response;
        console.log(oReq);
        var elink = document.createElement("a");
        elink.download = "成绩模板.xls";
        elink.style.display = "none";

        var blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);
        elink.click();

        document.body.removeChild(elink);
      };
      oReq.send();
    },
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel");
        const tHeader = ["序号", "IMSI", "MSISDN", "证件号码", "姓名"];
        const filterVal = ["ID", "imsi", "msisdn", "address", "name"];
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "列表excel");
      });
    },
    upload(file, fileList) {
      let formData = new FormData();
      formData.append("file", file.raw);
      formData.append("courseId", this.$route.query.id);
      scoreUpload(formData).then(response => {
        this.resData = response.data;
        this.dialogShow = true;
      });
    },
    readExcel1(files) {
      //表格导入
      var that = this;
      console.log(files);
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          console.log(ws.slice(1));
          // that.peopleArr = [];//清空接收数据
          // if(that.peopleArr.length == 1 && that.peopleArr[0].roleName == "" && that.peopleArr[0].enLine == ""){
          //     that.peopleArr = [];
          // }
          //重写数据
          try {
          } catch (err) {
            console.log(err);
          }

          this.$refs.upload.value = "";
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    // 确认导入
    ensureImport(items) {
      let data = {};
      data.courseId = this.scoreParams.courseId;
      scoreModify(data).then(response => {
        if (response.code === 400005) {
          this.$message({
            message: "导入成功",
            type: "success"
          });
        }
        this.dialogShow = false;
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.grade-head 
  display: flex;
  align-items: center;
  justify-content: space-between;
  .import-btn
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 400px;
</style>

