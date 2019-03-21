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
          minWidth: 200
        },
        {
          name: "系",
          prop: "departmentName",
          slot: true,
          minWidth: 200
        },
        {
          name: "专业",
          prop: "specialityName",
          slot: true,
          minWidth: 200
        },
        {
          name: "班级",
          prop: "className",
          slot: true,
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
      // console.log(
      //   "父组件接收到的类型：" + type + "父组件接收到的信息：" + info
      // );
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
        case "addStudent":
          this.dialogTitle = "添加学生";
          this.formEvent = "addNewStudent";
          this.initStudent();
          this.mobileEnable = false;
          // console.log(this.mobileEnable);
          this.dialogVisible = true;
          break;
        case "edit":
          this.dialogTitle = "编辑学生";
          this.initStudent(info);
          this.mobileEnable = true;
          // console.log(this.mobileEnable);
          this.formEvent = "editStudent";
          this.dialogVisible = true;
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
    //删除学生
    delStudent(student) {
      // console.log(student.length);
      let delArr = [];
      if (student.length == 0) {
        return false
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
    ensureBtn() {
      if (this.formEvent == "addNewStudent") {
        this.addNewStudent();
      } else if (this.formEvent == "editStudent") {
        this.editStudent();
      }
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

.input-with-select .el-input-group__prepend {
  background-color: #fff;
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





