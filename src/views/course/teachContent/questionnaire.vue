<template>
  <div>
    <!--加载动画-->
    <div v-show="showLoading">
      <div class="tq_loading__mask"></div>
      <div class="tq_loading-wrapper">
        <div class="tq_loading__loading-wrapper">
          <square :background="'#409eff'"></square>
        </div>
        <div class="tq_loading__text">
          正在加载
        </div>
      </div>
    </div>
    <itemTable
      :tableData="tableData"
      :tables="tables"
      :buttonStylus="tableStylus"
      @showComponentInfo="showComponentInfo"
    ></itemTable>
    <el-dialog :visible.sync="isDialog" width="60%" title="投票结果">
      <div class="main">
        <div class="header-container">
          <div>
            <img :src="require('@/assets/images/vote.png')" alt>
            <span style="margin: 0 20px 0 10px">投票进度</span>
            <span>共1道题 | 50人作答</span>
          </div>
        </div>
        <span style="color:rgb(130,178,198);float: right;margin-right:100px">提示：按照提交顺序排序</span>
        <template v-for="(item, index) in quesObj.voteQuizzes">
          <div style="margin-top: 20px" :key="item.quizId">
            <span>题目{{index+1}} {{item.quizTitle}}</span>
            <span style="color:rgb(130,178,198)">({{item.quizType===10 ? '单选题' : '多选题'}})</span>
          </div>
          <div class="answer-container" v-for="(subject, i) in item.voteQuizOptions" :key="i">
            <div class="answer-item">
              <span>{{subject.optionTitle}}</span>
              <div>
                <el-progress
                  :text-inside="true"
                  class="progress"
                  :stroke-width="18"
                  :percentage="subject.percent"
                ></el-progress>
                <span style="margin-left: 5px;color:rgb(130,178,198)">{{subject.userCount}}人</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import itemTable from "@/components/table-no-header.vue";
import { interactList, interactVote } from "@/api/course";
import { mapGetters } from "vuex";
import Square from "@/components/cubeShadow.vue";
export default {
  components: {
    itemTable,
    Square
  },
  data() {
    return {
      quesParams: { courseId: this.$route.query.id },
      quesObj: {},
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
        // {
        //   title: "投票问卷1",
        //   center: "所属章",
        //   fbr: "状态超好",
        //   time: "5/4"
        // },
        // {
        //   title: "投票问卷1",
        //   center: "所属章",
        //   fbr: "状态超好",
        //   time: "5/4"
        // },
        // {
        //   title: "投票问卷1",
        //   center: "所属章",
        //   fbr: "状态超好",
        //   time: "5/4"
        // }
      ],
      tableStylus: [
        {
          name: "查看详情",
          type: "detail"
        }
      ],
      isDialog: false,
      addUp: {
        title: "",
        center: ""
      }
    };
  },
  computed: {
    ...mapGetters(["showLoading"])
  },
  created() {
    this.$emit("teachingNav", "questionnaire");
  },
  mounted() {
    this.$store.commit("SHOWLOADING");
    interactList(this.quesParams).then(response => {
      let stormArr = [];
      response.data.forEach(element => {
        element.interactions.forEach(item => {
          if (item.interactionType === 60) {
            console.log("item.interactionStatus", item.interactionStatus);
            item.answerStatus = `?/${item.userCount}`;
            item.endTime = "?";
            item.interactionStatus =
              item.interactionStatus === 10
                ? "已开始"
                : item.interactionStatus === 20
                ? "未开始"
                : "已结束";
            stormArr.push(item);
          }
        });
      });
      this.tableData = stormArr;
      this.$store.commit("HIDELOADING");
    });
  },
  methods: {
    showComponentInfo(e, data) {
      console.log(e, data);
      switch (e) {
        case "detail":
          interactVote({ voteId: data.interactionId }).then(response => {
            this.quesObj = response.data;
          });
          this.isDialog = true;
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.header-container {
  display: flex;
  height: 50px;
  justify-content: space-between;
  padding: 10px 20px;

  div {
    display: flex;
    align-items: center;
  }

  img {
    width: 30px;
    height: 30px;
  }
}

.main {
  width: 90%;
  margin: 10px auto;
  padding: 30px;
  background: rgb(247, 248, 250);
}

.answer-container {
  margin: 20px auto;

  .progress {
    width: 300px;
    display: inline-block;
  }

  .answer-item {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
  }
}
</style>
