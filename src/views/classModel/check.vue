<template>
  <div class="check">
    <div class="class-info">{{$store.state.socket.courseName}}</div>
    <div class="check-time">
      <div class="time">
        <div class="time-text">{{this.time}}</div>
      </div>
    </div>
    <div class="check-btn" style="">
      <el-button type="primary" @click="closeSign">结束签到并进入课堂</el-button>
      <el-button type="primary" @click="startSign">开始签到</el-button>
    </div>
    <div class="check-num"> <span style="color: #409EFF;">12</span>人已加入</div>
    <div class="check-avatar-warp">
      <div class="check-avatar-box first-check" v-for="(student,index) in studenlist" :key="student.id">
        <img  :src="imgSrc.full" alt="" class="check-avatar">
        <p style="text-align: center">{{student.name}}</p>
      </div>
    </div>
    <div class="fullScreen" @click="fullScreen">
      <img :src="isFullScreen ? imgSrc.unfull : imgSrc.full" alt="">
    </div>
  </div>
</template>

<script>
  import { classingInfo, classOver, classSave } from "@/api/course";

  import {sign,signClose, connect} from "../../utils/utils";
  import Cookie from "js-cookie";

  export default {
    name: "check",
    data(){
      return{
        isFullScreen: false,//是否全屏
        time:'00:00',
        imgSrc :{
          full: require("@/assets/images/full.png"),
          unfull: require("@/assets/images/unfull.png"),
        },
        studenlist:[
          {name:'王某'},
          {name:'王某某某'},
          {name:'王某'},
          {name:'王是某'},
          {name:'王某某'},
          {name:'王某'},
          {name:'王某'},
          {name:'王某'},
        ]
      }
    },
    methods: {
      timeAdd(){
        let _this_ = this
        clearInterval(timer)
        let miao = 0,
            fen = 0,
            miaoNum = 0;

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

          // console.log(miaoNum)
          // console.log(fen + miao);
          _this_.time = (`${fen}:${miao}`)
        }, 1000)
      },
      fullScreen(){
        if (document.fullscreenElement) {
          document.exitFullscreen()
          this.isFullScreen = false
        } else {
          document.documentElement.requestFullscreen()
          this.isFullScreen = true
        }
      },
      startSign(){
        sign()
      },
      closeSign(){

      },
      enter(){
        console.log('执行')
        var socket = new SockJS('http://120.36.137.90:9008/websocket');
        stompClient = Stomp.over(socket);
        console.log(stompClient)
        stompClient.connect({'token': '9647dd84abb76fe6d78480b55f69d323','courseId':'1'}, function (frame) {
            stompTopic();
            stompQueue();
            resolve('200 OK')
          },
          function errorCallBack (error) {
            // 连接失败时（服务器响应 ERROR 帧）的回调方法
            reject('error');
          }
        )
      },
      enterClass() {
        let that = this;
        let loading = this.$loading({
          lock: true,
          text: '正在进入课堂',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        new Promise(connect)
          .then(function(result) {
            loading.close()
            console.log("成功：" + result);
            classSave({ courseId: that.$route.query.id }).then(response => {
              if (response.code === 200) {
                that.$router.push({
                  path: "/course/classchapter",
                  query: {
                    id: that.$route.query.id,
                    classroomId: response.data.classroomId
                  }
                });
              }
            });
          })
          .catch(function(reason) {
            that.enterClass();
          });
      }
    },
    mounted(){
      // this.startSign()
      // this.getClass()
    },
    created(){
      this.timeAdd()
      // this.startSign()
      // this.getClass()
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