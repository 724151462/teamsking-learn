<template>
  <div class="member">
    <div class="navs">
      <el-input v-model="pageParmas.searchKey" placeholder="请输入内容" style="width: 200px;"></el-input>
      <el-button type="primary" @click="searchMember">搜索</el-button>
      <el-button type="primary"><router-link :to="{name: '成员方案管理', query: {id: $route.query.id}}">成员小组方案管理</router-link></el-button>
      <el-button type="primary">导入成员</el-button>
    </div>
    <item-table :tables="tables" :tableData="tableData" @showComponentInfo="showComponentInfo" :buttonStylus="buttonType"></item-table>
    <el-pagination
            background
            layout="prev, pager, next"
            :page-size="tableData.pageSize"
            :total="tableData.totalCount"
            :current-page="tableData.pageIndex"
            @current-change="handleCurrentChange">
    </el-pagination>
    <!--成员小组方案-->
    <el-dialog
        title="成员小组方案管理"
        :visible.sync="isFa"
        width="70%">

      <groupPlans></groupPlans>

    </el-dialog>
  </div>
</template>

<script>

import itemTable from '@/components/table-no-header.vue'
import groupPlans from './memberContent/groupPlan.vue'
import {
  memberList,
  setAssistant,
  unsetAssistant,
  deleteUser  
} from '@/api/course'
export default {
  components:{
    itemTable,
    groupPlans
  },
  data(){
    return{
      courseId: this.$route.query.id,
      input:'',
      pageParmas: {
        searchKey: ''
      },
      tables:[
        {
          name:'序号',
          prop:'id',
          width:120
        },
        {
          name:'学生姓名',
          prop:'realName',
          width:120
        },
        {
          name:'学号',
          prop:'studentNo',
          width:120
        },
        {
          name:'手机号码',
          prop:'mobile',
          width:120
        },
        {
          name:'学校',
          prop:'tenantName',
        }
      ],
      tableData:[
        {
          id:'1',
          name:'小三',
          xh:'123123',
          cellphone:'12386403',
          xx:'xxx大学'
        },
        {
          id:'1',
          name:'小三',
          xh:'123123',
          cellphone:'12386403',
          xx:'xxx大学'
        },
      ],
      buttonType:[
        {
          name:'设为助教',
          type:'setSys',
          show: (item)=>{
            console.log(item)
            if(item.assistantStatus === 2){
              return true
            }else{
              return false
            }
          }
        },
        {
          name:'取消助教',
          type:'unsetSys',
          show: (item)=>{
            console.log(item)
            if(item.assistantStatus === 1){
              return true
            }else{
              return false
            }
          }
        },
        {
          name:'移出班级群',
          type:'delete',
          show: (item)=>{
            return true
          }
        }
      ],
      isFa:false
    }
  },
  created(){
    this.$emit('upCoursesNav','member')
  },
  mounted() {
    this.getPage()
  },
  methods: {
    btnShow() {
      return false
    },
    showComponentInfo(type, info, index) {
      console.log(type, info,index )
      var sysInfo = {
        courseId: this.courseId,
        userId: info.userId
      }
      switch (type) {
        case 'setSys':
          console.log(sysInfo)
          setAssistant(sysInfo)
          .then((response)=> {
            if(response.code === 200) {
              info.assistantStatus = 1
            }
          })
          break;
        case 'unsetSys':
          unsetAssistant(sysInfo)
          .then((response)=> {
            if(response.code === 200) {
              info.assistantStatus = 2
            }
          })
          break;
        case 'delete':
          console.log(index)
          deleteUser(sysInfo)
          .then((response)=> {
            if(response.code === 200) {
              tableData.splice(index, 1)
            }
          })
        default:
          break;
      }
    },
    handleCurrentChange(index) {
      this.pageParmas.pageIndex = index
      this.getPage()
    },
    getPage() {
      this.pageParmas.courseId = this.courseId
      memberList(this.pageParmas)
      .then((response)=> {
        this.tableData = response.data.pageData
        this.tableData.totalCount = response.data.totalCount
        this.tableData.pageSize = response.data.pageSize
      })
    },
    searchMember() {
      console.log(this.pageParmas)
      this.getPage(this.pageParmas)
    }
  }
}
</script>

<style scoped lang="stylus" type="text/stylus">
  .member
    .navs
      text-align:right
      padding-top:10px
      padding-bottom:10px
</style>