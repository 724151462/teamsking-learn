<template>
  <div class="member">
    <div class="navs">
      <el-input v-model="input" placeholder="请输入内容" style="width: 200px;"></el-input>
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="isFa = true">成员小组方案管理</el-button>
      <el-button type="primary">导入成员</el-button>
    </div>
    <item-table :tables="tables" :tableData="tableData" @showComponentInfo="showComponentInfo" :buttonStylus="buttonType"></item-table>
    <el-pagination
            background
            layout="prev, pager, next"
            :page-size="tableData.pageSize"
            :page-count="tableData.totalCount"
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
import groupPlans from './interactContent/groupPlan.vue'
import {memberList} from '@/api/course'
export default {
  components:{
    itemTable,
    groupPlans
  },
  data(){
    return{
      courseId: '0608367675f54267aa6960fd0557cc1b',
      input:'',
      pageParmas: {},
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
          type:'sys'
        },
        {
          name:'移出班级群',
          type:'delete'
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
    showComponentInfo(type, info) {
      console.log(type, info)
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