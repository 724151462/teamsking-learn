<template>
    <div>
      <el-row>
        <el-button round size="small" @click="courseType()">全部课程</el-button>
        <el-button round size="small" @click="courseType(30)">已发布</el-button>
        <el-button round size="small" @click="courseType(10)">未发布</el-button>
        <el-button round size="small" @click="courseType(40)">已关闭</el-button>
        <div class="list-search">
          <el-input v-model="listQuery.courseName" type="text" placeholder="请输入课程名称" style="width:180px;margin-left: 100px;"></el-input>
          <el-button type="primary" @click="getList">搜索</el-button>
        </div>
        <el-button type="primary" round style="float: right" @click="goAddCourse">创建课程</el-button>
      </el-row>

      <el-row>
        <el-row style="background:#F3F3F3;padding:10px 0 10px 10px;margin-top: 20px;">课程列表</el-row>
        <el-row class="course-table" v-for="list in data" :key="list">
          <div class="img">
            <span class="tib">{{courseStatus(list.courseStatus)}}</span>
            <img :src="list.courseCover">
          </div>
          <div class="center">
            <div class="title" style="margin:20px 0;font-weight:bold">{{list.courseName }}</div>
            <div class="list">学生数：{{list.userCount}}人</div>
            <div class="list">课程时间：{{list.beginTime}} ~ {{list.endTime}}</div>
            <div class="list">所属学校：{{list.tenantName}}</div>
            <div class="list">开放范围：{{Number(list.courseMode) === 10 ? '教师指定学员' : Number(list.courseMode) === 20 ? '本校学生' : Number(list.courseMode) === 30 ? '全部学员' : '' }}</div>
          </div>
          <div class="button">
            <div class="top">
              <a class="list" @click="upData(list.courseId)">编辑</a>
              <a class="list">复制</a>
              <a class="list" v-if="list.courseStatus === 30">停用</a>
              <a class="list" v-else-if="list.courseStatus === 10" @click="release(list.courseId)">发布</a>
              <a class="list" v-if="list.courseStatus === 30 || list.courseStatus === 10">删除</a>
            </div>
            <el-button type="primary" @click="goCourseModel(list.courseId)">课堂模式</el-button>
            <el-button type="primary" @click="goCourseChapter(list.courseId)">教学管理</el-button>
          </div>
        </el-row>
        <div style="text-align:right;">
          <el-pagination
              background
              layout="prev, pager, next"
              @current-change="goGetList"
              :total="listQuery.total">
          </el-pagination>
        </div>
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
<!--
            <el-select v-model="value" placeholder="请选择学校">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
-->
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
import { coursePage, publish } from '../../api/course'
export default {
  data () {
    return {
      data: [],
      selectValue: '',
      sellTime: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      isDialog: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        courseName: '',
        courseStatus: ''
      }
    }
  },
  created () {
    this.$emit('floorStatus', 'course')
    this.getList()
  },
  methods: {
    goGetList (e) {
      this.listQuery.pageIndex = e
      this.getList()
    },
    courseType(type = '') {
      this.listQuery.courseStatus = type
      coursePage(this.listQuery).then(res => {
        if (res.code === 200) {
          this.data = res.data.pageData
          this.listQuery.total = res.data.totalCount
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    upData (e) {
      this.$router.push({
        path: '/course/addCourse',
        query: {
          type: 'upData',
          courseId: e
        }
      })
    },
    courseStatus (val) {
      let vals = Number(val)
      if (vals === 10) {
        return '未发布'
      } else if (vals === 30) {
        return '已发布'
      } else if (vals === 40) {
        return '关闭'
      }
    },
    yesTimeSell (e) {
      console.log('确定了', e)
    },
    sell () {
      this.isDialog = true
    },
    goCourseModel(e) {
      this.$router.push({
        path: '/course/classmodel',
        query: {id: e}
      })
    },
    goCourseChapter(e) {
      this.$router.push({
        path: '/course/list/chapter',
        query: {id: e}
      })
    },
    goAddCourse (e) {
      this.$router.push({
        path: '/course/addcourse',
      })
    },
    release (val) {
      publish(val).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '发布失败',
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getList () {
      coursePage(this.listQuery).then(res => {
        if (res.code === 200) {
          this.data = res.data.pageData
          this.listQuery.total = res.data.totalCount
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
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
    margin-bottom:10px
    border-bottom:1px solid #CCCCCC

    .img
      position: relative
      width:260px
      height:200px
      border:1px solid #CCCCCC
      display:inline-block
      vertical-align:top
      position: relative

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
        position: absolute
        top: 50%
        transform:translateY(-50%)

    .center
      display:inline-block
      padding-left:30px

      .title
        font-size:20px
        margin-top:5px
        color: rgb(61, 61, 70)

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
          color: rgb(116, 120,129)
          cursor: pointer
</style>
