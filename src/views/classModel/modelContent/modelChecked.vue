<template>
  <div class="model-checked">
    <div class="header">
      成员
      <div class="nav-search">
        <div style="display: flex">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="search">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn" size="small" @click="getResource(0,0,search)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="gary-mask">
      <span>未签到(1人)</span>
      <span style="float: right;">点击可变更状态</span>
    </div>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="8">
        <div><img :src="require('@/assets/images/pdf.png')" alt="" class="user-avatar"></div>
      </el-col>
      <el-col :span="8" justify="center"><div>411212121</div></el-col>
      <el-col :span="8" justify="center"><div>sssss</div></el-col>
    </el-row>

    <div class="gary-mask">
      <div>已签到(37人)</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "modelChecked",
  }
</script>

<style scoped lang="stylus" type="text/stylus" >
  .model-checked
    .gary-mask
      background #ccc
      padding 5px
    .header
      padding 10px 0
      padding-left 20px;
      overflow hidden
      .nav-search
        float right
        width 250px
        padding-right 20px;
        .search-btn
          border-left 0
          background-color #fff
          border-radius 4px
    .user-avatar
      width: 40px;
      height 40px
      border-radius 50%
</style>