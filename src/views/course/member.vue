<template>
  <div class="member">
    <div class="navs">
      <el-input v-model="pageParmas.searchKey" placeholder="请输入内容" style="width: 200px;"></el-input>
      <el-button type="primary" @click="searchMember">搜索</el-button>
      <el-button type="primary">
        <router-link :to="{name: '成员方案管理', query: {id: $route.query.id}}">成员小组方案管理</router-link>
      </el-button>
      <el-button type="success" @click="deleteAll">批量移除成员</el-button>
      <div style="margin-top:10px">
        <el-upload
          style="display: inline-block;margin-right:10px"
          ref="upload"
          accept=".xls, .xlsx"
          action
          :on-change="upload"
          :show-file-list="false"
          :auto-upload="false"
          id="file"
        >
          <el-button type="success">导入成员</el-button>
        </el-upload>
        <el-button type="success" @click="downloadModel">下载导入模板</el-button>
      </div>
    </div>
    <item-table
      :tables="tables"
      :tableData="tableData"
      @showComponentInfo="showComponentInfo"
      :buttonStylus="buttonType"
    ></item-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="tableData.pageSize"
      :total="tableData.totalCount"
      :current-page="tableData.pageIndex"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <!--成员小组方案-->
    <el-dialog title="成员小组方案管理" :visible.sync="isFa" width="70%">
      <groupPlans></groupPlans>
    </el-dialog>
    <el-dialog title="导入结果" :visible.sync="dialogShow" :data="resData" width="50%">
      <el-table :data="resData" :row-class-name="tableRowClassName">
        <el-table-column prop="studentNo" label="学号"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="tenantName" label="租户名称"></el-table-column>
        <el-table-column prop="errorData" label="错误信息"></el-table-column>
      </el-table>
      <el-button @click="ensureImport">确认导入</el-button>
    </el-dialog>
  </div>
</template>

<script>
import itemTable from "@/components/table-no-header.vue";
import groupPlans from "./memberContent/groupPlan.vue";
import XLSX from "xlsx";
import {
  memberList,
  setAssistant,
  unsetAssistant,
  deleteUser,
  memberUpload,
  userModify,
} from "@/api/course";
import { getToken } from "@/utils/auth";
export default {
  components: {
    itemTable,
    groupPlans
  },
  data() {
    return {
      courseId: this.$route.query.id,
      input: "",
      pageParmas: {
        searchKey: ""
      },
      tables: [
        {
          name: "序号",
          prop: "id",
          width: 120
        },
        {
          name: "学生姓名",
          prop: "realName",
          width: 120
        },
        {
          name: "学号",
          prop: "studentNo",
          width: 120
        },
        {
          name: "手机号码",
          prop: "mobile",
          width: 120
        },
        {
          name: "学校",
          prop: "tenantName"
        }
      ],
      tableData: [
        {
          id: "1",
          name: "小三",
          xh: "123123",
          cellphone: "12386403",
          xx: "xxx大学"
        },
        {
          id: "1",
          name: "小三",
          xh: "123123",
          cellphone: "12386403",
          xx: "xxx大学"
        }
      ],
      buttonType: [
        {
          name: "设为助教",
          type: "setSys",
          show: item => {
            if (item.assistantStatus === 2) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          name: "取消助教",
          type: "unsetSys",
          show: item => {
            if (item.assistantStatus === 1) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          name: "移出班级群",
          type: "delete",
          show: item => {
            return true;
          }
        }
      ],
      delArr: [],
      dialogShow: false,
      resData: [],
      isFa: false
    };
  },
  created() {
    this.$emit("upCoursesNav", "member");
  },
  mounted() {
    this.getPage();
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
        if (JSON.stringify(row.errorData) === '[]') {
          return 'success-row';
        } else {
          return 'warning-row';
        }
      },
    btnShow() {
      return false;
    },
    deleteAll() {
      console.log(this.delArr)
      deleteUser(sysInfo).then(response => {
        if (response.code === 200) {
          tableData.splice(index, 1);
        }
      });
    },
    showComponentInfo(type, info, index) {
      
      console.log(type, info, index);
      var sysInfo = {
        courseId: this.courseId,
        userId: info.userId
      };
      switch (type) {
        case "selected":
          this.delArr = []
          info.forEach(element => {
            this.delArr.push(element.id)
          });
          console.log(this.delArr)
        case "setSys":
          console.log(sysInfo);
          setAssistant(sysInfo).then(response => {
            if (response.code === 200) {
              info.assistantStatus = 1;
              this.$message({
                message: "设置成功",
                type: "success"
              });
            }
          });
          break;
        case "unsetSys":
          unsetAssistant(sysInfo).then(response => {
            if (response.code === 200) {
              info.assistantStatus = 2;
              this.$message({
                message: "设置成功",
                type: "success"
              });
            }
          });
          break;
        case "delete":
          console.log(index);
          deleteUser(sysInfo).then(response => {
            if (response.code === 200) {
              tableData.splice(index, 1);
            }
          });
        default:
          break;
      }
    },
    downloadModel() {
      var oReq = new XMLHttpRequest();
      oReq.open(
        "GET",
        "http://120.36.137.90:9008/api/v1/sys/course/user/excel",
        true
      );
      oReq.setRequestHeader("token", getToken());
      oReq.responseType = "blob";
      oReq.onload = function(oEvent) {
        var content = oReq.response;
        console.log(oReq);
        var elink = document.createElement("a");
        elink.download = "成员模板.xlsx";
        elink.style.display = "none";

        var blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);
        elink.click();

        document.body.removeChild(elink);
      };
      oReq.send();
    },
    upload(file, fileList) {
      let formData = new FormData();
      formData.append("file", file.raw);
      formData.append("courseId", this.$route.query.id);
      memberUpload(formData).then(response => {
        this.resData = response.data;
        this.dialogShow = true;
      });
    },
    // 确认导入
    ensureImport(items) {
      let data = {};
      data.courseId = this.$route.query.id;
      userModify(data).then(response => {
        if (response.code === 400005) {
          this.$message({
            message: "导入成功",
            type: "success"
          });
        }
        this.dialogShow = false;
      });
    },
    handleCurrentChange(index) {
      this.pageParmas.pageIndex = index;
      this.getPage();
    },
    getPage() {
      this.pageParmas.courseId = this.courseId;
      memberList(this.pageParmas).then(response => {
        this.tableData = response.data.pageData;
        this.tableData.totalCount = response.data.totalCount;
        this.tableData.pageSize = response.data.pageSize;
      });
    },
    searchMember() {
      console.log(this.pageParmas);
      this.getPage(this.pageParmas);
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.member {
  .navs {
    text-align: right;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>