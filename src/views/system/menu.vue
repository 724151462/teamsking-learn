<template>
  <div class="role">
    <header-the-again headerTitle="菜单管理">
      <el-form ref="form" :inline="true" label-width="100px" class="form-query">
        <el-form-item label="输入搜索：">
          <el-input v-model="form.name"  style="width: 200px;margin-left: 10px;" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
        </el-form-item>
      </el-form>
    </header-the-again>
    <table-the-again
        :tableTitle="tableTitle"
        :tableOperate="tableOperate"
        :columnNameList="columnNameList"
        :tableData="tableData.data"
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
      <el-form :model="routeConfig" ref="menuForm" :rules="rules">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="routeConfig.name"></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="url">
          <el-input v-model="routeConfig.url"></el-input>
        </el-form-item>
        <el-form-item label="组件加载路径" prop="component">
          <el-input v-model="routeConfig.component"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单，默认为0">
          <el-input v-model="routeConfig.parentId"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio v-model="routeConfig.type" label="0">
            目录
          </el-radio>
          <el-radio v-model="routeConfig.type" label="1">
            菜单
          </el-radio>
          <el-radio v-model="routeConfig.type" label="2">
            按钮
          </el-radio>
        </el-form-item>
        <el-form-item label="菜单级别" prop="level">
          <el-input v-model="routeConfig.level"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="perms">
          <el-input v-model="routeConfig.perms"></el-input>
        </el-form-item>
        <el-form-item label="重定向">
          <el-input v-model="routeConfig.redirect"></el-input>
        </el-form-item>
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


  import { sysRolePage } from '../../api/system'
  import { sysRoleAdd } from '../../api/system'
  import { sysRoleEdit } from '../../api/system'
  import { sysUserMenuDel } from '../../api/system'
  import { sysUserMenuList, sysUserMenuAdd } from '../../api/system'
import { get } from 'http';

  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        routeConfig: {
          type: '2'
        },
        rules: {
          name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
          url: [{ required: true, message: '请输入菜单访问路径', trigger: 'blur' }],
          component: [{ required: true, message: '请输入组件加载路径', trigger: 'blur' }],
          level: [{ required: true, message: '请输入菜单级别', trigger: 'blur' }],
          perms: [{ required: true, message: '授权(多个用逗号分隔，如：user:list,user:create)', trigger: 'blur' }],
        },
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
        tableTitle:'角色管理列表',
        tableOperate:[
          {
            content:'创建菜单',
            type:'created'
          },
          // {
          //   content:'批量删除',
          //   type:'deleteList'
          // }
        ],
        columnNameList:[
          {
            type:'selection'
          },
          {
            name:'菜单编号',
            prop:'menuId'
          },
          {
            name:'菜单名',
            prop:'name'
          },
          {
            name:'父级菜单',
            prop:'parentId'
          },
          // {
          //   name:'创建时间',
          //   prop:'createName'
          // },
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
          }
        ],
        tableData:[],



      }
    },
    created:function(){
     // this.queryRoleList();
     this.getMenuList(this.form)
      
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


          console.log( 'menuTree' , menuTree );*\

        }
      ).catch()*/

    },
    methods:{
      showComponentInfo:function(type,info){
        console.log('type',type,'info',info);
        switch(type){
          case 'created':
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
      getMenuList:function () {
        sysUserMenuList().then(
          res => {
            this.tableData = res;
            console.log('this.tableData',this.tableData);
          }
        ).catch()
      },
      appendRole:function(){
        this.dialogVisible = true;
        this.addForm.title = '添加菜单';
        this.addForm.data={ roleName:'' }
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
        if( this.addForm.title === '添加菜单'){
          this.$refs['menuForm'].validate((valid) => {
            if (valid) {
              sysUserMenuAdd(this.routeConfig)
              .then(response=> {
                if(response.code === 200) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                }else{
                  this.$message({
                    message: response.msg,
                    type: 'warning'
                  })
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
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
      },
      delete:function(type,list){
        sysUserMenuDel(list).then(
          res => {
            console.log('删除成功的信息:',res);
            if(res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getMenuList()
            }
          }
        ).catch(
          error => {
            console.log("删除失败:",error);
          }
        )
      },
      handleCurrentChange:function( number ){
        this.form.pageIndex = number;
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
