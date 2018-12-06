<template>
  <div class="groupPlan">
    <span style="display:inline-block;margin: 10px 0">
        <router-link :to="{name: '成员'}">成员</router-link> > 成员小组方案
    </span>
    <div class="nav">
      <el-button type="primary" @click="addPlan = true">+ 手动分组</el-button>
      <el-button type="primary" @click="isAddFa = true">+ 随机分组</el-button>
    </div>
    <div class="center">
      <div class="list" v-for="item in schemeList" :key="item.schemeId">
        <div class="title">{{item.schemeName}}</div>
        <div class="bottom">
          <span class="left">{{item.userCount | coutFilter}}人已被划分为小组，划分为{{item.teamCount | coutFilter}}个小组</span>
          <span class="right">
            <i class="el-icon-tickets">详情</i>
            <i class="el-icon-document">复制</i>
            <i class="el-icon-edit" @click="editPlan">编辑</i>
            <i class="el-icon-delete">删除</i>
          </span>
        </div>
      </div>
    </div>
    <el-dialog 
      width="40%"
      title="添加方案"
      :visible.sync="addPlan">
      <el-form>
        <el-form-item label="小组方案名称" required>
          <el-input v-model="groupPlan.schemeName"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="addPlan = false">取消</el-button>
        <el-button type="primary" @click="ensureAddPlan">确定</el-button>
      </div>
    </el-dialog>
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

        <div class="groupPlanLint">
          <div>5人为1小组</div>
          <div class="list" v-for="(item, index) in addGroup.zuList" :key="index">
            <div class="title">
              <span class="left">组1</span>
              <span class="right">
                <i class="el-icon-edit" @click="isUpGrouplan = true">改名</i>
                <i class="el-icon-delete">删除</i>
              </span>
            </div>
            <div class="all-img-list">
              <div class="img-list">
                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg" class="img">
              </div>
              <div class="add-img" @click="isAddGrouplan = true">+</div>
            </div>
          </div>
          <div class="add">
            <el-button type="primary">添加组</el-button>
          </div>
        </div>
        <div style="text-align: right;">
          <el-button @click="isAddFa = false">取消</el-button>
          <el-button type="primary" @click="isAddFa = false">确定</el-button>
        </div>
      </el-form>

      <!--修改组名-->
      <el-dialog
          title="修改组名"
          :visible.sync="isUpGrouplan"
          width="40%"
          append-to-body>
        <el-form>
          <el-form-item label="修改组名">
            <el-input v-model="addGroup.rssx" style="width: 220px;"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isUpGrouplan = false">取 消</el-button>
          <el-button type="primary" @click="isUpGrouplan = false">确 定</el-button>
        </span>
      </el-dialog>

      <!--添加成员-->
      <el-dialog
        title="选择成员"
        :visible.sync="isAddGrouplan"
        width="50%"
        custom-class="select-member"
        append-to-body>
        <div class="search">
          <el-radio v-model="group" label="1">全部成员</el-radio>
          <el-radio v-model="group" label="2" class="right">未分配小组成员</el-radio>
          <el-input placeholder="请输入成员名称" style="width:220px"></el-input>
          <el-button type="primary">搜索</el-button>
        </div>
        <div class="all-member">
          <div class="member-list" v-for="(list, index) in tableData" :key="index">
            <el-checkbox v-model="list.isCheck"></el-checkbox>
            <div class="imgs">
              <img :src="list.img">
            </div>
            <div class="right">
              <div>
                <span class="name">{{list.realName}}</span>
                <span class="sys" v-if="Number(list.assistantStatus) === 1">助教</span>
              </div>
              <div class="student">{{list.studentNo}}</div>
            </div>
          </div>
        </div>
        <div style="text-align: right">
          <el-button type="primary">已选择2人，确认选择</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {memberList, schemeAdd, schemeList} from '@/api/course'
export default {
  data(){
    return{
      courseId: '0608367675f54267aa6960fd0557cc1b',
      pageParmas: {
        pageSize:100
      },
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
        name:'',  //小组方案名称
        sx:'',    //分组上限
        //分组结构
        zulist:[
          {
            name:'我是组名称',
            //这里是组成员
            list:[
              {
                id:'1',
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
              },
              {
                id:'1',
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
              },
            ]
          }
        ]
      },
      schemeList: [],
      addPlan: false,
      groupPlan: {
        courseId: '0608367675f54267aa6960fd0557cc1b',
        schemeName: "",
        schemeType: 10
      },

      group:'1',  // 1 全部成员 2 未分配小组的成员
      isAddFa:false,
      isUpGrouplan:false,
      isAddGrouplan:false,
      tableData: [
        {
          isCheck:false,
          img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
          name:'小三',
          xh:'123123',  //这个是学号
          role:'1', //角色 1 学生 2 助教
        },
        {
          isCheck:false,
          img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
          name:'小三',
          xh:'123123',  //这个是学号
          role:'2', //角色 1 学生 2 助教
        },
        {
          isCheck:false,
          img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
          name:'小三',
          xh:'123123',  //这个是学号
          role:'1', //角色 1 学生 2 助教
        },
      ]
    }
  },
  created() {
    this.getPage(this.pageParmas)
    schemeList(this.courseId)
    .then((response)=> {
      this.schemeList = response.data
    })
  },
  methods: {
    getPage() {
      this.pageParmas.courseId = this.courseId
      memberList(this.pageParmas)
      .then((response)=> {
        this.tableData = response.data.pageData
        this.tableData.totalCount = response.data.totalCount
        this.tableData.pageSize = response.data.pageSize
        this.tableData.img = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg'
        console.log(this.tableData)
      })
    },
    // 添加方案名称
    ensureAddPlan() {
      schemeAdd(this.groupPlan)
      .then((response)=> {
        alert('添加成功')
      })
      this.addPlan = false
    },
    // 点击编辑弹窗
    editPlan() {
      this.isAddFa = true
    }
  },
  filters: {
    coutFilter(value) {
      if(value === null) {
        return 0
      } else {
        return value
      }
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
        width:50%
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

  .groupPlanLint
    margin-left:50px

    .list
      background:#F8F8F8
      padding:5px 10px

      .title
        border-bottom:1px solid #D8D8D8
        padding-bottom:5px
        overflow:hidden

        .right
          float:right

          i
            margin-left:20px

      .all-img-list
        padding-top:10px
        display: flex
        flex-wrap:wrap
        align-items:center

        .img-list
          width:50px
          height:50px
          overflow:hidden
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%

          .img
            width:auto

        .add-img
          font-size:50px
          width:50px
          height:50px
          text-align: center
          line-height: 40px
          border:1px solid #D8D8D8
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%
          margin-left:10px

    .add
      margin-top:10px

  .select-member
    .search
      .right
        margin-right:20px

    .all-member
      padding-bottom:10px
      height: 600px
      overflow scroll

      .member-list
        border-bottom:1px solid #CCCCCC
        padding-top:5px
        padding-bottom:5px
        display:flex
        flex-direction:row
        align-items:center
        
        .imgs
          width:50px
          height:50px
          overflow:hidden
          -webkit-border-radius: 50%
          -moz-border-radius: 50%
          border-radius: 50%
          margin-left:20px
          margin-right:20px

          img
            width:auto

        .right
          .name
            font-size:18px

          .sys
            font-size:14px
            display:inline-block
            background:#FF7D44
            padding-left:3px
            padding-right:3px
            color: #ffffff
            margin-left:10px
</style>
