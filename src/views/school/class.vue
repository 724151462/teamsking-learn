<template>
  <div class="academy">
    <header-the-again headerTitle="班级管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchForm.searchKey" placeholder="班级名称" style="width:230px"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="queryClass(1)"
          icon="el-icon-search"
        ></el-button>
      </div>
    </header-the-again>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData.pageData"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    >
      <template slot="collegeName" slot-scope="scope">
        <el-select
          filterable
          clearable
          remote
          class="my-select"
          v-model="searchForm.collegeId"
          placeholder="院"
          @change="(value)=>{
            if(value !== ''){
              queryClass()
            }
          }"
          @clear="queryClear('collegeId')"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.collegeId"
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
          @change="(value)=>{
            if(value !== ''){
              queryClass()
            }
          }"
          @clear="queryClear('departmentId')"
          v-model="searchForm.departmentId"
          :filter-method="(query)=>{
            if(query !== ''){
              getSysDepartmentList(query) 
            }
          }"
          placeholder="请输入系名称"
        >
          <el-option
            v-for="item in departmentList"
            :key="item.departmentId"
            :label="item.departmentName"
            :value="item.departmentId"
          ></el-option>
        </el-select>
      </template>
      <template slot="specialityName" slot-scope="scope">
        <el-select
          filterable
          clearable
          class="my-select"
          @change="(value)=>{
            if(value !== ''){
              queryClass()
            }
          }"
          @clear="queryClear('specialityId')"
          v-model="searchForm.specialityId"
          :filter-method="(query)=>{
            if(query !== ''){
              querySpecialityList(query,'specialityList') 
            }
          }"
          placeholder="请输入专业搜索"
        >
          <el-option
            v-for="item in specialityList"
            :key="item.specialityId"
            :label="item.specialityName"
            :value="item.specialityId"
          ></el-option>
        </el-select>
      </template>
    </table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="tableData.pageSize"
      :page-count="tableData.totalPage"
      :current-page="tableData.pageIndex"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-dialog
      :title="addForm.title"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="addForm.data" :rules="rules" ref="id_addForm" label-width="100px">
        <!-- <el-form-item
          prop="collegeId"
          label="院："
        >
          <el-select
            filterable
            clearable
            v-model="addForm.data.collegeId"
            placeholder="请选择院"
            @change="(value)=>{
              addForm.data.departmentId = ''
              getSysDepartmentList(null,value,'AddDepartmentList')
              }"
          >
            <el-option
              v-for="item in collegeList"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="系："
          prop="departmentId"
        >
          <el-select filterable clearable v-model="addForm.data.departmentId" placeholder="请选择系">
            <el-option
              v-for="item in AddDepartmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="专业：" prop="specialityId">
          <el-select
            filterable
            clearable
            :filter-method="(query)=>{
            if(query !== ''){
              querySpecialityList(query,'AddSpecialityList') 
            }
          }"
            v-model="addForm.data.specialityId"
            placeholder="请选择所属专业"
          >
            <el-option
              v-for="item in AddSpecialityList"
              @change="()=>{console.log('change')}"
              :key="item.specialityId"
              :label="item.specialityName"
              :value="item.specialityId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级：" prop="classYear">
          <el-input
            class="input-pop"
            v-model="addForm.data.classYear"
            placeholder="请填写年级"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="班级：" prop="className">
          <el-input
            class="input-pop"
            v-model="addForm.data.className"
            placeholder="请填写班级"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:10px">
          <p v-for="(item, index) in addForm.data.manager" :key="index">
            <span style="diaplay:inline-block">{{item.realName}}</span>
            <i
              @click="()=>{
                addForm.data.manager.splice(index,1)
              }"
              class="el-icon-remove"
              style="font-size: 20px;vertical-align: middle;margin-left: 10px;color:#f56c6c;cursor:pointer;"
            ></i>
          </p>
        </el-form-item>
        <el-form-item label="负责人：">
          <el-autocomplete
            class="input-pop"
            suffix-icon="el-icon-search"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            v-model="addForm.teacherName"
            placeholder="输入名字查找教师"
          ></el-autocomplete>
          <span style="display:inline-block;margin-left:10px">
            <span style="color:red;">{{addForm.data.manager.length}}</span>/5
          </span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "../../components/header-theAgain";

import { sysTenantTeacher } from "../../api/school";
import {
  sysClassPage,
  sysCollegeList,
  sysDepartmentPage,
  sysTeacherPage,
  sysSpecialityPage
} from "../../api/school";
import { sysClass } from "../../api/school";
import { sysClassUpdate } from "../../api/school";
import { sysClassDelete } from "../../api/school";
import { getErrorMsg } from "@/utils/utils";

// import { sysDepartment } from '../../api/school'
// import { sysDepartmentEdit } from '../../api/school'
// import { sysDepartmentDelete } from '../../api/school'

export default {
  name: "",
  data() {
    return {
      collegeList: [], //院列表
      departmentList: [], //系列表
      specialityList: [], //专业列表
      AddSpecialityList: [], //添加 || 编辑 用的专业列表
      searchForm: {
        className: "",
        collegeId: "",
        departmentId: "",
        specialityId: ""
      },
      departmentSelectList: [],
      specialityList: [],
      collegeAndDepartment: "",
      popCollegeAndDepartment: "",
      popError: "",
      input: "",
      form: {
        specialityId: -1,
        collegeId: -1,
        departmentId: -1,
        className: ""
      },
      addForm: {
        title: "添加系",
        teacherName: "",
        data: {
          specialityId: "",
          className: "",
          classYear: "",
          classId: "",
          manager: []
        }
      },
      rules: {
        collegeId: [
          { required: true, message: "请选择所属院", trigger: "blur" }
        ],
        specialityId: [
          { required: true, message: "请选择所属专业", trigger: "blur" }
        ],
        className: [
          { required: true, message: "请填写班级名称", trigger: "blur" }
        ],
        classYear: [{ required: true, message: "请填写年级", trigger: "blur" }]
      },
      tableData: {},
      dialogVisible: false,
      tableTitle: "班级列表",
      tableOperate: [
        {
          content: "+添加",
          type: "add"
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
          name: "所属院名称",
          prop: "collegeName",
          slot: true,
          select: false,
          minWidth: 200
        },
        {
          name: "所属系名称",
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
          minWidth: 200
        },
        {
          name: "班级负责人",
          prop: "manager",
          minWidth: 100,
          formatter: val => {
            let str = "";
            for (let i = 0; i < val.length; i++) {
              if (val.length === 1) {
                str = val[0].realName;
              } else {
                if (i === 0) {
                  str = val[0].realName;
                } else {
                  str += "," + val[i].realName;
                }
              }
            }
            return str || "-";
          }
        },
        {
          name: "年级",
          prop: "classYear"
        }
      ],
      operateList: [
        {
          content: "编辑",
          type: "edit"
        },
        {
          content: "删除",
          type: "delete"
        }
      ]
    };
  },
  components: {
    tableTheAgain,
    headerTheAgain
  },
  created: function() {
    this.getCollegeList(); //获取院列表
    this.getSysDepartmentList(); //获取系列表
    this.querySpecialityList(); //获取专业列表
    this.queryClass();
  },
  methods: {
    showComponentInfo: function(type, info) {
      switch (type) {
        case "edit":
          this.edit(JSON.parse(JSON.stringify(info)));
          break;
        case "add":
          this.appendNewClass();
          break;
        case "deleteAll":
          this.deleteClass("list", info);
          break;
        case "delete":
          this.deleteClass("one", info);
          break;
      }
    },
    //获取院列表
    getCollegeList: function() {
      //查询院列表
      sysCollegeList()
        .then(res => {
          this.collegeList = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取系列表
    getSysDepartmentList: function(departmentName = null) {
      sysDepartmentPage({ collegeId: -1, departmentName })
        .then(res => {
          this.departmentList = res.data.pageData;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取专业列表
    querySpecialityList: function(
      specialityName = null,
      target = "specialityList"
    ) {
      sysSpecialityPage({ departmentId: -1, specialityName })
        .then(res => {
          this[target] = res.data.pageData;
        })
        .catch(error => console.log(error));
    },
    //获取班级列表
    queryClass: function(pageIndex = 1) {
      let data = {
        pageIndex,
        departmentId: this.searchForm.departmentId || -1,
        specialityId: this.searchForm.specialityId || -1,
        collegeId: this.searchForm.collegeId || -1,
        className: this.searchForm.searchKey || null
      };
      sysClassPage(data)
        .then(res => {
          this.tableData = res.data;
        })
        .catch(error => console.log(error));
    },
    //查询条件清空
    queryClear(target) {
      (this.searchForm[target] = ""),
        (this.searchForm.searchKey = ""),
        this.queryClass();
    },
    save: function() {
      this.$refs["id_addForm"].validate(valid => {
        if (valid) {
          if (this.addForm.title !== "添加班级") {
            sysSpecialityEdit(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("修改成功");
                  this.handleClose();
                  this.querySpeciality();
                } else {
                  this.$store.commit("ERR_MSG", res.msg);
                }
              })
              .catch(error => {
                this.$store.commit("ERR_MSG", res.msg);
              });
          } else {
            sysClass(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("添加成功");
                  this.handleClose();
                  this.querySpeciality();
                } else {
                  this.$store.commit("ERR_MSG", res.msg);
                }
              })
              .catch(error => {
                this.$store.commit("ERR_MSG", error.msg);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // }
      // if (this.addForm.title === "添加班级") {
      //   sysClass(this.addForm.data)
      //     .then(res => {
      //       console.log("添加成功", res);
      //     })
      //     .catch(error => {
      //       console.log("添加失败", error);
      //     });
      // } else if (this.addForm.title === "修改班级") {
      //   sysClassUpdate(this.addForm.data)
      //     .then(res => {
      //       console.log("修改成功", res);
      //     })
      //     .catch(error => {
      //       console.log("修改失败", error);
      //     });
      // }
      // this.dialogVisible = false;
      // setTimeout(() => this.queryClass(), 500);
    },
    deleteClass: function(type, classList) {
      let classIdList = [];
      if (type === "list") {
        classList.filter(item => {
          classIdList.push(parseInt(item.classId));
        });
      }
      if (type === "one") {
        classIdList.push(parseInt(classList.classId));
      }
      sysClassDelete(classIdList)
        .then(res => {
          console.log("删除成功");
        })
        .catch(error => {
          this.$store.commit("ERR_MSG", error.msg);
          console.log("删除失败", error);
        });
      //console.log( '删除的班级列表', classIdList);
      setTimeout(() => {
        this.queryClass();
      }, 300);
    },
    addInput: function() {
      this.popError = "";
      if (this.addForm.data.manager.length < 5) {
        this.addForm.data.manager.push({
          realName: "",
          userId: "",
          workNumber: ""
        });
      } else {
        this.popError = "最多添加五位院负责人";
      }
      this.queryWorkNumber();
    },
    deleteInput: function(index) {
      this.addForm.data.manager.splice(index, 1);
    },
    appendNewClass: function() {
      this.dialogVisible = !this.dialogVisible;
      this.addForm.title = "添加班级";
      this.querySpecialityList(null, "AddSpecialityList");
    },
    edit: function(info) {
      this.dialogVisible = !this.dialogVisible;
      this.querySpecialityList(info.specialityName, "AddSpecialityList");
      this.addForm.title = "修改班级";
      this.addForm.data = info;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs["id_addForm"].resetFields();
      this.addForm.teacherName = "";
      this.addForm.data.classId = null;
      this.addForm.data.className = "";
      this.addForm.data.specialityId = "";
      this.addForm.data.manager = [];
      // this.querySpecialityList(null,'AddSpecialityList')
    },
    handleCurrentChange: function(number) {
      // console.log( number );
      this.form.pageIndex = number;
      this.queryClass();
      console.log("this.form.pageIndex", this.form.pageIndex);
    },
    //添加负责人时的搜索函数
    querySearchAsync(queryString, cb) {
      sysTeacherPage({ teacherInfo: queryString, pageSize: 10 })
        .then(res => {
          if (Number(res.code) == 200) {
            let results = res.data.pageData.filter(item => {
              item.value = item.teacherName;
              return item;
            });
            cb(results);
          } else {
            this.$store.commit("ERR_MSG", res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择添加负责人
    handleSelect(item) {
      if (this.addForm.data.manager.length >= 5) {
        this.$message.warning("最多添加5个负责人");
        return false;
      }
      let hasTeacher = false;
      this.addForm.data.manager.forEach(list => {
        if (list.workNumber == item.teacherNumber) {
          hasTeacher = true;
          this.$message.warning("已选择该教师");
        }
      });
      if (!hasTeacher) {
        this.addForm.data.manager.push({
          realName: item.teacherName,
          userId: item.userId,
          workNumber: item.teacherNumber
        });
      }
      this.addForm.teacherName = "";
    }
  }
};
</script>
<style scoped lang="stylus" type="text/stylus">
.academy {
  .el-pagination {
    margin: 20px 2.5% 0 0;
    display: flex;
    justify-content: flex-end;
    width: 95%;
  }

  .pop-academy {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: left;
  }

  .color-red {
    color: red;
  }

  .item-title {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    width: 30%;

    span {
      line-height: 40px;
    }
  }

  .item-input-list {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    width: 70%;
  }

  .item-input {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 40px;
  }

  .input-pop {
    width: 200px;
  }
}
</style>
