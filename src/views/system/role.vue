<template>
  <div class="role">
    <header-the-again headerTitle="角色管理"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="form.roleName"  style="width: 200px;margin-left: 10px;" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryRoleList">查询</el-button>
      </el-form-item>
    </el-form>


    <table-the-again
         :tableTitle="tableTitle"
         :tableOperate="tableOperate"
         :columnNameList="columnNameList"
         :tableData="tableData.pageData"
         :operateList="operateList"
          @showComponentInfo="showComponentInfo">
    </table-the-again>

    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="tableData.pageSize"
        :page-count="tableData.totalPage"
        :current-page="tableData.pageIndex"
        @current-change="handleCurrentChange">
    </el-pagination>


    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>




  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'
  import tableTheAgain from '@/components/table-theAgain'


  import {sysRolePage} from '../../api/system'


  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        dialogVisible:false,
        form:{
          roleName:'',
        },
        tableTitle:'角色管理列表',
        tableOperate:[
          {
            content:'创建角色',
            type:'created'
          },
          {
            content:'批量删除',
            type:'deleteAll'
          }
        ],
        columnNameList:[
          {
            type:'selection'
          },
          {
            name:'角色名',
            prop:'roleName'
          },
          {
            name:'创建时间',
            prop:'createTime'
          },
          {
            name:'创建人',
            prop:'createName'
          },
        ],
        operateList:[
          {
            content:'删除',
            type:'delete'
          },
          {
            content:'编辑',
            type:'edit'
          },
          {
            content:'设置权限',
            type:'set'
          }
        ],
        tableData:'',

      }
    },
    created:function(){
      this.queryRoleList();
    },
    methods:{
      showComponentInfo:function(type,info){
        console.log('type',type,'info',info);
        switch(type){
          case 'created':
            this.dialogVisible = true;
            console.log('here is created');
            break;
        }
      },
      queryRoleList:function () {
        console.log('this.form',this.form);
        sysRolePage(this.form).then(
          res => {
            this.tableData=res.data
            console.log("tableData",this.tableData)
          }
        ).catch(
          error => console.log('error',error)
        )
      },
      handleCurrentChange:function( number ){
        this.form.pageIndex = number;
        this.queryAcademy();
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }

  }
</script>

<style scoped lang="stylus" type="css/stylus">

</style>
