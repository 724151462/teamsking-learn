<template>
    <div>
      <el-row>
        <el-button round size="small">全部课程（100）</el-button>
        <el-button round size="small">已发布（100）</el-button>
        <el-button round size="small">未发布（100）</el-button>
        <el-button round size="small">已关闭（11）</el-button>
        <div class="list-search">
          <el-input v-model="listQuery.courseName" type="text" placeholder="请输入课程名称" style="width:180px;margin-left: 100px;"></el-input>
          <el-button type="primary" @click="getList">搜索</el-button>
        </div>
        <el-button type="primary" round style="margin-left: 50px;" @click="goAddCourse">创建课程</el-button>
      </el-row>

      <el-row>
        <el-row style="background:#F3F3F3;padding:10px 0 10px 10px;margin-top: 20px;">课程列表</el-row>
        <el-row class="course-table">
          <div class="img">
            <span class="tib">未发布</span>
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=108228188,2741176027&fm=27&gp=0.jpg">
          </div>
          <div class="center">
            <div class="title">课程名称</div>
            <div class="select">
              课程用途:
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="list">课程ID：26915</div>
            <div class="list">学生数：10人</div>
            <div class="list">课程时间：2018-06-30 ~ 2018-07-31</div>
            <div class="list">所属学校：高校邦通识课</div>
            <div class="list">开放范围：选课名单学员</div>
          </div>
          <div class="button">
            <div class="top">
              <a class="list">编辑</a>
              <a class="list">复制</a>
              <a class="list">发布</a>
              <a class="list">删除</a>
              <a class="list" @click="sell">售卖</a>
            </div>
            <el-button type="primary">教学管理</el-button>
          </div>
        </el-row>
      </el-row>

      <!--弹出框-->

      <el-dialog title="售卖" :visible.sync="isDialog">
        <el-row>
          <div>
            <span>*</span>
            <span>开课时间：</span>
            <el-date-picker
                v-model="sellTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                change="yesTimeSell"
            >
            </el-date-picker>
          </div>
          <div>
            <span>*</span>
            <span>选择学校：</span>
            <el-select v-model="value" placeholder="请选择学校">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isDialog = false">取 消</el-button>
          <el-button type="primary" @click="isDialog = false">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { coursePage } from '../../api/course'
  export default {
    data (){
      return {
        data:[],
        //选择框的数据
        selectValue:'',
        //日期选择器
        sellTime: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        //下拉选项
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
        isDialog:false,   //弹出框
        listQuery:{
          pageIndex:1,  //页码
          pageSize:10, //显示条数
          courseName:'' //课程名称
        }
      }
    },
    created(){
      this.getList()
    },
    methods: {
      yesTimeSell (e) {
        console.log('确定了',e)
      },
      sell () {
        this.isDialog = true
      },
      goAddCourse(){
        this.$router.push({
          path:'/course/addCourse'
        })
      },
      getList () {
        coursePage(this.listQuery).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.date = res.data.pageData
            this.listQuery.total = res.data.totalCount
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .list-search
    display: inline-block

  .course-table
    overflow hidden

    .img
      position: relative
      width:260px
      height:200px
      border:1px solid red
      display:inline-block
      vertical-align:top

      .tib
        background: #3EABA8
        padding:2px 5px
        color:#ffffff;
        font-size: 16px
        -webkit-border-radius: 2px
        -moz-border-radius: 2px
        border-radius: 2px

      span
        position: absolute
        left: 0
        top: 0

      img
        width:100%
        height:auto

    .center
      display:inline-block
      padding-left:30px

      .title
        font-size:20px
        margin-top:5px

      .list
        margin-top:5px

    .button
      float: right
      text-align:center

      .top
        margin-top:30px;
        margin-bottom:20px

        .list
          margin-right:20px
          color: #0EA5F0
</style>
