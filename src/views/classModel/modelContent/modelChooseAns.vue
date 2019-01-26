<template>
  <div>
    <div class="main">
      <div style="margin-left: 180px">
        <el-input
          style="width:80%;margin-right:20px"
          v-model="subject.title"
          placeholder="老师口述题目或在此输入一句话描述本次活动"
        ></el-input>
        <el-button type="primary" @click="dialogVisible = true">试题库添加</el-button>
      </div>
      <div class="answer-type">
        <div class="type-item" v-for="(item, n) in imgList" :key="n">
          <img @click="ansTypeBtn(item)" :src="item.src" alt>
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
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { getTestFileFold } from "@/api/library";

import Tree from "@/components/fileTree";
export default {
  data() {
    return {
      imgList: [
        {
          url: "/course/modelAnsqd",
          src: require("@/assets/images/qd.png")
        },
        {
          url: "/course/modelAnssj",
          src: require("@/assets/images/sj.png")
        },
        {
          url: "/course/modelAnssd",
          src: require("@/assets/images/sd.png")
        }
      ],
      dialogVisible: false,
      fileList: [],
      defaultProps: {
        children: "catalogList",
        label: "catalogName"
      },
      subject: {
        title: this.$route.query.subject || ""
      }
    };
  },
  created() {
    Cookie.set("modelActive", "5");
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
              list.quizTitle = this.matchReg(list.quizTitle);
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
      if (checkedList.length > 1) {
        this.$message({
          message: "请选择单个试题",
          type: "warning"
        });
        this.subject.title = null;
        return;
      } else if (checkedList.length === 0) {
        this.$message({
          message: "请选择试题",
          type: "warning"
        });
        this.subject.title = null;
        return;
      } else {
        this.subject.title = checkedList[0].catalogName;
      }
    },
    // 去富文本HTML标签
    matchReg(str) {
      let reg = /<\/?.+?\/?>/g;
      return str.replace(reg, "");
    },
    // 确认添加试题
    addEnsure() {
      this.dialogVisible = false;
    },
    ansTypeBtn(item) {
      var that = this;
      this.$router.push({
        path: item.url,
        query: {
          id: this.$route.query.id,
          classroomId: this.$route.query.classroomId,
          subject: this.subject.title
        }
      });
    }
  },
  components: {
    Tree
  }
};
</script>

<style lang="stylus" scoped>
.main {
  width: 80%;
  margin: 50px auto;
}

.answer-type {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 50px;

  .type-item {
    cursor: pointer;
  }
}
</style>