<template>
  <div class="portalTeacher">
    <div style="height: 50px; line-height: 50px">
      <span>提示：最多添加4门推荐课程</span>
      <el-button style="float: right;margin-right: 50px" type="primary" @click="addCourse">添加</el-button>
    </div>

    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="recommendData"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-the-again>

    <el-dialog title="添加课程" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="选择课程">
          <el-select v-model="form.sourceIds">
            <el-option
              v-for="item in options"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";

import {
  courseRecList,
  courseAllList,
  recRemove,
  recAdd,
  recMod
} from "../../api/system";

export default {
  components: {
    tableTheAgain
  },
  data() {
    return {
      dialogVisible: false,
      activeIndex: "2",
      tableTitle: "课程列表",
      recommendData: [],
      columnNameList: [
        {
          type: "index"
        },
        {
          name: "课程名称",
          prop: "courseName"
        },
        {
          name: "讲师",
          prop: "instructorName"
        }
      ],
      operateList: [
        {
          content: "重新选择",
          type: "edit"
        },
        {
          content: "删除",
          type: "delete"
        }
      ],
      tableOperate: [
        {
          content: "+添加",
          type: "add"
        }
      ],
      form: {
        recommendType: 10,
        sourceIds: ""
      },
      options: [],
      btnType: "",
      temId: ""
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    showComponentInfo: function(type, info) {
      // console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
      switch (type) {
        case "edit":
          this.edit(info);
          break;
        case "add":
          this.appendNewAcademy(info);
        case "delete":
          recRemove({ recommendType: 10, recommendId: info.recommendId }).then(
            response => {
              if (response.code === 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getRecList();
              }
            }
          );
          break;
      }
    },
    edit(info) {
      this.btnType = "edit";
      this.temId = String(info.recommendId);
      this.dialogVisible = true;
    },
    addCourse() {
      this.btnType = "add";
      this.dialogVisible = true;
    },
    ensureBtn() {
      if (this.btnType === "add") {
        if (this.recommendData.length >= 4) {
          this.$message({
            message: "最多添加4门课程，您可以尝试替换课程",
            type: "warning"
          });
          this.dialogVisible = false;
          return;
        }
        console.log(this.form);
        let form = {
          sourceIds: [this.form.sourceIds],
          recommendType: 10
        };
        recAdd(form)
          .then(response => {
            if (response.code === 200) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getRecList();
            } else if (response.code === 1000) {
              this.$message({
                message: response.msg,
                type: "warning"
              });
            }
            this.dialogVisible = false;
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "danger"
            });
          });
      } else {
        // 新值
        let sourceId = this.form.sourceIds;
        // 旧值
        let targetRecommendId = this.temId;
        let form = {
          recommendType: 10,
          sourceId,
          targetRecommendId
        };
        console.log(this.form.sourceIds);
        recMod(form)
          .then(response => {
            if (response.code === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.getRecList();
            } else if (response.code === 1000) {
              this.$message({
                message: response.msg,
                type: "warning"
              });
            }
            this.dialogVisible = false;
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "danger"
            });
          });
      }
    },
    getRecList() {
      courseRecList().then(res => {
        console.log("res", res);
        this.recommendData = res.data.page.pageData;
      });
    }
  },
  created: function() {
    this.getRecList();
    courseAllList().then(response => {
      this.options = response.data.pageData;
    });
  }
};
</script>
<style scoped>
.portalTeacher {
  margin-top: 20px;
}
</style>
