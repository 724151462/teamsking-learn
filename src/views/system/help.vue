<template>
  <div class="help">
    <header-the-again headerTitle="帮助中心">
      <el-form ref="form" :inline="true" label-width="100px" class="form-query">
              <el-form-item label="输入搜索：">
                  <el-input placeholder="请输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" >查询</el-button>
              </el-form-item>
      </el-form>
    </header-the-again>

    <el-row>
      <el-col :span="10" style="min-width:400px;">
        <h5>导航管理</h5>
        <el-menu
          :default-active="activeIndex"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          unique-opened>
          <template v-for="item in helpMenu">
                <!-- 菜单目录层 -->
                <el-submenu :index="String(item.navId)" :key="item.navId">
                  <template slot="title">
                    <i :class="item.iconCls"></i>
                    <span slot="title">{{item.navName}}</span>
                    <div class="operation parent">
                      <el-tooltip content="添加问题类型" placement="top">
                        <i class="el-icon-plus" @click.stop="addQuestion(item)" style="margin-right: 10px"></i>
                      </el-tooltip>
                      <el-tooltip content="修改" placement="top">
                        <i class="el-icon-edit" @click.stop="edit(item)" style="margin-right: 10px"></i>
                      </el-tooltip>
                      <el-tooltip content="删除" placement="top">
                        <i class="el-icon-delete" @click.stop="del(item)"></i>
                      </el-tooltip>
                    </div>
                    
                  </template>
                  <template v-for="term in item.children">
                    <!-- 子菜单展示 -->
                    <el-menu-item
                    :key="term.navId"
                    :index="String(term.navId)"

                  >
                    <template slot="title">
                    <i :class="item.iconCls"></i>
                    <span v-if="term.navId === activeIndex">123</span>
                    <span slot="title">{{term.navName}}</span>
                    <div class="operation children">
                      <el-tooltip content="删除" placement="top">
                        <i class="el-icon-delete" @click.stop="del(item)" style=" color: #909399; margin-left: 100px"></i>
                      </el-tooltip>
                    </div>
                    
                  </template>
                    </el-menu-item>
                  </template>    
                </el-submenu>
              </template>
        </el-menu>
        <el-button type="primary" size="small" @click="addQuestion({navId: 0})">
          添加问题类型
        </el-button>
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
            <el-collapse-item :name="item.helpContentId">
              <template slot="title">
                <div class="collapse-title">
                  <span>
                    {{index+1 + ':' + item.title}}
                  </span>
                  <div>
                    <el-tooltip content="修改" placement="top">
                      <i class="el-icon-edit" @click.stop="editContent(item)" style="margin-right: 10px"></i>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <i class="el-icon-delete" @click.stop="delItem(item)"></i>
                    </el-tooltip>
                  </div>
                </div>
              </template>
              <div id="triangle-up"></div>
              <div class="answer">答:{{item.content}}</div>
            </el-collapse-item>
         </el-collapse>
         </div>
         <div class="addContent">
           <el-button 
            type="primary" 
            size="small" 
            style="margin-top: 20px;margin-left: 20px" 
            @click="addContent"
            v-if="activeIndex">
             添加内容
           </el-button>
         </div>
       </el-col>

     
    </el-row>
    <el-dialog :visible.sync="contentForm.addContentShow" :title="contentForm.title">
      <el-form :model="helpItemForm">
        <el-form-item label="帮助问题">
          <el-input placeholder="请输入问题描述" v-model="helpItemForm.title"></el-input>
        </el-form-item>
        <el-form-item label="回答内容">
          <el-input placeholder="请输入回答" v-model="helpItemForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="questionDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveItem">确 定</el-button>
      </span>
    </el-dialog>
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
    delQuestionTitle,
    addContent,
    editContent,
    questionId, // select选中后暂存
  } from '@/api/system'
import { throws } from 'assert';
import { delContent } from '../../api/system';

  export default {
    name: "help",
    components:{
      headerTheAgain
    },
    data(){
      return{
        helpItemForm: {}, // 要添加或修改的帮助条目数据
        contentForm: {
          addContentShow: false
        },
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
        this.questionForm.parentNavId = item.navId
        this.dialogTitle = '新增问题'
        // this.questionForm = {}
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
        this.$store.commit(
          'DELETECONFIRM',{
            title: '提示',
            message: '确认删除问题?', 
            fn:() => {
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
            }
          }
          
        )
        // this.$confirm('确认删除问题?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   delQuestionTitle([item.navId])
        //   .then(response=> {
        //     if(response.code === 200) {
        //       this.$message({
        //         message: '删除成功',
        //         type: 'success'
        //       })
        //       this.getHelpList()
        //     }
        //   })
        // }).catch(() => {     
        // });
        
      },
      delConfirm() {
        
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
        this.questionId = params[0]
        this.activeIndex = this.questionId
        this.helpItemForm.navId = this.questionId
        helpDetail({navId: this.questionId}).then(response=> {
          this.contentList = response.data.pageData
        })
      },

      // 内容相关
      addContent() {
        this.contentForm.title = '添加内容与回答'
        // this.helpItemForm = {}
        this.contentForm.addContentShow = true
      },
      editContent(item) {
        console.log(item)
        let editContent = Object.assign({}, item)
        this.helpItemForm = editContent
        this.contentForm.title = '修改内容与回答'
        // this.helpItemForm = {}
        this.contentForm.addContentShow = true
      },
      saveItem() {
        console.log(this.helpItemForm)
        if(this.contentForm.title === '添加内容与回答'){
          addContent(this.helpItemForm)
          .then(response=> {
            if(response.code === 200) {
              this.$message({
                message: '添加内容成功',
                type: 'success'
              })
              this.contentList.push(response.data)
              this.helpItemForm = {}
              this.contentForm.addContentShow = false
            }
          })
        }else{
          editContent(this.helpItemForm)
          .then(response=> {
            if(response.code === 200) {
              this.$message({
                message: '修改内容成功',
                type: 'success'
              })
              this.helpItemForm = {}
              this.contentForm.addContentShow = false
              helpDetail({navId: this.questionId}).then(response=> {
                this.contentList = response.data.pageData
              })
            }
          })
        }
      },
      delItem(item) {
        delContent([item.helpContentId])
        .then(response=> {
          if(response.code === 200) {
            this.$message({
              message: '删除内容成功',
              type: 'success'
            })
            helpDetail({navId: this.questionId}).then(response=> {
              this.contentList = response.data.pageData
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .operation
    position absolute
    left 360px
    display inline-block
    font-size 12px
    color #fff
    display none
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
      display inline-block
    i 
      color: rgb(144, 147, 153) !important;
    
  .el-submenu__title:hover
    background #409EFF
    color #fff
    .parent
      color #000
      display inline-block
  .el-submenu__title
    &:hover
      background #409EFF
      color #fff
  .el-menu-item.is-active
    background none
    color rgb(64, 158, 254)
    border-left: 3px solid;
  .collapse-title
    display flex
    justify-content space-between
    width 94%
</style>
