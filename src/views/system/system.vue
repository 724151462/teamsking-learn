<template>
  <div class="system">
    <header-the-again headerTitle="系统管理员"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="form.userName"  style="width: 200px;margin-left: 10px;" placeholder="姓名"></el-input>
        <el-input v-model="form.managerNumber"  style="width: 200px;margin-left: 10px;" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getManagerPage">查询</el-button>
      </el-form-item>
    </el-form>

    <table-the-again
         :tableTitle="tableTitle"
         :tableOperate="tableOperate"
         :columnNameList="columnNameList"
         :tableData="tableData.pageData"
         :operateList="operateList"
         switchColumn = 'open'
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
        :title="addForm.title"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        style="min-width: 800px">

      <el-form ref="managerForm" :model="form">
        <el-form-item label="管理员用户名">
          <el-input style="width: 300px" v-model="form.userName" type="text" placeholder="请输入管理员用户名"></el-input>
        </el-form-item>
        <el-form-item label="管理员昵称">
          <el-input style="width: 300px" v-model="form.nickName" type="text" placeholder="请输入管理员昵称"></el-input>
        </el-form-item>
        <el-form-item label="管理员工号">
          <el-input style="width: 300px" v-model="form.managerNumber" type="text" placeholder="请输入管理员工号"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            active-value=1
            inactive-value=2
            v-model="form.status" 
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <span style="color: red">* </span> <span>提示：创建的管理员用户，默认初始密码都是abc123456</span>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'
  import tableTheAgain from '@/components/table-theAgain'


  import { sysManagerAdminPage, sysManagerAdminAdd, sysManagerReset, sysManagerModify, sysManagerDel } from '../../api/system'
  import { sysRoleAdd } from '../../api/system'
  import { sysRoleEdit } from '../../api/system'
  import { sysRoleDelete } from '../../api/system'
  import { sysUserMenuList } from '../../api/system'

  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        addForm:{
          title:'',
          data:{
            roleName:'',
          }
        },
        menuDialogVisible:false,
        dialogVisible:false,
        form:{
        },
        tableTitle:'学生管理列表',
        tableOperate:[
           {
            content:'重置',
            type:'reset'
          },
          {
            content:'删除',
            type:'delete'
          },
           {
            content:'创建管理员',
            type:'create'
          },
         
        ],
        columnNameList:[
          {
            type:'selection'
          },
          {
            name:'工号',
            prop:'managerNumber'
          },
          {
            name:'用户名',
            prop:'userName'
          },
          {
            name:'创建时间',
            prop:'createTime'
          }
        ],
        operateList:[
          {
            content:'重置密码',
            type:'reset'
          },
          {
            content:'删除',
            type:'delete'
          },
          {
            content:'编辑',
            type:'edit'
          }
        ],
        tableData:[],
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }



      }
    },
    created:function(){
      this.getManagerPage();
    },
    methods:{
      showComponentInfo:function(type,info){
        // console.log('type',type,'info',info);
        switch(type){
          case 'create':
            this.addForm.title = '添加管理员'
            this.form = {}
            this.dialogVisible = true
            break
          case 'reset':
            this.resetPassword(info)
            break
          case 'switch':
            console.log(info)
            break
          case 'edit':
            this.addForm.title = '修改管理员'
            this.form = Object.assign({}, info)
            this.dialogVisible = true
            break
          case 'delete':
            this.delManager(info)
            break
        }
      },
      resetPassword(info) {
        let resetArr = []
        if(info instanceof Array) {
          info.forEach(element => {
            console.log(element)
            resetArr.push(element.administratorId)
          });
        }else{
          resetArr.push(info.administratorId)
        }
        this.$store.commit('DELETECONFIRM',
        {
          title: '提示',
          message: '确认重置密码?', 
          fn:() => {
            sysManagerReset(resetArr)
            .then(response=> {
              if(response.code === 200) {
                this.$message({
                  message: '重置成功',
                  type: 'success'
                })
              }else{
                this.$message({
                  message: '出错了',
                  type: 'warning'
                })
              }
            })
          }
        })
      },
      getManagerPage() {
        console.log('this.form',this.form);
        sysManagerAdminPage(this.form).then(
          res => {
            res.data.pageData.forEach(element => {
              element.status = String(element.status)
            });
            this.tableData=res.data;
            console.log("tableData",this.tableData)
          }
        ).catch(
          error => console.log('error',error)
        )
      },
      save() {
        if(this.addForm.title === '添加管理员'){
          sysManagerAdminAdd(this.form)
          .then(response=> {
            if(response.code === 200) {
              this.$message({
                message: "添加成功",
                type: 'success'
              })
              this.form = {}
              this.getManagerPage()
            }else{
              this.$message({
                message: response.msg,
                type: 'warning'
              })
            }
            this.dialogVisible = false
          })
        }else{
          sysManagerModify(this.form)
          .then(response=> {
            if(response.code === 200) {
              this.$message({
                message: "修改成功",
                type: 'success'
              })
              this.form = {}
              this.getManagerPage()
            }else{
              this.$message({
                message: response.msg,
                type: 'warning'
              })
            }
            this.dialogVisible = false
          })
        }
      },
      delManager(info) {
        let delArr = []
        if(info instanceof Array) {
          info.forEach(element => {
            console.log(element)
            delArr.push(element.administratorId)
          });
        }else{
          delArr.push(info.administratorId)
        }
        this.$store.commit('DELETECONFIRM',
        {
          title: '提示',
          message: '确认删除管理员?', 
          fn:() => {
            sysManagerDel(delArr)
            .then(response=> {
              if(response.code === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.getManagerPage()
              }else{
                this.$message({
                  message: '出错了',
                  type: 'warning'
                })
              }
            })
          }
        })
      },
      handleCurrentChange:function( number ){
        this.form.pageIndex = number;
        this.getManagerPage();
      },
      handleClose(done) {
        done();
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .system
    .el-pagination
      margin:20px 2.5% 0 0
      display:flex
      justify-content:flex-end
      width:95%

    .pop-academy
      box-sizing:border-box
      display:flex
      justify-content:flex-start
      align-items:left
    .color-red
      color:red
    .item-title
      box-sizing border-box
      display:flex
      justify-content:flex-end
      flex-shrink:0
      width:30%
      span
        line-height:40px

    .item-input-list
      box-sizing:border-box
      display:flex
      justify-content:flex-start
      flex-direction:column
      width:70%

    .item-input
      margin-bottom:20px
      display:flex
      justify-content:flex-start
      align-items:center
      line-height:40px

    .input-pop
      width:200px
</style>
