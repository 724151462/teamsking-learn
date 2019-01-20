<template>
  <div class="system">
    <header-the-again headerTitle="系统管理员"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="form.roleName"  style="width: 200px;margin-left: 10px;" placeholder="姓名/昵称"></el-input>
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
        :title="addForm.title"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        style="min-width: 800px">

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>请输入角色名：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop"  v-model="addForm.data.roleName"  placeholder="学生名称" clearable></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        :title="addForm.title"
        :visible.sync="menuDialogVisible"
        width="60%"
        :before-close="handleClose"
        style="min-width: 800px">

      <div class="pop-academy">

        权限菜单列表: <br /><br /><br />

        <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
        </el-tree>


        <!--{{ addForm.data.menuList }}-->

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="menuDialogVisible = false">确 定</el-button>
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

  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        addForm:{
          title:'添加角色',
          data:{
            roleName:'',
          }
        },
        menuDialogVisible:false,
        dialogVisible:false,
        form:{
          title:'添加学生',
        },
        tableTitle:'学生管理列表',
        tableOperate:[
           {
            content:'重置',
            type:'created'
          },
          {
            content:'删除',
            type:'created'
          },
           {
            content:'创建管理员',
            type:'created'
          },
         
        ],
        columnNameList:[
          {
            type:'selection'
          },
          {
            name:'工号',
            prop:'roleName'
          },
          {
            name:'用户名',
            prop:'createTime'
          },
          {
            name:'用户昵称',
            prop:'createName'
          },
          {
            name:'创建时间',
            prop:'createName'
          },
          {
            name:'状态',
            prop:'createName'
          },
        ],
        operateList:[
          {
            content:'重置密码',
            type:'delete'
          },
          {
            content:'删除',
            type:'delete'
          },
          {
            content:'编辑',
            type:'delete'
          }
        ],
        tableData:'',



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
      this.queryRoleList();
    },
    mounted:function(){
      sysUserMenuList().then(
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
      ).catch()

    },
    methods:{
      showComponentInfo:function(type,info){
        console.log('type',type,'info',info);
        switch(type){
          case 'created':
            console.log('here is created');
            this.appendRole();
            break;
          case 'edit':
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
            break;
        }
      },
      queryRoleList:function () {
        console.log('this.form',this.form);
        sysRolePage(this.form).then(
          res => {
            this.tableData=res.data;
            console.log("tableData",this.tableData)
          }
        ).catch(
          error => console.log('error',error)
        )
      },
      appendRole:function(){
        this.dialogVisible = true;
        this.addForm.title = '添加角色';
        this.addForm.data={ roleName:'' }
      },
      editRole:function(roleInfo){
        this.dialogVisible = true;
        this.addForm.title = '编辑角色';
        this.addForm.data  = roleInfo;
        console.log( 'this.addForm.data' , this.addForm.data );
      },
      editMenu:function(roleInfo){
        this.menuDialogVisible = true;
        this.addForm.title = '设置权限';
        this.addForm.data  = roleInfo;
        console.log( 'this.addForm.data.menuList' , this.addForm.data.menuList );
      },
      save:function(){
        if( this.addForm.title === '添加角色'){
          console.log( '添加角色的信息:', this.addForm.data);
          sysRoleAdd( this.addForm.data).then(
            res => {
              console.log('添加角色:',res);
            }
          ).catch(
            error => console.log('添加角色出错',error)
          )
        }else if( this.addForm.title === '编辑角色' ){
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
        setTimeout( ()=>{ this.queryRoleList() },300);
      },
      delete:function(type,list){
        let roleIdList = [];
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
        setTimeout( () => { this.queryRoleList() },300 );
      },
      handleCurrentChange:function( number ){
        this.form.pageIndex = number;
        this.queryRoleList();
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
