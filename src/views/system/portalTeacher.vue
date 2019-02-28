<template>
  <div class="portalTeacher">
    <div style="height: 50px; line-height: 50px">
      <span>提示：最多添加8位推荐教师</span>
      <el-button style="float: right;margin-right: 50px" type="primary" @click="addTeacher">添加</el-button>
    </div>

    <table-wjx
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-wjx>
    <el-dialog title="添加教师" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="选择教师">
          <el-select v-model="form.sourceIds">
            <el-option
              v-for="item in options"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
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
import tableWjx from "../../components/table-wjx";

import { teacherRecList, teacherAllList, recAdd, recMod } from "../../api/system";

export default {
  components: {
    tableWjx
  },
  data() {
    return {
      dialogVisible: false,
      activeIndex: "2",
      tableTitle: "名师列表",
      tableData3: [],
      columnNameList: [
        {
          type: "index"
        },
        {
          name: "老师头像",
          prop: "avatar",
          imgList: {}
        },
        {
          name: "老师姓名",
          prop: "teacherName"
        },
        {
          name: "老师简介",
          prop: "synopsis"
        }
      ],
      operateList: [
        {
          content: "重新选择",
          type: "edit"
        }
      ],
      tableOperate: [],
      form: {
        recommendType: 20,
        sourceIds: []
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
        case 'edit':
          this.edit(info);
          break;
      //   case 'add':
      //     this.appendNewAcademy(info);
      //     break;
      //   case 'deleteAll':
      //     this.deleteAcademy('list',info);
      //     break;
      //   case 'delete':
      //     this.deleteAcademy('one',info);
      //     break;
      }
    },
    edit(info) {
      this.btnType = 'edit'
      this.temId = String(info.recommendId)
      this.dialogVisible = true
    },
    addTeacher() {
      this.btnType = 'add'
      this.dialogVisible = true
    },
    ensureBtn() {
      if (this.btnType === "add") {
        if(this.tableData3.length >= 8) {
          this.$message({
            message: '最多添加8位教师，您可以尝试替换教师',
            type: 'warning'
          })
          this.dialogVisible = false
          return
        }
        console.log(this.form)
        this.form.sourceIds = [this.form.sourceIds]
        recAdd(this.form)
          .then(response => {
            if (response.code === 200) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getRecList()
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
        let sourceId =Number(this.form.sourceIds)
        // 旧值
        let targetRecommendId = this.temId
        let form = {
          recommendType: 20,
          sourceId,
          targetRecommendId
        }
        console.log(form)
        recMod(form)
          .then(response => {
            if (response.code === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.getRecList()
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
      teacherRecList()
      .then(res => {
        console.log("res", res);
        res.data.page.pageData.forEach(element => {
          console.log(element.avatar);
          element.avatar = [{ imgUrl: element.avatar }];
        });
        this.tableData3 = res.data.page.pageData;
      })
    }
  },
  created: function() {
    this.getRecList()
    teacherAllList().then(response => {
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
