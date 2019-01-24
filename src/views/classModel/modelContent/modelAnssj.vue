<template>
  <div class="main">
    <div style="margin-left: 180px">
      <el-input
        style="width:80%;margin-right:20px"
        v-model="subject.title"
        placeholder="老师口述题目或在此输入一句话描述本次活动"
      ></el-input>
    </div>
    <div class="answer-container">
      <div>
        <div class="back">
          <img :src="require('@/assets/images/back.png')" height="30px" alt>
          <router-link
            :to="{
                path: '/course/modelChooseAns', 
                query: {
                id: $route.query.id,
                classroomId: $route.query.classroomId,
                subject: subject.title
                }}"
          >{{subject.status === 'ready' || subject.status === 'finished' ? '返回' : '结束并返回'}}</router-link>
        </div>
        <div class="avatar-btn">
          <img :src="answer.answerAvatar" width="300px" alt>
          <span>{{answer.answerName}}</span>
          <el-button
            type="primary"
            style="margin-top: 30px"
            @click="begin($event)"
          >{{subject.status === 'ready' ? '开始随机选人' : (subject.status === 'chooseing' ? '选人中' : '完成') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subject: {
        title: this.$route.query.subject || "",
        status: "ready"
      },
      answer: {
        answerAvatar: require("@/assets/images/answer.png"),
        answerName: "",
        userId: ""
      },
      olUserList: [
        {
          src: require("@/assets/images/qd.png"),
          userName: "抢答哥",
          userId: 1
        },
        {
          src: require("@/assets/images/sj.png"),
          userName: "随机妹",
          userId: 2
        },
        {
          src: require("@/assets/images/sd.png"),
          userName: "手动姐",
          userId: 3
        }
      ],
      timer: ""
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    // 获取长连接下参与的学生
    getOnlineUser() {
      var that = this;
      window.STOMP_CLIENT.send(
        "/teamsking/course/classroom/onlineuser",
        {
          token: sessionStorage.getItem("token")
        },
        JSON.stringify({
          bean: "",
          classroomId: that.$route.query.classroomId,
          courseId: that.$route.query.id,
          userId: sessionStorage.getItem("userId")
        })
      );
    },
    begin(e) {
      console.log(e.currentTarget.innerHTML);
      var that = this;
      if (
        e.currentTarget.innerHTML === "<!----><!----><span>开始随机选人</span>"
      ) {
        this.timer = setInterval(this.getAnswer, 100);
        this.subClassroom();
        this.getOnlineUser();
        setTimeout(() => {
          clearInterval(this.timer);
          console.log(this.answer);
          window.STOMP_CLIENT.send(
            "/teamsking/course/rushanswer/randomselection",
            {
              token: sessionStorage.getItem("token")
            },
            JSON.stringify({
              bean: {
                topicTitle: that.subject.title,
                selectUserId: that.answer.userId
              },
              classroomId: that.$route.query.classroomId,
              courseId: that.$route.query.id,
              userId: sessionStorage.getItem("userId")
            })
          );
          this.subject.status = "finished";
        }, 3000);
      }
    },
    getAnswer() {
      this.subject.status = "chooseing";
      let randomNum = Math.floor(Math.random() * 3);
      this.answer.answerAvatar = this.olUserList[randomNum].src;
      this.answer.answerName = this.olUserList[randomNum].userName;
      this.answer.userId = this.olUserList[randomNum].userId;
      // console.log(this.olUserList);
    },
    subClassroom() {
      let userId = sessionStorage.getItem("userId");
      var that = this;
      window.STOMP_CLIENT.subscribe(
        "/user/" + userId + "/teamsking/classroom",
        function(result) {
          let socketData = JSON.parse(result.body).data.socketData;
          let socketType = JSON.parse(result.body).data.socketType;
          console.log(socketType, socketData);
          if (socketType === 903) {
            that.$message({
              message: `那么今天的受害者是：${that.answer.answerName}！！！`,
              type: "success"
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.main {
  width: 80%;
  margin: 50px auto;

  .answer-container {
    margin-top: 50px;

    .back {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 25px;
      color: rgb(114, 193, 246);

      & span, img {
        cursor: pointer;
      }
    }

    .avatar-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

