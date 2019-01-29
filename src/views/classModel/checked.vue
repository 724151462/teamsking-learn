<template>
  <div class="checked">
    <div class="class-info">{{courseName}}</div>
    <div style="padding: 40px;margin-bottom: 20px;">
      <div class="check-num">已签:{{this.studenlist.length}}/43</div>
      <div class="check-avatar-warp">
        <div class="check-avatar-box"
             v-for="(student) in studenlist" :key="student.id">
          <img  :src="student.imgSrc" alt="" class="check-avatar">
          <p style="text-align: center">{{student.usreName}}</p>
        </div>
      </div>
    </div>
    <div class="outBtn">
      <el-button  type="primary" @click="closeSign">结束签退</el-button>
    </div>
    <div class="fullScreen" @click="toggleFullScreen">
      <img :src="isFullScreen ? imgSrc.unfull : imgSrc.full" alt="">
    </div>
  </div>
</template>

<script>
  import {
    classingInfo, classOver, classSave ,
    saveSign, signList, changeSign
  } from "@/api/course";
  import {getUserInfo} from '@/api/user'
  export default {
    name: "checked",
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
    methods:{
      toggleFullScreen() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();

          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();

          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
          this.isFullScreen = true
          // console.log('全屏')
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
          this.isFullScreen = false
          // console.log('退出全屏')
        }
      },
      //长连接开始签到
      startSign(){
        let tagClient = window.STOMP_CLIENT,
          token = sessionStorage.getItem('token'),
          userId = sessionStorage.getItem('userId'),
          courseId = sessionStorage.getItem('courseId'),
          classroomId = sessionStorage.getItem('classroom');
        let signData = {classroomId , courseId ,signType:10,usedType:20};

        //开始签到前保存签到
        saveSign(signData)
          .then(res=>{
            console.log('保存签到成功')
            if(Number(res.code) === 200){
              this.subClassroom()
              sessionStorage.setItem('signOutId',res.data.signId)
              tagClient.send('/teamsking/course/sign/start',{'token': token},
                JSON.stringify({
                  "bean":res.data.signId,
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
        let userId = sessionStorage.getItem('userId');
        console.log('订阅成功')
        let _this_ = this;

        window.STOMP_CLIENT.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
          let data = result.body
          data = JSON.parse(data)

          if(data.data.socketType == 801){
            console.log('--开始签退--')
            console.log(data.data)
          }
          if(data.data.socketType == 803){
            console.log('学生签到')
            console.log(data.data)
            _this_.studentSign(data.data.socketData.userId)
          }
          if(data.data.socketType == 804){
            console.log('错误签到')
            console.log(data.data)
            _this_.$message.error('签到错误')
          }
          if(data.data.socketType == 802){
            console.log('结束签退')
            console.log(data.data)
            window.STOMP_CLIENT.unsubscribe();
            _this_.$router.push({
              path: "/course/classend",
            });
          }
        });
      },
      //有学生签到签到
      studentSign(data){
        console.log('开始查找用户信息')
        getUserInfo(data).then((res)=>{
          if (res.code === 200) {
            console.log(res)
            let data = {usreName:res.data.userName,imgSrc:res.data.avatar}
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
          signId = sessionStorage.getItem('signOutId'),
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
      this.startSign()
      this.courseName = sessionStorage.getItem('courseName')
    }
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
  .checked
    height 100%
    .class-info
      padding 5px 10px;
      font-size 20px
      background: #409eff !important
      color #fff
    .check-num
      height 30px
      color #409eff
      padding 5px 0
      font-weight 600
      text-align center
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
      z-index: 666
      right 20px;
    .outBtn
      position fixed
      bottom 20px;
      right calc(50% - 60px);
      z-index 666
</style>