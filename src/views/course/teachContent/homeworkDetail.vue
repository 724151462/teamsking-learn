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
      <template></template>
      <div class="dialog-header" slot="header">
        <span>陈晓霞</span>
        <el-button type="warning" size="small">打回作业</el-button>
      </div>
    </adialog>
  </div>
</template>

<script>
import tableNoHeader from "@/components/table-no-header.vue";
import adialog from "@/components/dialog";
import { homeWorkDetail } from "@/api/course";
export default {
  data() {
    return {
      tables: [
        {
          name: "作业名称",
          prop: "title"
        },
        {
          name: "学生名称",
          prop: "interactionStatus"
        },
        {
          name: "状态",
          prop: "expireTime"
        },
        {
          name: "班组",
          prop: "submitStatus"
        },
        {
          name: "提交时间",
          prop: "submitStatus"
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
        title: "查看笔记",
        width: "40",
        labelWidth: "120",
        top: "20",
        inputWidth: "70",
        eventType: ""
      },
      formData: [
        {
          key: "作业名称:",
          inputType: "info",
          value: "notesTitle"
        },
        {
          key: "状态:",
          inputType: "info",
          value: "fbr"
        },
        {
          key: "学生答案：",
          inputType: "info",
          value: "fbsj"
        },
        {
          key: "提交时间：",
          inputType: "info",
          value: "notesContent"
        },
        {
          key: "老师评分",
          inputType: "string",
          value: "score"
        },
        {
          key: "评分参照",
          inputType: "tip",
          value: "tip"
        },
        {
          key: "老师评语",
          inputType: "textarea",
          value: "pingyu"
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
      }
    };
  },
  created() {
    this.$emit("teachingNav", "operation");
  },
  mounted() {
    homeWorkDetail({ homeworkId: this.$route.query.homeworkId }).then(response => {
      this.tableData = response.data.homeworkMarks;
      console.log(this.tableData);
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
          // this.$route.push
          // this.show = true
          break;

        default:
          break;
      }
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

