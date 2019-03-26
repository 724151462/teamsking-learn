<template>
  <div class="academy">
    <header-the-again headerTitle="专业管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchForm.searchKey" placeholder="专业名称" style="width:230px"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="querySpeciality()"
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
          class="my-select"
          v-model="searchForm.collegeId"
          placeholder="院"
          @change="(value)=>{
            if(value !== ''){
              querySpeciality()
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
              querySpeciality()
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
      <el-form :model="addForm.data" ref="id_addForm" label-width="100px">
        <el-form-item
          prop="collegeId"
          :rules="[{ required: true, message: '请选择所属院',trigger: 'blur'}]"
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
          :rules="[{ required: true, message: '请选择所属系',trigger: 'blur'}]"
        >
          <el-select filterable clearable v-model="addForm.data.departmentId" placeholder="请选择系">
            <el-option
              v-for="item in AddDepartmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请填写专业名称',trigger: 'blur'}]"
          label="专业："
          prop="specialityName"
        >
          <el-input
            class="input-pop"
            v-model="addForm.data.specialityName"
            placeholder="请填写专业"
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

import { sysTenantTeacher, sysDepartmentPage } from "../../api/school";
import { sysCollegeList, sysTeacherPage } from "../../api/school";
import { sysSpecialityPage } from "../../api/school";
import { sysSpeciality } from "../../api/school";
import { sysSpecialityEdit } from "../../api/school";
import { sysSpecialityDelete } from "../../api/school";
import { getErrorMsg } from "@/utils/utils";

export default {
  data() {
    return {
      collegeList: [], //院列表
      departmentList: [], //系列表
      AddDepartmentList: [], //添加 || 编辑时用的系列表
      searchForm: {
        //用于表格筛选
        collegeId: "",
        searchKey: "",
        departmentId: ""
      },
      form: {
        pageIndex: 1,
        departmentId: -1,
        collegeId: -1,
        specialityName: ""
      },
      addForm: {
        title: "添加专业",
        teacherName: "",
        data: {
          collegeId: "",
          departmentId: "",
          departmentName: "",
          specialityName: "",
          specialityId: "",
          manager: []
        }
      },
      tableData: {},
      dialogVisible: false,
      tableTitle: "系列表",
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
          slot: true,
          select: false,
          prop: "collegeName",
          minWidth: "200"
        },
        {
          name: "所属系名称",
          slot: true,
          select: false,
          prop: "departmentName",
          minWidth: "200"
        },
        {
          name: "专业",
          prop: "specialityName",
          minWidth: "200"
        },
        {
          name: "专业负责人",
          prop: "manager",
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
    this.getSysDepartmentList();
    this.querySpeciality(); //查询专业
  },
  methods: {
    showComponentInfo: function(type, info) {
      switch (type) {
        case "edit":
          this.edit(JSON.parse(JSON.stringify(info)));
          break;
        case "add":
          this.dialogVisible = true;
          this.addForm.title = "添加专业";
          break;
        case "deleteAll":
          if (info.length == 0) {
            this.$message.warning("请勾选要删除的目标");
            return false;
          }
          this.delete("list", info);
          break;
        case "delete":
          this.delete("one", info);
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
    getSysDepartmentList: function(
      departmentName = null,
      collegeId = -1,
      target = "departmentList"
    ) {
      sysDepartmentPage({ collegeId, departmentName })
        .then(res => {
          this[target] = res.data.pageData;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取专业信息
    querySpeciality: function(pageIndex =1) {
      let data = {
        pageIndex,
        departmentId: this.searchForm.departmentId || -1,
        collegeId: this.searchForm.collegeId || -1,
        specialityName: this.searchForm.searchKey || null
      };
      sysSpecialityPage(data)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data;
          } else {
            this.errMsg(res.msg);
          }
        })
        .catch(error => {
          this.errMsg(error.msg);
        });
    },
    //查询条件清空
    queryClear(target) {
      (this.searchForm[target] = ""),
        (this.searchForm.searchKey = ""),
        this.querySpeciality();
    },
    save: function() {
      this.$refs["id_addForm"].validate(valid => {
        if (valid) {
          if (this.addForm.title !== "添加专业") {
            sysSpecialityEdit(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("修改成功");
                  this.handleClose();
                  this.querySpeciality();
                } else {
                  this.errMsg(res.msg);
                }
              })
              .catch(error => {
                this.errMsg(res.msg);
              });
          } else {
            sysSpeciality(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("添加成功");
                  this.handleClose();
                  this.querySpeciality();
                } else {
                  this.errMsg(res.msg);
                }
              })
              .catch(error => {
                this.errMsg(error.msg);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    delete: function(type, specialityList) {
      let specialityLists = [];
      if (type === "list") {
        specialityList.filter(item => {
          specialityLists.push(parseInt(item.specialityId));
        });
      } else {
        specialityLists.push(specialityList.specialityId);
      }
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysSpecialityDelete(specialityLists)
            .then(res => {
              console.log(res);
              if (res.code === 200) {
                this.successMsg("删除成功");
                this.querySpeciality();
              } else {
                this.errMsg(res.msg);
              }
            })
            .catch(error => {
              this.errMsg(error.msg);
            });
        })
        .catch(() => {});
    },
    edit: function(info) {
      this.dialogVisible = true;
      this.addForm.title = "编辑专业";
      this.getSysDepartmentList(null, info.collegeId, "AddDepartmentList");
      this.addForm.data = info;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs["id_addForm"].resetFields();
      this.addForm.teacherName = "";
      this.addForm.data.departmentId = null;
      this.addForm.data.collegeId = null;
      this.addForm.data.specialityName = "";
      this.addForm.data.specialityId = "";
      this.addForm.data.manager = [];
      this.AddDepartmentList = [];
    },
    handleCurrentChange: function(number) {
      this.querySpeciality(number);
    },
    successMsg(msg) {
      this.$message({
        message: msg,
        type: "success"
      });
    },
    errMsg(msg) {
      this.$message.error(getErrorMsg(msg));
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
            this.errMsg(res.msg);
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
  },
  watch: {},
  mounted: function() {}
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
