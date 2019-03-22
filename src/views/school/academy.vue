<template>
  <div class="academy">
    <header-the-again headerTitle="院管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchKey" placeholder="学院名称" style="width:230px"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="queryAcademy(1,searchKey)"
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
    ></table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
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
          :rules="[{ required: true, message: '请填写学院名称',trigger: 'blur'}]"
          label="学院："
          prop="collegeName"
        >
          <el-input
            require
            class="input-pop"
            v-model="addForm.data.collegeName"
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
  sysCollegePage,
  sysCollege,
  sysTeacherPage,
  sysCollegeDelete,
  sysTenantTeacher,
  sysCollegeEdit,
  sysCollegeList
} from "../../api/school";
import { truncate, truncateSync } from "fs";
import { getErrorMsg } from "@/utils/utils";
export default {
  name: "",
  data() {
    return {
      academySelectList: [],
      searchKey: "",
      addForm: {
        title: "添加学院",
        teacherName: "",

        data: {
          collegeName: "",
          manager: []
        }
      },
      tableData: {},
      dialogVisible: false,
      tableTitle: "院列表",
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
        // {
        //   name: "编号",
        //   prop: "collegeId",
        //   width: ''
        // },
        {
          name: "学院",
          prop: "collegeName"
        },
        {
          name: "学院负责人",
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
    this.queryAcademy();
  },
  methods: {
    showComponentInfo: function(type, info) {
      // console.log("父组件接收到的类型：", type + "父组件接收到的信息：", info);
      switch (type) {
        case "edit":
          this.dialogVisible = true;
          this.addForm.title = "编辑院信息";
          this.addForm.data.collegeId = info.collegeId;
          this.addForm.data.collegeName = info.collegeName;
          this.addForm.data.manager = info.manager;
          break;
        case "add":
          this.dialogVisible = true;
          this.addForm.title = "添加学院";
          break;
        case "deleteAll":
          this.deleteAcademy(info);
          break;
        case "delete":
          this.deleteAcademy(info);
          break;
      }
    },
    //保存 || 修改学院
    save: function() {
      this.$refs["id_addForm"].validate(valid => {
        if (valid) {
          if (this.addForm.title !== "添加学院") {
            sysCollegeEdit(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("修改成功");
                  this.handleClose();
                  this.queryAcademy();
                } else {
                  this.errMsg(getErrorMsg(res.msg));
                }
                console.log("编辑成功与否", res);
              })
              .catch(error => {
                this.errMsg(getErrorMsg(res.msg));
              });
          } else {
            // this.dialogVisible = false;
            sysCollege(this.addForm.data)
              .then(res => {
                if (res.code === 200) {
                  this.successMsg("添加成功");
                  this.handleClose();
                  this.queryAcademy();
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
    // 删除 || 批量删除
    deleteAcademy: function(academyList) {
      let academyIdList = [];
      if (academyList.length == 0) {
        return false;
      }
      if (academyList.collegeId) {
        academyIdList.push(academyList.collegeId);
      } else {
        academyList.filter(item => {
          academyIdList.push(parseInt(item.collegeId));
        });
      }
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysCollegeDelete(academyIdList)
            .then(res => {
              if (res.code === 200) {
                this.successMsg("删除成功");
                this.queryAcademy();
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
    //查询租户下的分院
    queryAcademy: function(pageIndex = 1, collegeName = "") {
      sysCollegePage({ pageIndex, collegeName })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data;
            // console.log('分页查询院信息:',res);
          } else {
            this.popError = "查询失败!!" + res.msg;
            this.errMsg();
          }
        })
        .catch(error => {
          this.popError = "查询失败!!" + error;
          this.errMsg();
        });
    },
    //关闭编辑弹窗
    handleClose() {
      this.dialogVisible = false;
      this.$refs["id_addForm"].resetFields();
      this.addForm.teacherName = "";
      this.addForm.data.collegeName = "";
      this.addForm.data.manager = [];
    },
    //分页改变
    handleCurrentChange: function(number) {
      this.queryAcademy(number);
    },
    successMsg(msg) {
      this.$message({
        message: msg,
        type: "success"
      });
    },
    errMsg(msg) {
      this.$message.error(msg);
    },
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
