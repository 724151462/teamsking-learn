<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 发起投票
    </span>
    <div>
      <el-button size="small" @click="addTab(voteQuizzesValue)" type="primary">添加题目</el-button>
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
            <div v-for="(answer, index) in item.voteQuizOptions" :key="index" class="margin-sides">
              {{index|character}}
              <el-input v-model="answer.optionTitle" style="width:300px"></el-input>
              <span class="delBtn" @click="delAnswer(item,index)">删除</span>
            </div>
            <el-button @click="addAnswer(item)" type="primary">添加选项</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-form :model="voteObj" :rules="rules" ref="voteForm">
        <el-form-item label="标题" prop="voteTitle">
          <el-input v-model="voteObj.voteTitle"/>
        </el-form-item>
        <el-form-item label="所属章" prop="chapterId">
          <el-select v-model="voteObj.chapterId">
            <!-- <el-option value="1">第一章</el-option> -->
            <el-option
              v-for="item in chapterList"
              :key="item.chapterId"
              :label="item.chapterName"
              :value="item.chapterId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-checkbox v-model="voteObj.showResult" true-label="1" false-label="2">投票后立即显示结果</el-checkbox>
      </div>
    </div>
    <el-button @click="saveVoteArr" type="primary">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import { 
  voteSave,
  votePut,
  chaptersListSimple,
  interactVote,
} from "@/api/course";

import Cookie from 'js-cookie'

export default {
  data() {
    return {
      voteQuizzesValue: "1",
      rules: {
        voteTitle: [
          { required: true, message: '请填写投票标题', trigger: 'blur' }
        ],
        chapterId: [
          { required: true, message: '请选择一个章节', trigger: 'change' }
        ]
      },
      voteObj: {
        courseId: this.$route.query.id,
        voteTitle: "",
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
              }
            ]
          }
        ]
      },
      quizType: "单选",
      tabIndex: 1,
      showTitle: "",
      temTitle: "",
      chapterList: [],
      routerType: 'cancel'
    };
  },
  mounted() {
    if(this.$route.query.operation === 'edit') {
      interactVote({voteId: this.$route.query.interactId})
      .then(response=> {
        this.voteQuizzesValue = String(response.data.voteQuizzes.length - 1)
        response.data.voteQuizzes.forEach((element,i)=>{
          element.quizType = String(element.quizType)
          element.title = `第${i+1}题`
        })
        this.voteObj = response.data
      })
    }
    chaptersListSimple({ courseId: this.voteObj.courseId }).then(response => {
      this.chapterList = response.data;
    });
    this.preventBack()
  },
  methods: {
    preventBack() {
      history.pushState(null, null, document.URL); 
      window.addEventListener('popstate', function() { 
        history.pushState(null, null, document.URL); 
      });
    },
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
    handleSuccess() {
      this.routerType = 'success'
      let chapterArr = JSON.parse(localStorage.getItem('localInteractId'))
      Cookie.set('interactionStatus', "10")
      let index = ''
      let findFlag = chapterArr.some((element, i)=> {
        if(element === this.voteObj.chapterId) {
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
    saveVoteArr() {
      console.log(this.$route.query.operation);
      if(this.$route.query.operation === 'edit'){
        votePut(this.voteObj).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "修改投票成功",
              type: "success"
            });
            this.handleSuccess()
          }
        });
      }else{
        this.$refs['voteForm'].validate((valid) => {
          if (valid) {
            voteSave(this.voteObj).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: "发起投票成功",
                  type: "success"
                });
                this.handleSuccess()
              }else{
                this.$message({
                  message: "请检查 投票题干/选项/题目类型 是否填写正确",
                  type: "warning"
                });
              }
            });
          }
        }
      )}
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
    },
    // 取消
    cancel() {
      this.routerType = "cancel"
      this.$router.push({path:"/course/list/interact",query: {id: this.$route.query.id}})
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
  },
  beforeRouteLeave (to, from, next) {
    let msg = '跳转将丢失未保存数据，是否跳转'
    if(this.routerType === 'cancel') {
      msg = '跳转将丢失未保存数据，是否跳转'
    }else {
      msg = '添加成功，是否跳活动转列表页'
    }
    this.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {      
    });
  },
};
</script>

<style>
</style>
