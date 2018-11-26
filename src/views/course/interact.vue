<template>
  <div class="interact">
    <div class="start-container">
      <div class="start-item">
        <span style="margin-right:30px">发起：</span>
        <div class="icon-group">
          <div><router-link to="interact/vote"><img :src="require('../../assets/images/vote.png')"/>投票</router-link></div>
          <div><img :src="require('../../assets/images/brainStorme.png')"/>头脑风暴</div>
          <div><img :src="require('../../assets/images/homeWork.png')"/>作业/小组任务</div>
          <div><img :src="require('../../assets/images/test.png')"/>测试</div>
        </div>
      </div>
      <div><el-button>签到</el-button></div>
    </div>
    <div class="interact-radio">
      <el-radio label="全部" value="全部"></el-radio>
      <el-radio label="未开始" value="未开始"></el-radio>
      <el-radio label="进行中" value="进行中"></el-radio>
      <el-radio label="已开始" value="已开始"></el-radio>
    </div>
    <div class="collapse-container">
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <span style="margin-left: 20px">第一章  第一节</span>
          </template>
          <div class="collapse-layout">
            <div class="collapse-layout interact-left">
              <img width="60px" :src="require('../../assets/images/vote.png')" alt="">
              <div class="item-detail">
                <div>
                  <span  class="status">进行中</span>
                  <span style="margin-left: 10px">投票问卷</span>
                  <span style="margin-left: 10px">关于按时交贷款的问卷调查</span>
                </div>
                <div>
                  <span>共2到题目|</span>
                  <span>共1人作答|2018-09-19</span>
                </div>
              </div>
            </div>
            <div class="interact-right">
              <el-tooltip placement="bottom" effect="light">
                <div slot="content" style="margin-bottom:5px;cursor: pointer" @click="click123">直接开始</div>
                <div slot="content" style="cursor: pointer" @click="setEndTime">设置结束时间并开始</div>
                <div>
                  <i class="el-icon-caret-right"></i>
                  <span>开始互动</span>
                </div>
              </el-tooltip>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      setEndTimeDialog: false,
      endTimeForm: {
        date: '',
        time: ''
      }
    }
  },
  methods: {
    click123() {
      alert(123)
    },
    setEndTime() {
      this.setEndTimeDialog = true
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
            margin-right 20px
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


