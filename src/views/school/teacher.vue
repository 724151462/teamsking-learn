<template>
  <div class="teacher">
    <header-the-again headerTitle="教师管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchForm.teacherInfo" placeholder="老师名称/工号" style="width:230px"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="teacherInit"
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
          remote
          :remote-method="remoteCollege"
          @focus='()=>{remoteCollege()}'
          :loading="searchStatus.collegeLoading"
          @change="teacherInit"
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
          remote
          class="my-select"
          v-model="searchForm.department"
          placeholder="系"
          :remote-method="remoteDepartment"
          @focus='()=>{remoteDepartment()}'
          :loading="searchStatus.departmentLoading"
          @change="teacherInit"
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
      :current-page="searchForm.pageIndex"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "../../components/header-theAgain";
import mbNav from "@/components/breadcrumb";

import {
  sysCollegeList,
  sysCollegePage,
  sysDepartmentList,
  sysTeacherPage,
  sysDepartmentPage,
  sysTeacherSwitch,
  sysTeacherReset
} from "../../api/school";

export default {
  name: "",
  data() {
    return {
      tableOperate: [
        {
          content: "+添加教师",
          type: "addTeacher"
        },
        {
          content: "批量重置密码",
          type: "resetAll"
        }
      ],
      tableTitle: "教师管理列表",
      columnNameList: [
        {
          type: "selection"
        },
        {
          name: "姓名",
          prop: "teacherName"
        },
        {
          name: "工号",
          minWidth: 100,
          prop: "teacherNumber"
        },
        {
          name: "手机号",
          prop: "mobile",
          minWidth: 150
        },
        {
          name: "院",
          slot: true,
          select: false,
          minWidth: 200,
          prop: "collegeName"
        },
        {
          name: "系",
          slot: true,
          select: false,
          minWidth: 200,
          prop: "departmentName"
        },
        {
          name: "创建课程",
          prop: "courseCount",
          width: 85
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
      searchStatus:{
        departmentLoading:false,
        collegeLoading:false,
      },
      searchForm: {
        college: "",
        department: "",
        teacherInfo: "",
        pageIndex: 1
      },
      searchCollegeList: [],
      searchDepartmentList: [],
      collegeList: [],
      totalCount: 0,
      pageIndex: 1
    };
  },
  components: {
    tableTheAgain,
    headerTheAgain,
  },
  computed: {},
  mounted() {
    this.teacherInit();
  },
  methods: {
    //获取教师列表
    teacherInit() {
      sysTeacherPage(this.searchForm).then(response => {
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          dataArr.push(element);
        });
        this.totalCount = Number(response.data.totalCount);
        this.tableData3 = dataArr;
      });
    },
    //分页改变
    pageChange(pageNum) {
      this.searchForm.pageIndex = pageNum;
      this.teacherInit()
    },
    showComponentInfo: function(type, info) {
      switch (type) {
        case "switch":
          this.changeStatus(info)
          break;
        case "addTeacher":
          this.$router.push({ path: "/school/teacher/addteacher" });
          break;
        case "resetPassword":
          this.resetPassword(info);
          break;
        case "resetAll":
          if(info.length ==0){
            this.$message.warning('请勾选教师')
            return false
          }
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
    //重置密码
    resetPassword(teacher) {
      let resetArr = [];
      if (teacher.teacherId) {
        resetArr.push(teacher.userId);
      } else {
        teacher.forEach(element => {
          resetArr.push(element.userId);
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
    //变更教师状态
    changeStatus(info){
      let switchInfo = { id: info.teacherId, status: info.status };
      this.$confirm("变更教师状态", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysTeacherSwitch(switchInfo).then(response => {
            if (response.code === 200) {
              this.$message.success("操作成功");
              this.teacherInit();
            } else {
              this.$store.commit("ERR_MSG", response.msg);
            }
          });
        })
        .catch(() => {
          this.teacherInit();
        });
    },
    //远程搜索系列表
    remoteCollege(collegeName = null){
      this.searchStatus.collegeLoading = true;
      sysCollegePage({collegeName})
        .then(res => {
          this.searchCollegeList = res.data.pageData;
          this.searchStatus.collegeLoading = false;
        })
        .catch(error => {
          this.$store.commit("ERR_MSG", error.msg);
          console.log(error);
        });
    },
    //远程搜索院列表
    remoteDepartment(query = null){
      this.searchStatus.departmentLoading = true;
      sysDepartmentPage({ collegeId:-1, departmentName:query })
        .then(res => {
          this.searchDepartmentList = res.data.pageData;
          this.searchStatus.departmentLoading = false;
        })
        .catch(error => {
          this.$store.commit("ERR_MSG", error.msg);
          console.log(error);
        });
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