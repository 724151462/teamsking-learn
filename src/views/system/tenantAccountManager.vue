<template>
  <div class="role">
    <header-the-again headerTitle="租户账号管理">
      <el-form ref="form" :inline="true" label-width="100px" class="form-query">
        <el-form-item label="输入搜索：">
          <el-input v-model="searchForm.search"  style="width: 200px;margin-left: 10px;" placeholder="用户名/姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.tenantId" placeholder="请选择学校">
            <el-option v-for="tenant in tenantlist" :key="tenant.tenantId" :label="tenant.tenantName" :value="tenant.tenantId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryTenantList">查询</el-button>
        </el-form-item>
      </el-form>
    </header-the-again>
    

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
        :title="addForm.title"
        :visible.sync="dialogVisible"
        width="60%"
        style="min-width: 800px">

      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="工号" required>
          <el-input v-model="form.managerNumber"></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="form.passwd"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" required>
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" required>
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio v-model="form.gender" label="1">
            男
          </el-radio>
          <el-radio v-model="form.gender" label="2">
            女
          </el-radio>
        </el-form-item>
        <el-form-item label="学校" required>
          <el-select v-model="form.tenantId">
            <el-option v-for="tenant in tenantlist" :key="tenant.tenantId" :label="tenant.tenantName" :value="tenant.tenantId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" required>
          <el-radio v-model="form.status" label="1">
            是
          </el-radio>
          <el-radio v-model="form.status" label="2">
            否
          </el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'
  import tableTheAgain from '@/components/table-theAgain'


  import { sysRolePage } from '../../api/system'
  import { sysRoleAdd } from '../../api/system'
  import { sysRoleEdit } from '../../api/system'
  import { sysRoleDelete } from '../../api/system'
  import { sysUserMenuList } from '../../api/system'
  import { sysTenantManagerPage } from '../../api/system'
  import { sysTenantManager,tenantGet, sysTenantManagerEdit } from '../../api/system'

  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        tenantlist: [],
        searchForm: {
        },
        addForm:{
          title:'添加租户',
          data:{
            realName:'',
            mobile:''
          }
        },
        menuDialogVisible:false,
        dialogVisible:false,
        form:{
          status: '1'
        },
        tableTitle:'角色管理列表',
        tableOperate:[
          {
            content:'删除',
            type:'批量删除'
          },
          {
            content:'创建租户账号',
            type:'created'
          }
        ],
        columnNameList:[
          {
            type:'selection'
          },
          {
            name:'用户名',
            prop:'userName'
          },
          {
            name:'姓名',
            prop:'realName'
          },
          {
            name:'所属学校',
            prop:'tenantName'
          },
          {
            name:'创建时间',
            prop:'createTime'
          }
        ],
        operateList:[
          {
            content:'编辑',
            type:'edit'
          }

        ],
        tableData:[],
      }
    },
    created:function(){
      tenantGet({
        pageParam: {
          pageIndex: 1,
          pageSize: 1000
        },
        searchKey: ""
      }).then(response => {
        console.log(response.data.pageData);
        this.tenantlist = response.data.pageData;
      });
      this.queryTenantList();
    },
    methods:{
      showComponentInfo:function(type,info){
        console.log('type',type,'info',info);
         switch(type){
           case 'created':
             console.log('here is created');
             console.log(this.form)
             this.form = {}
             this.appendTenant();
             break;
           case 'edit':
             console.log(info);
             info.status = String(info.status)
             info.gender = String(info.gender)
             this.editRole(info);
             break;
         }
      },
      queryTenantList:function () {
        console.log('请求的参数信息:',this.searchForm);
        // if(this.searchForm.tenantId){
        //   delete this.searchForm.search
        //   console.log(this.searchForm)
        // }
        sysTenantManagerPage(this.searchForm).then(
          res => {
            if(res.code === 200){
              this.tableData = res.data;
            }else{
              this.open4('查询出错' + res.msg);
            }
            // this.tableData = res.data;
            console.log('租户管理员列表:', this.tableData );
          }
        ).catch(
          error => {
            this.open4('查询出错' + error)
          }
        )
      },
      appendTenant:function(){
        this.dialogVisible = true;
        this.addForm.title = '添加租户管理员账号';
        this.addForm.data={ roleName:'',mobile:'',tenantId:1 }
      },
      editRole:function(roleInfo){
        this.dialogVisible = true;
        this.addForm.title = '编辑角色';
        let data = Object.assign({}, roleInfo)
        this.form  = data;
      },
      save:function(){
        if( this.addForm.title === '添加租户管理员账号'){
          console.log( '添加角色的信息:', this.form);
          // this.form.tenantName = '123'
          sysTenantManager( this.form).then(
            res => {
              if(res.code === 200){
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.queryTenantList()
              }else{
                this.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
              console.log('添加租户管理员账号:',res);
            }
          ).catch(
            error => console.log('添加角色出错',error)
          )
        }else if( this.addForm.title === '编辑角色' ){
          console.log('编辑提交的信息:',this.form);
          sysTenantManagerEdit( this.form ).then(
            res =>{
              if(res.code === 200){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.queryTenantList()
              }else{
                this.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
            }
          ).catch(
            error => {
              console.log(error)
            }
          );
        }
        this.dialogVisible = false;
      },
      delete:function(type,list){
        /* let roleIdList = [];
         switch (type) {
           case 'one':
             roleIdList.push(list.roleId);
             break;
           case 'list':
             list.filter(
               element => {
                 roleIdList.push( element.roleId );
                 return true;
               }
             );
             break;
         }
         sysRoleDelete(roleIdList).then(
           res => {
             console.log('删除成功的信息:',res);
           }
         ).catch(
           error => {
             console.log("删除失败:",error);
           }
         )
         setTimeout( () => { this.queryRoleList() },300 );*/
      },
      open4(errorInfo) {
        this.$message.error(errorInfo);
      },
      handleCurrentChange( number ){
        this.searchForm.pageIndex = number
        this.queryTenantList(this.searchForm);
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .role
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
