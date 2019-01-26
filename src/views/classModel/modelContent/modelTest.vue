<template>
  <div>
    <el-container>
      <div style="position: fixed; left: 100px; z-index: 999">
        <span @click="menuShow">{{isInteractStart === true? '展开': '收起'}}</span>  
      </div>
      <transition name="slide-fade">
      <modelAside v-if="isInteractStart === false"
        @dialogShow="dialogShow"
        :sourceList="testList"
        :textObj="textObj"
        :dataKey="dataKey"
        :status="testObj"
        @activeEvent="activeTest"
        @beginEvent="beginTest"
      ></modelAside>
      </transition>
      <el-main :class="isInteractStart === true ? 'full': 'hide'">
        <div v-if="testObj === ''">
          <span></span>
        </div>
        <div v-else-if="testObj.interactionStatus === 10 || testObj.interactionStatus === 20">
          <!-- <div v-else-if="testObj.interactionStatus === 60 || testObj.interactionStatus === 70"> -->
          <!-- {{testObj}} -->
          <div class="count-down">
            <img :src="require('@/assets/images/clock.png')" width="25" alt>
            <span>{{countDownShow}}</span>
          </div>
          <div style="min-height: 500px">
            <div v-for="(item,i) in testObj.libraryQuizVOS" :key="item.quizId">
              <p>
                <span class="option-type" v-if="item.quizType === 10">单选</span>
                <span class="option-type" v-else>多选</span>
                第{{i+1}}题:
                <span
                  style="display: inline-block; margin-left: 10px"
                >{{matchReg(item.quizTitle)}}</span>
              </p>
              <div v-for="(option,oid) in item.quizOption" :key="option.optionId">
                <p style="margin:5px">
                  <span style="margin-right: 5px">{{optionItem[oid]}}</span>
                  {{option.optionTitle}}
                </p>
              </div>
            </div>
          </div>

          <el-button
            type="primary"
            v-if="testObj.interactionStatus === 10"
            @click="beginTest('rightSide')"
          >开始测试</el-button>
          <el-button
            type="primary"
            v-else-if="testObj.interactionStatus === 20"
            @click="endTest('rightSide')"
          >结束测试</el-button>
          <el-button
            type="primary"
            v-else-if="testObj.interactionStatus === 30"
            :disabled="true"
          >已结束</el-button>

          <el-collapse v-if="testObj.interactionStatus === 20">
            <el-collapse-item title="40/44位同学答题情况排名" name="1">
              <div class="answer-container">
                <span>排名</span>
                <span>姓名</span>
                <span>学号</span>
                <span>提交时间</span>
                <span>分数</span>
              </div>
              <template v-if="students.length !== 0">
                <div
                  v-for="(item, index) in sortStudents"
                  :class="{'answer-container': true, 'answer-first': index === 0, 'answer-second': index === 1, 'answer-third': index === 2}"
                  :key="index"
                  style="margin-top:30px"
                >
                  <span>{{index+1}}</span>
                  <div class="user-avatar">
                    <img :src="item.avatar" width="30" alt>
                    <span>{{item.realName}}</span>
                  </div>
                  <span>{{item.studentNo}}</span>
                  <span>{{item.createTime}}</span>
                  <span>{{item.score}}</span>
                </div>
              </template>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else>
          <div v-for="(item,i) in answerObj" :key="item.quizId">
            <div :id="'subject'+i" style="width: 1000px;height: 400px;"></div>
            <p>
              <span class="option-type" v-if="item.quizType === 10">单选1</span>
              <span class="option-type" v-else>多选1</span>
              第{{i+1}}题:
              <span
                style="display: inline-block; margin-left: 10px"
              >{{matchReg(item.quizTitle)}}</span>
            </p>
            <div v-for="(option,oid) in item.options" :key="option.optionId">
              <p style="margin:5px">
                <span style="margin-right: 5px">{{optionItem[oid]}}</span>
                {{option.optionTitle}}
              </p>
            
            <div v-if="oid === item.options.length - 1" class="answer-group">
                <p>正确答案：<span>{{correctAnswer(item.options)}}</span></p> 
                <div class="analysis-group">
                  <p><span>解析: </span>{{item.quizAnalysis}}</p>
                  <p><span>知识点: </span>{{item.skillPoint}}</p>
                </div>
                
            </div>
            </div>
        </div>

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
import echarts from "echarts";

import { testList, interactExam, interactExamRes } from "@/api/course";
import { classTest, classTestSave, classTestRes } from "../../../api/course";
import { getTestFileFold } from "@/api/library";
import Tree from "@/components/fileTree";

import modelAside from "@/components/modelAside";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      textObj: {
        addBtn: "添加测试",
        interactItemBtn: "开始活动"
      },
      rightSideStatus: {},
      dataKey: {
        itemId: "examId",
        itemTitle: "examTitle"
      },
      testList: [],
      activeIndex: "",
      testObj: "",
      answerObj: {},
      optionItem: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      examParams: {
        courseId: this.$route.query.id,
        examId: ""
      },
      students: [],
      // 试题相关
      dialogVisible: false,
      fileList: [],
      defaultProps: {
        children: "catalogList",
        label: "catalogName"
      },
      addTestParams: {
        chapterId: Cookie.get("chapterId"),
        classroomId: this.$route.query.classroomId,
        courseId: this.$route.query.id,
        examTitle: "课堂测试",
        quizIds: []
      },
      isInteractStart: false,
      isEnd:false,//倒计时是否结束
      endTime:1,//应为接口获取到的结束时间
      time: {},
      countDownShow: '00:00'
    };
  },
  computed: {
    sortStudents: function() {
      if (this.students.length === 0) {
        return
      }else{
        alert(1)
        return this.students.sort(this.sortBy("grade", "time"));
      }
    }
  },
  mounted() {},
  created() {
    Cookie.set("modelActive", "2");
    console.log(this.$route.query);
    this.getTest()
    getTestFileFold({ parentId: 0, searchKey: "" }).then(response => {
      this.fileList = this.filterData(response.data);
    });
  },
  methods: {
    menuShow() {
      this.isInteractStart = !this.isInteractStart
    },
    getTest() {
      // 总的测试列表
      classTest({
        classroomId: this.$route.query.classroomId,
        chapterId: Cookie.get("chapterId")
      }).then(response => {
        this.testList = response.data;
      });
    },
    setEndTime(){
        var date = this.endTime * 60 //计算总秒数
        var interval = setInterval(() =>{
        if(date == 0){
          this.isEnd = true;
          clearInterval(interval)
        }else{
          date --;
          this.time.m = parseInt(date / 60 % 60);//计算剩余的分钟
          if(this.time.m < 10){
            this.time.m = "0" +this.time.m
          } 
          this.time.s = parseInt(date % 60);//计算剩余的秒数 
          if(this.time.s < 10){
            this.time.s = "0" +this.time.s
          }
          console.log(this.time.m+this.time.s)
          this.countDownShow = this.time.m+':'+this.time.s;
          return this.time.m+this.time.s;	
        }
      },1000);
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
    // 点击获取测试
    activeTest(item) {
      console.log(item)
      this.getQuiz(item);
    },
    // 获取并开始
    beginTest(value) {
      console.log(value)
      this.activeTest(value)
      if (value === "rightSide") {
        this.testObj.interactionStatus = 20;
        this.rightSideStatus = this.testObj;
        // this.rightSideStatus.id = this.testObj.voteId
      }
      this.examParams.classroomId = this.$route.query.classroomId;
      this.examParams.bean = value.examId
      this.examParams.userId = Cookie.get('userId')
      console.log(this.examParams)
      this.subClassroom()
      window.STOMP_CLIENT.send(
        "/teamsking/course/exam/start",
        { token: sessionStorage.getItem('token') },
        JSON.stringify({
          bean: value.examId,
          classroomId: this.$route.query.classroomId,
          courseId: this.$route.query.id,
          userId: sessionStorage.getItem('userId')
        })
      );
    },

    // 结束测试
    endTest(value) {
      this.isInteractStart = false
      if (value === "rightSide") {
        console.log(this.testObj)
        this.testObj.interactionStatus = 30;
        this.rightSideStatus = this.testObj;
        // this.rightSideStatus.id = this.voteObj.voteId
      } 
      window.STOMP_CLIENT.send(
        "/teamsking/course/exam/finish",
        { token: sessionStorage.getItem("token") },
        JSON.stringify({
          bean: this.testObj.examId,
          classroomId: this.$route.query.classroomId,
          courseId: this.$route.query.id,
          userId: sessionStorage.getItem("userId")
        })
      );
    },
    // 获取测试
    getQuiz(item) {
      console.log(item.examId)
      interactExam({ examId: item.examId }).then(response => {
        this.testObj = response.data;
        if (item.interactionStatus === 30) {
          classTestRes({ examId: item.examId }).then(response => {
            this.answerObj = response.data;
            console.log(this.answerObj)
            this.$nextTick(function() {
              this.drawPie(this.answerObj);
            });
          });
        } else if (item.interactionStatus === 20) {
          // interactExamRes(this.examParams).then(response => {
          //   this.students = response.data.pageData;
          // });
        }
      });
      
    },
    drawPie(items) {
      // setTimeout(()=>{
      //   console.log(document.getElementById('subject0'));
      // },1000)
      let num = 0;
      items.forEach((element, i) => {
        num += 1;
        let chart = "chart" + num;
        chart = echarts.init(document.getElementById(`subject${i}`));
        console.log(element.options);
        let pieData = []
        let legend = []
        element.options.forEach((item)=> {
          legend.push(item.optionTitle)
          pieData.push({name:item.optionTitle, value: item.answerPercent})
        })
        chart.setOption({
          title: {
            text: `第${num}题`,
            subtext: "",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: legend
          },
          series: [
            {
              name: "回答情况",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        });
      });

      // let charts = echarts.init(document.getElementById(`subject1`));
      // console.log(chart)
    },
    // 若分数相等，用用时来排序
    sortBy(field1, field2) {
      return function(a, b) {
        console.log(a[field1], b[field1]);
        if (a[field1] === b[field1]) {
          console.log(a, b);
          return a[field2] - b[field2];
        }
        return b[field1] - a[field1];
      };
    },
    // 选中的文件
    checkedFiles(checkedList) {
      let quizArr = [];
      checkedList.forEach(element => {
        quizArr.push(element.quizId);
      });
      this.addTestParams.quizIds = quizArr;
      this.addTestParams.interactionId = null;
    },
    // 添加测验按钮
    dialogShow() {
      this.dialogVisible = true;
    },
    // 确认添加试题
    addEnsure() {
      if (this.addTestParams.quizIds[0] === undefined) {
        this.$message({
          message: "请选择试题",
          type: "warning"
        });
        return;
      } else {
        classTestSave(this.addTestParams).then(response => {
          this.testList.push(response.data);
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogVisible = false;
        });
      }
    },
    // 去富文本HTML标签
    matchReg(str) {
      console.log(str);
      let reg = /<\/?.+?\/?>/g;
      return str.replace(reg, "");
    },
    // 正确答案
    correctAnswer(item) {
      console.log(item);
      let arr = "";
      let correctArr = item.filter(element => {
        if (element.correctFlag === 1) {
          arr += element.optionTitle + ",";
        }
      });
      return arr.substring(0, arr.length - 1);
      // let ansArr = []
      // if(item.correctFlag === 2) {
      //     ansArr.push(item.optionTitle)
      // }
      // return ansArr
    },
    subClassroom() {
      let userId = sessionStorage.getItem("userId");
      var that = this;
      window.STOMP_CLIENT.subscribe(
        "/user/" + userId + "/teamsking/classroom",
        function(result) {
          console.log(result);
          let data = JSON.parse(result.body);
          console.log("========", data.data.socketData);
          if (data.data.socketType === 303) {
            that.$message.info("收到一个学生提交");
            that.students.push(data.data.socketData[0]);
          }else if(data.data.socketType === 302) {
            that.$message.info("结束测试");
            that.getQuiz(data.data.socketData)
            that.getTest()
          }else if(data.data.socketType === 301) {
            that.$message.info("开始测试");
            that.getTest()
            that.isInteractStart = true
          }
        }
      );
    }
  },
  components: {
    Tree,
    modelAside
  }
};
</script>

<style lang="stylus" scoped>
@media screen and (min-width: 1200px) and (max-width: 1500px) {
  .el-container {
    font-size: 15px !important;
  }

  .count-down {
    left: 92% !important;
  }
}

.el-main {
  padding-left: 300px;
  min-height: 600px;
}

.full {
  animation:aside-show 1s;
  padding-left: 0px
}

.hide {
  animation:aside-hide 1s;
  padding-left: 300px
}

@keyframes aside-show{
  from {padding-left: 300px}
  to {padding-left: 0px}
  animation-fill-mode: forwards
}

@keyframes aside-hide{
  from {padding-left: 0px}
  to {padding-left: 300px}
  animation-fill-mode: forwards
}

.option-type {
  display: inline-block;
  border: 1px solid rgb(0, 204, 102);
  border-radius: 4px;
  padding: 2px 5px;
  color: rgb(0, 204, 102);
}

.count-down {
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #fff;
  font-size: 20px;
  background: rgb(0, 204, 102);
  position: fixed;
  left: 95%;
  width: 100px;
  height: 40px;
  border: 1px solid rgb(0, 204, 102);
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
}

.answer-container {
  display: flex;
  justify-content: space-between;
  margin: 20px auto;
  width: 94%;

  .user-avatar {
    display: flex;
    align-items: center;

    span {
      width: 55px !important;
    }
  }

  span {
    width: 80px;
    text-align: center;
  }
}

.answer-first {
  color: rgb(159, 58, 72);
}

.answer-second {
  color: rgb(192, 166, 135);
}

.answer-third {
  color: rgb(110, 169, 170);
}

.answer-group>p:first-child {
  margin: 10px;

  .analysis-group span {
    display: inline-block;
    width: 60px;
    border: 1px solid red;
    padding: 10px 10px;
    color: red;
  }
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateX(-50px);
  opacity: 0;
}
</style>

