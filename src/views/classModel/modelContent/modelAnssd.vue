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
      <div class="img-container" v-if="isChoose === false">
        <div class="img" v-for="(item, index) in students" :key="index">
          <div class="img-outer">
            <img :src="item.src" width="50px" alt="" @click="choose(item)">
          </div>
          <span>{{item.userName}}</span>
        </div>
      </div>
      <div class="selected-container" v-else>
        <div class="img-outer selected">
          <img :src="answer.src" width="300px" alt="">
        </div>
        <span>{{answer.userName}}</span>
      </div>
      <div class="btn">
        <el-button type="primary" style="margin-top: 30px" @click="begin($event)">{{subject.status === 'ready' ? '选择完成' : '完成'}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [
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
      subject: {
        title: this.$route.query.subject || "",
        status: 'ready'
      },
      answerAvatar: require('@/assets/images/answer.png'),
      answer: {
        userName: '',
        src: '',
        userId: ''
      },
      timer: '',
      isChoose: false,
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    choose(info) {
      console.log(info)
      this.answer = info
      this.subClassroom()
      var that = this
      window.STOMP_CLIENT.send(
        "/teamsking/course/rushanswer/selection",
        {
          token: sessionStorage.getItem("token")
        },
        JSON.stringify({
          bean: {topicTitle: that.subject.title, selectedUserId: that.answer.userId},
          classroomId: that.$route.query.classroomId,
          courseId: that.$route.query.id,
          userId: sessionStorage.getItem("userId")
        })
      );
    },
    begin(e) {
      console.log(e.currentTarget.innerHTML)
      if(e.currentTarget.innerHTML === '<!----><!----><span>选择完成</span>'){
        if(this.answer.userName !== "") {
          this.isChoose = true
          this.subject.status = 'finish'
        }
      }
    },
    getAnswer() {
      this.isChoose = true
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
              type: 'success'
            })
          }
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.main
  width: 80%;
  margin: 50px auto;
  .answer-container
    margin-top: 50px;
    .back
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 25px;
      color: rgb(114, 193, 246);

      & span, img
        cursor: pointer;
    .back
      display flex
      justify-content flex-end
      align-items center
      font-size 25px
      color rgb(114,193,246)
      & span,img
        cursor pointer
    .btn
      display flex
      align-items center
      justify-content center
    .img
      display flex
      flex-direction column
      align-items center
      box-sizing: border-box;
      flex: 0 0 8%;
      height: 80px;
    .img-container
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      .img-outer
        height 50px
        width 50px
        overflow hidden
        border-radius 50px
    .selected-container
      display flex
      flex-direction column
      align-items center
      justify-content center
      span 
        margin-top 20px
        font-size 30px
        
      .img-outer
        height 50px
        width 50px
        overflow hidden
        border-radius 50px
      .selected
        margin 0 auto
        height 300px
        width 300px
        border-radius 150px
</style>

