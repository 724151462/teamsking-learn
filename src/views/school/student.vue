<template>
  <div class="student">
    <header-the-again headerTitle="学生管理">
      <div style="display:inline-block;position: relative;">
        <el-input
          style="width:230px"
          class="input-with-select"
          v-model="searchForm.search"
          placeholder="输入姓名或学号"
        >
          <!-- <el-button slot="append" @click="searchStudent" icon="el-icon-search"></el-button> -->
        </el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="searchStudent"
          icon="el-icon-search"
        ></el-button>
      </div>
    </header-the-again>
    <input type="file" style="display:none" id="upTemp" @change="upStudentTemp" name="upload">
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
      switchColumn="open"
    >
      <template slot="collegeName" slot-scope="scope">
        <el-select
          class="my-select"
          filterable
          clearable
          v-model="searchForm.college"
          :readonly="true"
          placeholder="院"
          @change="filterChange"
          @clear="filterChange"
        >
          <el-option
            v-for="(item, index) in searchCollegeList"
            :key="index"
            :label="item.collegeName"
            :value="item.collegeId"
          ></el-option>
        </el-select>
      </template>
      <template slot="departmentName" slot-scope="scope">
        <el-select
          class="my-select"
          filterable
          clearable
          v-model="searchForm.department"
          :readonly="true"
          placeholder="系"
          @change="filterChange"
          @clear="filterChange"
        >
          <el-option
            v-for="(item, index) in searchDepartmentList"
            :key="index"
            :label="item.departmentName"
            :value="item.departmentId"
          ></el-option>
        </el-select>
      </template>
      <template slot="specialityName" slot-scope="scope">
        <el-select
          v-model="searchForm.speciality"
          class="my-select"
          filterable
          clearable
          placeholder="专业"
          @change="filterChange"
          @clear="filterChange"
        >
          <el-option
            v-for="(item, index) in searchSpecialityList"
            :key="index"
            :label="item.specialityName"
            :value="item.specialityId"
          ></el-option>
        </el-select>
      </template>
      <template slot="className" slot-scope="scope">
        <el-select
          class="my-select"
          filterable
          clearable
          v-model="searchForm.studentClass"
          placeholder="班级"
          @change="filterChange"
          @clear="filterChange"
        >
          <el-option
            v-for="(item, index) in classSearchList"
            :key="index"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
      </template>
    </table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="pageChange"
    ></el-pagination>

    <el-dialog
      title="学生导入"
      :visible.sync="upDiago"
      width="500px"
      class="up-warp"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div
        :class="{progress : upData.isUp,'progress-success' : !upData.isUp}"
        class="progress-init"
      ></div>
      <p style="color:red" v-if="upData.isUp">{{this.upData.text}}</p>
      <template v-else>
        <p>
          解析完成：模板内一共
          <span style="color:red">{{upData.total}}</span>条数据，成功解析
          <span style="color:red">{{upData.success}}</span>条
        </p>
        <p style="color:red">点击确认按钮将数据导入库中,点击取消则放弃此次导入</p>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open4('取消导入，确定吗？')">取 消</el-button>
        <el-button type="primary" @click="putTemp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "../../components/header-theAgain";
import {
  sysCollegeList,
  sysStudentPage,
  sysStudentSwitch,
  sysDepartmentList,
  DepartmentList,
  sysSpecialityList,
  sysStudentTemp,
  sysUpTemp,
  sysGetTempData,
  sysPushTemp,
  sysClassList,
  sysStudentAdd,
  sysStudentModify,
  sysStudentDelete
} from "../../api/school";
import axios from "axios";
import searchInput from "@/components/search-input";
import { setTimeout } from "timers";
import Cookie from "js-cookie";
import { log } from "util";
export default {
  name: "",
  data() {
    return {
      search: "",
      upDiago: false,
      upData: {
        isUp: true,
        text: "正在解析模板，请不要关闭页面",
        total: "",
        success: ""
      },
      classSearchList: [],
      searchForm: {
        college: "",
        department: "",
        speciality: "",
        search: "",
        studentClass: ""
      },
      searchCollegeList: [],
      searchDepartmentList: [],
      searchSpecialityList: [],
      searchClassList: [],
      searchStudentList: [],
      tableTitle: "学生列表",
      tableOperate: [
        {
          content: "+添加学生",
          type: "addStudent"
        },
        {
          content: "批量删除",
          type: "deleteAll"
        },
        {
          content: "下载模板",
          type: "downTemp"
        },
        {
          content: "导入模板",
          type: "upTemp"
        }
      ],
      columnNameList: [
        {
          type: "selection"
        },
        {
          name: "姓名",
          prop: "realName"
        },
        {
          name: "学号",
          minWidth: 100,
          prop: "studentNo"
        },
        {
          name: "院",
          prop: "collegeName",
          slot: true,
          select: false,
          minWidth: 200
        },
        {
          name: "系",
          prop: "departmentName",
          slot: true,
          select: false,
          minWidth: 200
        },
        {
          name: "专业",
          prop: "specialityName",
          slot: true,
          select: false,

          minWidth: 200
        },
        {
          name: "班级",
          prop: "className",
          slot: true,
          select: false,
          minWidth: 200
        },
        {
          name: "创建时间",
          minWidth: 200,
          prop: "createTime"
        }
      ],
      operateList: [
        {
          content: "编辑",
          type: "edit"
        },
        {
          content: "重置密码",
          type: "resetPassword"
        },
        {
          content: "删除",
          type: "delete"
        }
      ],
      tableData3: [],
      filterSelect: {},
      selectOptions: [],
      dialogVisible: true,
      // 院列表
      collegeList: [],
      collegeSelected: "",
      // 系列表
      departmentList: [],
      departmentRows: [],
      // 专业列表
      specialityList: [],
      specialityRows: [],
      // 班级列表
      classList: [],
      classRows: [],
      // 表单信息
      form: {
        studentNo: "",
        realName: "",
        sex: "",
        mobile: "",
        status: true
      },
      mobileEnable: true,
      studentId: "",
      status: false,
      dialogTitle: "",
      collegeId: "",
      departmentId: "",
      specialityId: "",
      classId: "",
      totalCount: 0,
      pageIndex: 1,
      formEvent: ""
    };
  },
  components: {
    tableTheAgain,
    headerTheAgain,
    searchInput
  },
  mounted() {
    // 院列表
    this.collegeInit();
    // 系列表
    this.departmentInit();
    // 专业列表
    sysSpecialityList({ collegeId: -1, departmentId: -1 }).then(response => {
      if (response.code === 200) {
        this.specialityRows = response.data;
        this.searchSpecialityList = response.data;
        console.log("专业列表", response.data);
      }
    });
    // 班级列表
    sysClassList({ specialityId: -1 }).then(response => {
      console.log("班级列表", response.data);
      if (response.code === 200) {
        this.classRows = response.data;
        this.classSearchList = response.data;
      }
    });
    // 学生列表
    this.studentInit();
  },
  watch: {},
  methods: {
    //获取院列表
    collegeInit() {
      sysCollegeList().then(response => {
        if (response.code === 200) {
          this.collegeList = response.data;
          this.searchCollegeList = response.data;
          console.log("院列表", response.data);
        }
      });
    },
    //获取系列表
    departmentInit(id = -1) {
      DepartmentList({ collegeId: id }).then(response => {
        if (response.code === 200) {
          this.departmentRows = response.data;
          this.searchDepartmentList = response.data;
          console.log("系列表", response.data);
        }
      });
    },
    studentInit(data) {
      let newData = {};
      Object.assign(newData, data, { pageIndex: this.pageIndex });
      sysStudentPage(newData).then(response => {
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          dataArr.push(element);
        });
        this.totalCount = Number(response.data.totalCount);
        this.tableData3 = dataArr;
      });
    },
    // 院值变化
    filterChange(value) {
      this.studentInit(this.searchForm);
    },
    collegeChange() {},
    // 系值变化
    departmentChange(value) {
      this.studentInit(this.searchForm);
    },
    // 专业搜索值变化
    specialityChange(value) {
      this.searchForm.studentClass = -1;
      if (value === -1) {
        this.classSearchList = this.classRows;
      } else {
        this.classSearchList = this.classRows.filter(item => {
          // console.log(item);
          return item.specialityId == value || item.classId == -1;
        });
      }
      // console.log(this.classSearchList)
    },
    // 查找按钮事件
    searchStudent() {
      this.searchForm.pageIndex = 1;
      sysStudentPage(this.searchForm).then(response => {
        // console.log(response);
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          // console.log(typeof element.status);
          dataArr.push(element);
        });
        this.tableData3 = dataArr;
        this.totalCount = Number(response.data.totalCount);
      });
    },
    showComponentInfo: function(type, info) {
      switch (type) {
        case "switch":
          this.changeStatus(info);
          break;
        case "delete":
          this.delStudent(info);
          break;
        case "deleteAll":
          this.delStudent(info);
          break;
        case "downTemp":
          this.down();
          break;
        case "upTemp":
          let a = document.getElementById("upTemp");
          a.click();
          break;
        case "addStudent":
          this.$router.push({ path: "/school/student/add" });
          break;
        case "edit":
          this.$router.push({
            path: "/school/student/add",
            query: { studentId: info.studentId }
          });
          break;
      }
    },
    //删除学生
    delStudent(student) {
      // console.log(student.length);
      let delArr = [];
      if (student.length == 0) {
        this.$message.warning("请勾选要删除的目标");
        return false;
      }
      if (student.studentId) {
        delArr.push(student.studentId);
      } else {
        student.forEach(element => {
          delArr.push(element.studentId);
        });
      }
      this.$confirm("是否删除学生？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysStudentDelete(delArr).then(response => {
            if (response.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.studentInit();
            }
          });
        })
        .catch(() => {});
    },
    //是否启用学生
    changeStatus(info) {
      let switchInfo = { id: info.studentId, status: info.status };
      this.$confirm("变更学生状态", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysStudentSwitch(switchInfo).then(response => {
            if (response.code === 200) {
              this.$message.success("操作成功");
              this.studentInit();
            } else {
              this.$message.success("操作失败，请重试");
            }
          });
        })
        .catch(() => {
          this.studentInit();
        });
    },
    pageChange(pageNum) {
      this.searchForm.pageIndex = pageNum;
      sysStudentPage(this.searchForm).then(response => {
        console.log(response);
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          console.log(typeof element.status);
          dataArr.push(element);
        });
        this.tableData3 = dataArr;
      });
    },
    down() {
      axios
        .get("/api/v1/sys/student/excel", {
          headers: {
            "content-type": "application/vnd.ms-excel",
            token: Cookie.get("BackstageToken")
          },
          responseType: "blob"
        })
        .then(response => {
          //由于后台接口没有返回体，请求直接被catch捕获
        })
        .catch(function(response) {
          let blob = new Blob([response], { type: "application/vnd.ms-excel" });
          let url = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "学生模板.xlsx");
          document.body.appendChild(link);
          link.click();
        });
    },
    //模板解析
    upStudentTemp(item) {
      let upFile = item.target.files[0];
      let fileFormData = new FormData();
      fileFormData.append("file", upFile);
      this.upDiago = true;
      this.upData.isUp = true;
      this.upData.text = "正在解析模板，请不要关闭页面";
      sysUpTemp(fileFormData)
        .then(res => {
          let a = document.getElementById("upTemp");
          a.value = "";
          this.upData.total = res.data.length;
        })
        .then(() => {
          sysGetTempData().then(res => {
            console.log(res);
            this.upData.success = res.data.list.length;
            this.upData.isUp = false;
          });
        })
        .catch(error => {
          let a = document.getElementById("upTemp");
          a.value = "";
          console.log(error);
        });
    },
    //将模板数据导入数据库
    putTemp() {
      if (this.upData.isUp) {
        this.open4("模板解析尚未完成，取消导入，确定吗？");
      } else {
        this.$store.commit("SHOWLOADING");

        sysPushTemp()
          .then(res => {
            if (res.code == 200) {
              this.$store.commit("HIDELOADING");

              this.$message.success("导入成功！");
              this.upDiago = false;
              this.upData.isUp = true;
              this.upData.text = "正在解析模板，请不要关闭页面";
              this.upData.total = "";
              this.upData.success = "";
              this.studentInit();
            } else {
              this.$store.commit("ERR_MSG", res.msg);
            }
          })
          .catch(err => {
            this.$store.commit("ERR_MSG", err.msg);
          });
      }
    },
    open4(text) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "继续",
        type: "warning"
      })
        .then(() => {
          this.upDiago = false;
          this.upData.isUp = true;
          this.upData.text = "正在解析模板，请不要关闭页面";
          this.upData.total = "";
          this.upData.success = "";
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.my-input {
  padding: 0;

  input {
    border: 0;
  }
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.student {
  @keyframes slidein {
    from {
      background: rgb(19, 206, 102);
      width: 0;
    }

    to {
      background: rgb(19, 206, 102);
      width: 100%;
    }
  }

  .up-warp {
    .progress {
      border-radius: 30px;
      width: 420px;
      height: 20px;
      background: #ccc;
      animation: slidein 5s linear 1s infinite;
    }

    .progress-init {
      border-radius: 30px;
      width: 420px;
      height: 20px;
      background: white;
    }

    .progress-success {
      border-radius: 30px;
      width: 420px;
      height: 20px;
      background: rgb(19, 206, 102);
    }
  }

  .el-pagination {
    margin: 20px 2.5% 0 0;
    display: flex;
    justify-content: flex-end;
    width: 95%;
  }
}
</style>





