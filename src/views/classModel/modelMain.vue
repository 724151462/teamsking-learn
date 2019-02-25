<template>
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header>
                <span class="course-name">{{courseName}}
                    <span style="font-size: 0.7em">{{currentInfo.chapterName}}</span>
                    
                    <span style="font-size: 0.7em; margin-left: 15px">{{currentInfo.sectionName}}</span>
                </span>
                <div class="icon-div">
                  <div class="icon-inner" style="cursor: pointer;" @click="goCheck">
                    <img :src="require('@/assets/images/user1.png')" height="35px" alt="">
                    <span>签到</span>
                  </div>
                    <div class="icon-inner" style="cursor: pointer;" @click="goUser">
                        <img :src="require('@/assets/images/user1.png')" height="35px" alt="">
                        <span>成员</span>
                    </div>
                    <div class="icon-inner" @click="closeClass" style="cursor: pointer;">
                        <img :src="require('@/assets/images/over.png')" height="35px" alt="">
                        <span >结束课堂</span>
                    </div>
                </div>
            </el-header>
            <el-main>
                <div style="height: 61px; width: 100%; background: #fff;">
                   <el-menu active-text-color="#409EFF" text-color="#000" :default-active="active" mode="horizontal" @select="handleSelect">
                        <el-menu-item index="1">章节</el-menu-item>
                        <el-menu-item index="2">测验</el-menu-item>
                        <el-menu-item index="3">头脑风暴</el-menu-item>
                        <el-menu-item index="4">投票</el-menu-item>
                        <el-menu-item index="5">选答</el-menu-item>
                        <el-menu-item index="6">资源库</el-menu-item>
                        <img :src="require('@/assets/images/back.png')"
                             v-show="isBack === true"
                             height="30px"
                             @click="$router.push({path: '/course/modelChapter'})"
                             style="margin: 0 20px;margin-top:15px;cursor: pointer" alt="">
                    </el-menu>
                </div>
                <router-view @showCurrentInfo="getCNanme"></router-view>
            </el-main>
        </el-container>
      <full-screen></full-screen>
    </div>
</template>

<script>
  import { classOver, hasCheck, saveSign} from "@/api/course";
  import fullScreen from './fullScreen'
  export default {
    data(){
      return{
        courseName: sessionStorage.getItem('courseName'),
        active: this.$store.state.modelActive,
        currentInfo: {
          chapterName: '',
          sectionName: ''
        },
        isBack:false
      }
    },
    components:{
      fullScreen
    },
    created() {
    },
    mounted () {
      this.isCheck()
    },
    watch: {
      $route (to, from) {
        to.path === '/course/modelChecked' ? this.isBack = true : this.isBack = false
      }
    },
    methods: {
      getCNanme(value) {
         this.currentInfo = value
      },
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
        // console.log('当前链接状态',this.$store.state.socket.isConnect)
        switch(key) {
            case '1':
            this.$router.push({
              path: '/course/modelChapter',
              query: {
                  id: this.$route.query.id,
                  classroomId: this.$route.query.classroomId
              }
            })
            break;
            case '2':
            this.$store.state.modelActive = '2'
            this.$router.push({
              path: '/course/modelTest',
              query: {
                  id: this.$route.query.id,
                  classroomId: this.$route.query.classroomId
              }
            })
            break;
            case '3':
            this.$router.push({
              path: '/course/modelStrome',
              query: {
                  id: this.$route.query.id,
                  classroomId: this.$route.query.classroomId
              }
            })
            break;
            case '4':
            this.$router.push({
              path: '/course/modelVote',
              query: {
                  id: this.$route.query.id,
                  classroomId: this.$route.query.classroomId
              }
            })
            break;
            case '5':
            this.$router.push({
              path: '/course/modelChooseAns',
              query: {
                id: this.$route.query.id,
                classroomId: this.$route.query.classroomId
              }
            })
            break;
            case '6':
            this.$router.push({
              path: '/course/modelResource',
              query: {
                id: this.$route.query.id,
                classroomId: this.$route.query.classroomId
              }
            })
            break;
        }
      },
      closeClass(){
        this.$confirm('是否开启课堂签退?', '结束课堂', {
          distinguishCancelAndClose: true,
          confirmButtonText: '直接结束',
          cancelButtonText: '开启签退',
          type: 'warning'
        }).then(() => {
            this.$router.push({path: "/course/classend",});
        }).catch((action => {
          if(action === 'cancel'){
            this.$router.push({
              path: "/course/checked",
            });
          }
        }))
      },
      goCheck(){
        if(sessionStorage.getItem('isSign') === 'NO'){
          this.$router.push({
            path: "/course/check",
            query: {
              id: this.$route.query.id,
              classroomId: this.$store.state.socket.classroomId
            }
          });
        }else{
          this.$message.warning('已经开启过签到了')
        }
      },
      //保存签到
      newSign(){
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
      //检查是否有未完成的签到
      isCheck(){
        console.log('检查')
        let data = {classroomId:Number(sessionStorage.getItem('classroom'))}
        hasCheck(data)
          .then(res=>{
            console.log(res)
          })
          .catch(err=>{console.log(err)})
      },
      goUser(){
        this.$router.push({path: "/course/modelChecked"});
      },
    }
}
</script>

<style lang="stylus" scoped>
@media screen and (min-width:1500px) and (max-width:2000px) { 
    .el-container{
        font-size: 15px!important;
    }
} 
.el-menu {
    position: fixed
    z-index 10
}
.el-menu.el-menu--horizontal {
    width 100%
}
.el-menu-item {
    width 200px
}
.el-menu-item.is-active {
    border-bottom: 2px solid #409EFF
}
.el-header
    display flex
    align-items center
    justify-content space-between
    background-color: rgb(63,159,255)
    color #fff;
    height 4.66em !important;
    .course-name
        font-size 2em;
    .icon-div
        display flex
        align-items center
        justify-content space-between
        width 200px
        .icon-inner
            display flex
            flex-direction column 
            align-items center
.el-main {
    color: #333;
    padding 0 !important
    height 100%
  }
.el-menu-item
    text-align center
    font-size 1.5em
</style>

