<template>
  <div class="groupPlan">
    <div class="nav">
      <el-button type="primary" @click="isAddFa = true">+ 添加成员小组方案</el-button>
    </div>
    <div class="center">
      <div class="list">
        <div class="title">成员小组方案1</div>
        <div class="bottom">
          <span class="left">2人已被划分为小组，划分为1个小组</span>
          <span class="right">
            <i class="el-icon-tickets">详情</i>
            <i class="el-icon-document">复制</i>
            <i class="el-icon-edit">编辑</i>
            <i class="el-icon-delete">删除</i>
          </span>
        </div>
      </div>
    </div>

    <el-dialog
        width="60%"
        title="添加成员小组方案"
        :visible.sync="isAddFa"
        append-to-body>

      <el-form :model="addGroup" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="小组方案名称" required>
          <el-input v-model="addGroup.name" style="width: 220px;"></el-input>
        </el-form-item>

        <el-form-item label="分组上限" required>
          <el-input v-model="addGroup.sx" style="width: 220px;"></el-input>
        </el-form-item>

        <el-form-item label="分组人数上限" required>
          <el-input v-model="addGroup.rssx" style="width: 220px;"></el-input>
        </el-form-item>

        <el-button type="primary">添加组</el-button>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        data:[
          {
            title:'小组方案1',
            folk:12, //人数
            group:1,  //组数
          },
          {
            title:'小组方案1',
            folk:12, //人数
            group:1,  //组数
          },
        ],
        addGroup:{
          name:'',
          sx:'',
          rssx:''
        },
        isAddFa:false
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .groupPlan
    .nav
      padding-top:10px
      padding-bottom:10px

    .center
      padding-top:10px

      .list
        width:70%
        display: inline-block
        background:#F8F8F8
        padding:10px 5px

        .title
          padding-bottom:10px
          border-bottom:1px solid #E6E6E6
          margin-bottom:10px

        .bottom
          overflow:hidden

          .right
            float:right

            i
              margin-right:10px
              cursor:pointer
</style>