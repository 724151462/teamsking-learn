<template>
<div>
    <div class="test">
    <tip title="试题管理"></tip>
    <!--<div style="display: flex;margin: 25px 0;">-->
      <!--<div style="" class="btn-warp" >-->
        <!--<div>-->
          <!--<el-button type="success" @click="downTemp">下载模板</el-button>-->
        <!--</div>-->
        <!--<div>-->
          <!--<el-upload-->
            <!--:http-request="upTestFile"-->
            <!--action="string"-->
            <!--:show-file-list="false">-->
            <!--<el-button >导入</el-button>-->
          <!--</el-upload>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <div class="test-warp">
      <div class="test-title">
        <div style="flex: 1">
          <el-button type="primary" size="small" @click="goCreateCatalog('',0)">创建目录</el-button>
          <el-button type="info" size="small"
                     v-bind:class="{ active: deleteArr.length>0}"
                     @click="deleteCatalog">删除</el-button>
          <!-- <el-button type="danger" size="small" @click="checkAll(true)">清空库</el-button> -->
          <el-button type="success" size="small" @click="downTemp">下载模板</el-button>
          <el-upload
            style="display: inline-block;margin-left: 10px"
            :http-request="upTestFile"
            action="string"
            :show-file-list="false">
            <el-button  type="success" style="padding: 9px 20px;">导入</el-button>
          </el-upload>
        </div>
        <div>
          <div style="display: flex">
            <div style="width: 300px">
              <el-input
                placeholder="搜索试题"
                v-model="input">
              </el-input>
            </div>
            <div>
              <el-button icon="el-icon-search" class="search-btn" @click="searchTestList(0,input)"></el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="test-body">
        <el-tree
          :data="catalogData"
          :props="{
            label: 'catalogName',
            children: 'catalogList'
          }"
          show-checkbox
          :default-expanded-keys="expan"
          @check-change	="nodeCheck"
          accordion
          draggable
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
          node-key="catalogId"
          ref="tree">
            <span class="test-tree-node" slot-scope="{ node, data }">
              <div class="test-info">
                <img
                  :width="20"
                  v-if="data.catalogId"
                  style="margin-right: 3px"
                  :src="require('@/assets/images/folder.png')"
                  alt
                >
                <!--<img :src="require('@/assets/images/folder.png')" alt="" class="folder-img" style="width: 20px" v-show="!data.quizId">-->
                <span class="quiz-tag" v-show="data.quizType == 10">单选题</span>
                <span class="quiz-tag" v-show="data.quizType == 20">多选题</span>
                <span class="quiz-tag" v-show="data.quizType == 30">主观题</span>
                <span style="margin-left: 10px">{{ node.label }}</span>
              </div>
              <div class="hide-button">
                <span v-if="data.catalogLevel">
                  <el-button size="mini" type="primary" v-show="data.catalogLevel<3" @click.stop="goCreateCatalog(data,data.catalogId)"> 创建子目录 </el-button>
                  <el-button size="mini" type="primary" @click.stop="goRenameCatalog(data,data.catalogId)"> 重命名 </el-button>
                  <el-button size="mini" type="primary" @click.stop="goAddTest(data.catalogId)"> 添加试题 </el-button>
                  <!--<el-button size="mini" type="primary" @click="() => remove(node, data)">删除</el-button>-->
                </span>
                <span v-else class="hide-button">
                  <el-button size="mini" type="primary" @click.stop="goEditTest(data.quizId)"> 编辑 </el-button>
                  <el-button size="mini" type="primary" @click.stop="delQuiz(data.quizId,data.parentId)">删除</el-button>
                </span>
              </div>

              <span style="margin-right: 10px" v-show="data.updateTime">{{data.updateTime}}</span>
            </span>
        </el-tree>
      </div>
    </div>
    <!--试题查看弹窗-->
    <el-dialog
      title="试题查看"
      :visible.sync="testView"
      width="50%">
       <div class="test-body">
         <p><span style="margin-right: 20px"><b>(单选题)</b></span>1、在下列设备中，不能作为危机输入设备的是?</p>
         <br>
         <div class="options">
           <span>A、扫描仪</span>
           <span>B、扫描仪</span>
           <span>C、扫描仪</span>
           <span>D、扫描仪</span>
         </div>
       </div>
      <span slot="footer" class="dialog-footer" style="text-align: left">
        <p>正确答案:<span>C</span></p>
        <p>解析:<span>鼠标是一种常用的输入设备</span></p>
      </span>
    </el-dialog>
    <!--删除确认框-->
    <el-dialog
      title="清空资源"
      :visible.sync="allDelete"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="40%">
      <span style="font-size: 16px">此操作会清空试题库，请慎重！</span>
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
  </div>
</div>

</template>

<script>
  import UpOss from "@/components/up-oss";
  import {
    getTestFileFold, newTestFileFold ,
    deleteTestFileFold, deleteQuiz,
    upQuiz, testFileFoldRename,
    moveTest,
  } from "../../../../api/library";
  import tip from '@/components/tip'

  export default {
    // components:{uposs},
    created (){
      this.getTestList(0)
    },
    components:{
      UpOss,
      tip
    },
    data() {
      return {
        imgSrc: {
          folder: require("../../../../assets/images/folder.png"),
        },
        catalogData: [{
          catalogId: 0,
          parentId: 0,
          catalogName: "默认文件夹",
          catalogList: [
            {
              id: 1,
              catalogName: "子文件夹",
              parentId: 0,
              catalogLevel: 1
            }
          ],
          quizList: [{
            quizTitle: '试题名称',
            parentId: 0,
          }]
        }],
        isCheckAll: false,
        value:'',
        //创建新文件夹的表单
        newCatalog:{
          catalogId: 0,
          catalogName: ""
        },
        input:'',//搜索框的值
        deleteArr:[],//需要删除的文件夹的数组
        quizArr:[],//需要删除的试题数组
        uploadDialog: false, //文件上传弹窗
        createCatalog: false, //新建目录弹窗
        renameCatalog : false,//重命名弹窗
        testView: false , //试题查看弹窗
        allDelete: false, //删除试题
        //courseId: '0608367675f54267aa6960fd0557cc1b',//如果指定课程的话，课程ID
        courseId: '',//如果指定课程的话，课程ID
        catalogPros:{
          label:'catalogName'
        },
        expan:[],
      }
    },
    methods: {
      //下载模板
      downTemp(){
        var FileSaver = require("file-saver");
        FileSaver.saveAs('https://tskedu-course.oss-cn-beijing.aliyuncs.com/ExcelTemplate/QuizTemplate.xls','试题模板')
      },
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
      reFileFold(){
        let data = this.newCatalog
        testFileFoldRename(data).then(res => {
          if (Number(res.code) === 200) {
            this.$message.success('重命名成功');
            this.renameCatalog = false
            this.newCatalog.catalogName = ''
            //更新页面数据
            this.getTestList(0)
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      // 全选操作
      checkAll(flag){
        //获取所有文件夹节点的id用于全选
        let idArr = []
        this.catalogData.forEach((item)=>{
          idArr.push(item.catalogId)
        })
        this.isCheckAll = flag
        this.isCheckAll ? idArr : idArr=[]
        this.deleteArr= idArr

        this.allDelete = flag
        // this.$refs.tree.setCheckedKeys(idArr)
      },
      //节点复选框被选
      nodeCheck(data, checked){
        if(checked){
          this.deleteArr.push(data.catalogId)
          this.quizArr.push(data.quizId)
        }else{
          let index = this.deleteArr.indexOf(data.catalogId)
          this.deleteArr.splice(index,1)

          let reindex = this.quizArr.indexOf(data.quizId)
          this.quizArr.splice(index,1)
        }
        this.deleteArr =this.deleteArr.filter((item)=>{
          return item != undefined
        })
        this.quizArr =this.quizArr.filter((item)=>{
          return item != undefined
        })
      },
      // 获取所有试题列表
      getTestList(id,key){
      this.$store.commit("SHOWLOADING");
        let data = {
          quizType: id,
          searchKey:key
        }
        getTestFileFold(data).then(res => {
                    this.$store.commit("HIDELOADING");
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
            this.catalogData = this.filterData(res.data)
          } else {
            this.$message({
              message: "试题列表数据获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      },
      searchTestList(id,key){
        let data = {
          quizType: id,
          searchKey:key
        }
        getTestFileFold(data).then(res => {
          if (Number(res.code) === 200) {
            this.catalogData = this.filterData(res.data)
          } else {
            this.$message({
              message: "试题列表数据获取失败",
              type: "error"
            });
          }
        })
      },
      //新建文件夹
      newFileFold(){
      this.$store.commit("SHOWLOADING");

        let data = this.newCatalog
        this.expan = [this.newCatalog.catalogId]
        newTestFileFold(data).then(res => {
                    this.$store.commit("HIDELOADING");
          console.log(res)
          if (Number(res.code) === 200) {
            this.$message.success('文件夹新建成功');
            this.createCatalog = false
            this.newCatalog.catalogName = ''
            //更新页面数据
            this.getTestList(0)
          } else {
            this.$message.error('文件夹新建失败');
          }
        })
      },
      goEditTest(id) {
        this.$router.push(`/course/resource/edittest/${id}`);
      },
      goAddTest(catalogId) {
        this.$router.push({path: `/course/resource/addtest/${catalogId}` });
      },
      // 导入试题模板
      upTestFile(item) {
        this.beforTestUpload(item)
        let upFile = item.file
        let fileFormData = new FormData();
        fileFormData.append('file', upFile);
      this.$store.commit("SHOWLOADING");
        upQuiz(fileFormData).then(res => {
                    this.$store.commit("HIDELOADING");
          console.log(res)
          this.$message.success('新增' + res.data.totalCount + '个试题')
        }).catch(error => {
          console.log(error)
        })
      },
      //文件上传验证
      beforTestUpload(file) {
        console.log(file.file.name, '文件');
        this.files = file;
        const extension = file.file.name.split('.')[1] === 'xls'
        const extension2 = file.file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.file.size / 1024 / 1024 < 5
        if (!extension && !extension2) {
          this.$message.warning('上传模板只能是 xls、xlsx格式!')
          return
        }
        if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 5MB!')
          return
        }
        this.fileName = file.file.name;
        return false // 返回false不会自动上传
      },
      // 删除试题
      delQuiz(id,parentId) {
      this.$store.commit("SHOWLOADING");

        this.quizArr.push(Number(id))
        let arr = [...this.quizArr]
        this.expan = [parentId]
        deleteQuiz(arr).then(res => {
          this.$store.commit("HIDELOADING");
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
      this.$store.commit("SHOWLOADING");

        let catalogIds = [...this.deleteArr]
        console.log(catalogIds)
        deleteTestFileFold(this.deleteArr).then(res => {
                    this.$store.commit("HIDELOADING");
          console.log(res)
          if (Number(res.code) === 200) {
            this.$message.success('删除成功');
            this.allDelete = false
            this.getTestList(0)
          } else {
            this.$message.error('删除失败');
          }
        })
      },
      //编辑试题
      goEdit(quizId){
        this.$router.push({ path: `/course/resource/edittest/${quizId}` })
      },
      //清洗数据
      filterData(data){
        let getFilter = (data)=>{
         data.forEach((item)=>{
            if(item.catalogList.length!==0){
              getFilter(item.catalogList)
            }
            if(item.quizList.length !==0){
              item.quizList.forEach((list)=>{
                list.quizTitle = list.quizTitle.replace(/<[^>]+>/g,"");//去掉所有的html标记
                item.catalogList.push({
                  catalogName: list.quizTitle,
                  quizId: list.quizId,
                  updateTime:list.updateTime,
                  quizType:list.quizType,
                  parentId:item.catalogId
                })
              })
            }
          })
          return data
        }
        return getFilter(data)
      },
      //拖拽相关
      handleDrop(draggingNode, dropNode, dropType, ev) {

        //console.log(dropType)
        //console.log('拖拽的',dropNode.label,dropNode)

        let type= draggingNode.data.catalogId ? 1 :2,
          beforeId = type == 1 ? draggingNode.data.catalogId: draggingNode.data.resourceId,
          afterType = dropNode.data.catalogId ? 1 : 2,
          afterId = type == 1 ? dropNode.data.catalogId: dropNode.data.resourceId;

        let data = {}

        switch (dropType) {
          case 'inner':
            data = {id: beforeId, type: type, inCatalogId: afterId}
            this.move(data)
            break
          case 'after':
            data = {
              id: beforeId,
              type: type,
              previous: {
                id: afterId,
                type: afterType
              }
            }
            console.log(data)
            console.log('将被移到id:', dropNode.data.catalogId, '名字：', dropNode.label, '后面')
            this.move(data)
            break
          case 'before':
            if (dropNode.previousSibling.previousSibling) {
              data = {
                id: beforeId,
                type: type,
                previous: {
                  id: dropNode.previousSibling.previousSibling.data.catalogId,
                  type: afterType
                }
              }
              console.log(data)
              console.log('将被移到id', dropNode.previousSibling.previousSibling.data.catalogId,
                '名字:', dropNode.previousSibling.previousSibling.label, '后面')
            } else {
              data = {
                id: beforeId,
                type: type,
                next: {
                  id: afterId,
                  type: afterType
                }
              }
              console.log(data)
              console.log('将被移到最顶部')
            }
            this.move(data)
            break
        }
      },
      allowDrop(draggingNode, dropNode, dropType) {
        if(!draggingNode.data.catalogId){
          return type === 'inner' && dropNode.data.catalogId
        }else if(draggingNode.data.catalogId){
          return dropNode.data.catalogId
        } else{
          return true
        }
      },
      //文件夹/文件 移动操作
      move(data){
        moveTest(data).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            this.$message.success('移动成功')
            this.searchTestList(0)
          } else {
            this.$message.error('移动失败');
            this.searchTestList(0)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .active
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  //单选，多选，徽章
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
      border-bottom: 1px solid #e3e8ee;
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
          width 100%;
          max-width 600px;
          flex: 1;
          overflow: hidden;
          padding-right: 30px;
          white-space: nowrap;
          text-overflow: ellipsis;
</style>

