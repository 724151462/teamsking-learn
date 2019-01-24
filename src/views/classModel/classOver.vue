<template>
  <div class="class-over">
    <el-header>
      <span class="course-name">{{courseName}}国际贸易</span>
      <div class="icon-div">
        <div class="icon-inner" @click="back" style="cursor: pointer;">
          <img :src="require('@/assets/images/over.png')" height="35px" alt="">
          <span >返回后台</span>
        </div>
      </div>
    </el-header>
    <div class="box-warp">
      <div class="box-item">
        <div>
          <img :src="require('@/assets/images/over.png')" height="35px" alt="">
        </div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div>
          <img :src="require('@/assets/images/over.png')" height="35px" alt="">
        </div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div><img :src="require('@/assets/images/over.png')" height="35px" alt=""></div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div><img :src="require('@/assets/images/over.png')" height="35px" alt=""></div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
    </div>
    <div>
      <p style="margin-left: 40px;">学生明细表</p>
      <el-button>导出ex表格</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="测验提交次数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="投票提交次数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="头脑风暴提交次数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="课堂出勤">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "classOver",
    data (){
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods:{
      back(){
        this.$router.push({
          path: "/course/list",
        });
      }
    },
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
  .class-over
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
    .box-warp
      display flex
      align-items center
      text-align right
      .box-item
        flex 1
        height 100px
        align-items center
        text-align right
        background yellow;
        padding 0 20px
        margin 40px
        display flex
        .box-text
          flex 1
          text-align right

</style>