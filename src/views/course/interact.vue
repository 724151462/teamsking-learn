<template>
  <div class="interact">
    <div class="start-container">
      <div class="start-item">
        <span style="margin-right:30px">发起：</span>
        <div class="icon-group">
          <div><img :src="require('../../assets/images/vote.png')"/><router-link :to="{name: '发布投票', query: {id: $route.query.id}}">投票</router-link></div>
          <div><img :src="require('../../assets/images/brainStorme.png')"/><router-link :to="{name: '发布头脑风暴', query: {id: $route.query.id}}">头脑风暴</router-link></div>
          <div><img :src="require('../../assets/images/homeWork.png')"/><router-link :to="{name: '作业/小组任务', query: {id: $route.query.id}}">作业/小组任务</router-link></div>
          <div><img :src="require('../../assets/images/test.png')"/><router-link :to="{name: '发布测试', query: {id: $route.query.id}}">测试</router-link></div>
        </div>
      </div>
      <div><el-button>签到</el-button></div>
    </div>
    <div class="interact-radio">
      <el-radio-group v-model="interactParams.interactionStatus" @change="handleSelect">
        <el-radio label="">全部</el-radio>
        <el-radio label="10">未开始</el-radio>
        <el-radio label="20">进行中</el-radio>
        <el-radio label="30">已结束</el-radio>
      </el-radio-group>
    </div>
    <div class="collapse-container">
      <el-collapse>
        <el-collapse-item v-for="item in interactList" :key="item.chapterId">
          <template slot="title">
            <span style="margin-left: 20px">{{item.chapterName}}</span>
          </template>
          <div class="collapse-layout" v-for="interact in item.interactions" :key="interact.interactionId">
            <div class="collapse-layout interact-left" @click="toDetail(interact)">
              <img width="60px" :src="interactImg(interact.interactionType)" alt="">
              <div class="item-detail">
                <div>
                  <span  class="status">{{interact.interactionStatus | interactStatus}}</span>
                  <span style="margin-left: 10px">{{interact.interactionType | interactionType}}</span>
                  <span style="margin-left: 10px">{{interact.interactionName}}</span>
                </div>
                <div>
                  <span>共{{interact.quizCount}}道题目 | </span>
                  <span>共{{interact.userCount}}人作答 | {{interact.createTime}}</span>
                </div>
              </div>
            </div>
            <div class="interact-right">
              <el-tooltip placement="bottom" effect="light" v-if="interact.interactionStatus === 10">
                <div slot="content" style="margin-bottom:5px;cursor: pointer" @click="click123">直接开始</div>
                <div slot="content" style="cursor: pointer" @click="setEndTime">设置结束时间并开始</div>
                <div>
                  <i class="el-icon-caret-right"></i>
                  <span>开始互动</span>
                </div>
              </el-tooltip>
              <span v-else-if="interact.interactionStatus === 20">结束互动</span>
              <span v-else>已结束</span>
              <div>
                <span @click="editInteraction(interact)" v-if="interact.interactionStatus === 10">编辑</span>
                <span @click="deleteInteraction(interact)" style="margin-left:10px">删除</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 设置结束时间对话框 -->
    <el-dialog
      title="设置活动结束时间"
      :visible.sync="setEndTimeDialog"
      top="40vh"
      width="30%">
      <el-form v-model="endTimeForm">
        <el-input style="width:200px" v-model="endTimeForm.date" type="date"></el-input>
        &nbsp;
        <el-input style="width:200px" v-model="endTimeForm.time" type="time"></el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setEndTimeDialog = false">取 消</el-button>
        <el-button type="primary" @click="setEndTimeDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="确认删除"
      :visible.sync="deleteDialog"
      top="40vh"
      width="30%">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteEnsure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  interactList,
  stormDelete,
  homeworkDelete,
  voteDelete,
  examDelete
} from '@/api/course'
export default {
  data() {
    return {
      interactParams: {
        courseId: this.$route.query.id,
        interactionStatus: ''
      },
      setEndTimeDialog: false,
      endTimeForm: {
        date: '',
        time: ''
      },
      interactList: [],
      deleteDialog: false,
      delParams: {}
    }
  },
  mounted() {
    interactList(this.interactParams)
    .then(response=> {
      response.data.forEach(element => {
        // console.log(element)
        // element.interactions.forEach(item=> {
        //   item.interactionStatus = 20
        // }) 
      });
      this.interactList = response.data
    })
  },
  methods: {
    click123() {
      alert(123)
    },
    toDetail(val) {
      console.log(val.interactionStatus)
      if(val.interactionStatus === 10) {
        return
      }
      switch (val.interactionType) {
        case 30:
          return this.$router.push({path: '/course/list/interact/testresult', query: {id: this.$route.query.id, interactId: val.interactionId}})
          break;
        case 40:
          return this.$router.push({path: '/course/list/interact/homeworkresult', query: {id: this.$route.query.id, interactId: val.interactionId}})
          break;
        case 50:
          return this.$router.push({path: '/course/list/interact/brainresult', query: {id: this.$route.query.id, interactId: val.interactionId}})
          break;
        case 60:
          return this.$router.push({path: '/course/list/interact/voteresult', query: {id: this.$route.query.id, interactId: val.interactionId}})
          break;
      }
      // this.$router.push({path: '/course/list/interact/voteresult', query: {id: 123}})
      // this.$router.push({path: '/course/list/interact/brainresult', query: {id: 123}})
      // this.$router.push({path: '/course/list/interact/testresult', query: {id: 123}})
    },
    setEndTime() {
      this.setEndTimeDialog = true
    },
    interactImg(value) {
      switch (value) {
        case 30:
          return require('../../assets/images/test.png')
          break;
        case 40:
          return require('../../assets/images/homeWork.png')
          break;
        case 50:
          return require('../../assets/images/brainStorme.png')
          break;
        case 60:
          return require('../../assets/images/vote.png')
          break;
      }
      
    },
    handleSelect(value) {
      this.interactParams.interactionStatus = value
      console.log(this.interactParams)
      interactList(this.interactParams)
      .then(response=> {
        this.interactList = response.data
      })
    },
    editInteraction(item) {
      console.log(item)
      let routerParams = {
        id: this.interactParams.courseId,
        interactId: item.interactionId,
        operation: 'edit'
      }
      switch (item.interactionType) {
        case 30:
          this.$router.push({name: '发布测试',query:routerParams})
          break;
        case 40:
          this.$router.push({name: '作业/小组任务',query:routerParams})
          break;
        case 50:
          this.$router.push({name: '发布头脑风暴',query:routerParams})
          break;
        case 60:
          this.$router.push({name: '发布投票',query:routerParams})
          break;
      }
    },
    deleteInteraction(item) {
      this.delParams.delId = item.interactionId
      this.delParams.delType = item.interactionType
      this.deleteDialog = true
      console.log(item)
    },
    deleteEnsure() {
      console.log(this.delParams)
      switch (this.delParams.delType) {
        case 30:
          examDelete({examId: this.delParams.delId})
          .then(response=> {
            if(response.code === 200) {
              this.deleteHandle(this.delParams.delId)
            }
          })
          break;
        case 40:
          homeworkDelete({homeworkId: this.delParams.delId})
          .then(response=> {
            if(response.code === 200) {
              this.deleteHandle(this.delParams.delId)
            }
          })
          break;
        case 50:
          stormDelete({stormId: this.delParams.delId})
          .then(response=> {
            if(response.code === 200) {
              this.deleteHandle(this.delParams.delId)
            }
          })
          break;
        case 60:
          voteDelete({voteId: this.delParams.delId})
          .then(response=> {
            if(response.code === 200) {
              this.deleteHandle(this.delParams.delId)
            }
          })
          break;
      }
    },
    deleteHandle(id) {
      this.interactList.forEach(element=> {
        element.interactions.forEach((interact, i)=> {
          if(interact.interactionId === id) {
            element.interactions.splice(i, 1)
          }
        })
      })
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.deleteDialog = false
    }
  },
  filters: {
    // 活动状态
    interactStatus(value) {
      switch (value) {
        case 10:
          return '未开始'
          break;
        case 20:
          return '进行中'
          break;
        case 30:
          return '已结束'
          break;
      }
    },
    // 活动类型
    interactionType(value) {
      switch (value) {
        case 30:
          return '测试'
          break;
        case 40:
          return '作业/任务'
          break;
        case 50:
          return '头脑风暴'
          break;
        case 60:
          return '投票问卷'
          break;
      }
    }
  }
}
</script>

<style scoped lang="stylus" type="text/stylus">
div
  .start-container
    display flex
    justify-content space-between
    width 95%
    margin 0 auto
    margin-top 30px
    .start-item
      display flex
      width 60%
      align-items center
      .icon-group
        display flex
        width 55%
        justify-content space-between
        div
          display flex
          align-items center
          cursor pointer
          img 
            margin-right 10px
            width 25px
  .interact-radio
    margin 20px auto
    margin-left 2.5%
  .collapse-container
    width 95%
    margin 0 auto
    .collapse-layout
      display flex
      align-items center
      justify-content space-between
      margin 10px 0
      margin-left 10px
      cursor pointer
      .interact-left
        justify-content flex-start
        div
          margin-left 10px
      .item-detail
        display flex
        justify-content space-between
        flex-direction column
        height: 60px
        .status
          border 2px solid rgb(185,225,227)
          border-radius 5px
          color rgb(185,225,227)
          padding 1px 5px
      // .interact-right
      //   cursor pointer
</style>


