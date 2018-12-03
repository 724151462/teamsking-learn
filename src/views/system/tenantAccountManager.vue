<template>
  <div class="role">
    <header-the-again headerTitle="租户账号管理"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="form.search"  style="width: 200px;margin-left: 10px;" placeholder="用户名/姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="value" placeholder="请选择学校">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryTenantList">查询</el-button>
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

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>账号：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop"  v-model="addForm.data.mobile"  placeholder="请输入手机号或者邮箱" clearable></el-input>
        </div>
      </div>
      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>姓名：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop"  v-model="addForm.data.realName"  placeholder="请输入姓名" clearable></el-input>
        </div>
      </div>

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


  import { sysRolePage } from '../../api/system'
  import { sysRoleAdd } from '../../api/system'
  import { sysRoleEdit } from '../../api/system'
  import { sysRoleDelete } from '../../api/system'
  import { sysUserMenuList } from '../../api/system'
  import { sysTenantManagerPage } from '../../api/system'
  import { sysTenantManager } from '../../api/system'

  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
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
          search:'',
          tenantId:1,
        },
        tableTitle:'角色管理列表',
        tableOperate:[
          {
            content:'删除',
            type:'批量删除'
          },
          {
            content:'创建租户',
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
        tableData:'',




      }
    },
    created:function(){
      this.queryTenantList();
      // this.queryRoleList();
    },
    mounted:function(){
      /* sysUserMenuList().then(
         res => {
           console.log("权限菜单:",res);

           let menuTree = res.data.filter(
             element => {
               return element.parentId === 0
             }
           );

           for( let i = 0; i < menuTree.length; i++  ){
             menuTree[i].children = [];
             menuTree[i].children.push( res.data.filter(
               element => {
                 return element.parentId === menuTree[i].menuId
               }
             ) )
           }


           console.log( 'menuTree' , menuTree );

         }
       ).catch()*/

    },
    methods:{
      showComponentInfo:function(type,info){
        console.log('type',type,'info',info);
         switch(type){
           case 'created':
             console.log('here is created');
             this.appendTenant();
             break;
           /*case 'edit':
             console.log('here is edit');
             this.editRole(info);
             break;
           case 'delete':
             this.delete('one',info);
             break;
           case 'deleteList':
             this.delete('list',info);
             break;
           case 'set':
             this.editMenu(info);
             break;*/
         }
      },
      queryTenantList:function () {
        console.log('请求的参数信息:',this.form);
        sysTenantManagerPage(this.form).then(
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
        /*console.log('this.form',this.form);
        sysRolePage(this.form).then(
          res => {
            this.tableData=res.data;
            console.log("tableData",this.tableData)
          }
        ).catch(
          error => console.log('error',error)
        )*/
      },
      appendTenant:function(){
        this.dialogVisible = true;
        this.addForm.title = '添加租户管理员账号';
        this.addForm.data={ roleName:'',mobile:'',tenantId:1 }
      },
      editRole:function(roleInfo){
        /*this.dialogVisible = true;
        this.addForm.title = '编辑角色';
        this.addForm.data  = roleInfo;
        console.log( 'this.addForm.data' , this.addForm.data );*/
      },
      editMenu:function(roleInfo){
        /*this.menuDialogVisible = true;
        this.addForm.title = '设置权限';
        this.addForm.data  = roleInfo;
        console.log( 'this.addForm.data.menuList' , this.addForm.data.menuList );*/
      },
      save:function(){
        if( this.addForm.title === '添加租户管理员账号'){
          console.log( '添加角色的信息:', this.addForm.data);
          sysTenantManager( this.addForm.data).then(
            res => {
              if(res.code === 200){

              }
              console.log('添加租户管理员账号:',res);
            }
          ).catch(
            error => console.log('添加角色出错',error)
          )
        }/*else if( this.addForm.title === '编辑角色' ){
          console.log('编辑提交的信息:',this.addForm.data);
          sysRoleEdit( this.addForm.data ).then(
            res =>{
              console.log( '编辑的信息返回：',res);
            }
          ).catch(
            error => {
              console.log(error)
            }
          );
        }
        this.dialogVisible = false;
        setTimeout( ()=>{ this.queryRoleList() },300);*/
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
      handleCurrentChange:function( number ){
        this.form.pageIndex = number;
        // this.queryRoleList();
      },
      handleClose(done) {
        done();
      },
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
