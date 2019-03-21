<template>
  <div class="academy">
    <header-the-again headerTitle="院管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="form.collegeName" placeholder="学院名称" style="width:230px"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="queryAcademy"
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
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="addForm.data" ref="addForm" label-width="100px">
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
            <i class="el-icon-remove" style="font-size: 20px;vertical-align: middle;margin-left: 10px;color:#f56c6c"></i>
          </p>
        </el-form-item>
        <el-form-item label="负责人：">
          <el-autocomplete
            class="input-pop"
            suffix-icon="el-icon-search"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            v-model="addForm.data.teacherName"
            placeholder="输入名字查找教师"
            clearable
          ></el-autocomplete>
          <span style="display:inline-block;margin-left:10px">
            <span style="color:red">0</span>/5
          </span>
        </el-form-item>
      </el-form>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red"></span>
          <span>院负责人：</span>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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

export default {
  name: "",
  data() {
    return {
      academySelectList: [],
      form: {
        pageIndex: 1,
        collegeName: ""
      },
      addForm: {
        title: "添加院系",
        data: {
          collegeName: "",
          teacherName: "",
          manager: [
            {
              realName: "",
              userId: "",
              workNumber: ""
            }
          ]
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
      console.log("父组件接收到的类型：", type + "父组件接收到的信息：", info);
      switch (type) {
        case "check":
          console.log("checkInfo", info);
          // this.check(info);
          break;
        case "edit":
          this.edit(info);
          break;
        case "add":
          this.appendNewAcademy(info);
          break;
        case "deleteAll":
          this.deleteAcademy(info);
          break;
        case "delete":
          this.deleteAcademy(info);
          break;
      }
    },
    save: function() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // this.popError = "";
      // //  this.blurFunction(this.addForm.data.manager.length-1);
      // // this.blurFunction()?"":reuturn;
      // if (this.blurFunction()) {
      //   if (this.popError !== "") return;
      //   //检测manager中的信息
      //   for (let i = this.addForm.data.manager.length - 1; i >= 0; i--) {
      //     if (
      //       this.addForm.data.manager[i].realName === "暂无此负责人" ||
      //       this.addForm.data.manager[i].realName === ""
      //     ) {
      //       this.addForm.data.manager.splice(i, 1);
      //     }
      //   }
      //   //console.log('manager信息:',this.addForm.data.manager);
      //   if (this.addForm.data.collegeId !== "") {
      //     // this.dialogVisible = false;
      //     // console.log( "提交信息:", this.addForm.data );
      //     sysCollegeEdit(this.addForm.data)
      //       .then(res => {
      //         if (res.code === 200) {
      //           this.successMsg("编辑成功");
      //           closePop();
      //         } else {
      //           this.popError = "编辑失败：" + res.msg;
      //           this.errMsg();
      //         }
      //         console.log("编辑成功与否", res);
      //       })
      //       .catch(error => {
      //         this.popError = "编辑失败：" + error;
      //         this.errMsg();
      //       });
      //   } else {
      //     // this.dialogVisible = false;
      //     sysCollege(this.addForm.data)
      //       .then(res => {
      //         if (res.code === 200) {
      //           this.successMsg("添加成功");
      //           closePop();
      //         } else {
      //           this.errMsg("添加失败");
      //         }
      //       })
      //       .catch(error => {
      //         this.popError = "添加失败：" + error;
      //         this.errMsg();
      //       });
      //   }

      //   let that = this;
      //   function closePop() {
      //     that.dialogVisible = false;
      //     that.queryAcademy();
      //   }
      // }
    },
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
                this.popError = "删除失败";
                this.errMsg("删除失败");
              }
            })
            .catch(error => {
              this.popError = "删除失败:" + error;
              this.errMsg();
            });
        })
        .catch(() => {});
    },
    queryAcademy: function(pageSize = 10) {
      let data = {
        pageSize,
        pageIndex: this.form.pageIndex,
        collegeName: this.form.collegeName
      };
      sysCollegePage(data)
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
    appendNewAcademy: function() {
      this.dialogVisible = !this.dialogVisible;
      this.addForm.title = "添加学院";
      this.addForm.data.collegeId = "";
      this.addForm.data.collegeName = "";
      this.addForm.data.manager = [{ realName: "", userId: 1, workNumber: "" }];
    },
    edit: function(info) {
      this.dialogVisible = !this.dialogVisible;
      this.addForm.title = "编辑院信息";
      this.addForm.data.collegeId = info.collegeId;
      this.addForm.data.tenantId = "";
      this.addForm.data.collegeName = info.collegeName;
      this.addForm.data.manager =
        info.manager.length === 0
          ? [{ realName: "", userId: "", workNumber: "" }]
          : info.manager;
    },
    blurFunction: function(id, index) {
      //console.log("失去焦点执行函数");
      this.popError = "";
      let a = this.addForm.data.manager.filter((element, index, arr) => {
        //this.queryWorkNumber(element.workNumber);
        if (element.workNumber === "") return false;
        for (let i = index + 1; i < arr.length; i++) {
          if (element.workNumber === arr[i].workNumber && index !== i)
            return true;
        }
        return false;
      });
      this.queryWorkNumber(id, index);
      if (a.length > 0) {
        this.popError = "院负责人不能重复";
        this.errMsg();
        return false;
      }
      return true;
    },
    queryWorkNumber: function(id, index) {
      //console.log("id:"+id);
      sysTenantTeacher(id)
        .then(res => {
          //console.log( '返回信息:' , res.data.realName,res.data.userId );
          this.addForm.data.manager[index].realName = res.data.realName;
          this.addForm.data.manager[index].userId = res.data.userId;
        })
        .catch(() => {
          //console.log(error);
          this.addForm.data.manager[index].realName = "暂无此负责人";
        });
    },
    handleClose(done) {
      done();
    },
    handleCurrentChange: function(number) {
      this.form.pageIndex = number;
      this.queryAcademy();
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
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
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
