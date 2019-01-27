<template>
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header>
                <span class="course-name">{{courseName}}
                    <span style="font-size: 0.7em">{{chapterName}}</span>
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
                   <el-menu active-text-color="#fff" text-color="#000" :default-active="active" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                        <el-menu-item index="1">章节</el-menu-item>
                        <el-menu-item index="2">测验</el-menu-item>
                        <el-menu-item index="3">头脑风暴</el-menu-item>
                        <el-menu-item index="4">投票</el-menu-item>
                        <el-menu-item index="5">选答</el-menu-item>
                        <el-menu-item index="6">资源库</el-menu-item>
                    </el-menu> 
                </div>
                <router-view @showChapterName="getCNanme"></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  import { classOver } from "@/api/course";
  export default {
    data(){
        return{
            courseName: sessionStorage.getItem('courseName'),
            active: this.$store.state.modelActive,
            chapterName: ''
        }
    },
    created() {
        this.handleSelect(this.$store.state.modelActive)
    },
    
    methods: {
       getCNanme(value) {
           this.chapterName = value
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
          console.log('当前链接状态',this.$store.state.socket.isConnect)
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
          confirmButtonText: '直接结束',
          cancelButtonText: '开启签退',
          type: 'warning'
        }).then(() => {
          let loading = this.$loading({
            lock: true,
            text: '正在结束课堂',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          // this.$store.state.socket.classroomId
          classOver({ classroomId:  this.$route.query.classroomId}).then((res)=>{
            loading.close()
            console.log(res)
            this.$message.success('课堂已结束')
            this.$router.push({
              path: "/course/classend",
              query: {
                id: this.$route.query.id,
                classroomId: this.$store.state.socket.classroomId
              }
            });
          })
        }).catch(() => {
          this.$router.push({
            path: "/course/checked",
            query: {
              id: this.$route.query.id,
              classroomId: this.$store.state.socket.classroomId
            }
          });
        });
      },
      goCheck(){
        this.$router.push({
          path: "/course/check",
          query: {
            id: this.$route.query.id,
            classroomId: this.$store.state.socket.classroomId
          }
        });
      },
      goUser(){
        this.$router.push({path: "/course/modelChecked",});
      },
    },
    mounted(){}
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
    background: #409eff !important
    border none
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

