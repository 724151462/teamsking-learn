<template>
  <div>
    <div style="padding:60px 0 20px 0;border-bottom: 1px solid rgb(215, 215, 215)">
      <div class="search-box">
        <el-input
          placeholder="请选择日期"
          v-model="input1">
          <i slot="suffix" class="el-input__icon el-icon-search i-btn" @click="btnClick"></i>
        </el-input>
      </div>
    </div>
    <div style="padding: 0 100px;">
      <p>讨论中心</p>
      <h4 class="topic"><b>全部主题</b></h4>
      <div class="content-warp">
        <div>
          <p>请问我来迟了，怎么办？</p>
          <p>
            <span class="auto">发布者：三年又三年</span>
            <span class="time">2018-9-1</span>
          </p>
        </div>
        <div>浏览:8 / 回复:0</div>
        <div><i class="el-icon-delete" style="color: green;font-size: 20px;"></i></div>
      </div>
      <div class="content-warp">
        <div>
          <p>请问我来迟了，怎么办？</p>
          <p>
            <span class="auto">发布者：三年又三年</span>
            <span class="time">2018-9-1</span>
          </p>
        </div>
        <div>浏览:8 / 回复:0</div>
        <div><i class="el-icon-delete" style="color: green;font-size: 20px;"></i></div>
      </div>
      <div style="padding-top: 50px;text-align: center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        input1: '',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      btnClick () {
        console.log('点击了')
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .search-box
    width: 300px;
    margin: 0 auto
    .i-btn
      cursor: pointer
  .topic
    padding 15px 0;
    padding-left 15px;
    border-bottom: 1px solid rgb(215, 215, 215)
  .content-warp
    display flex
    cursor: pointer
    font-size 13px;
    padding 15px 0;
    padding-left 15px;
    border-bottom: 1px solid rgb(215, 215, 215)
    .auto
      color #218001
      font-size 10px
    .time
      font-size 10px
      color darkgray
      margin-left 20px;
    & div:first-child
      flex 1
    & div:nth-child(2)
      width 100px;
      padding-right 20px;
</style>