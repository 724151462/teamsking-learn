<template>
  <div>
    <div>
      <tableNoHeader
        :tableData="tableData"
        :tables="tables"
        :buttonStylus="sysButton"
        @showComponentInfo="showComponentInfo"
      ></tableNoHeader>
    </div>
    <el-dialog :visible.sync="show" title="全部回答">
      <div v-for="(answer, index) in answerList" :key="index">
        <div class="content">
          <div style="display: flex">
            <div>
              <img :src="require('@/assets/images/vote.png')" :width="50" alt>
            </div>
            <div class="student">
              <p>{{answer.realName}}</p>
              <p>回答内容：{{answer.stormContent}}</p>
            </div>
          </div>

          <div>
            <el-button size="small" @click="addScore(answer)">加分</el-button>
          </div>
        </div>
        <span style="float:right">回答日期：{{answer.createTime}}</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableNoHeader from "@/components/table-no-header.vue";
import { interactList, interactBS, stormAddScore } from "@/api/course";
export default {
  data() {
    return {
      stormParams: { courseId: this.$route.query.id },
      tables: [
        {
          name: "题目",
          prop: "interactionName"
        },
        {
          name: "状态",
          prop: "interactionStatus"
        },
        {
          name: "已作答/应作答",
          prop: "answerStatus"
        },
        {
          name: "截止时间",
          prop: "endTime"
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
          type: "view"
        }
      ],
      answerList: [],

      // 对话框
      show: false
    };
  },
  created() {
    this.$emit("teachingNav", "storm");
  },
  mounted() {
    interactList(this.stormParams).then(response => {
      let stormArr = [];
      response.data.forEach(element => {
        element.interactions.forEach(item => {
          if (item.interactionType === 50) {
            console.log("item.interactionStatus", item.interactionStatus);
            item.answerStatus = `?/${item.userCount}`;
            item.endTime = "?";
            switch (item.interactionStatus) {
              case 10:
                item.interactionStatus = "已开始";
                break;
              case 20:
                item.interactionStatus = "未开始";
                break;
              case 30:
                item.interactionStatus = "已结束";
                break;
              default:
                break;
            }

            stormArr.push(item);
          }
        });
      });
      this.tableData = stormArr;
    });
  },
  components: {
    tableNoHeader
  },
  methods: {
    showComponentInfo(...params) {
      let type = params[0];
      console.log(type);
      switch (type) {
        case "view":
          interactBS({ stormId: params[1].interactionId }).then(response => {
            this.answerList = response.data;
          });
          this.show = true;
          break;

        default:
          break;
      }
    },
    addScore(answer) {
      console.log(answer.id);
      stormAddScore({ recordId: answer.id }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "加分成功",
            type: "success"
          });
        }
      });
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

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .student {
    margin-left: 12px;
  }
}
</style>

