<template>
  <div class="help">
    <header-the-again headerTitle="帮助中心"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
            <el-form-item label="输入搜索：">
                <el-input placeholder="请输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" >查询</el-button>
            </el-form-item>
    </el-form>



    <el-row class="tac">
      <el-col :span="8" style="min-width:400px;">
        <h5>导航管理</h5>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>注册登录认证相关</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>


          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>课程学习成绩相关</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>其他问题</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-col>

       <el-col :span="12">
         <h5>内容</h5>
         {{problemContent}}
       </el-col>

     
    </el-row>











    <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
    </el-pagination>

  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'

  export default {
    name: "help",
    components:{
      headerTheAgain
    },
    data(){
      return{
        problemContent:''
      }
    },
    methods:{
       handleOpen(key, keyPath) {
         console.log('点击展开',key);
         this.problemContent = '问题内容'+key;
      //  console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
       // console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>

</style>