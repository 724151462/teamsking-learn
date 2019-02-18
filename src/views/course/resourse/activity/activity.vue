<template>
  <div class="activity">
    <div class="title">
      <div>活动管理</div>
    </div>
    <div style="display: flex;margin: 25px 0;">
      <div style="display: flex">
        <div style="width: 300px">
          <el-input
              placeholder="查找活动"
              v-model="input">
          </el-input>
        </div>
        <div>
          <el-button icon="el-icon-search" class="search-btn" @click="newList(0,input)"></el-button>
        </div>
      </div>
    </div>
    <div class="test-warp">
      <div class="test-title">
        <div style="flex: 1"></div>
        <div>
          <!--全选-->
          <!--<el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>-->
          <el-button type="primary" size="small" @click="goCreateCatalog('',0)">创建目录</el-button>
          <el-button type="info"
                     size="small"
                     v-bind:class="{ active: deleteArr.length>0}"
                     @click="deleteCatalog">删除</el-button>
          <el-button type="danger" size="small" @click="checkAll(true)">清空库</el-button>
        </div>
      </div>
      <div class="test-body">
        <el-tree
            :data="activityData"
            :props="{
            label: 'catalogName',
            children: 'childList'
          }"
            show-checkbox
            @check-change = "nodeCheck"
            accordion
            draggable
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
            :default-expanded-keys="expan"
            node-key="catalogId"
            ref="tree">
            <span class="test-tree-node" slot-scope="{ node, data }">
              <span class="test-info">
                <img :src="imgSrc.folder" alt="" class="folder-img" v-show="!data.interactionId">
                <span class="quiz-tag" v-if="data.interactionType == 30">测试</span>
                <span class="quiz-tag" v-else-if="data.interactionType == 40">作业</span>
                <span class="quiz-tag" v-else-if="data.interactionType == 50">头脑风暴</span>
                <span class="quiz-tag" v-else-if="data.interactionType == 60">投票问卷</span>
                <span class="quiz-tag" v-else-if="data.interactionType == 70">讨论</span>
                <span>{{ node.label }}</span>
                <!--<span v-if="data.interactionId" class="golook" style="margin-left: 20px" @click="showAc(data.interactionId,data.interactionType)">查看</span>-->
              </span>
              <span>
                <span v-if="data.catalogLevel" class="hide-button">
                  <el-button size="mini" type="primary" v-show="data.catalogLevel<3" @click.stop="goCreateCatalog(data,data.catalogId)"> 创建子目录 </el-button>
                  <el-button size="mini" type="primary" @click.stop="goRenameCatalog(data,data.catalogId)"> 重命名 </el-button>
                  <!--<el-button size="mini" type="primary" @click="() => remove(node, data)">删除</el-button>-->
                </span>
                <span v-else class="hide-button">
                  <!--<el-button size="mini" type="primary" @click.stop="goEditTest(data.interactionId)"> 编辑 </el-button>-->
                  <!--<el-button size="mini" type="primary" @click.stop="delAc(data.interactionId)">删除</el-button>-->
                </span>
              </span>

              <span style="margin-right: 10px" v-show="data.updateTime">{{data.createTime}}</span>
            </span>
        </el-tree>
      </div>
    </div>
    <!--删除确认框-->
    <el-dialog
        title="清空资源"
        :visible.sync="allDelete"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        width="40%">
      <span style="font-size: 16px">此操作会清空活动库，请慎重！</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="checkAll(false)">取 消</el-button>
    <el-button type="danger" @click="deleteCatalog">确 定</el-button>
    </span>
    </el-dialog>
    <!--创建目录弹窗-->
    <el-dialog
        title="创建目录"
        :visible.sync="createCatalog"
        width="40%">
      <el-input v-model="newCatalog.catalogName" placeholder="请输入文件夹的名字"></el-input>

      <span slot="footer" class="dialog-footer">
          <el-button @click="createCatalog = false">取 消</el-button>
          <el-button type="primary" @click="newFileFold">确 定</el-button>
        </span>
    </el-dialog>
    <!--重命名弹窗-->
    <el-dialog
        title="重命名"
        :visible.sync="renameCatalog"
        width="40%">
      <el-input v-model="newCatalog.catalogName" placeholder="请输入文件夹的名字"></el-input>

      <span slot="footer" class="dialog-footer">
          <el-button @click="renameCatalog = false">取 消</el-button>
          <el-button type="primary" @click="reFileFold">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 查看活动弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="showCatalog"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCatalog = false">取 消</el-button>
        <el-button type="primary" @click="showCatalog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    deleteAc, removeAc, createAc,
    renameAc, getAcList, getStormInfo,
    getHomeWorkInfo, getExamInfo, getVoteInfo
  } from '@/api/library'
  export default {
    created () {
        this.getList(0)
    },
    data () {
      return {
        imgSrc: {folder: require("../../../../assets/images/folder.png"),},
        input2: '',
        //多选框验证
        isCheckAll:false, // 是否全选(一级)
        checked:[],      //被选择数据的数组
        //数据
        activityData:[
            {
                "catalogId": 0,
                "catalogLevel": 0,
                "catalogName": "string",
                "childList": [
                    {}
                ],
                "interactionList": [
                    {
                        "createTime": "",
                        "interactionId": 0,
                        "interactionName": "string",
                        "interactionStatus": 0,
                        "interactionType": 0,
                        "quizCount": 0,
                        "userCount": 0
                    }
                ],
                "parentId": 0,
            }
        ],
        //新文件夹数据
        newCatalog:{
            catalogId:0,
            catalogName:''
        },
        deleteArr:[],
        interactionIdArr:[],
        dragArr:[],
        expan:[],
        input:'', //搜索时用的搜索框
        createCatalog : false,
        renameCatalog : false,
        showCatalog : false,
        allDelete:false,

      };
    },
    methods:{
      //点击弹出新建目录的弹窗
      goCreateCatalog(data,id) {
          this.newCatalog.catalogId = id
          this.createCatalog = true
      },
      //点击弹出重命名的弹窗
      goRenameCatalog(data,id) {
        let parentId =  data.parentId || 0
        this.expan = [parentId]
        this.newCatalog.catalogId = id
          this.renameCatalog = true
      },
      //全选操作
      checkAll(flag){
          //获取所有文件夹节点的id用于全选
          let idArr = []
          this.activityData.forEach((item)=>{
              idArr.push(item.catalogId)
          })
          this.isCheckAll = flag
          this.isCheckAll ? idArr : idArr=[]
          this.deleteArr= idArr

          this.allDelete = flag
      },
      //节点复选框被选
      nodeCheck(data, checked){
          if(checked){
              this.deleteArr.push(data.catalogId)
              this.interactionIdArr.push(data.interactionId)
          }else{
              let index = this.deleteArr.indexOf(data.catalogId)
              this.deleteArr.splice(index,1)
              let reindex = this.interactionIdArr.indexOf(data.interactionId)
              this.interactionIdArr.splice(index,1)
          }
          this.deleteArr =this.deleteArr.filter((item)=>{
              return item != undefined
          })
          this.interactionIdArr =this.interactionIdArr.filter((item)=>{
              return item != undefined
          })
      },
      // 获取所有活动列表
      getList(id,key){
        let loading = this.$loading(this.loadingCss)
          let data = {
            interactionType : id,
            searchKey:key
          }
          getAcList(data).then(res => {
            loading.close()
              console.log(res)
              if (Number(res.code) === 200) {
                  //如果试题库为空，则初始化新建一个默认的文件夹
                  if(res.data.length === 0){
                      this.newCatalog = {
                          catalogId: 0,
                          catalogName: "默认文件夹"
                      }
                      this.newFileFold()
                  }
                  let data = JSON.parse(JSON.stringify(res.data))
                  this.activityData = this.filterData(data)
                  // console.log(this.activityData)
              } else {
                  this.$message({
                      message: "数据获取失败",
                      type: "error"
                  });
              }
          })
          .catch(error => {
              console.log(error);
          });
      },
      // 获取所有活动列表,无loading效果
      newList(id,key){
        let data = {
          interactionType : id,
          searchKey:key
        }
        getAcList(data).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            let data = JSON.parse(JSON.stringify(res.data))
            this.activityData = this.filterData(data)
            // console.log(this.activityData)
          } else {
            this.$message({
              message: "数据获取失败",
              type: "error"
            });
          }
        })
      },
        //新建文件夹
        newFileFold(){
            let data = this.newCatalog
          this.expan = [this.newCatalog.catalogId]
          createAc(data).then(res => {
                if (Number(res.code) === 200) {
                    this.$message.success('文件夹新建成功');
                    this.createCatalog = false
                    this.newCatalog.catalogName = ''
                    //更新页面数据
                    this.getList(0)
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        //重命名文件夹
        reFileFold(){
            let data = this.newCatalog
            console.log(data)
            renameAc(data).then(res => {
                if (Number(res.code) === 200) {
                    this.$message.success('重命名成功');
                    this.renameCatalog = false
                    this.newCatalog.catalogName = ''
                    //更新页面数据
                    this.getList(0)
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        goAddTest(catalogId) {
            this.$router.push({path: `/course/resource/addtest/${catalogId}` });
        },
        // 删除活动
        delAc() {
          deleteAc(this.quizArr).then(res => {
                console.log(res)
                if (Number(res.code) === 200) {
                    this.$message.success('试题删除成功');
                    this.getTestList(0)
                } else {
                    this.$message.error('删除失败');
                }
            })
        },
        //删除文件夹
        deleteCatalog(){
            deleteAc(this.deleteArr).then(res => {
                if (Number(res.code) === 200) {
                    this.$message.success('删除成功');
                    this.allDelete = false
                    this.getList(0)
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        //清洗数据
        filterData(data){
            let getFilter = (data)=>{
                data.forEach((item)=>{
                    if(!item.childList.length!==0){
                        getFilter(item.childList)
                    }
                    if(item.interactionList.length !==0){
                      let parentId = item.catalogId

                      item.interactionList.forEach((list)=>{
                            list.interactionTitle = list.interactionTitle.replace(/<[^>]+>/g,"");//去掉所有的html标记
                            item.childList.push({
                              catalogName: list.interactionTitle,
                              interactionId: list.interactionId,
                              createTime:list.createTime,
                              interactionType:list.interactionType,
                              parentId,
                            })
                        })
                    }
                })
                return data
            }
            let curData = getFilter(data)
            return curData
        },
        //查看资源
        showAc(id,type){
          //30:测试，40:作业/任务，50:头脑风暴， 60:投票问卷
          console.log(id,type)
          if(type == 30){
            this.initExamInfo(id)
          }else if(type == 40){
            this.initHomeWorkInfo(id)
          }else if(type == 50){
            this.initStormInfo(id)
          }else if(type == 60){
            this.initVoteInfo(id)
          }
        },
        //移动文件夹、
        remove(data){
          removeAc(data).then(res => {
            console.log(res)
            if (Number(res.code) === 200) {
              this.$message.success('移动成功');
              // this.getTestList(0)
            } else {
              this.$message.error(res.data.message);
            }
          })
        },
        //获取作业的信息
        initExamInfo(id){
          let loading = this.$loading(this.loadingCss)
          getExamInfo(id).then(res => {
            if (Number(res.code) === 200) {
              loading.close()
              console.log(res)
            } else {
              this.$message.error(res.data.message);
            }
          })
        },
      //获取头脑风暴的信息
      initStormInfo(id){
        let loading = this.$loading(this.loadingCss)
        getStormInfo(id).then(res => {
          if (Number(res.code) === 200) {
            loading.close()
            console.log(res)
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      //获取投票的信息
      initVoteInfo(id){
        let loading = this.$loading(this.loadingCss)
        getVoteInfo(id).then(res => {
          if (Number(res.code) === 200) {
            loading.close()
            console.log(res)
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      //获取作业的信息
      initHomeWorkInfo(id){
        let loading = this.$loading(this.loadingCss)
        getHomeWorkInfo(id).then(res => {
          if (Number(res.code) === 200) {
            loading.close()
            console.log(res)
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      //拖拽相关
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let beforeType= draggingNode.data.resourceId ? 2 :1,
          beforeId = beforeType ==1 ? draggingNode.data.catalogId: draggingNode.data.resourceId,
          afterType = dropNode.data.resourceId ? 2 :1,
          afterId = afterType ==1 ? dropNode.data.catalogId: dropNode.data.resourceId;

        let expanId = draggingNode.data.catalogId || draggingNode.data.parentId
        this.expan=[expanId]

        if(dropType == 'after'){
          let data = {
            id:beforeId,
            type:beforeType,
            previous: {
              id: afterId,
              type:afterType
            }
          }
          console.log(draggingNode.data.catalogName, '---文件夹移动到---', dropNode.data.catalogName ,'--的后面')
          console.log(data)
          this.move(data)
        }else if(dropType == 'before'){
          let data = {
            id:beforeId,
            type:beforeType,
            previous: {
              id: afterId,
              type:afterType
            }
          }
          console.log(draggingNode.data.catalogName, '---文件夹移动到---', dropNode.data.catalogName ,'--的前面')
          console.log(data)
          // this.move(data)
        }else if(dropType == 'inner'){
          let data = {
            id:beforeId,
            type:beforeType,
            inCatalogId:afterId
          }
          console.log(data)
          console.log('移入操作')
          this.move(data)
        }
      },
      allowDrop(draggingNode, dropNode, dropType) {
        // console.log(draggingNode,dropNode,dropType)
        let type = draggingNode.data.resourceId ? 2 :1
        if(type ==2 && dropNode.data.catalogLevel == 1){
          return false
        }else if (dropType == 'prev' || dropType == 'next'){
          return false
        }else{
          return true
        }
      },
      //文件夹/文件 移动操作
      move(data){
        removeAc(data).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            this.$message.success('移动成功')
            this.newList(0)
          } else {
            this.$message.error('移动失败');
            this.newList(0)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .golook
    color #ccc
    &:hover
      color :#409EFF
  .active
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  .activity
    .title
      border-bottom 2px solid gray
      padding-bottom 20px
    .search-box
      width: 350px
      float: right
      padding:15px 0
      display: flex
      .search-btn
        border-left 0
        background-color #f4f4f4
        border-radius 4px
    .quiz-tag
      display inline-block
      padding 0 5px
      margin 0 5px
      color cornflowerblue
      border 1px solid cornflowerblue
    //隐藏按钮
    .hide-button
      opacity  0
      &:hover
        opacity  1
    .el-table .cell
      overflow: hidden
      white-space: nowrap
      text-overflow:ellipsis
    .test
      padding:0 5% 20px 50px
    .search-btn
      border-left 0
      background-color #f4f4f4
      border-radius 4px
    .title
      width 100%
      display flex
      align-items center
      border-bottom 2px solid gray
      padding-bottom 10px
      & div:first-chilf
        height 45px;
        width 100px;
    .btn-warp
      flex 1
      display flex
      justify-content flex-end
      & div
        margin 0 10px
      & div:last-child
        margin-right 0
    .test-warp
      .img-span
        display inline-block
        .img-icon
          width 48px
          height 48px
          margin 0 10px
      .test-title
        display flex
        height 50px
        align-items center
        background-color #f4f4f4
      .test-body
        .folder-img
          width: 20px;margin: -5px 10px;
        .test-tree-node
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-right: 8px;
          .test-info
            flex: 1;
            overflow: hidden;
            padding-right: 30px;
            white-space: nowrap;
            text-overflow: ellipsis;

</style>
