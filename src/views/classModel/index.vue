<template>
    <el-main>
        <div class="inner-container">
            <div style="font-size: 1.5em">课堂模式已开启，课程资源及课程活动将自动投至大屏幕。</div>
            <div style="font-size: 3em">国际贸易服务</div>
            <div style="font-size: 2em">陈老师</div>
            <div style="font-size: 2.5em;cursor: pointer" @click="enterClass">进入课堂</div>
            <div style="display:flex; align-items: flex-start; width: 100%; font-size: 2em"><span style="margin-left:1em">课程号:56734</span></div>
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
              <el-button @click="dialogVisible = false">结束</el-button>
              <el-button type="primary" @click="dialogVisible = false">继续</el-button>
            </span>
        </el-dialog>
    </el-main>
</template>

<script>
import { classingInfo, classOver, classSave } from "@/api/course";
import { connect } from "@/utils/socket";
import {startConect} from "@/utils/utils"
import Cookie from "js-cookie";
export default {
    data(){
      return {
        isFullScreen: false,//是否全屏
        imgSrc :{
          full: require("@/assets/images/full.png"),
          unfull: require("@/assets/images/unfull.png"),
          },
        dialogVisible:false
      }
    },
    methods: {
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
        let token = '9647dd84abb76fe6d78480b55f69d323',
            courseId='0608367675f54267aa6960fd0557cc1b',
            userId = '1';
          startConect(token,courseId,userId).then(
            (result)=>{
              console.log(result)
              classSave({ courseId: this.$route.query.id }).then(response => {
                if (response.code === 200) {
                  this.$router.push({
                    path: "/course/classchapter",
                    query: {
                      id: this.$route.query.id,
                      classroomId: response.data.classroomId
                    }
                  });
                }
              })
            },
            (error)=>{
              console.log(error,'连接失败,尝试重新连接中')
              startConect(token,courseId,userId)
            }
          ).catch((error)=>{
            console.log(error,'连接失败,尝试重新连接中')
            // startConect(token,courseId,userId)
          });

        // let that = this;
        // let loading = this.$loading({
        //   lock: true,
        //   text: '正在进入课堂',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // });
        // var socket = new SockJS('http://120.36.137.90:9008/websocket');
        // let stompClient = Stomp.over(socket);
        // // try {
        // stompClient.connect({'token': '9647dd84abb76fe6d78480b55f69d323','courseId':'0608367675f54267aa6960fd0557cc1b'}, function (frame) {
        //     that.$store.commit('NEW_SOCKET',stompClient)
        //     console.log(this,'成功')
        //     stompClient.subscribe('/teamsking/helloWorld', function (result) {
        //       console.log(result);
        //     },{'token': "9647dd84abb76fe6d78480b55f69d323"});
        //     stompClient.subscribe('/user/' + 1 + '/teamsking/classroom',function(result){
        //       console.log(result);
        //     });
        //     classSave({ courseId: that.$route.query.id }).then(response => {
        //       loading.close()
        //       if (response.code === 200) {
        //         that.$router.push({
        //           path: "/course/classchapter",
        //           query: {
        //             id: that.$route.query.id,
        //             classroomId: response.data.classroomId
        //           }
        //         });
        //       }
        //     });
        //   },
        //   function errorCallBack (error) {
        //     // 连接失败时（服务器响应 ERROR 帧）的回调方法
        //     console.log('error');
        //   }
        // )
        // new Promise(connect)
        //   .then(function(result) {
        //     loading.close()
        //     console.log("成功：" + result);
        //     that.$store.commit('NEW_SOCKET',result)
        //     classSave({ courseId: that.$route.query.id }).then(response => {
        //       if (response.code === 200) {
        //         that.$router.push({
        //           path: "/course/classchapter",
        //           query: {
        //             id: that.$route.query.id,
        //             classroomId: response.data.classroomId
        //           }
        //         });
        //       }
        //     });
        //   })
        //   .catch(function(reason) {
        //     that.enterClass();
        //   });
      },
      getClass(){
        let loading = this.$loading({
          lock: true,
          text: '正在获取课堂信息',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        classingInfo({ courseId: this.$route.query.id }).then( res => {
          loading.close()
          if(res.data){
            this.dialogVisible = true
          }else{
            this.$store.commit('SAVE_INFO',{
              courseId : this.$route.query.id,
              userId: Cookie.get('userId'),
              token: Cookie.get('token')
            })
          }
        });
      },
      closeClass(){
        classOver({ courseId: this.$route.query.id }).then((res)=>{
          console.log(res)
            this.$message.success('课堂已结束')
            alert('跳转到课堂结束结束页面')
        })
      }
    },
    created(){
      // this.getClass()
    },
    mounted() {
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
            .fullScreen
              position fixed
              bottom 20px;
              right 20px;
</style>

