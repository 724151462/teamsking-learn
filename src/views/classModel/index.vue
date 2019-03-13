<template>
    <el-main>
        <div class="inner-container">
            <div style="font-size: 1.5em">课堂模式已开启，课程资源及课程活动将自动投至大屏幕。</div>
            <div style="font-size: 3em">{{this.courseName}}</div>
            <div style="font-size: 2em">{{this.teacherName}}</div>
            <div style="font-size: 2.5em;cursor: pointer" @click="enterClass">进入课堂</div>
            <div style="display:flex; align-items: flex-start; width: 100%; font-size: 2em"><span style="margin-left:1em">课程号:{{this.courseCode}}</span></div>
            <!--<div  style="position : fixed;bottom :20px;right: 20px;" class="fullScreen" @click="full()">-->
              <!--<img :src="$store.state.isFullScreen ? require('@/assets/images/unfull.png') : require('@/assets/images/full.png') " alt="">-->
            <!--</div>-->
            <full-screen></full-screen>
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
import { classingInfo, classOver, classSave ,courseBaseInfo } from "@/api/course";
import {toggleFullScreen} from "@/utils/utils"
import fullScreen from './fullScreen'
import Cookie from "js-cookie";
export default {
    data(){
      return {
        courseName:'',
        courseCode:'',
        teacherName:'',
        dialogVisible:false
      }
    },
    components:{
      fullScreen
    },
    methods: {
      full(){
        this.$store.commit('SET_FULLSCREEN')
      },
      //获取课程信息
      initCourse(){
        courseBaseInfo(this.$route.query.id).then((res)=>{
          this.courseName = res.data.courseName
          this.courseCode = res.data.courseCode
          this.$store.commit('SAVE_NAME',res.data.courseName)
          sessionStorage.setItem('courseName',res.data.courseName)
        })
      },
      enterClass() {
        let loading = this.$loading({
          lock: true,
          text: '正在进入课堂',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let connect = new Promise((resolve, reject)=>{
          let url = window.sockterUrl,
            token = sessionStorage.getItem('token'),
            userId = sessionStorage.getItem('userId'),
            courseId = sessionStorage.getItem('courseId');
          let stompClient = Stomp.client(url);

          let _Vue_ = this
          //禁用控制台调试信息
          // stompClient.debug = null
          stompClient.connect({'token': token,'courseId':courseId}, function (frame) {
              window.STOMP_CLIENT = stompClient
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
                console.log('保存课堂',response)
                sessionStorage.setItem('classroom',response.data.classroomId)
                sessionStorage.setItem('isSign','NO')
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
          console.log(JSON.parse(data))
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
      },
    },
    created(){
      this.teacherName = sessionStorage.getItem('realName')
      // this.enterClass()
      document.onkeyup = (e)=> {
        console.log(e)
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 122) {//捕捉F11键盘动作
          e.preventDefault();  //阻止F11默认动作
          this.toggleFullScreen()
        }
      }
      sessionStorage.setItem('isFullScreen','')
    },
    mounted() {
      this.initCourse()
      this.getClass()
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
</style>

