<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 发布测试
    </span>
    <div>
      <el-button size="small" @click="addTab(testContentArrValue)">添加题目</el-button>
      <div>
        <el-tabs
          v-model="testContentArrValue"
          @tab-click="handleClick"
          type="card"
          closable
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="item in testObj.quizIds"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <div style="display:inline-block; height:100px;width:50%;">
              <el-button size="small" style="margin: 20px 50px" @click="addTestBtn">点击添加试题</el-button>
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
        <span>所属章节</span>
      </div>
      <div>
        <el-select v-model="testObj.chapterId">
          <el-option
            v-for="item in chapterList"
            :key="item.chapterId"
            :label="item.chapterName"
            :value="item.chapterId"
          >{{item.chapterName}}</el-option>
        </el-select>
      </div>
      <div>
        <el-checkbox v-model="testObj.disorderOrder" true-label="1" false-label="2">题目乱序</el-checkbox>
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
    <el-button @click="savetestArr">保存</el-button>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
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
          :data="data2"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[1,2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
        ></el-tree>
        <!-- </div> -->
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { testAdd, chaptersListSimple } from "@/api/course";
import { getTestFileFold } from "@/api/library";
export default {
  data() {
    return {
      data2: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      dialogVisible: true,
      activeNames: [0],
      chapterList: [],
      testContentArrValue: "1",
      testObj: {
        courseId: this.$route.query.id,
        belongTitle: "",
        chapterId: "",
        disorderOrder: false,
        repeatTimes: "",
        testHour: "",
        testMinute: "",
        quizIds: [
          {
            title: `第1题`,
            name: "1",
            examTitle: "",
            typeCheck: ""
          }
        ],
        list: "",
        examTitle: "",
        showAnswer: "10"
      },
      tabIndex: 1,
      testLibrary: {}
    };
  },
  mounted() {
    chaptersListSimple({ courseId: this.testObj.courseId }).then(response => {
      this.chapterList = response.data;
    });
    getTestFileFold({ parentId: 0, searchKey: "" }).then(response => {
      this.testLibrary = response.data;
    });
  },
  methods: {
    addTab(targetName) {
      let newTabName = ++this.tabIndex + "";
      this.testObj.quizIds.push({
        title: `第${this.testObj.quizIds.length + 1}题`,
        name: newTabName,
        content: "New Tab content"
      });
      this.testContentArrValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.testObj.quizIds;
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
      this.testObj.quizIds = tabs.filter(tab => tab.name !== targetName);
      this.testObj.quizIds.forEach((tab, index) => {
        tab.title = `第${index + 1}题`;
      });
    },
    savetestArr() {
      let minute =
        Number(this.testObj.testHour) * 60 + Number(this.testObj.testMinute);
      this.testObj.limitTime = minute;
      console.log(this.testObj);
      testAdd(this.testObj).then(response => {
        console.log(response.data);
      });
    },
    handleClick(value) {
      console.log(value);
    },
    addTestBtn() {}
  }
};
</script>

<style>
</style>
