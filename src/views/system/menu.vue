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
    <el-tree
      :data="menuData.data"
      show-checkbox
      :props="defaultProps"
      node-key="menuId"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
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
        <el-form-item label="是否侧边栏显示">
          <el-radio v-model="routeConfig.showCode" label="1">
            是
          </el-radio>
          <el-radio v-model="routeConfig.showCode" label="2">
            否
          </el-radio>
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
          showCode: '1',
          type: '2'
        },
        defaultProps: {
          children: 'list',
          label: 'name'
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
        menuData: []
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
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.appendMenu(data) }>Append</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>);
      },
      append(data) {
        console.log(data)
        const newChild = { menuId: data.menuId, label: data.labe, list: [] };
        if (!data.list) {
          this.$set(data, 'list', []);
        }
        data.list.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.list || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      getMenuList:function () {
        sysUserMenuList().then(
          res => {
            this.menuData = res;
            console.log('this.menuData',this.menuData);
          }
        ).catch()
      },
      appendMenu(data){
        console.log(data)
        this.routeConfig.parentId = data.menuId
        this.dialogVisible = true;
        this.addForm.title = '添加菜单';
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
      save(){
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
                  this.getMenuList()
                  this.dialogVisible = false
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
