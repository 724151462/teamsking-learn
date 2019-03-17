<template>
  <div class="student">
    <header-the-again headerTitle="学生管理">
      <div style="display:inline-block;position: relative;">
        <el-input style="width:230px" v-model="searchForm.search" placeholder="输入姓名或学号"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="searchStudent"
        >搜索</el-button>
      </div>
    </header-the-again>
    <div style="font-size:15px">
      <el-button type="text" style="font-size:16px">＋添加学生</el-button>
      <el-button type="text" style="font-size:16px">批量删除</el-button>
    </div>
    <div style="border: 1px solid #ebebeb;border-radius: 3px;transition: .2s;">
    <el-table :data="tableData3" style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="realName" label="姓名" width="100"></el-table-column>
      <el-table-column prop="studentNo" label="学号" width="100"></el-table-column>
      <!-- <el-table-column prop="realName" label="姓名" width="100"></el-table-column> -->
      <el-table-column width="170" prop="collegeName">
        <template slot="header" slot-scope="scope">
          <el-select
            class="my-select"
            filterable
            clearable
            v-model="searchForm.college"
            :readonly="true"
            placeholder="院(点此可筛选)"
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
      </el-table-column>
      <el-table-column width="170" prop="departmentName">
        <template slot="header" slot-scope="scope">
          <el-select
            class="my-select"
            filterable
            clearable
            v-model="searchForm.department"
            :readonly="true"
            placeholder="系(点此可筛选)"
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
      </el-table-column>
      <el-table-column min-width="170" prop="specialityName">
        <template slot="header" slot-scope="scope">
          <el-select
            v-model="searchForm.speciality"
            class="my-select"
            filterable
            clearable
            placeholder="专业(点此可筛选)"
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
      </el-table-column>
      <el-table-column min-width="170" prop="className">
        <template slot="header" slot-scope="scope">
          <el-select
            class="my-select"
            filterable
            clearable
            v-model="searchForm.studentClass"
            placeholder="班级(点此可筛选)"
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
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column fixed="right" label="是否启用" width="85">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="2"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="250" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="editStudent()">编辑</el-button>
          <el-button size="mini" type="danger" @click="delStudent([scope.row])">删除</el-button>
          <el-button size="mini" type="primary" @click="handleDelete(scope.$index, scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <!-- <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
      switchColumn="open"
    ></table-the-again>-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form1" :model="form" label-width="80px">
        <el-form-item label="学号">
          <el-input v-model="form.studentNo"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="手机号码">
          <el-input v-model="form.mobile" :disabled="mobileEnable"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.college"
            :readonly="true"
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
        </el-form-item>
        <el-form-item>
          <el-select
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
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.speciality" placeholder="专业" @change="specialityChange">
            <el-option
              v-for="(item, index) in searchSpecialityList"
              :key="index"
              :label="item.specialityName"
              :value="item.specialityId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.studentClass" placeholder="班级">
            <el-option
              v-for="(item, index) in classSearchList"
              :key="index"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            active-value="1"
            inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="status"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ensureBtn()">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="pageChange"
    ></el-pagination>
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
  sysClassList,
  sysStudentAdd,
  sysStudentModify,
  sysStudentDelete
} from "../../api/school";
import tip from "@/components/tip";
import searchInput from "@/components/search-input";
import { setTimeout } from "timers";
export default {
  name: "",
  data() {
    return {
      search: "",
      classSearchList: [],
      state4: "",
      timeout: null,
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
      timeout: "",
      tableOperate: [
        {
          content: "添加学生",
          type: "addStudent"
        },
        {
          content: "批量删除",
          type: "deleteAll"
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
          prop: "studentNo"
        },
        {
          name: "系",
          prop: "departmentName",
          fit: true
        },
        {
          name: "专业",
          prop: "specialityName"
        },
        {
          name: "班级",
          prop: "className"
        },
        {
          name: "创建时间",
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
      dialogVisible: false,
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
        console.log("学生列表", response.data.pageData);
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          dataArr.push(element);
        });
        this.totalCount = Number(response.data.totalCount);
        this.tableData3 = dataArr;
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
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
      console.log("spec", value);
      this.searchForm.studentClass = -1;
      if (value === -1) {
        this.classSearchList = this.classRows;
      } else {
        this.classSearchList = this.classRows.filter(item => {
          console.log(item);
          return item.specialityId == value || item.classId == -1;
        });
      }
      // console.log(this.classSearchList)
    },
    // 查找按钮事件
    searchStudent() {
      // let {studentClass, college, department, speciality , studentInfo} = this.searchForm

      console.log(this.classSearchList);
      if (!this.searchForm.studentClass) {
        this.searchForm.studentClass = -1;
      }
      if (!this.searchForm.college) {
        this.searchForm.college = -1;
      }
      if (!this.searchForm.department) {
        this.searchForm.department = -1;
      }
      if (!this.searchForm.speciality) {
        this.searchForm.speciality = -1;
      }
      console.log("12344", this.searchForm);
      this.searchForm.pageIndex = 1;
      sysStudentPage(this.searchForm).then(response => {
        console.log(response);
        let dataArr = [];
        response.data.pageData.forEach(element => {
          element.status = String(element.status);
          console.log(typeof element.status);
          dataArr.push(element);
        });
        this.tableData3 = dataArr;
        this.totalCount = Number(response.data.totalCount);
      });
    },
    showComponentInfo: function(type, info) {
      console.log(
        "父组件接收到的类型：" + type + "父组件接收到的信息：" + info
      );
      switch (type) {
        case "check":
          //console.log(info);
          this.check(info);
          break;
        case "switch":
          let switchInfo = { id: info.studentId, status: info.status };
          sysStudentSwitch(switchInfo).then(response => {
            console.log(response);
          });
          break;
        case "delete":
          this.delStudent(info);
          break;
        case "deleteAll":
          this.delStudent(info);
          break;
        case "addStudent":
          this.dialogTitle = "添加学生";
          this.formEvent = "addNewStudent";
          this.initStudent();
          this.mobileEnable = false;
          console.log(this.mobileEnable);
          this.dialogVisible = true;
          break;
        case "edit":
          break;
      }
    },
    check: function() {
      this.dialogVisible = !this.dialogVisible;
    },
    onSubmit: function() {
      // this.specialityRows.forEach(element => {
      //     console.log('---',element)
      // });
      console.log(123);
    },
    editStudent() {
      this.dialogTitle = "编辑学生";
      this.initStudent(info);
      this.mobileEnable = true;
      console.log(this.mobileEnable);
      this.formEvent = "editStudent";
      this.dialogVisible = true;
    },
    delStudent(student) {
      // console.log(student.length);
      let delArr = [];
      if (student.length == undefined) {
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
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    ensureBtn() {
      if (this.formEvent == "addNewStudent") {
        this.addNewStudent();
      } else if (this.formEvent == "editStudent") {
        this.editStudent();
      }
    },
    // 添加新学生
    addNewStudent: function() {
      console.log(123, this.form.classId);
      let sex = this.form.sex == "男" ? 1 : 2;
      let formData = {
        classId: this.searchForm.studentClass,
        collegeId: this.searchForm.collegeId,
        realName: this.form.realName,
        specialityId: this.searchForm.specialityId,
        gender: sex,
        mobile: this.form.mobile,
        studentNo: this.form.studentNo,
        departmentId: this.departmentId,
        status: this.status
      };
      sysStudentAdd(formData).then(response => {
        if (response.code === 200) {
          this.$message({
            type: "success",
            message: "添加成功！"
          });
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: JSON.parse(response.msg)[0].message
          });
        }
      });
    },
    // 初始化修改表单的学生信息
    initStudent(info) {
      if (info) {
        let sex = info.sex == "男" ? 1 : 2;
        this.form.realName = info.realName;
        this.collegeId = info.collegeId == null ? "无院" : info.collegeId;
        this.departmentId =
          info.departmentId == null ? "无系" : info.departmentId;
        this.specialityId =
          info.specialityId == null ? "无专业" : info.specialityId;
        this.classId = info.classId == null ? "请添加班级" : info.classId;
        this.form.mobile = info.mobile;
        this.form.studentNo = info.studentNo;
        this.form.sex = info.gender;
        this.status = info.status;
        this.studentId = info.studentId;
      } else {
        this.form.realName = "";
        this.collegeId = "";
        this.departmentId = "";
        this.specialityId = "";
        this.classId = "";
        this.form.mobile = "";
        this.form.studentNo = "";
        this.form.sex = "男";
        this.status = 2;
      }
    },
    // 修改学生信息
    editStudent() {
      let sex = this.form.sex == "男" ? 1 : 2;
      let formData = {
        studentId: this.studentId,
        status: this.status,
        classId: this.classId,
        collegeId: this.collegeId == "无院" ? -1 : this.collegeId,
        realName: this.form.realName,
        specialityId: this.specialityId,
        gender: sex,
        mobile: this.form.mobile,
        studentNo: this.form.studentNo,
        departmentId: this.departmentId
      };
      sysStudentModify(formData).then(response => {
        if (response.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: JSON.parse(response.msg)[0].message
          });
        }
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

.student {
  .el-pagination {
    margin: 20px 2.5% 0 0;
    display: flex;
    justify-content: flex-end;
    width: 95%;
  }
}
</style>





