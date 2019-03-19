<template>
  <div class="course">
    <header-the-again headerTitle="课程管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchForm.searchString" style="width:230px" placeholder="课程名称/课程ID"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="courseSearch"
        >查询</el-button>
      </div>
    </header-the-again>
    <Dialog :dialogConfig="dialogConfig" :formData="formData" :dataObj="dataObj" :show.sync="show"></Dialog>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="5"
      @current-change="pageChange"
    ></el-pagination>

    <el-dialog title="课程评价详情" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      {{ this.popContentItem }}
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "@/components/header-theAgain";
import Dialog from "@/components/dialog";
import { getErrorMsg } from "@/utils/utils";
import { sysCoursePage, sysCourseId } from "@/api/school";
import { courseDel } from "@/api/course";
export default {
  name: "",
  data() {
    return {
      form: {
        appraisal: "",
        catagory: "",
        teacher: ""
      },
      // 分页
      totalCount: 0,
      searchForm: {
        pageIndex: 1,
        searchString: "",
        pageSize: 10
      },
      dialogVisible: false,
      // 对话框
      dialogConfig: {
        btnShow: false,
        title: "",
        width: "60",
        labelWidth: "120",
        inputWidth: "70",
        top: "10"
      },
      tableOperate: [
        {
          content: "+添加课程",
          type: "add"
        }
      ],
      formData: [
        {
          key: "课程名称：",
          inputType: "string",
          value: "courseName"
        },
        {
          key: "课程价格：",
          inputType: "string",
          value: "coursePrice"
        },
        {
          key: "课程分类：",
          inputType: "string",
          value: "courseCategory"
        },
        {
          key: "开课时间：",
          inputType: "string",
          value: "beginTime"
        },
        {
          key: "结课时间：",
          inputType: "string",
          value: "endTime"
        },
        {
          key: "课程人数：",
          inputType: "string",
          value: "userCount"
        },
        {
          key: "所属学校:",
          inputType: "string",
          value: "courseSchool"
        },
        {
          key: "选课开放范围：",
          inputType: "string",
          value: ""
        }
      ],
      dataObj: {},
      show: false,
      tableTitle: "课程管理列表",
      columnNameList: [
        {
          type: "selection"
        },
        {
          name: "课程名称",
          prop: "courseName",
          minWidth: "180"
        },
        {
          name: "一级分类",
          prop: "courseCategoryParentName",
          minWidth: "100"
        },
        {
          name: "二级分类",
          prop: "courseCategoryName",
          minWidth: "100"
        },
        {
          name: "开课时间",
          prop: "beginTime",
          minWidth: "130"
        },
        {
          name: "结课时间",
          prop: "endTime",
          minWidth: "130"
        },
        {
          name: "课程人数",
          prop: "userCount",
          width: "80"
        }
      ],
      operateList: [
        {
          content: "查看",
          type: "check"
        },
        {
          content: "删除",
          type: "delete"
        }
      ],
      tableData3: [],
      popContentItem: [],
      textarea: ""
    };
  },
  mounted() {
    this.getCoursePage();
  },
  components: {
    tableTheAgain,
    Dialog,
    headerTheAgain
  },
  methods: {
    // 页码改变
    pageChange(pageNum) {
      this.searchForm.pageIndex = pageNum;
      this.getCoursePage();
    },
    // 查询课程
    courseSearch() {
      this.getCoursePage();
    },
    // 列表请求
    getCoursePage() {
      sysCoursePage(this.searchForm).then(response => {
        this.tableData3 = response.data.pageData;
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
          this.dialogConfig = {
            btnShow: false,
            title: "查看课程"
          };
          sysCourseId(info.courseId).then(response => {
            this.dataObj = this.handleData(response.data);
            this.dataObj.courseSchool = "字段未知";
            console.log(response);
          });
          this.show = true;
          break;
        case "delete":
          if (Number(info.courseStatus == 40) || info.courseStatus == 10) {
            this.$confirm("删除课程？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.delCourse(info.courseId);
              })
              .catch(() => {});
          }else{
            this.$message.warning('只有未发布和已关闭的课程可以删除');
          }
          break;
        case "add":
          this.$router.push("/course/addcourse");
          break;
      }
    },
    check: function() {
      this.dialogVisible = !this.dialogVisible;
    },
    //删除课程
    delCourse(id) {
      courseDel([id]).then(response => {
        if (response.code === 200) {
          this.$message.success('删除成功');
          this.getCoursePage();
        } else {
          this.$message.error(getErrorMsg(response.msg));
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onSubmit: function() {
      console.log("onSubmit!!");
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.el-pagination {
  margin: 20px 2.5% 0 0;
  display: flex;
  justify-content: flex-end;
  width: 95%;
}
</style>
