<template>
  <div class="check">
    <div class="class-info">{{courseName}}</div>
    <div class="check-time">
      <div class="time">
        <div class="time-text">{{this.time}}</div>
      </div>
    </div>
    <div class="check-btn" style="">
      <el-button type="primary" @click="closeSign">结束签到进入课堂</el-button>
    </div>
    <div class="check-num"> <span style="color: #409EFF;">{{studenlist.length}}</span>人已加入</div>
    <div class="check-avatar-warp">
      <div class="check-avatar-box " v-bind:class="{ 'first-check': index<3 }"
            v-for="(student,index) in studenlist" :key="student.id">
        <img  :src="student.imgSrc" alt="" class="check-avatar">
        <p style="text-align: center">{{student.usreName}}</p>
      </div>
    </div>
    <full-screen></full-screen>
  </div>
</template>

<script>
  import {
    classingInfo, classOver, classSave ,
    saveSign, signList, changeSign, checkUser
  } from "@/api/course";
  import {getUserInfo} from '@/api/user'
  import fullScreen from './fullScreen'
  export default {
    name: "check",
    data(){
      return{
        courseName:'',
        isFullScreen: false,//是否全屏
        time:'00:00',
        imgSrc :{
          full: require("@/assets/images/full.png"),
          unfull: require("@/assets/images/unfull.png"),
        },
        studenlist:[]
      }
    },
    components:{
      fullScreen
    },
    methods: {
      timeAdd(miaoNum = 0){
        let _this_ = this
        clearInterval(timer)
        let miao = 0,
            fen = 0;
        let timer = setInterval(function() {
          miao +=1
          miaoNum +=1
          if(miao >= 60){
            miao = 0
            fen +=1
          }
          fen=parseInt(miaoNum/60);
          miao=parseInt(miaoNum%60);

          miao = miao >= 10 ? String(miao) : '0'+miao
          fen = fen >= 10 ? String (fen) : '0'+fen
          _this_.time = (`${fen}:${miao}`)
        }, 1000)
      },
      //长连接开始签到
      startSign(){
        let tagClient = window.STOMP_CLIENT,
          token = sessionStorage.getItem('token'),
          userId = sessionStorage.getItem('userId'),
          courseId = sessionStorage.getItem('courseId'),
          beanId = sessionStorage.getItem('signId'),
          classroomId = sessionStorage.getItem('classroom');
        let signData = {classroomId , courseId ,signType:10,usedType:10};

        //开始签到前保存签到
        saveSign(signData)
          .then(res=>{
          console.log('保存签到成功')
          if(Number(res.code) === 200){
            sessionStorage.setItem('signId',res.data.signId)
            beanId = sessionStorage.getItem('signId');

            this.subClassroom()

            tagClient.send('/teamsking/course/sign/start',{'token': token},
              JSON.stringify({
                "bean":beanId,
                "classroomId":classroomId,
                "courseId":courseId,
                "userId":userId
              })
            );
          }else{
            this.$message.error('保存签到失败')
          }
        })
      },
      subClassroom(){
        let userId = sessionStorage.getItem('userId'),
            courseId = sessionStorage.getItem('courseId');
        //console.log('订阅成功')
        let _this_ = this;

        window.STOMP_CLIENT.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
          let data = result.body
          data = JSON.parse(data)
          console.log(data)
          if(data.data.socketType == 801 && data.data.socketData.courseId == courseId){
            console.log('--开始签到--')
            _this_.timeAdd()
            console.log(data.data)
          }
          if(data.data.socketType == 803 && data.data.socketData.courseId == courseId){
            console.log('学生签到')
            console.log(data.data)
            _this_.studentSign(data.data.socketData.userId)
          }
          if(data.data.socketType == 804 && data.data.socketData.courseId == courseId){
            console.log('错误签到')
            console.log(data.data)
            _this_.$message.error('签到错误')
          }
          if(data.data.socketType == 802 && data.data.socketData.courseId == courseId){
            console.log('结束签到')
            _this_.$message.success('签到结束')
            sessionStorage.setItem('isSign','YES')
            window.STOMP_CLIENT.unsubscribe();
            _this_.$router.push({path: "/course/classchapter"});
          }
        });
      },
      //有学生签到签到
      studentSign(data){
        console.log('开始查找用户信息')
        checkUser(data).then((res)=>{
          if (res.code === 200) {
            console.log(res)
            let data = {usreName:res.data.realName,imgSrc:res.data.avatar}
            this.studenlist.push(data)
          }else{
            this.$message.error('学生签到信息获取失败')
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      closeSign(){
        let tagClient = window.STOMP_CLIENT,
          token = sessionStorage.getItem('token'),
          userId = sessionStorage.getItem('userId'),
          courseId = sessionStorage.getItem('courseId'),
          signId = sessionStorage.getItem('signId'),
          classroomId = sessionStorage.getItem('classroom');

        tagClient.send('/teamsking/course/sign/close',{'token': token},
          JSON.stringify({
            "bean":signId,
            "classroomId":classroomId,
            "courseId":courseId,
            "userId":userId
          })
        );
      }
    },
    created(){
      this.courseName = sessionStorage.getItem('courseName')
      if(this.$route.query.recover){
        let data = JSON.parse(sessionStorage.getItem('signInfo'))
        this.timeAdd(data.duringTime)
        this.studenlist = data.userList
      }else{
        this.subClassroom()
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @media screen and (min-width: 400px) and (max-width: 700px) {
    .el-main {
      font-size: 20px !important;
    }
  }

  @media screen and (min-width: 1500px) and (max-width: 2000px) {
    .el-main {
      font-size: 15px !important;
    }
  }
  .check
    height 90%
    .class-info
      padding 5px 10px;
      font-size 20px
      background: #409eff !important
      color #fff
    .check-btn
      text-align: center
      display: flex
      justify-content: center
      margin-bottom: 20px
    .check-time
      display: flex;
      min-height 300px;
      height 40%
      justify-content: center; /* 水平居中 */
      align-items: center;     /* 垂直居中 */
      .time
        height 60%
        width 40%
        display flex
        align-items center
        text-align center
        background-color: rgb(117, 186, 255);
        border-radius: 8px;
        border 17px solid rgb(213, 234, 255);
        .time-text
          height 100%
          line-height 100%
          width 100%
          font-size 8em
          color #fff
          display: -webkit-box;
          -webkit-box-pack: center;
          box-pack: center;
          -webkit-box-align: center;
          box-align: center;
    .check-num
      height 30px
      padding 5px 0
      background #ccc
      text-align left
      padding-left 20px;
      font-size 16px;
    .check-avatar-warp
      align-self: flex-start
      text-align left
      .check-avatar-box
        margin 20px
        display inline-block
        .check-avatar
          width 60px
          height 60px
          align-self: flex-start
          border-radius 50%
          display inline-block
      .first-check
        display inline-block
        position relative
        &::after
          position absolute
          content: ''
          width 25px;
          height 25px;
          top -20px
          left 18px;
          background url("../../assets/images/tara.png")
          background-size: 25px 25px;
    .fullScreen
      position fixed
      bottom 20px;
      right 20px;
</style>