<template>
  <div class="teacher">

    <header-the-again headerTitle="教师管理"></header-the-again>
    <el-form ref="form" :model="searchForm" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="searchForm.teacherInfo" placeholder="老师名称/工号/手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.college" :readonly="true" placeholder="院" @change="collegeChange">
            <el-option 
            v-for="(item, index) in searchCollegeList" 
            :key="index" 
            :label="item.collegeName"
            :value="item.collegeId">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.department" :readonly="true" placeholder="系" @change="departmentChange">
            <el-option 
            v-for="(item, index) in searchDepartmentList" 
            :key="index" 
            :label="item.departmentName"
            :value="item.departmentId">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="teacherSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo">
    </table-the-again>

    <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size="10"
            :current-page="searchForm.pageIndex"
            @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>
  import tableTheAgain from '../../components/table-theAgain'
  import headerTheAgain from '../../components/header-theAgain'

  import {
    sysCollegeList,
    sysDepartmentList,
    sysTeacherPage,
    sysTeacherReset
  } from '../../api/school';

  export default{
    name:'',
    data(){
      return{
        dialogVisible: false,
        tableOperate:[
        ],
        tableTitle:'教师管理列表',
        columnNameList:[
          {
            name:'姓名',
            prop:'teacherName'
          },
          {
            name:'工号',
            prop:'teacherNumber'
          },
          {
            name:'手机号',
            prop:'mobile'
          },
          {
            name:'院',
            prop:'collegeName'
          },
          {
            name:'系',
            prop:'departmentName'
          },
          {
            name:'创建课程',
            prop:'courseCount'
          },

        ],
        operateList:[
          {
            content:'查看',
            type:'detail'
          }
        ],
        tableData3: [
          {
            id:'20180900',
            userType:'管理员',
            userName:'10',
            createdTime:'2017-06-15 14:35:51',
            status:'启用'
          },
          {
            id:'20180900',
            userType:'管理员',
            userName:'10',
            createdTime:'2017-06-15 14:35:51',
            status:'启用'
          },
          {
            id:'20180900',
            userType:'管理员',
            userName:'10',
            createdTime:'2017-06-15 14:35:51',
            status:'启用'
          },
          {
            id:'20180900',
            userType:'管理员',
            userName:'10',
            createdTime:'2017-06-15 14:35:51',
            status:'启用'
          }
        ],
        popContentItem:[],
        textarea:'',
        searchForm: {
            college: '',
            department: '',
            teacherInfo: '',
            pageIndex: 1
        },
        searchCollegeList: [],
        searchDepartmentList: [],
        departmentRows: [],
        collegeList: [],
        totalCount: 0,
        pageIndex: 1,
      }
    },
    components:{
        tableTheAgain,
        headerTheAgain
    },
    computed:{
      testList() {
        return this.$store.state.collegeList
      }
    },
    mounted(){
      // 教师列表
      sysTeacherPage({"pageIndex": this.pageIndex})
      .then((response)=>{
          let dataArr = []
          response.data.pageData.forEach(element => {
              element.status = String(element.status)
              console.log(typeof(element.status))
              dataArr.push(element)
          });
          this.totalCount = Number(response.data.totalCount)
          console.log(this.totalCount)
          this.tableData3 = dataArr
      })
      // 院列表
      sysCollegeList()
      .then((response)=>{
          if (response.code === 200){
              this.collegeList = response.data
              this.searchCollegeList = response.data
              let all = {"collegeId": -1, "collegeName": "全部"}
            // this.collegeList.unshift(all)
              this.searchCollegeList.unshift(all)
              console.log(this.collegeList)
          }
      })
      // 系列表
      sysDepartmentList()
      .then((response)=>{
          if (response.code === 200){
              this.departmentRows = response.data
              this.searchDepartmentList = response.data
              let all = {"departmentId": -1, "departmentName": "全部"}
              // this.searchDepartmentList.unshift(all)
            this.departmentRows.unshift(all)
              console.log(this.departmentRows)
          }
      })
    },
    methods:{
      // 院搜索值变化
      collegeChange(value) {
          // console.log(value)
          // console.log('a',this.departmentRows)
          if(value === -1){
              this.searchDepartmentList = this.departmentRows
              this.searchForm.department = -1
          }else{
              this.searchDepartmentList = this.departmentRows.filter((item,index)=>{
                  return (item.collegeId == value || item.collegeId == -1 || index == 0)
              })

              console.log('121', this.searchDepartmentList)
              this.searchForm.department = -1   
          }         
      },
      // 系搜索值变化
      departmentChange(value) {
        console.log('dep', value)
        // if(value === -1){
        //     return this.specialityRows
        // }
        // this.searchForm.speciality = -1
        // this.searchSpecialityList = this.specialityRows.filter((item)=>{
        //     return item.departmentId == value || item.departmentId == -1
        // })
      },
      teacherSearch(){
        this.searchForm.pageIndex = 1
        sysTeacherPage(this.searchForm)
          .then((response)=>{
            console.log(response)
            let dataArr = []
            response.data.pageData.forEach(element => {
                element.status = String(element.status)
                console.log(typeof(element.status))
                dataArr.push(element)
            });
            this.tableData3 = dataArr
            this.totalCount = Number(response.data.totalCount)
            this.pageIndex = 1
          })
      },
      pageChange(pageNum) {
        this.searchForm.pageIndex = pageNum
        sysTeacherPage(this.searchForm).then((response)=>{
            console.log(response)
            let dataArr = []
            response.data.pageData.forEach(element => {
                element.status = String(element.status)
                console.log(typeof(element.status))
                dataArr.push(element)
            });
            this.tableData3 = dataArr
        })
      },
      showComponentInfo:function(type,info){
        console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
        switch (type) {
          case 'check':
            //console.log(info);
            this.popContentItem = this.info;
            this.check(info);
            break;
          case 'resetPassword':
            this.resetPassword(info)
            break;
          case 'resetAll':
            break;
            this.resetPassword(info)
          case 'detail':
            this.$router.push({path: '/system/teacher/teacherdetail', query: {teacherId: info.teacherId} })
            break;
        }
      },
      check:function(){
        this.dialogVisible = !this.dialogVisible;
      },
      resetPassword(teacher) {
          console.log(teacher.length)
          let resetArr = []
          if(teacher.length == undefined){
              resetArr.push(teacher.teacherId)
          }else{
              teacher.forEach(element => {
                  resetArr.push(element.teacherId)
              });
          }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      onSubmit:function(){
        console.log('onSubmit!!');
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .teacher
    .pop-user-info
      margin:0px 0 20px 0
      box-sizing border-box
      display:flex
      justify-content:space-around
      flex-direction:column
      align-items:center
      width:150px
      height:150px

      div
        width:100px
        height:100px
        background:cyan
        border-radius:50% 50%

      span
        margin:5px 0
        box-sizing:border-box
        display:inline

    .pop-content-item
      span:first-child
        font-weight:800
    .pop-content-item:last-child
      margin-top:20px

    .el-pagination
      margin:20px 2.5% 0 0
      display:flex
      justify-content flex-end
      width:95%
</style>