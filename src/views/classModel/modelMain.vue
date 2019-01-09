<template>
    <div style="height: 100%">
        <el-container style="height: 100%">
            <el-header>
                <span class="course-name">{{courseName}}</span>
                <div class="icon-div">
                    <div class="icon-inner">
                        <img :src="require('@/assets/images/user1.png')" height="35px" alt="">
                        <span>成员</span>
                    </div>
                    <div class="icon-inner">
                        <img :src="require('@/assets/images/over.png')" height="35px" alt="">
                        <span>结束课堂</span>
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
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    data(){
        return{
            courseName: "国际服务贸易",
            active: this.$store.state.modelActive
        }
    },
    methods: {
        handleSelect(key, keyPath) {
        console.log(key, keyPath);
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
    },
    mounted(){

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
        width 120px
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

