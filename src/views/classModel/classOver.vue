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
          <img :src="require('@/assets/images/classModel/play.png')" height="40px" alt="">
        </div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div>
          <img :src="require('@/assets/images/classModel/attRate.png')" height="40px" width="50px" alt="">
        </div>
        <div class="box-text">
          <p>{{this.extMeta.attendanceRate}}</p>
          <p>课堂出勤率(%)</p>
        </div>
      </div>
      <div class="box-item">
        <div><img :src="require('@/assets/images/classModel/xfj.png')" height="40px" alt=""></div>
        <div class="box-text">
          <p>{{this.extMeta.interactionCount}}</p>
          <p>课堂发布活动(个)</p>
        </div>
      </div>
      <div class="box-item">
        <div><img :src="require('@/assets/images/classModel/member.png')" height="35px" width="50px" alt=""></div>
        <div class="box-text">
          <p>{{this.extMeta.userCount}}</p>
          <p>学生上课人数(人)</p>
        </div>
      </div>
    </div>
    <div style="padding: 0 40px;">
      <div style="display: inline-block;width: 50%">
        <span>学生明细表</span>
      </div>
      <div style="display: inline-block;width: 50%;text-align: right" >
        <el-button size="mini" type="primary" @click="excelInit">导出表格</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;padding: 0 40px;">
      <el-table-column
        prop="studentNo"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="examCount"
        label="测验提交次数">
      </el-table-column>
      <el-table-column
        prop="voteCount"
        label="投票提交次数">
      </el-table-column>
      <el-table-column
        prop="stormCount"
        label="头脑风暴提交次数">
      </el-table-column>
      <el-table-column label="课堂出勤">
        <template slot-scope="scope">
          <span v-if="scope.row.signStatus === 1">正常</span>
          <span v-else-if="scope.row.signStatus === 2" style="color: orange">缺勤</span>
          <span v-else-if="scope.row.signStatus === 3" style="color: orange">早退</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        style="margin-top: 20px;text-align: right;margin-right: 40px;"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        @current-change="pageChange"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {classRoomData, classOver} from '@/api/course'
  export default {
    name: "classOver",
    data (){
      return {
        courseName:'',
        currentPage:1,
        totalPage:10,
        extMeta: {
          attendanceRate: "0%",
          interactionCount: 0,
          userCount: 0,
        },
        tableData: [
        ]
      }
    },
    created(){
      this.courseName = sessionStorage.getItem('courseName')
      this.closeClass()
    },
    methods:{
      back(){
        this.$router.push({path: "/course/list",});
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      init(pageIndex){
        let data = {
          classroomId: 135,
          pageParam: {
            pageIndex: pageIndex,
            pageSize: 10
          }
        }
        classRoomData(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200){
            this.tableData = res.data.pageData
            this.extMeta = res.data.extMeta
            this.currentPage =res.data.pageIndex
            this.totalPage = res.data.totalPage * 10
          }else{
            this.$message({
              message:'获取课堂小结失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      getTime(){
        // 获取当前日期
        let date = new Date(),
          nowMonth = date.getMonth() + 1,
          strDate = date.getDate(),
          seperator = "-";

        if (nowMonth >= 1 && nowMonth <= 9) {
          nowMonth = "0" + nowMonth;
        }

        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }

        return date.getFullYear() + seperator + nowMonth + seperator + strDate;
      },
    //导出表格时对数据进行处理
      excelInit(){
        let pagedata = {
          classroomId: 135,
          pageParam: {
            pageIndex: 1,
            pageSize: 10000
          }
        }
        let curData = []
        classRoomData(pagedata).then(res=>{
          if(Number(res.code) === 200){
            curData = res.data.pageData
            curData.forEach((item)=>{
              if(item.signStatus == 1){
                item.signStatus = '正常'
              }else if(item.signStatus == 2){
                item.signStatus = '缺勤'
              }else{
                item.signStatus = '早退'
              }
            })
            //导出表格
            require.ensure([], () => {
              let { export_json_to_excel } = require('@/vendor/Export2Excel');
              let tHeader = ['学号', '姓名', '测验提交次数', '投票提交次数', '头脑风暴提交次数','课堂出勤'];
              let filterVal = ['studentNo', 'realName', 'examCount', 'voteCount','stormCount', 'signStatus'];
              let dataList = curData;
              let data = this.formatJson(filterVal, dataList);
              export_json_to_excel(tHeader, data, `${this.getTime()}${this.courseName}出勤表`);
            })
          }else{
            this.$message({
              message:'表格导出失败',
              type:'error'
            })
            return false
          }
          return curData
        })
      },
      pageChange(page){
        this.init(page)
      },
      closeClass(){
        // let loading = this.$loading({
        //   lock: true,
        //   text: '正在结束课堂',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // });
        classOver({ classroomId: sessionStorage.getItem('classroom') }).then((res)=>{
          // loading.close()
          console.log(res)
          this.init(1)
        })
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
        padding 0 20px
        margin 40px
        display flex
        &:nth-child(1)
          background: rgb(131, 201, 236)
        &:nth-child(2)
          background-color: rgb(110, 190, 230)
        &:nth-child(3)
          background-color: rgb(116, 174, 232)
        &:nth-child(4)
          background-color: rgb(137, 162, 245)
        .box-text
          flex 1
          color white
          text-align right

</style>