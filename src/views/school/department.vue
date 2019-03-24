<template>
  <div class="academy">
    <header-the-again headerTitle="系管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchKey" style="width: 230px;margin-left: 10px;" placeholder="系名称"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="queryDepartment(1,searchKey)"
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
          @change="(value)=>{
            if(value !== ''){
              queryDepartment(1,null,value)
            }
          }"
          @clear="queryDepartment"
          filterable
          clearable
          v-model="collegeId"
          class="my-select"
          placeholder="院"
        >
          <el-option
            v-for="item in departmentSelectList"
            :key="item.collegeId"
            :label="item.collegeName"
            :value="item.collegeId"
          ></el-option>
        </el-select>
      </template>
    </table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="tableData.totalPage"
      :current-page="tableData.pageIndex"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 添加，编辑的弹窗 -->
    <el-dialog
      :title="addForm.title"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="addForm.data" ref="id_addForm" label-width="100px">
        <el-form-item label="学院：">
          <el-select
            @clear="()=>{this.addForm.data.collegeId = null}"
            filterable
            clearable
            v-model="addForm.data.collegeId"
            placeholder="请选择院"
          >
            <el-option
              v-for="item in departmentAddList"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请填写系名称',trigger: 'blur'}]"
          label="系："
          prop="departmentName"
        >
          <el-input
            require
            class="input-pop"
            v-model="addForm.data.departmentName"
            placeholder="请填写院"
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

import {
  sysTeacherPage,
  sysCollegeList,
  sysDepartmentPage,
  sysDepartment,
  sysDepartmentEdit,
  sysDepartmentDelete
} from "../../api/school";
import { getErrorMsg } from "../../utils/utils";

export default {
  name: "",
  data() {
    return {
      departmentSelectList: [], //表格筛选时用的院列表
      departmentAddList: [], //添加 || 编辑时用的院列表
      searchKey: "",
      collegeId: "",
      addForm: {
        title: "添加系",
        teacherName: "",
        data: {
          collegeId: "",
          departmentId: "",
          departmentName: "",
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
          name: "院名称",
          prop: "collegeName",
          slot: true,
          select: false,
          minWidth: "200"
        },
        {
          name: "系名称",
          prop: "departmentName",
          minWidth: "200"
        },

        {
          name: "系负责人",
          minWidth: "130",
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
    this.getCollegeList();
    this.queryDepartment();
  },
  methods: {
    showComponentInfo: function(type, info) {
      switch (type) {
        case "edit":
          this.edit(JSON.parse(JSON.stringify(info)));
          break;
        case "add":
          this.dialogVisible = true;
          this.addForm.title = "添加系";
          break;
        case "deleteAll":
          this.deleteDepartment(info);
          break;
        case "delete":
          this.deleteDepartment(info);
          break;
      }
    },
    //获取院列表
    getCollegeList: function() {
      sysCollegeList()
        .then(res => {
          this.departmentSelectList = res.data;
          this.departmentAddList = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取系数据
    queryDepartment: function(
      pageIndex = 1,
      departmentName = null,
      collegeId = -1
    ) {
      sysDepartmentPage({ collegeId, pageIndex, departmentName })
        .then(res => {
          // console.log(res);
          if (res.code === 200) {
            this.tableData = res.data;
          } else {
            this.errMsg(getErrorMsg(res.msg));
          }
        })
        .catch(error => {
          this.errMsg(getErrorMsg(res.msg));
        });
    },
    save: function() {
      this.$refs["id_addForm"].validate(valid => {
        if (valid) {
          if (this.addForm.title !== "添加系") {
            sysDepartmentEdit(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("修改成功");
                  this.handleClose();
                  this.queryDepartment();
                } else {
                  this.errMsg(getErrorMsg(res.msg));
                }
              })
              .catch(error => {
                this.errMsg(getErrorMsg(res.msg));
              });
          } else {
            sysDepartment(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("添加成功");
                  this.handleClose();
                  this.queryDepartment();
                } else {
                  this.errMsg(getErrorMsg(res.msg));
                }
              })
              .catch(error => {
                this.errMsg("添加失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    edit(info) {
      this.dialogVisible = true;
      this.addForm.title = "编辑系信息";
      this.addForm.data.departmentId = info.departmentId;
      this.addForm.data.departmentName = info.departmentName;
      this.addForm.data.collegeId = info.collegeId;
      this.addForm.data.manager = info.manager;
    },
    deleteDepartment: function(departmentList) {
      let departmentIdList = [];
      if (departmentList.length == 0) {
        this.$message.warning("请勾选要删除的目标");
        return false;
      }
      if (departmentList.collegeId) {
        departmentIdList.push(departmentList.departmentId);
      } else {
        departmentList.filter(item => {
          departmentIdList.push(parseInt(item.departmentId));
        });
      }
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysDepartmentDelete(departmentIdList)
            .then(res => {
              console.log("删除：", res);
              if (res.code === 200) {
                this.successMsg("删除成功");
                this.queryDepartment();
              } else {
                this.errMsg(getErrorMsg(res.msg));
              }
            })
            .catch(error => {
              this.errMsg(getErrorMsg(res.msg));
            });
        })
        .catch(() => {});
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
    handleClose() {
      this.dialogVisible = false;
      this.$refs["id_addForm"].resetFields();
      this.addForm.teacherName = "";
      this.addForm.data.departmentName = "";
      this.addForm.data.departmentId = null;
      this.addForm.data.collegeId = null;
      this.addForm.data.manager = [];
    },
    //分页改变
    handleCurrentChange: function(number) {
      this.queryDepartment(number, this.searchKey);
    },
    successMsg(msg) {
      this.$message.success(msg);
    },
    errMsg(msg) {
      this.$message.error(msg);
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
            this.errMsg("查询失败");
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
