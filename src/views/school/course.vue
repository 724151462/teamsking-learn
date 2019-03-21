<template>
  <div class="course">
    <header-the-again headerTitle="课程管理">
      <div style="display:inline-block;position: relative;">
        <el-input v-model="searchForm.courseName" style="width:230px" placeholder="输入课程名称搜索"></el-input>
        <el-button
          type="primary"
          style="position: absolute;right:0;border-radius: 0;"
          @click="courseSearch"
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
    ></table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="pageChange"
    ></el-pagination>

    <el-dialog
      :visible.sync="show"
      width="350px"
      style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
    >
      <div style="width:280px;margin: 0 auto">
        <img :src="courseInfo.courseCover" width="280" height="160" alt>
        <p style="margin: 10px 0">课程名称：{{courseInfo.courseName}}</p>
        <p style="margin: 10px 0">一级分类：{{courseInfo.courseCategoryParentName}}</p>
        <p
          style="margin: 10px 0"
          v-show="courseInfo.courseCategoryName"
        >二级分类：{{courseInfo.courseCategoryName}}</p>
        <p style="margin: 10px 0">学生人数：{{courseInfo.userCount}}</p>
        <p style="margin: 10px 0">当前状态：{{courseInfo.courseStatus | reallyStatus}}</p>
        <p style="margin: 10px 0">开始时间：{{courseInfo.beginTime}}</p>
        <p style="margin: 10px 0">结束时间：{{courseInfo.endTime}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "@/components/header-theAgain";
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
        courseName: "",
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
      courseInfo: {
        beginTime: "2018-12-12",
        courseCategoryName: "高斯数学",
        courseCategoryParentName: "数学",
        courseCover:
          "http://tskedu-course.oss-cn-beijing.aliyuncs.com/154850266372770334.jpeg",
        courseId: "059d392723b647b1b3489747ea554185",
        courseName: "uu",
        courseStatus: 30,
        difficultyStatus: 10,
        endTime: "2019-09-20",
        userCount: 1
      },
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
          name: "学生人数",
          prop: "userCount",
          width: "80"
        }
      ],
      operateList: [
        {
          content: "编辑",
          type: "edit"
        },
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
  filters: {
    reallyStatus: function(value) {
      switch (value) {
        case 10:
          return "未发布";
          break;
        case 20:
          return "预发布";
          break;
        case 30:
          return "已发布";
          break;
        case 40:
          return "已关闭";
          break;
        case 50:
          return "已归档";
          break;
        default:
          break;
      }
    }
  },
  components: {
    tableTheAgain,
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
      sysCoursePage(this.searchForm)
        .then(response => {
          this.tableData3 = response.data.pageData;
          this.totalCount = Number(response.data.totalCount);
        })
        .catch(err => {
          this.$message.error("数据获取失败");
        });
    },
    showComponentInfo: function(type, info) {
      // console.log(
      //   "父组件接收到的类型：" , type , "父组件接收到的信息：" , info
      // );
      switch (type) {
        case "check":
          this.courseInfo = info;
          this.show = true;
          break;
        case "edit":
          this.$confirm("前往编辑课程："+info.courseName, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$router.push({
                path: "/course/addCourse",
                query: {
                  type: "upData",
                  courseId: info.courseId
                }
              });
            })
            .catch(() => {});
          break;
        case "delete":
          if (Number(info.courseStatus == 40) || info.courseStatus == 10) {
            this.$confirm("删除课程："+info.courseName, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.delCourse(info.courseId);
              })
              .catch(() => {});
          } else {
            this.$message.warning("只有未发布和已关闭的课程可以删除");
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
          this.$message.success("删除成功");
          this.getCoursePage();
        } else {
          this.$message.error(getErrorMsg(response.msg));
        }
      });
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
