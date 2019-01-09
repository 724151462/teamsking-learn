<template>
  <div>
    <el-container>
      <el-aside style="width:280px; border: 1px solid gray; position: fixed;height:85%">
        <div style="margin: 20px 50px">
          <el-button type="primary" style="width: 150px;font-size: 1.2em" @click="addTest">添加测验</el-button>
          <p style="margin-top: 5px">点击题目查看详细情况</p>
        </div>
        <div
          :class="['test-container',item.examId===activeIndex?'test-active':'']"
          v-for="item in testList"
          @click="activeTest(item)"
          :key="item.examId"
        >
          <p
            style="width: 200px; display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden; font-size: 1.2em"
          >{{item.examTitle}}</p>
          <el-button
            v-if="item.interactionStatus === 10"
            type="primary"
            @click="beginTest(item)"
          >开始测试</el-button>
          <el-button v-else-if="item.interactionStatus === 20" type>进行中...</el-button>
          <el-button v-else :disabled="true" style="background: rgb(158,167,180);color: #fff">已结束</el-button>
        </div>
      </el-aside>
      <el-main>
        <div v-if="testObj === ''">
          <span>请选择测试</span>
        </div>
        <div v-else-if="testObj.interactionStatus === 10 || testObj.interactionStatus === 20">
          <!-- <div v-else-if="testObj.interactionStatus === 60 || testObj.interactionStatus === 70"> -->
          <!-- {{testObj}} -->
          <div class="count-down">
            <img :src="require('@/assets/images/clock.png')" width="25" alt>
            <span>00:00</span>
          </div>
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
          <el-button style="margin-left: 45%" type="primary">结束测试</el-button>

          <el-collapse v-if="testObj.interactionStatus === 20">
            <el-collapse-item title="40/44位同学答题情况排名" name="1">
              <div class="answer-container">
                <span>排名</span>
                <span>姓名</span>
                <span>学号</span>
                <!-- <span>正确题数</span> -->
                <!-- <span>正确率</span> -->
                <span>提交时间</span>
                <span>分数</span>
              </div>
              <div
                v-for="(item, index) in sortStudents"
                :class="{'answer-container': true, 'answer-first': index === 0, 'answer-second': index === 1, 'answer-third': index === 2}"
                :key="item.id"
                style="margin-top:30px"
              >
                <span>{{index+1}}</span>
                <div class="user-avatar">
                  <img :src="item.avatar" width="30" alt>
                  <span>{{item.realName}}</span>
                </div>
                <span>{{item.studentNo}}</span>
                <!-- <span>{{item.correctCount}}</span> -->
                <!-- <span>{{item.correctRate}}</span> -->
                <span>{{item.createTime}}</span>
                <span>{{item.score}}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-show="testObj.interactionStatus === 30">
          <div v-for="(item,i) in testObj.libraryQuizVOS" :key="item.quizId">
            <div :id="'subject'+i" style="width: 1000px;height: 400px;"></div>
            <p>
              <span class="option-type" v-if="item.quizType === 10">单选1</span>
              <span class="option-type" v-else>多选1</span>
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
            <el-button @click="editSubjectVisible = false">取 消</el-button>
            <el-button type="primary" @click="addEnsure">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { testList, interactExam, interactExamRes } from "@/api/course";
import { classTest, classTestSave } from "../../../api/course";
import { getTestFileFold } from "@/api/library";
import Tree from "@/components/fileTree";
import echarts from "echarts";
export default {
  data() {
    return {
      testList: [],
      activeIndex: "",
      testObj: "",
      optionItem: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T"
      ],
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
      }
    };
  },
  computed: {
    sortStudents: function() {
      return this.students.sort(this.sortBy("grade", "time"));
    }
  },
  mounted() {},
  created() {
    Cookie.set("modelActive", "2");
    console.log(this.$route.query);
    classTest({
      classroomId: this.$route.query.classroomId,
      chapterId: Cookie.get("chapterId")
    }).then(response => {
      this.testList = response.data;
    });
    getTestFileFold({ parentId: 0, searchKey: "" }).then(response => {
      this.fileList = this.filterData(response.data);
    });
  },
  methods: {
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
    activeTest(item) {
      this.activeIndex = item.examId;
      interactExam({ examId: item.examId }).then(response => {
        this.testObj = response.data;
        if (this.testObj.interactionStatus === 30) {
          // for (let index = 0; index < this.testObj.libraryQuizVOS.length; index++) {
          //     console.log(this.testObj.libraryQuizVOS[index])

          // }
          this.$nextTick(function() {
            this.drawPie(this.testObj.libraryQuizVOS);
          });
        }
      });
    },
    drawPie(items) {
      console.log(items);
      let num = 0;
      items.forEach((element, i) => {
        num += 1;
        let chart = "chart" + num;
        chart = echarts.init(document.getElementById(`subject${i}`));
        console.log(chart);
        chart.setOption({
          title: {
            text: "某站点用户访问来源",
            subtext: "纯属虚构",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: 335, name: "直接访问" },
                { value: 310, name: "邮件营销" },
                { value: 234, name: "联盟广告" },
                { value: 135, name: "视频广告" },
                { value: 1548, name: "搜索引擎" }
              ],
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
    beginTest(item) {
      this.activeTest(item);
      this.examParams.examId = item.examId;
      interactExamRes(this.examParams).then(response => {
        this.students = response.data.pageData;
      });
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
    addTest() {
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
      let reg = /<\/?.+?\/?>/g;
      return str.replace(reg, "");
    }
  },
  components: {
    Tree
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
}

.test-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 3px solid rgb(158, 167, 180);
  border-radius: 10px;
  width: 80%;
  height: 100px;
  padding: 15px;
  margin: 10px auto;
}

.test-active {
  border-color: rgb(63, 159, 255);
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
</style>

