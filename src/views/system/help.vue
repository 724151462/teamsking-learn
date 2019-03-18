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
      <el-col :span="10" style="min-width:400px;">
        <h5>导航管理</h5>
        <el-menu
          :default-active="activeIndex"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect">
          <template v-for="item in helpMenu">
                <!-- 菜单目录层 -->
                <el-submenu :index="String(item.navId)" :key="item.navId">
                  <template slot="title">
                    <i :class="item.iconCls"></i>
                    <span slot="title">{{item.navName}}</span>
                    <div class="operation parent">
                      <span @click.stop="addQuestion(item)" style="margin-right: 10px">新增问题</span>
                      <span @click.stop="edit(item)" style="margin-right: 10px">编辑</span>
                      <span @click.stop="del(item)">删除</span>
                    </div>
                    
                  </template>
                  <template v-for="term in item.children">
                    <!-- 子菜单展示 -->
                    <el-menu-item
                     v-if="term.showCode !== 2"
                    :key="term.navId"
                    :index="String(term.navId)"

                  >
                    <template slot="title">
                    <i :class="item.iconCls"></i>
                    <span v-if="term.navId === activeIndex">123</span>
                    <span slot="title">{{term.navName}}</span>
                    <div class="operation children">
                      <span @click.stop="edit(term)" style="margin-right: 10px">编辑</span>
                      <span @click.stop="del(term)">删除</span>
                    </div>
                    
                  </template>
                    </el-menu-item>
                  </template>    
                </el-submenu>
              </template>
        </el-menu>
        <el-dialog :visible.sync="questionDialog" :title="questionForm.title">
          <el-form>
            <el-form-item label='问题标题'>
              <el-input v-model="questionForm.name" placeholder="请输入问题标题"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="questionDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveQuestion">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>

       <el-col :span="12">
         <h5>内容</h5>
         <div style="padding: 10px">
          <el-collapse 
          v-for="(item,index) in contentList" 
          :key="item.helpContentId" 
          v-model="activeName" accordion>
            <el-collapse-item :title="index+1 + ':' + item.title" :name="item.helpContentId">
              <div id="triangle-up"></div>
              <div class="answer">答:{{item.content}}</div>
            </el-collapse-item>
         </el-collapse>
         </div>
       </el-col>

     
    </el-row>
    <!-- <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
    </el-pagination> -->

  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'
  import { 
    helpList, 
    helpDetail, 
    editQuestionTitle,
    addQuestionTitle,
    delQuestionTitle
  } from '@/api/system'

  export default {
    name: "help",
    components:{
      headerTheAgain
    },
    data(){
      return{
        dialogTitle: '',
        questionForm: {},
        problemContent: '',
        helpMenu: [],
        contentList: [],
        activeName: '',
        activeIndex: '',
        questionDialog: false
      }
    },
    mounted() {
      this.getHelpList()
    },
    methods:{
      getHelpList() {
        helpList().then(response => {
          this.helpMenu = response.data
        })
      },
      saveQuestion() {
        console.log(this.questionForm)
        if(this.dialogTitle === '修改标题') {
          editQuestionTitle(this.questionForm).then(response=> {
            if(response.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.questionDialog = false
              this.getHelpList()
            }
          })
        }else{
          let params = Object.assign({}, this.questionForm)
          params.navName = this.questionForm.name
          delete params.name
          addQuestionTitle(params).then(response=> {
            if(response.code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.questionForm = {}
              this.questionDialog = false
              this.getHelpList()
            }
          })
        }
      },
      // 添加问题
      addQuestion(item) {
        this.dialogTitle = '新增问题'
        this.questionForm = {}
        this.questionForm.parentNavId = item.navId
        this.questionDialog = true
      },
      // 修改问题
      edit(item) {
        console.log(item)
        this.dialogTitle = '修改标题'
        this.questionForm.navId = item.navId
        this.$set(this.questionForm, 'name', item.navName)
        this.questionDialog = true
      },
      del(item) {
        delQuestionTitle([item.navId])
        .then(response=> {
          if(response.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getHelpList()
          }
        })
      },
       handleOpen(key, keyPath) {
         console.log('点击展开',key);
         this.problemContent = '问题内容'+key;
      //  console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
       // console.log(key, keyPath);
      },
      handleSelect(...params) {
        let questionId = params[0]
        this.activeIndex = questionId
        helpDetail({navId: questionId}).then(response=> {
          this.contentList = response.data.pageData
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .operation
    position relative
    left 320px
    display inline-block
    font-size 12px
    color #fff
    opacity  0
  .children
    left 180px
  .answer
    padding: 5px;
    border: 1px solid rgb(197,234,254);
    background: rgb(195,234,254);
    border-radius: 5px;
  #triangle-up
    position relative
    left 15px
    width:0;
    height:0;
    border-left:5px solid transparent;
    border-right:5px solid transparent;
    border-bottom:10px solid rgb(197,234,254);
  .el-submenu-item
    height 30px
    line-height 30px
  .el-menu-item
    height 30px
    line-height 30px
  .el-menu-item:hover
    background rgb(64, 158, 254)
    color #fff
    .children
      opacity 1
  .el-submenu__title:hover
    background #409EFF
    color #fff
    .parent
      color #000
      opacity 1
  .el-submenu__title
    &:hover
      background #409EFF
      color #fff
  .el-menu-item.is-active
    background none
    color rgb(64, 158, 254)
    border-left: 3px solid;
</style>
