<template>
  <div class="modelVote">
    <el-container>
      <div class="menu-switch">
        <div :class="isInteractStart === true ? ['switch-outer','full']: ['switch-outer','no-full']">
          <i :class="isInteractStart === true ? 'el-icon-caret-right' : 'el-icon-caret-left'" @click.stop="menuShow"></i>
        </div> 
      </div>
      <transition name="slide-fade">
      <modelAside v-show="isInteractStart === false"
        @dialogShow="dialogShow"
        :sourceList="voteList"
        :textObj="textObj"
        :dataKey="dataKey"
        :status="voteObj"
        @activeEvent="activeVote"
        @beginEvent="beginVote"
        ref="modelAside"
      ></modelAside>
      </transition>
      <el-main :class="isInteractStart === true ? 'main-full': 'main-hide'">
        <div v-if="voteObj === ''">
          <span>请选择或添加投票</span>
        </div>
        <div v-else-if="voteObj === 'add'">
          <div>
            <el-input
              v-model="addVoteParams.voteTitle"
              style="width: 50%;min-height: 240px"
              type="textarea"
              placeholder="手动输入投票题目"
            ></el-input>
          </div>
          <div v-for="(option, i) in addVoteParams.quizOptions" :key="i">
            <el-input style="width: 750px;margin: 10px 0" placeholder="输入选项" v-model="option.text"></el-input>
            <span style="margin-left: 10px; font-size:28px; cursor: pointer" @click="delOption(i)">×</span>
          </div>
          <el-button type="primary" @click="addOption">+添加选项</el-button>
          <div style="margin: 10px 0">
            <el-radio v-model="addVoteParams.quizType" :label="10">单选</el-radio>
            <el-radio v-model="addVoteParams.quizType" :label="20">多选</el-radio>
          </div>
          <el-button @click="dialogVisible = true">试题库导入</el-button>
          <el-button @click="manualAdd" type="primary">开始投票</el-button>
        </div>
        <div v-else>
          <p>{{voteObj.voteTitle}}</p>
          <div
            v-for="(quiz, i) in voteObj.voteQuizzes"
            :key="quiz.quizId"
            style="border-bottom: 1px solid rgb(215,215,215);width: 80%;min-height: 400px"
          >
            <p style="margin: 20px 0">{{i+1}}. {{quiz.quizTitle}}</p>
            <div
              style="margin: 10px 0"
              v-for="(option, optionIndex) in quiz.voteQuizOptions"
              :key="option.optionId"
            >
              <div class="answer-item">
                <span>{{optionItem[optionIndex]}}. {{option.optionTitle}}</span>
                <div class="progress-container">
                  <el-progress
                    :text-inside="true"
                    class="progress"
                    :stroke-width="18"
                    :percentage="option.percent"
                  ></el-progress>
                  <span style="margin-left: 5px;color:rgb(130,178,198)">{{option.userCount}}人</span>
                </div>
              </div>
            </div>
          </div>
          <el-footer>
            <span style="color: rgb(254,192,105)">学生参与即获得90分</span>
            <div class="footer-right" style="float: right">
              <div>
                <span style="margin-right: 20px">4/42人</span>
                <el-button
                  type="primary"
                  v-if="voteObj.interactionStatus === 10"
                  @click="beginVote(voteObj)"
                >开始投票</el-button>
                <el-button
                  type="primary"
                  v-else-if="voteObj.interactionStatus === 20"
                  @click="endVote('rightSide')"
                >结束投票</el-button>
                <el-button
                  type="primary"
                  v-else-if="voteObj.interactionStatus === 30"
                  :disabled="true"
                >已结束</el-button>
              </div>
              <span style="font-size: 12px">结束后学生不能再回答</span>
            </div>
          </el-footer>
        </div>
        <el-dialog title="选择题目" top="30vh" :visible.sync="dialogVisible" width="55%">
          <div>
            <div>
              <span style="color:rgb(85, 200, 255)">资源库导入</span>
            </div>
            <div style="float: right">
              <el-input
                type="text"
                placeholder="请输入测试题名称"
                suffix-icon="el-icon-search"
                style="width: 300px"
              ></el-input>
              <el-button>查询</el-button>
            </div>
            <div class="subjRadio">
              <Tree :sourceData="fileList" @checkedList="checkedFiles" :props="defaultProps"></Tree>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addEnsure">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { getTestFileFold } from "@/api/library";
import { voteList, interactVote, classVoteSave } from "@/api/course";

import Tree from "@/components/fileTree";
import modelAside from "@/components/modelAside";
import { error } from "util";
export default {
  data() {
    return {
      dialogVisible: false,
      textObj: {
        addBtn: "添加投票",
        interactItemBtn: "开始投票"
      },
      rightSideStatus: {},
      dataKey: {
        itemId: "voteId",
        itemTitle: "voteTitle"
      },
      fileList: [],
      defaultProps: {
        children: "catalogList",
        label: "catalogName"
      },
      addVoteParams: {
        chapterId: Cookie.get("chapterId"),
        classroomId: this.$route.query.classroomId || sessionStorage.getItem("classroom"),
        courseId: this.$route.query.id || sessionStorage.getItem("courseId"),
        quizOptions: [{ text: "" }, { text: "" }]
      },
      voteList: [
        {
          voteId: 1,
          voteTitle: "测试投票"
        }
      ],
      isInteractStart: false,
      voteObj: "",
      optionItem: ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
    };
  },
  created() {
    Cookie.set("modelActive", "4");
    this.getVoteList();
    getTestFileFold({ parentId: 0, searchKey: "" }).then(response => {
      this.fileList = this.filterData(response.data);
    });
  },
  methods: {
    menuShow() {
      this.isInteractStart = !this.isInteractStart
    },
    // 手动添加
    manualAdd() {
      console.log(this.addVoteParams);
      if(this.addVoteParams.chapterId === undefined) {
        this.$message({
          message: "请选择一个章",
          type: "warning"
        });
        return
      }
      classVoteSave(this.addVoteParams).then(response => {
        this.$refs.modelAside.activeEvent(response.data);
        if (response.code === 200) {
          this.getVoteList()
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.addVoteParams.voteTitle = ''
          this.addVoteParams.quizOptions.forEach(element => {
            element.text = ''
          });
        } else {
          this.$message({
            message: "添加错误，请检查信息",
            type: "error"
          });
        }
      });
    },
    // 添加选项
    addOption() {
      this.addVoteParams.quizOptions.push({ text: "" });
    },
    // 删除选项
    delOption(index) {
      console.log(this.addVoteParams.quizOptions);
      this.addVoteParams.quizOptions.splice(index, 1);
    },
    dialogShow(value) {
      this.voteObj = "add";
    },
    getVoteList() {
      voteList(this.addVoteParams).then(response => {
        this.voteList = response.data;
      });
    },
    // 点击获取投票
    activeVote(item, isStart) {
      interactVote({ voteId: item.voteId }).then(response => {
        this.voteObj = response.data;
        console.log(this.voteObj.interactionStatus);
      });
    },
    beginVote(value) {
      this.voteObj = value
        // if(this.voteObj === '') {
      this.activeVote(this.voteObj)
      this.subClassroom()
      this.socketVoteStart()
    },
    // 开始投票
    socketVoteStart() {
      window.STOMP_CLIENT.send(
        "/teamsking/course/vote",
        { token: sessionStorage.getItem('token') },
        JSON.stringify({
          bean: { voteId: this.voteObj.voteId},
          classroomId: this.$route.query.classroomId || sessionStorage.getItem('classroomId'),
          courseId: this.$route.query.id || sessionStorage.getItem("courseId"),
          userId: sessionStorage.getItem('userId')
        })
      );
    },
    endVote(value) {
      if (value === "rightSide") {
        this.voteObj.interactionStatus = 30;
        this.rightSideStatus = this.voteObj;
      }
      this.isInteractStart = false
        window.STOMP_CLIENT.send(
          "/teamsking/course/vote/close",
          { token: sessionStorage.getItem("token") },
          JSON.stringify({
            bean: { voteId: this.voteObj.voteId },
            classroomId: this.$route.query.classroomId || sessionStorage.getItem("classroomId"),
            courseId:  this.$route.query.id || sessionStorage.getItem("courseId"),
            userId: sessionStorage.getItem("userId")
          })
        );
    },
    // 递归渲染试题
    filterData(data) {
      let getFilter = data => {
        data.forEach(item => {
          // 文件夹处理
          if (!item.catalogList.length !== 0) {
            getFilter(item.catalogList);
          }
          // 文件处理
          if (item.quizList.length !== 0) {
            item.quizList.forEach(list => {
              item.catalogList.push({
                catalogName: list.quizTitle,
                quizId: list.quizId
              });
            });
          }
        });
        return data;
      };
      let curData = getFilter(data);
      return curData;
    },
    // 选中的文件
    checkedFiles(checkedList) {
      let quizArr = [];
      checkedList.forEach(element => {
        quizArr.push(element.quizId);
      });
      this.addVoteParams.quizIds = quizArr;
      this.addVoteParams.interactionId = null;
    },
    // 确认添加试题
    addEnsure() {
      if (this.addVoteParams.quizIds[0] === undefined) {
        this.$message({
          message: "请选择试题",
          type: "warning"
        });
        return;
      } else {
        classVoteSave(this.addVoteParams).then(response => {
          this.getVoteList()
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogVisible = false;
        });
      }
    },
    subClassroom() {
      let userId = sessionStorage.getItem("userId");
      var that = this;
      window.STOMP_CLIENT.subscribe(
        "/user/" + userId + "/teamsking/classroom",
        function(result) {
          let data = result.body;
          JSON.parse(data);
          console.log(JSON.parse(data).data.socketType);
          if (JSON.parse(data).data.socketType == 601) {
            that.$message({ message: "开始投票", type: "success" });
            that.isInteractStart = true
            // that.getVoteList();
            // if(that.voteObj !== '') that.voteObj.interactionStatus = 20;
            // that.rightSideStatus = that.voteObj;
          } else if (JSON.parse(data).data.socketType == 603) {
            that.$message({ message: "结束投票", type: "success" });
          } else if (JSON.parse(data).data.socketType == 604) {
            that.$message({ message: "收到一条投票信息", type: "success" });
            that.voteObj.voteQuizzes.forEach(element => {
              element.voteQuizOptions.forEach(option => {
                JSON.parse(data).data.socketData.forEach(newData => {
                  if (newData.optionId === option.optionId) {
                    console.log(newData.userCount, option);
                    option.userCount = newData.userCount;
                    option.percent = newData.percent;
                  }
                });
              });
            });
            console.log(that.voteObj.voteQuizzes);
          }
        }
      );
    }
  },
  components: {
    modelAside,
    Tree
  }
};
</script>

<style lang="stylus" scoped src="@/assets/css/menu-show.styl"></style>
<style lang="stylus" scoped>
.answer-item {
  display: flex;
  justify-content: space-between;
  width: 100%;

  // margin 0 auto
  .progress-container {
    display: flex;
    justify-content: space-between;
    width: 350px;

    .progress {
      width: 300px;
      display: inline-block;
    }
  }
}
</style>

