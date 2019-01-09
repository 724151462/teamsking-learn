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
    </el-main>
</template>

<script>
import { classingInfo, classOver, classSave } from "@/api/course";
import { connect } from "@/utils/socket";
import Cookie from "js-cookie";
export default {
    data(){
      return {
        isFullScreen: false,//是否全屏
        imgSrc :{
          full: require("@/assets/images/full.png"),
          unfull: require("@/assets/images/unfull.png"),
          }
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
      },
      getClass(){
        console.log('getClass执行')
        let loading = this.$loading({
          lock: true,
          text: '正在获取课堂信息',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        classingInfo({ courseId: this.$route.query.id }).then(response => {
          loading.close()
          if (response.data !== null) {
            this.$confirm("存在未结束的课堂，是否继续？", "提示", {
              confirmButtonText: "继续",
              cancelButtonText: "结束",
              type: "warning",
              // showCancelButton:false
            })
              .then(() => {
                this.enterClass();
              })
              .catch(() => {
                classOver({ classroomId: response.data.classroomId });
              });
          }
        });
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

