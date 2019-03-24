<template>
  <div class="teacher">
    <header-the-again headerTitle="教师管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchForm.teacherInfo" placeholder="老师名称/工号/手机号" style="width:230px"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="teacherSearch"
          icon="el-icon-search"
        ></el-button>
      </div>
    </header-the-again>

    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      switchColumn="open"
      @showComponentInfo="showComponentInfo"
    >
      <template slot="collegeName" slot-scope="scope">
        <el-select
          filterable
          clearable
          class="my-select"
          v-model="searchForm.college"
          placeholder="院"
          @change="collegeChange"
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
          filterable
          clearable
          class="my-select"
          v-model="searchForm.department"
          :readonly="true"
          placeholder="系"
          @change="departmentChange"
        >
          <el-option
            v-for="(item, index) in searchDepartmentList"
            :key="index"
            :label="item.departmentName"
            :value="item.departmentId"
          ></el-option>
        </el-select>
      </template>
    </table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="2"
      :current-page="searchForm.pageIndex"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "../../components/header-theAgain";

import {
  sysCollegeList,
  sysDepartmentList,
  sysTeacherPage,
  sysTeacherSwitch,
  sysTeacherReset
} from "../../api/school";

export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      tableOperate: [
        {
          content: "+添加教师",
          type: "addTeacher"
        },
        {
          content: "批量重置密码",
          type: "resetAll",
        }
      ],
      tableTitle: "教师管理列表",
      columnNameList: [
        {
          type: "selection"
        },
        {
          name: "姓名",
          prop: "teacherName",
        },
        {
          name: "工号",
          minWidth:100,
          prop: "teacherNumber"
        },
        {
          name: "手机号",
          prop: "mobile",
          minWidth:150
        },
        {
          name: "院",
          slot: true,
          minWidth: 200,
          prop: "collegeName",
        },
        {
          name: "系",
          slot: true,
          minWidth: 200,
          prop: "departmentName"
        },
        {
          name: "创建课程",
          prop: "courseCount",
          width:85,
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
        }
      ],
      tableData3: [],
      popContentItem: [],
      textarea: "",
      searchForm: {
        college: "",
        department: "",
        teacherInfo: "",
        pageIndex: 1
      },
      searchCollegeList: [],
      searchDepartmentList: [],
      departmentRows: [],
      collegeList: [],
      totalCount: 0,
      pageIndex: 1
    };
  },
  components: {
    tableTheAgain,
    headerTheAgain
  },
  computed: {},
  mounted() {
    // 教师列表
    sysTeacherPage({ pageIndex: this.pageIndex }).then(response => {
      let dataArr = [];
      response.data.pageData.forEach(element => {
        element.status = String(element.status);
        console.log(typeof element.status);
        dataArr.push(element);
      });
      this.totalCount = Number(response.data.totalCount);
      console.log(this.totalCount);
      this.tableData3 = dataArr;
    });
    // 院列表
    sysCollegeList().then(response => {
      if (response.code === 200) {
        this.collegeList = response.data;
        this.searchCollegeList = response.data;
      }
    });
    // 系列表
    sysDepartmentList().then(response => {
      if (response.code === 200) {
        this.departmentRows = response.data;
        this.searchDepartmentList = response.data;
      }
    });
  },
  methods: {
    // 院搜索值变化
    collegeChange(value) {
      // console.log(value)
      // console.log('a',this.departmentRows)
      if (value === -1) {
        this.searchDepartmentList = this.departmentRows;
        this.searchForm.department = -1;
      } else {
        this.searchDepartmentList = this.departmentRows.filter(
          (item, index) => {
            return (
              item.collegeId == value || item.collegeId == -1 || index == 0
            );
          }
        );
        this.searchForm.department = -1;
      }
    },
    // 系搜索值变化
    departmentChange(value) {
      console.log("dep", value);
      // if(value === -1){
      //     return this.specialityRows
      // }
      // this.searchForm.speciality = -1
      // this.searchSpecialityList = this.specialityRows.filter((item)=>{
      //     return item.departmentId == value || item.departmentId == -1
      // })
    },
    teacherSearch() {
      this.searchForm.pageIndex = 1;
      sysTeacherPage(this.searchForm).then(response => {
        console.log(response);
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          console.log(typeof element.status);
          dataArr.push(element);
        });
        this.tableData3 = dataArr;
        this.totalCount = Number(response.data.totalCount);
        this.pageIndex = 1;
      });
    },
    pageChange(pageNum) {
      this.searchForm.pageIndex = pageNum;
      sysTeacherPage(this.searchForm).then(response => {
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
    showComponentInfo: function(type, info) {
      console.log(
        "父组件接收到的类型：" + type + "父组件接收到的信息：" + info
      );
      switch (type) {
        case "check":
          //console.log(info);
          this.popContentItem = this.info;
          this.check(info);
          break;
        case "switch":
          let switchInfo = { id: info.teacherId, status: info.status };
          sysTeacherSwitch(switchInfo).then(response => {
            console.log(response);
          });
          break;
        case "addTeacher":
          this.$router.push({ path: "/school/teacher/addteacher" });
          break;
        case "resetPassword":
          this.resetPassword(info);
          break;
        case "resetAll":
          this.resetPassword(info);
          break;
        case "edit":
          this.$router.push({
            path: "/school/teacher/modifyteacher",
            query: { teacherId: info.teacherId }
          });
          break;
      }
    },
    check: function() {
      this.dialogVisible = !this.dialogVisible;
    },
    resetPassword(teacher) {
      console.log(teacher.length);
      let resetArr = [];
      if (teacher.length == undefined) {
        resetArr.push(teacher.teacherId);
      } else {
        teacher.forEach(element => {
          resetArr.push(element.teacherId);
        });
      }

      this.$confirm("是否重置密码？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysTeacherReset(resetArr).then(response => {
            if (response.code === 200) {
              this.$message({
                type: "success",
                message: "重置成功!"
              });
            }
          });
        })
        .catch(() => {});
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onSubmit: function() {
      console.log("onSubmit!!");
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.teacher {
  .pop-user-info {
    margin: 0px 0 20px 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    width: 150px;
    height: 150px;

    div {
      width: 100px;
      height: 100px;
      background: cyan;
      border-radius: 50% 50%;
    }

    span {
      margin: 5px 0;
      box-sizing: border-box;
      display: inline;
    }
  }

  .pop-content-item {
    span:first-child {
      font-weight: 800;
    }
  }

  .pop-content-item:last-child {
    margin-top: 20px;
  }

  .el-pagination {
    margin: 20px 2.5% 0 0;
    display: flex;
    justify-content: flex-end;
    width: 95%;
  }
}
</style>