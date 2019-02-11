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
          <router-link :to="{
                path: '/course/modelChooseAns', 
                query: {
                id: $route.query.id,
                classroomId: $route.query.classroomId,
                subject: subject.title
                }}">{{subject.status === 'ready' || subject.status === 'finished' ? '返回' : '结束并返回'}}</router-link>
        </div>
        <div class="avatar-btn">
          <img :src="answer.answerAvatar" width="300px" alt="">
          <span>{{answer.answerName}}</span>
          <el-button type="primary" style="margin-top: 30px" @click="begin($event)">{{subject.status === 'ready' ? '开始抢答' : '完成'}}</el-button>
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
        status: 'ready'
      },
      answer: {
        answerAvatar: require('@/assets/images/answer.png'),
        answerName: ''
      },
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
      timer: ''
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    begin(e) {
      console.log(e.currentTarget.innerHTML)
      var that = this
      if(e.currentTarget.innerHTML === '<!----><!----><span>开始抢答</span>'){
        this.subject.status = 'begin'
        this.subClassroom()
        window.STOMP_CLIENT.send(
          "/teamsking/course/rushanswer/rush",
          {
            token: sessionStorage.getItem("token")
          },
          JSON.stringify({
            bean: that.subject.title || '抢答',
            classroomId: that.$route.query.classroomId,
            courseId: that.$route.query.id,
            userId: sessionStorage.getItem("userId")
          })
        );
      }else{
        this.subject.status = 'finished'
      }
    },
    subClassroom(){
      let userId = sessionStorage.getItem('userId');
      var that = this
      window.STOMP_CLIENT.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
        let socketData = JSON.parse(result.body).data.socketData
        let socketType = JSON.parse(result.body).data.socketType
        console.log(socketType, socketData)
        if(socketType === 901) {
          // that.answerAvatar = socketData.username
          that.answer.answerName = socketData.realName
          that.answer.answerAvatar = socketData.avatar
        }
      });
    },
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
      display flex
      justify-content flex-end
      align-items center
      font-size 25px
      color rgb(114,193,246)
      & span,img
        cursor pointer
    .avatar-btn
      display flex
      flex-direction column
      align-items center
      justify-content center
      
</style>

