<template>
    <el-main>
        <div class="inner-container">
            <div style="font-size: 1.5em">课堂模式已开启，课程资源及课程活动将自动投至大屏幕。</div>
            <div style="font-size: 3em">{{this.courseName}}</div>
            <div style="font-size: 2em">陈老师</div>
            <div style="font-size: 2.5em;cursor: pointer" @click="enterClass">进入课堂</div>
            <div style="display:flex; align-items: flex-start; width: 100%; font-size: 2em"><span style="margin-left:1em">课程号:{{this.courseCode}}</span></div>
            <div class="fullScreen" @click="fullScreen">
              <img :src="isFullScreen ? imgSrc.unfull : imgSrc.full" alt="">
            </div>
        </div>
        <el-dialog title="提示"
                  :visible.sync="dialogVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :show-close="false"
                   width="30%">
          <span>您有一个正在进行的课堂,是否继续该课堂？</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeClass">结束</el-button>
              <el-button type="primary" @click="goBackClass">继续</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
import { classingInfo, classOver, classSave ,courseBaseInfo} from "@/api/course";
import {connect} from "@/utils/utils"
import Cookie from "js-cookie";
import {reResFileFold} from "../../api/library";
export default {
    data(){
      return {
        courseName:'',
        courseCode:'',
        isFullScreen: false,//是否全屏
        imgSrc :{
          full: require("@/assets/images/full.png"),
          unfull: require("@/assets/images/unfull.png"),
          },
        dialogVisible:false
      }
    },
    methods: {
      //获取课程信息
      initCourse(){
        courseBaseInfo(this.$route.query.id).then((res)=>{
          this.courseName = res.data.courseName
          this.courseCode = res.data.courseCode
          this.$store.commit('SAVE_NAME',res.data.courseName)
        })
      },
      //获取教师
      fullScreen() {
        if (document.fullscreenElement) {
          document.exitFullscreen()
          this.isFullScreen = false
        } else {
          document.documentElement.requestFullscreen()
          this.isFullScreen = true
        }
      },
      enterClass() {
        let loading = this.$loading({
          lock: true,
          text: '正在进入课堂',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let connect = new Promise((resolve, reject)=>{
          let url = 'ws://120.36.137.90:9008/websocket',
            token = sessionStorage.getItem('token'),
            userId = sessionStorage.getItem('userId'),
            courseId = sessionStorage.getItem('courseId');
          let stompClient = Stomp.client(url);
          // let stompClient = Stomp.over(socket);
          let _this_ = window
          let _Vue_ = this
          //禁用控制台调试信息
          // stompClient.debug = null
          stompClient.connect({'token': token,'courseId':courseId}, function (frame) {
              // stompClient.subscribe('/teamsking/helloWorld', function (result) {
              //   console.log(result);
              // },{'token': token});
              // stompClient.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
              //   console.log(result);
              // });
              window.STOMP_CLIENT = stompClient
              // _Vue_.subClassroom()
              // this.$store.commit('SAVE_CLASSROME',res.data.classroomId)
            // window.STOMP_CLIENT = stompClient
            let client = JSON.stringify(stompClient)
            sessionStorage.STOMP_CLIENT = client
              resolve('连接成功');
            },
            function errorCallBack (error) {
              // 连接失败时（服务器响应 ERROR 帧）的回调方法
              reject('连接失败');
            }
          )
        }).then((result)=>{
            loading.close()
            classSave({ courseId: this.$route.query.id }).then(response => {
              if (response.code === 200) {
                console.log(response)
                sessionStorage.setItem('classroom',response.data.classroomId)
                this.$router.push({
                  path: "/course/classchapter",
                  query: {
                    id: this.$route.query.id,
                    classroomId: response.data.classroomId
                  }
                });
              }
            })
          }).catch((error)=>{
            loading.close()
            console.log(error,'连接失败,尝试重新连接中')
            this.enterClass()
          });
      },
      //订阅classroom
      subClassroom(){
        let userId = sessionStorage.getItem('userId');
        window.STOMP_CLIENT.subscribe('/user/' + userId + '/teamsking/classroom',function(result){
          let data = result.body
          JSON.parse(data)
          console.log(JSON.parse(data))
          if(data.socketType == 803){
            this.$message.info('有学生签到')
          }
          if(data.socketType == 804){
            this.$message.error('签到错误')
          }
        });
      },
      getClass(){
        let loading = this.$loading({
          lock: true,
          text: '正在获取课堂信息',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        classingInfo({ courseId: this.$route.query.id }).then( res => {
          console.log(res)
          loading.close()
          if(res.data){
            sessionStorage.setItem('classroom',res.data.classroomId)
            // this.$store.commit('SAVE_CLASSROME',res.data.classroomId)
            this.dialogVisible = true
          }else{
            sessionStorage.setItem('userId',Cookie.get('userId'))
            sessionStorage.setItem('token',Cookie.get('BackstageToken'))
            sessionStorage.setItem('courseId',this.$route.query.id)
          }
        });
      },
      closeClass(){
        let loading = this.$loading({
          lock: true,
          text: '正在结束课堂',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        classOver({ classroomId: sessionStorage.getItem('classroom') }).then((res)=>{
          loading.close()
          console.log(res)
            this.$message.success('课堂已结束')
            this.$router.push({
              path: "/course/classend",
              query: {
                id: this.$route.query.id,
                classroomId: sessionStorage.getItem('classroom')
              }
            });
        })
      },
      //重新进入课堂
      goBackClass(){
        this.$router.push({
          path: "/course/classchapter",
          query: {
            id: this.$route.query.id,
            classroomId: sessionStorage.getItem('classroom')
          }
        });
      }
    },
    created(){
      // this.getClass()
    },
    mounted() {
      this.getClass()
      this.initCourse()
    }
};
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
    .el-main
        display flex
        align-items center
        justify-content center
        font-size 62.5%
        background-color: rgb(63,159,255)
        color: #333
        text-align: center
        width: 100%
        height: 100%
        .inner-container
            display flex
            align-items center
            justify-content space-around
            flex-direction column
            color #fff
            width 90%
            height 90%
            border 10px solid #fff
            .fullScreen
              position fixed
              bottom 20px;
              right 20px;
</style>

