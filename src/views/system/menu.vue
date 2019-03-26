<template>
  <div class="role">
    <!--加载动画-->
    <div v-show="showLoading">
      <div class="tq_loading__mask"></div>
      <div class="tq_loading-wrapper">
        <div class="tq_loading__loading-wrapper">
          <square :background="'#409eff'"></square>
        </div>
        <div class="tq_loading__text">
          正在加载
        </div>
      </div>
    </div>
    <header-the-again headerTitle="菜单管理">
      <!-- <el-form ref="form" :inline="true" label-width="100px" class="form-query">
        <el-form-item label="输入搜索：">
          <el-input v-model="form.name"  style="width: 200px;margin-left: 10px;" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
        </el-form-item>
      </el-form> -->
    </header-the-again>
    <el-tree
      :data="menuData.data"
      :props="defaultProps"
      node-key="menuId"
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
        <el-form-item label="是否为叶子节点">
          <el-radio v-model="routeConfig.isLeaf" label="1">
            是
          </el-radio>
          <el-radio v-model="routeConfig.isLeaf" label="2">
            否
          </el-radio>
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
        <el-form-item label="排序顺序">
          <el-input v-model="routeConfig.orderNo"></el-input>
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
  import { sysUserMenuList, sysUserMenuAdd, sysUserMenuEdit } from '../../api/system'
  import Square from "@/components/cubeShadow.vue";
  import { mapGetters } from "vuex";
import { get } from 'http';

  export default {
    name: "role",
    components:{
      Square,
      headerTheAgain
    },
    data(){
      return {
        routeConfig: {
          showCode: '1',
          type: '2',
          isLeaf: '2'
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
    created(){
     // this.queryRoleList();
     this.getMenuList(this.form)
      
    },
    mounted(){

    },
    computed: {
      ...mapGetters(["showLoading"])
    },
    methods:{
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span style="position: absolute;left: 350px">
              <el-button size="mini" type="text" on-click={ () => this.appendMenu(data) }>添加</el-button>
              <el-button size="mini" type="text" on-click={ () => this.editMenu(data) }>编辑</el-button>
              <el-button size="mini" type="text" on-click={ () => this.delete(node, data) }>删除</el-button>
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
      getMenuList:function () {
        this.$store.commit("SHOWLOADING");
        sysUserMenuList().then(
          res => {
            this.menuData = res;
            this.$store.commit("HIDELOADING");
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
      editMenu(data){
        let menuForm = Object.assign({}, data)
        console.log(menuForm)
        menuForm.isLeaf = String(menuForm.isLeaf)
        menuForm.type = String(menuForm.type)
        menuForm.showCode = String(menuForm.showCode)
        this.routeConfig = menuForm
        this.addForm.title = "修改菜单"
        this.dialogVisible = true
      },
      save(){
        this.routeConfig.isLeaf = Number(this.routeConfig.isLeaf)
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
        }else{
          sysUserMenuEdit( this.routeConfig ).then(
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
      delete(node,data){
        console.log(data)
        sysUserMenuDel({menuId: data.menuId}).then(
          res => {
            console.log('删除成功的信息:',res);
            if(res.code === 200) {
              const parent = node.parent;
              const children = parent.data.list || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getMenuList()
            }else if(res.code === 1000){
              this.$message({
                message: res.msg,
                type: 'warning'
              })
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
  .custom-tree-node
    color red
    // .operation
    //   opacity 1
</style>
