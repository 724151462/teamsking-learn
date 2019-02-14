<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 发布测试
    </span>
    <div>
      <el-button size="small" @click="addTestBtn" type="primary">添加题目</el-button>
      <div style="margin-top: 15px">
        <el-tabs
          v-model="testContentArrValue"
          @tab-click="handleClick"
          type="card"
          closable
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="item in testObj.quizList"
            :key="item.quizId"
            :label="item.title"
            :name="item.name"
          >
            <div style="display:inline-block; height:100px;width:50%;">
              <!-- <el-button size="small" style="margin: 20px 50px" @click="addTestBtn">点击添加试题</el-button> -->
              <span>{{item.quizTitle}}</span>
              <div style="margin-top:20px">
                <p
                  style="margin-bottom:5px"
                  v-for="option in item.option"
                  :key="option.optionId"
                >{{option.optionTitle}}</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="margin-sides">
        <span>标题</span>
      </div>
      <div>
        <el-input style="width:600px" v-model="testObj.examTitle"></el-input>
      </div>
      <div class="margin-sides">
        <span>所属章</span>
        <div style="display: inline-block; margin-left: 15px">
        <el-select v-model="testObj.chapterId">
          <el-option
            v-for="item in chapterList"
            :key="item.chapterId"
            :label="item.chapterName"
            :value="item.chapterId"
          >{{item.chapterName}}</el-option>
        </el-select>
      </div>
      </div>
      
      <div>
        <el-checkbox v-model="testObj.disorderOrder" :true-label="1" :false-label="2"><span style="font-size 20px !important">题目乱序</span></el-checkbox>
      </div>
      <div class="margin-sides">
        <span>测试时长</span>
        <el-input class="small-input" size="small" style="margin:10px" v-model="testObj.testHour"></el-input>小时
        <el-input class="small-input" size="small" style="margin:10px" v-model="testObj.testMinute"></el-input>分钟
        <span class="tip">测试总时长，学生需在此时间内完成作答。</span>
      </div>
      <div class="margin-sides">
        <span>重做次数</span>
        <el-input
          v-model="testObj.repeatTimes"
          class="small-input"
          size="small"
          style="margin:10px"
        ></el-input>次
        <span class="tip">学生可重复答题次数，成绩取最高分</span>
      </div>
      <div class="margin-sides">
        <span style="margin-right:10px">查看时机</span>
        <el-radio v-model="testObj.showAnswer" label="10">测试活动结束后查看答案</el-radio>
        <el-radio v-model="testObj.showAnswer" label="20">交卷后查看答案</el-radio>
      </div>
    </div>
    <el-button type="primary" @click="savetestArr">保存</el-button>
    <el-dialog title="添加题目" :visible.sync="dialogVisible" width="50%">
      <el-collapse v-model="activeNames" @change="handleClick">
        <!-- <div v-for="item in testLibrary.catalogList" :key="item.catalogId" style="display:flex; align-items:center"> -->
        <!-- <el-collapse-item style="width:100%">
                    <template slot="title">
                    <el-checkbox style="margin-right:10px"></el-checkbox>
                    <div class="title-container">
                        <span>{{item.catalogName}}</span>
                    </div>
                    </template>
        </el-collapse-item>-->
        <el-tree
          :data="fileList"
          ref="tree"
          show-checkbox
          @check="checkItem"
          node-key="quizId"
          :props="defaultProps"
          :default-checked-keys="checkedQuiz"
        ></el-tree>
        <!-- @node-expand="nodeExpand" -->
        <!-- </div> -->
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  testAdd,
  chaptersListSimple,
  interactExam,
  examPut
} from "@/api/course";
import { getTestFileFold, getAnswer } from "@/api/library";
import { matchReg } from "@/utils/utils";
import Cookie from "js-cookie"
export default {
  data() {
    return {
      fileList: [],
      defaultProps: {
        children: "catalogList",
        label: "catalogName"
      },
      dialogVisible: false,
      activeNames: [0],
      chapterList: [],
      testContentArrValue: "1",
      testObj: {
        courseId: this.$route.query.id,
        belongTitle: "",
        chapterId: "",
        disorderOrder: 2,
        repeatTimes: "",
        testHour: "",
        testMinute: "",
        quizList: [],
        list: "",
        examTitle: "",
        showAnswer: "10"
      },
      tabIndex: 0,
      testLibrary: {},
      checkedQuiz: [],
      routerType: 'cancel'
    };
  },
  mounted() {
    chaptersListSimple({ courseId: this.testObj.courseId }).then(response => {
      this.chapterList = response.data;
    });
    getTestFileFold({ parentId: 0, searchKey: "" }).then(response => {
      this.fileList = this.filterData(response.data);
    });
    if (this.$route.query.operation === "edit") {
      interactExam({ examId: this.$route.query.interactId }).then(response => {
        let subject = [];
        let checkedQuizIds = [];
        response.data.libraryQuizVOS.forEach((element, i) => {
          console.log(element);
          subject.push({
            quizTitle: element.quizTitle,
            quizId: element.quizId,
            title: `第${i + 1}题`,
            name: String(i + 1),
            option: element.quizOption
          });
          checkedQuizIds.push(element.quizId);
          this.checkedQuiz = checkedQuizIds;
          console.log(checkedQuizIds);
        });
        response.data.showAnswer = String(response.data.showAnswer);
        response.data.testHour = Math.floor(response.data.limitTime / 60);
        response.data.testMinute = response.data.limitTime % 60;
        response.data.quizList = subject;
        response.data.courseId = this.$route.query.id;
        this.testObj = response.data;
      });
    }
    // 禁用浏览器返回行为
    this.preventBack()
  },
  methods: {
    preventBack() {
      history.pushState(null, null, document.URL); 
      window.addEventListener('popstate', function() { 
        history.pushState(null, null, document.URL); 
      });
    },
    addTab(params) {
      let activeName = this.testContentArrValue;
      params.forEach((element, i) => {
        element.title = `第${i + 1}题`;
        element.quizTitle = element.catalogName;
        element.name = String(element.quizId);
      });
      // this.testObj.quizList.push({
      //   quizId: params.quizId,
      //   title: `第${this.testObj.quizList.length + 1}题`,
      //   quizTitle: params.catalogName,
      //   option: params.option,
      //   name: String(params.quizId),
      //   content: "New Tab content"
      // });
      this.testObj.quizList = params;
      this.testContentArrValue = activeName;
    },
    removeTab(targetName) {
      let tabs = this.testObj.quizList;
      let activeName = this.testContentArrValue;
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

      this.testContentArrValue = activeName;
      this.testObj.quizList = tabs.filter(tab => tab.name !== targetName);
      // 取出删除题目后的id数组
      let leftQuizIds = [];
      // 设置剩下的题目的disabled = false
      this.testObj.quizList.forEach((tab, index) => {
        leftQuizIds.push(tab.quizId);
        tab.title = `第${index + 1}题`;
      });
      this.$refs.tree.setCheckedKeys(leftQuizIds);
    },
    handleSuccess() {
      this.routerType = 'success'
      let chapterArr = JSON.parse(localStorage.getItem('localInteractId'))
      Cookie.set('interactionStatus', "10")
      let index = ''
      let findFlag = chapterArr.some((element, i)=> {
        if(element === this.testObj.chapterId) {
          index = i
        }
      })
      if(index !== '') {
        Cookie.set('interactActiveIndex', index)
      }else{
        Cookie.set('interactActiveIndex', chapterArr.length)
      }
      this.$router.push({path:"/course/list/interact",query: {id: this.$route.query.id}})
    },
    savetestArr() {
      console.log(this.$route.query.operation);
      if (this.$route.query.operation === "edit") {
        let minute =
          Number(this.testObj.testHour) * 60 + Number(this.testObj.testMinute);
        this.testObj.limitTime = minute;
        let idArr = [];
        this.testObj.quizList.forEach(element => {
          idArr.push(element.quizId);
        });
        this.testObj.quizIds = idArr;
        examPut(this.testObj).then(response => {
          console.log(response.data);
          if (response.code === 200) {
            this.$message({
              message: "修改测试成功",
              type: "success"
            });
            this.handleSuccess()
          } else if (response.code === 1000) {
            this.$message({
              message: response.msg,
              type: "warning"
            });
          }
        });
      } else {
        let minute =
          Number(this.testObj.testHour) * 60 + Number(this.testObj.testMinute);
        this.testObj.limitTime = minute;
        let idArr = [];
        this.testObj.quizList.forEach(element => {
          idArr.push(element.quizId);
        });
        this.testObj.quizIds = idArr;
        console.log(this.testObj);
        testAdd(this.testObj).then(response => {
          console.log(response.data);
          if (response.code === 200) {
            this.$message({
              message: "添加测试成功",
              type: "success"
            });
            this.handleSuccess()
          } else if (response.code === 1000) {
            this.$message({
              message: response.msg,
              type: "warning"
            });
          }
        });
      }
    },
    handleClick(value) {
      console.log(value);
    },
    addTestBtn() {
      this.dialogVisible = true;
      // setTimeout(() => {
      //   let checkedList = this.$refs.tree.getCheckedNodes().filter(element => {
      //     return element.catalogId === undefined;
      //   });
      //   console.log(checkedList)
      //   checkedList.forEach(element => {
      //     element.disabled = true
      //   })
      // });
    },
    // 取消
    cancel() {
      this.routerType = "cancel"
      this.$router.push({path:"/course/list/interact",query: {id: this.$route.query.id}})
    },
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
                catalogName: matchReg(list.quizTitle),
                quizId: list.quizId
                // disabled: true,
              });
            });
          }
        });
        return data;
      };
      let curData = getFilter(data);
      return curData;
    },
    // 选中题目
    checkItem(...params) {
      console.log(params[1]);
    },
    ensureAdd() {
      let checkedList = this.$refs.tree.getCheckedNodes().filter(element => {
        return element.catalogId === undefined;
      });
      console.log(this.checkedQuiz);
      checkedList.forEach(element => {
        let option = [];
        if (element.disabled !== true) {
          getAnswer({ quizId: element.quizId }).then(response => {
            response.data.forEach(ele => {
              option.push(ele);
            });
          });
          element.option = option;
          console.log(element);

          // this.$set(element, 'disabled', true)
        }
      });
      this.addTab(checkedList);
    }
  },
  beforeRouteLeave (to, from, next) {
    let msg = '跳转将丢失未保存数据，是否跳转'
    if(this.routerType === 'cancel') {
      msg = '跳转将丢失未保存数据，是否跳转'
    }else {
      msg = '添加成功，是否跳活动转列表页'
    }
    this.$confirm(msg, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {      
    });
  }
};
</script>

<style lang="stylus" scoped>
    
</style>

