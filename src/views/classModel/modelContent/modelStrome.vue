<template>
  <div class="modelStrome">
    <el-container>
      <div class="menu-switch">
        <div :class="isInteractStart === true ? ['switch-outer','full']: ['switch-outer','no-full']">
          <i :class="isInteractStart === true ? 'el-icon-caret-right' : 'el-icon-caret-left'" @click.stop="menuShow"></i>
        </div> 
      </div>
      <transition name="slide-fade">
      <modelAside v-show="isInteractStart === false"
        @dialogShow="dialogShow"
        :sourceList="stormList"
        :textObj="textObj"
        :dataKey="dataKey"
        :status="stormObj"
        @activeEvent="activeStorme"
        @beginEvent="beginStorm"
        ref="modelAside"
      ></modelAside>
      </transition>
      <el-main :class="isInteractStart === true ? 'main-full': 'main-hide'">
        <div v-if="stormObj.stormTitle === undefined && stormObj !== 'add'">
          <span>请选择或添加头脑风暴</span>
        </div>
        <div v-else-if="stormObj === 'add'">
          <div>
            <el-input
              v-model="addStormParams.stormTitle"
              style="width: 50%;min-height: 240px"
              type="textarea"
              placeholder="手动输入头脑风暴"
            ></el-input>
          </div>
          <el-button @click="dialogVisible = true">试题库导入</el-button>
          <el-button @click="manualAdd" type="primary">添加头脑风暴</el-button>
        </div>
        <div v-else>
          <el-container>
            <el-header>{{stormObj.stormTitle}}</el-header>
            <el-main class="answer-list" style="height:auto">
              <!-- <div class="answer-container"><span>张三</span><span>eewgtewgtew</span></div> -->
              <el-card
                class="item"
                v-for="(item, index) in stormObj.answerList"
                :key="index"
                :body-style="{ padding: '10px' }"
              >
              <!-- {{item}} -->
                <div style="display: flex; align-items: center">
                  <img :src="item.avatar" height="100" class="stu-image">
                  <span style="margin-left: 20px">{{item.userName}}</span>
                </div>
                <div>
                  <div
                    style="padding: 20px 0;min-height: 30px; border-bottom: 1px solid rgb(222,222,222)"
                  >
                    <div>
                      <img :src="item.asset[0]" alt="">
                    </div>
                    <span>{{item.entity.stormContent}}</span>
                  </div>

                  <div class="bottom clearfix">
                    <img
                      :src="require('@/assets/images/dz.png')"
                      width="30"
                      style="float: right;cursor: pointer;margin-top: 10px"
                    >
                    <el-button
                      type="text"
                      style="float: right;margin-right:10px;margin-top: 10px"
                      @click="addScore(item)"
                    >加分</el-button>
                  </div>
                </div>
              </el-card>
            </el-main>
            <el-footer>
              <span style="color: rgb(254,192,105)">学生参与即获得90分</span>
              <div class="footer-right">
                <div>
                  <span style="margin-right: 20px">4/42人</span>
                  <el-button
                  type="primary"
                  v-if="stormObj.interactionStatus === 10"
                  @click="beginStorm(stormObj)"
                >开始头脑风暴</el-button>
                <el-button
                  type="primary"
                  v-else-if="stormObj.interactionStatus === 20"
                  @click="endStorm('rightSide')"
                >结束头脑风暴</el-button>
                <el-button
                  type="primary"
                  v-else
                  :disabled="true"
                >已结束</el-button>
                </div>
                <span style="font-size: 12px">结束后学生不能再回答</span>
              </div>
            </el-footer>
          </el-container>
        </div>
      </el-main>
    </el-container>
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
import modelAside from "@/components/modelAside";
import { getTestFileFold } from "@/api/library";
import { matchReg } from "@/utils/utils";
import { classStromeGet, classStromeSave, storm, stormAddScore } from "@/api/course";
import Tree from "@/components/fileTree";
export default {
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      defaultProps: {
        children: "catalogList",
        label: "catalogName"
      },
      addStormParams: {
        classroomId: this.$route.query.classroomId || sessionStorage.get("classroomId"),
        courseId: this.$route.query.id || sessionStorage.get("courseId"),
        stormTitle: ''
      },
      isInteractStart: false,
      stormObj: {
        // socket实时消息列表
        answerList: []
      },
      stormList: [
        {
          stormId: 1,
          stormTitle: "测试头脑风暴"
        }
      ],
      textObj: {
        addBtn: "添加头脑风暴",
        interactItemBtn: "开始头脑风暴"
      },
      rightSideStatus: {},
      dataKey: {
        itemId: "stormId",
        itemTitle: "stormTitle"
      },
      
    };
  },
  methods: {
    menuShow() {
      this.isInteractStart = !this.isInteractStart
    },
    dialogShow(value) {
      this.stormObj = "add";
    },
    activeStorme(value) {
      console.log(value);
      storm({ stormId: value.stormId }).then(response => {
        response.data.stormTitle = matchReg(response.data.stormTitle);
        response.data.answerList = []
        this.stormObj = response.data;
      });
    },
    beginStorm(value) {
      console.log(value)
      this.stormObj = value
      this.activeStorme(value)
      this.subClassroom()
      this.socketStromStart()
    },
    endStorm(value) {
      if (value === "rightSide") {
        this.stormObj.interactionStatus = 30;
        this.rightSideStatus = this.stormObj;
        // this.rightSideStatus.id = this.voteObj.voteId
      }
      this.isInteractStart = false
      this.socketStromEnd()
    },
    // 开始头脑风暴
    socketStromStart() {
      console.log(this.stormObj)
      window.STOMP_CLIENT.send(
        "/teamsking/course/storm",
        { token: sessionStorage.getItem('token') },
        JSON.stringify({
          bean: this.stormObj.stormId,
          classroomId: this.$route.query.classroomId,
          courseId: this.$route.query.id,
          userId: sessionStorage.getItem('userId')
        })
      );
    },
    // 结束头脑风暴
    socketStromEnd() {
      window.STOMP_CLIENT.send(
        "/teamsking/course/storm/close",
        { token: sessionStorage.getItem('token') },
        JSON.stringify({
          bean: {stormId: this.stormObj.stormId},
          classroomId: this.$route.query.classroomId,
          courseId: this.$route.query.id,
          userId: sessionStorage.getItem('userId')
        })
      );
    },
    subClassroom(){
      var that = this
      let userId = sessionStorage.getItem('userId');
      console.log(this.stormObj)
      window.STOMP_CLIENT.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
        console.log(JSON.parse(result.body))
        if(JSON.parse(result.body).data.socketType === 506) {
          console.log(that.stormObj)
          let socketData = JSON.parse(result.body)
          let socketObj = {}
          socketObj.entity = socketData.data.socketData.entity
          socketObj.userName = socketData.data.socketData.userName
          socketObj.asset = socketData.data.socketData.asset
          socketObj.avatar = socketData.data.socketData.avatar
          console.log(socketObj)
          that.stormObj.answerList.push(socketObj)
          console.log('storm========',that.stormObj.answerList)
        }else if(JSON.parse(result.body).data.socketType === 502) {
          that.stormObj.interactionStatus = 30
          that.activeStorme(that.stormObj)
          that.$message({
            message: "已结束头脑风暴",
            type: "success"
          })
        }else if(JSON.parse(result.body).data.socketType === 501) {
          that.$message({ message: "开始头脑风暴", type: "success" });
          that.$set(that.stormObj, "answerList", [])
          that.isInteractStart = true
        }
      });
    },
    addScore(answer) {
      console.log(answer);
      stormAddScore({ recordId: answer.entity.id }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "加分成功",
            type: "success"
          });p
        }
      });
    },
    // 选中的文件
    checkedFiles(checkedList) {
      console.log(checkedList);
      if (checkedList.length > 1) {
        this.$message({
          message: "请选择单个试题",
          type: "warning"
        });
        this.addStormParams.quizId = null;
        return;
      } else if (checkedList.length === 0) {
        this.$message({
          message: "请选择试题",
          type: "warning"
        });
        this.addStormParams.quizId = null;
        return;
      } else {
        this.addStormParams.quizId = checkedList[0].quizId;
      }
    },
    // 获取头脑风暴列表
    getStormList() {
      classStromeGet(this.addStormParams).then(response => {
        response.data.forEach(element => {
          element.stormTitle = matchReg(element.stormTitle);
        });
        this.stormList = response.data;
      });
    },
    // 确认添加头脑风暴
    addEnsure() {
      console.log(this.addStormParams);
      if (this.addStormParams.quizId === null) {
        this.$message({
          message: "试题选择有误",
          type: "warning"
        });
        return;
      } else {
        console.log(this.addStormParams);
        this.postStorm();
      }
    },
    // 手动添加
    manualAdd() {
      this.postStorm();
    },
    // 添加请求
    postStorm() {
      console.log(111,this.addStormParams)
      classStromeSave(this.addStormParams).then(response => {
        if (response.code === 200) {
          console.log(this.addStormParams);
          this.$message({
            message: "添加头脑风暴成功",
            type: "success"
          });
          this.$refs.modelAside.activeEvent(response.data);
          this.addStormParams.stormTitle = "";
          console.log(this.addStormParams.stormTitle)
          this.dialogVisible = false;
          this.getStormList();
          // 返回的对象做为参数传入获取方法
          this.activeStorme(response.data)
        } else if (response.code === 1000) {
          this.$message({
            message: response.msg,
            type: "warning"
          });
        }
      });
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
  },
  created() {
    Cookie.set("modelActive", "3");
    this.getStormList();
    getTestFileFold({ parentId: 0, searchKey: "" }).then(response => {
      this.fileList = this.filterData(response.data);
    });
  },
  components: {
    modelAside,
    Tree
  }
};
</script>

<style lang="stylus" scoped src="@/assets/css/menu-show.styl"></style>
<style lang="stylus" scoped>
.el-header {
  border-bottom: 1px solid rgb(215, 215, 215);
  line-height: 60px;
}

.answer-list {
  width: 100%;
  height: 150px;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  min-height: 400px;
  .item {
    box-sizing: border-box;
    background-color: white;
    flex: 0 0 30%;
    min-height: 180px;
    margin: 10px 20px;
  }
}

.answer-container {
  display: flex;
  align-items: center;
  width: 200px;
  justify-content: space-between;
}

.stu-image {
  width: 40px;
  height: 40px;
  overflow: hidden;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.el-footer {
  display: flex;
  justify-content: space-between;

  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>

