<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动'}">互动</router-link>> 发起投票
    </span>
    <div>
      <el-button size="small" @click="addTab(voteQuizzesValue)">添加题目</el-button>
      <div class="margin-sides">
        <el-tabs
          v-model="voteQuizzesValue"
          @tab-click="handleClick"
          type="card"
          closable
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="item in voteObj.voteQuizzes"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <el-input
              type="textarea"
              v-model="item.quizTitle"
              placeholder="请输入题目"
              style="width:600px;"
              autofocus="autofocus"
            />
            <div class="margin-sides">
              <el-radio v-model="item.quizType" label="10">单选</el-radio>
              <el-radio v-model="item.quizType" label="20">多选</el-radio>
            </div>
            <el-button @click="addAnswer(item)">添加答案</el-button>
            <div v-for="(answer, index) in item.voteQuizOptions" :key="index" class="margin-sides">
              {{index|character}}
              <el-input v-model="answer.optionTitle" style="width:300px"></el-input>
              <span class="delBtn" @click="delAnswer(item,index)">删除</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="margin-sides">
        <span>标题</span>
      </div>
      <div class="margin-sides">
        <el-input v-model="voteObj.voteTitle"></el-input>
      </div>
      <div class="margin-sides">
        <span>所属章节</span>
      </div>
      <div>
        <el-select v-model="voteObj.chapterId" class="margin-sides">
          <!-- <el-option value="1">第一章</el-option> -->
          <el-option
            v-for="item in chapterList"
            :key="item.chapterId"
            :label="item.chapterName"
            :value="item.chapterId"
          ></el-option>
        </el-select>
      </div>
      <div>
        <el-checkbox v-model="voteObj.showResult" true-label="1" false-label="2">投票后立即显示结果</el-checkbox>
      </div>
    </div>
    <el-button @click="saveVoteArr">保存</el-button>
  </div>
</template>

<script>
import { voteSave, chaptersListSimple } from "@/api/course";
export default {
  data() {
    return {
      voteQuizzesValue: "1",
      voteObj: {
        courseId: this.$route.query.id,
        voteTitle: "",
        quizTitle: "",
        chapterId: "",
        interactionStatus: 10,
        showResult: "2",
        voteQuizzes: [
          {
            title: `第1题`,
            name: "1",
            quizTitle: "",
            quizType: "",
            voteQuizOptions: [
              {
                optionTitle: ""
              },
              {
                optionTitle: ""
              },
              {
                optionTitle: ""
              },
              {
                optionTitle: ""
              }
            ]
          }
        ]
      },
      quizType: "单选",
      tabIndex: 1,
      showTitle: "",
      temTitle: "",
      chapterList: []
    };
  },
  mounted() {
    chaptersListSimple({ courseId: this.voteObj.courseId }).then(response => {
      this.chapterList = response.data;
    });
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      console.log("newTabName", newTabName);
      this.voteObj.voteQuizzes.push({
        title: `第${this.voteObj.voteQuizzes.length + 1}题`,
        quizTitle: "",
        name: newTabName,
        content: "New Tab content",
        voteQuizOptions: [
          {
            optionTitle: "",
            id: ""
          },
          {
            optionTitle: "",
            id: ""
          },
          {
            optionTitle: "",
            id: ""
          },
          {
            optionTitle: "",
            id: ""
          }
        ]
      });
      this.voteQuizzesValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.voteObj.voteQuizzes;
      let activeName = this.voteQuizzesValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.voteQuizzesValue = activeName;
      this.voteObj.voteQuizzes = tabs.filter(tab => tab.name !== targetName);
      this.voteObj.voteQuizzes.forEach((tab, index) => {
        tab.title = `第${index + 1}题`;
      });
    },
    saveVoteArr() {
      console.log(this.voteObj);
      voteSave(this.voteObj).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "发起投票成功",
            type: "success"
          });
        }
      });
    },
    handleClick(tab, event) {},
    // 添加答案
    addAnswer(subject) {
      console.log("答案", subject);
      subject.voteQuizOptions.push({
        optionTitle: ""
      });
    },
    // 删除答案
    delAnswer(item, index) {
      console.log(item, index);
      item.voteQuizOptions.splice(index, 1);
    }
  },
  filters: {
    character(key) {
      // console.log(key)
      // return key
      switch (key) {
        case 0:
          return "A";
          break;
        case 1:
          return "B";
          break;
        case 2:
          return "C";
          break;
        case 3:
          return "D";
        case 4:
          return "E";
          break;
      }
    }
  }
};
</script>

<style>
</style>
