<template>
  <div class="member">
    <div class="navs">
      <el-input v-model="input" placeholder="请输入内容" style="width: 200px;"></el-input>
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="isFa = true">成员小组方案管理</el-button>
      <el-button type="primary">导入成员</el-button>
    </div>
    <item-table :tables="tables" :tableData="tableData" :buttonStylus="buttonType"></item-table>
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
  import itemTable from '../../../components/table-no-header.vue'
  import groupPlans from './upMember/groupPlan.vue'
  export default {
    components:{
      itemTable,
      groupPlans
    },
    data(){
      return{
        input:'',
        tables:[
          {
            name:'序号',
            prop:'id',
            width:120
          },
          {
            name:'学生姓名',
            prop:'name',
            width:120
          },
          {
            name:'学号',
            prop:'xh',
            width:120
          },
          {
            name:'手机号码',
            prop:'cellphone',
            width:120
          },
          {
            name:'学校',
            prop:'xx',
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
            name:'角色设置',
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