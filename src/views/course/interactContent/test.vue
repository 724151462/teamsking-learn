<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 发布测试
    </span>
    <div style="margin-bottom: 20px;">
      <el-button size="small" type="primary" @click="addTestBtn(editableTabsValue)">请选择题目</el-button>
    </div>
    <span v-if="editableTabs.length === 0">您还没有选择试题，点击选择题目按钮选择</span>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane style="min-height: 270px;"
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.tabName"
        :name="item.name"
      >
      <div style="display:inline-block; height:100px;width:50%;">
              <!-- <el-button size="small" style="margin: 20px 50px" @click="addTestBtn">点击添加试题</el-button> -->
              <span>{{item.title}}</span>
              <div style="margin-top:20px">
                <p
                  style="margin-bottom:5px"
                  v-for="option in item.content"
                  :key="option.optionId"
                >{{option.optionTitle}}</p>
              </div>
            </div>
    </el-tab-pane>
    </el-tabs>
    <el-form :model="testObj" :rules="rules" ref="testForm" label-width="100px">
        <el-form-item label="标题" prop="examTitle">
          <el-input style="width:600px" v-model="testObj.examTitle"></el-input>
        </el-form-item>
        <el-form-item label="所属章" prop="chapterId">
          <el-select v-model="testObj.chapterId">
            <el-option
              v-for="item in chapterList"
              :key="item.chapterId"
              :label="item.chapterName"
              :value="item.chapterId"
            >{{item.chapterName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目乱序">
          <el-checkbox v-model="testObj.disorderOrder" :true-label="1" :false-label="2"></el-checkbox>
        </el-form-item>
      <el-form-item label="测试时长">
        <el-input class="small-input" size="small" style="margin:0 10px" v-model="testObj.testHour"></el-input>小时
        <el-input class="small-input" size="small" style="margin:0 10px" v-model="testObj.testMinute"></el-input>分钟
        <span class="tip">测试总时长，学生需在此时间内完成作答。</span>
      </el-form-item>
      <el-form-item label="重做次数">
        <el-input
          v-model="testObj.repeatTimes"
          class="small-input"
          size="small"
          style="margin:0 10px"
        ></el-input>次
        <span class="tip">学生可重复答题次数，成绩取最高分</span>
      </el-form-item>
      <el-form-item label="查看时机">
        <el-radio v-model="testObj.showAnswer" label="10">测试活动结束后查看答案</el-radio>
        <el-radio v-model="testObj.showAnswer" label="20">交卷后查看答案</el-radio>
      </el-form-item>
      </el-form>
      <el-button type="primary" @click="savetestArr">保存</el-button>
    <el-dialog title="添加题目" :visible.sync="dialogVisible" width="50%">
      <el-collapse v-model="activeNames">
        <el-tree
          :data="fileList"
          ref="tree"
          show-checkbox
          node-key="quizId"
          :props="defaultProps"
          :default-checked-keys="checkedQuiz"
        ></el-tree>
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
import Cookie from "js-cookie";
export default {
  data() {
    return {
      editableTabsValue: "",
      editableTabs: [],
      rules: {
        examTitle: [
          { required: true, message: "请填写测试标题", trigger: "blur" }
        ],
        chapterId: [
          { required: true, message: "请选择一个章节", trigger: "change" }
        ]
      },
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
      routerType: "cancel"
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
        let newTabName
        response.data.libraryQuizVOS.forEach((element, index) => {
          newTabName = String(element.quizId);
          console.log(element);
          subject.push({
            tabName: `第${index+1}题`,
            title: element.quizTitle,
            name: newTabName,
            content: element.quizOption
          });
          checkedQuizIds.push(element.quizId);
          this.checkedQuiz = checkedQuizIds;
          console.log(checkedQuizIds);
        });
        response.data.showAnswer = String(response.data.showAnswer);
        response.data.testHour = Math.floor(response.data.limitTime / 60);
        response.data.testMinute = response.data.limitTime % 60;
        response.data.quizList = subject;
        this.editableTabs = subject
        response.data.courseId = this.$route.query.id;
        this.testObj = response.data;
      });
    }
    // 禁用浏览器返回行为
    this.preventBack();
  },
  methods: {
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
    preventBack() {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function() {
        history.pushState(null, null, document.URL);
      });
    },
    addTab(list) {
      console.log(list)
      this.editableTabs = []
      let newTabName
      list.forEach((element, index) => {
        newTabName = String(element.quizId);
        this.editableTabs.push({
          tabName: `第${index+1}题`,
          title: element.catalogName,
          name: newTabName,
          content: element.option
        });
      });
      this.testObj.quizList = list;
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      console.log(activeName, targetName)
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

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    addTestBtn() {
      this.dialogVisible = true;
    },
    ensureAdd() {
      let checkedList = this.$refs.tree.getCheckedNodes().filter(element => {
        return element.catalogId === undefined;
      });

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
      // console.log(checkedList);
      this.addTab(checkedList);
      this.dialogVisible = false;
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
        console.log(this.testObj.quizList)
        // 从tabs上的题目拿数据 name为quizId
        this.editableTabs.forEach(element => {
          idArr.push(Number(element.name));
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
        console.log(this.testObj.quizList)
        this.testObj.quizList.forEach(element => {
          idArr.push(element.quizId);
        });
        this.testObj.quizIds = idArr;
        console.log(this.testObj);
        this.$refs['testForm'].validate((valid) => {
          if (valid) {
            testAdd(this.testObj).then(response => {
              console.log(response.data);
              if (response.code === 200) {
                this.$message({
                  message: "添加测试成功",
                  type: "success"
                });
                this.handleSuccess()
              } else if (response.code === 200006) {
                this.$message({
                  message: response.msg,
                  type: "warning"
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
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

<style>
</style>
