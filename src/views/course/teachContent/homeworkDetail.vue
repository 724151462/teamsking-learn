<template>
  <div>
    <div style="float: right" class="margin-sides">
      <el-select v-model="filter.group" class="margin-sides">
        <el-option
          v-for="(group, index) in groups"
          :key="index"
          :label="group.name"
          :value="group.value"
        ></el-option>
      </el-select>
      <el-select v-model="filter.status" class="margin-sides">
        <el-option
          v-for="(group, index) in status"
          :key="index"
          :label="group.name"
          :value="group.value"
        ></el-option>
      </el-select>
      <el-input suffix-icon="el-icon-search" style="width: 200px" placeholder="姓名/作业名称"></el-input>
      <el-button>搜索</el-button>
    </div>
    <tableNoHeader
      :tableData="tableData"
      :tables="tables"
      :buttonStylus="sysButton"
      @showComponentInfo="showComponentInfo"
    ></tableNoHeader>
    <adialog
      :dialogConfig="dialogConfig"
      :dataObj="dataObj"
      :formData="formData"
      @showComponentInfo="showComponentInfo"
      :show.sync="show"
    >
      <div class="dialog-header" slot="header">
        <span>{{dataObj.userName}}</span>
        <el-button type="warning" size="small" @click="repulse">打回作业</el-button>
      </div>
    </adialog>
  </div>
</template>

<script>
import tableNoHeader from "@/components/table-no-header.vue";
import adialog from "@/components/dialog";
import { 
  homeWorkAnswerList,
  homeWorkRepulse,
  homeWorkScore
} from "@/api/course";
export default {
  data() {
    return {
      tables: [
        {
          name: "学生/小组",
          prop: "userName"
        },
        {
          name: "状态",
          prop: "reviewStatus"
        },
        {
          name: "班组",
          prop: "teamName"
        },
        {
          name: "提交时间",
          prop: "createTime"
        }
      ],
      tableData: [
        {
          zyname: "资源名",
          notesTitle: "笔记标题1",
          notesContent: "<p>笔记内容</p>",
          fbr: "发布人",
          fbsj: "2018-1-1",
          popover: "dsawf"
        },
        {
          zyname: "资源名",
          notesTitle: "笔记标题",
          notesContent: "笔记内容",
          fbr: "发布人",
          fbsj: "2018-1-1",
          popover: "twqfwq"
        }
      ],
      sysButton: [
        {
          name: "查看详情",
          type: "mark"
        }
      ],

      filter: {
        group: "",
        status: ""
      },
      groups: [
        {
          name: "第一小组",
          value: "1",
          member: [
            {
              name: "小明",
              status: 1
            }
          ]
        }
      ],
      status: [
        {
          name: "待批改",
          value: 1
        },
        {
          name: "已批改",
          value: 2
        }
      ],
      show: false,
      dialogConfig: {
        btnShow: true,
        title: "查看作业",
        width: "40",
        labelWidth: "120",
        top: "20",
        inputWidth: "70",
        eventType: "give a mark"
      },
      formData: [
        {
          key: "状态:",
          inputType: "info",
          value: "reviewStatus"
        },
        {
          key: "学生答案：",
          inputType: "info",
          value: "content"
        },
        {
          key: "提交时间：",
          inputType: "info",
          value: "createTime"
        },
        {
          key: "老师评分",
          inputType: "string",
          value: "score"
        },
        {
          key: "评分参照",
          inputType: "tip",
          value: "homeworkMarkEntity",
        },
        {
          key: "老师评语",
          inputType: "textarea",
          value: "markContent"
        }
      ],
      dataObj: {
        notesTitle: "笔记123",
        fbr: "小明",
        fbsj: "2018-11-29",
        notesContent: "werwrq",
        mark: "",
        tip: [{ content: "评分点1 <span>4分</span>" }, { content: "评分点2" }],
        pingyu: "gewjigovfjqwehgw"
      },
      // 作业id
      homeworkSubmissionId: ''
    };
  },
  created() {
    this.$emit("teachingNav", "operation");
  },
  mounted() {
    homeWorkAnswerList({ courseId: this.$route.query.id, homeworkId: this.$route.query.homeworkId }).then(response => {
      response.data.forEach(element => {
        element.reviewStatus= element.reviewStatus === 1 ? "未批阅" : (element.reviewStatus===2?"已批阅":"未提交")
      });
      this.tableData = response.data;
      // console.log(this.tableData);
    });
  },
  components: {
    tableNoHeader,
    adialog
  },
  methods: {
    showComponentInfo(...params) {
      let type = params[0];
      console.log(type);
      switch (type) {
        case "mark":
          this.homeworkSubmissionId = params[1].homeworkSubmissionId
          this.dataObj = params[1]
          this.show = true
          break;
        case "give a mark":
          let commitObj = {}
          let tem = JSON.stringify(this.dataObj)
          commitObj = JSON.parse(tem)
          commitObj.reviewStatus = commitObj.reviewStatus === "未批阅" ? 1 : (commitObj.reviewStatus==="已批阅"? 2 : 3)
          homeWorkScore(commitObj)
          break;
        default:
          break;
      }
    },
    // 打回作业
    repulse() {
      console.log(this.homeworkSubmissionId)
      homeWorkRepulse({homeworkSubmissionId: this.homeworkSubmissionId})
      .then(response=> {
        if(response.code === 200) {
          this.$message({
            message: '已打回作业',
            type: 'success'
          })
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  margin: 10px auto;
  padding: 10px;
  border-top: 1px solid rgb(233, 233, 233);
  border-bottom: 1px solid rgb(233, 233, 233);
}
</style>

