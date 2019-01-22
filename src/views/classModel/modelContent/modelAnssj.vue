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
          <img :src="answerAvatar" width="300px" alt>
          <el-button
            type="primary"
            style="margin-top: 30px"
            @click="begin($event)"
          >{{subject.status === 'ready' ? '开始随机选人' : (subject.status === 'chooseing' ? '选人中' : '停止') }}</el-button>
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
      answerAvatar: require("@/assets/images/answer.png"),
      imgList: [
        {
          src: require("@/assets/images/qd.png")
        },
        {
          src: require("@/assets/images/sj.png")
        },
        {
          src: require("@/assets/images/sd.png")
        }
      ],
      timer: ""
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    begin(e) {
      console.log(e.currentTarget.innerHTML);
      this.timer = setInterval(this.getAnswer, 100);
      setTimeout(() => {
        clearInterval(this.timer);
        this.subject.status = "finished";
      }, 3000);
    },
    getAnswer() {
      console.log(Math.random() * 3);
      this.subject.status = "chooseing";
      this.answerAvatar = this.imgList[Math.floor(Math.random() * 3)].src;
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

