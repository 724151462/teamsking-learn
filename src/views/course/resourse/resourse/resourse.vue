<template>
  <div class="resource">
    <div class="title">
      <div>资源管理</div>
    </div>
    <div class="radio-group">
      <div style="flex:1">
        <el-radio v-model="radio" :label="0" @change="getResource(radio)">全部文件</el-radio>
        <el-radio v-model="radio" :label="40" @change="getResource(radio)">图片</el-radio>
        <el-radio v-model="radio" :label="10" @change="getResource(radio)">视频</el-radio>
        <el-radio v-model="radio" :label="20" @change="getResource(radio)">文档</el-radio>
        <el-radio v-model="radio" :label="30" @change="getResource(radio)">音频</el-radio>
      </div>
      <div style="display: flex">
        <el-input
          placeholder="搜索资源"
          v-model="input">
        </el-input>
        <div>
          <el-button icon="el-icon-search" class="search-btn" @click="getResource(0,input)"></el-button>
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
          <el-button type="primary" size="small">移动到</el-button>
          <el-button type="info" size="small"
                     v-bind:class="{ active: deleteArr.length>0}"
                     @click="deleteCatalog" >删除</el-button>
          <el-button type="danger" size="small" @click="checkAll(true)">清空库</el-button>
        </div>
      </div>
      <div class="test-body">
        <el-tree
            :data="resourceData"
            :props="{
            label: 'catalogName',
            children: 'childCatalogList'
          }"
            show-checkbox
            @check-change	="nodeCheck"
            accordion
            node-key="catalogId"
            ref="tree">
            <span class="test-tree-node" slot-scope="{ node, data }">
              <span class="test-info">
                <img :src="imgSrc.folder" alt="" class="folder-img" v-show="!data.resourceId">
                <img :src="imgSrc.mp4" alt="" class="folder-img" v-if="data.resourceType == 10">
                <img :src="imgSrc.word" alt="" class="folder-img" v-else-if="data.resourceType == 20">
                <img :src="imgSrc.pdf" alt="" class="folder-img" v-else-if="data.resourceType == 30">
                <img :src="imgSrc.img" alt="" class="folder-img" v-else-if="data.resourceType == 40">
                <span class="tree-title">{{ node.label }}</span>
                <!--<span v-if="data.srtUrl != undefined"> <el-tag type="success">字幕</el-tag></span>-->
                <span class="str-tag" v-if="data.srtUrl != undefined">字幕</span>
              </span>
              <span>
                <span v-if="data.catalogLevel" class="hide-button">
                  <el-button size="mini" type="primary" v-show="data.catalogLevel<3" @click.stop="goCreateCatalog(data,data.catalogId)"> 创建子目录 </el-button>
                  <el-button size="mini" type="primary" v-show="data.catalogLevel" @click.stop="goUp">上传</el-button>
                  <!--<input style="display: none" type="file" id="inputs" @change="upInput"/>-->
                  <el-button size="mini" style="margin-left: 5px" type="primary" @click.stop="goRenameCatalog(data,data.catalogId)"> 重命名 </el-button>
                  <!--<el-button size="mini" type="primary" @click.stop="goAddTest(data.catalogId)"> 添加试题 </el-button>-->
                  <!--<el-button size="mini" type="primary" @click="() => remove(node, data)">删除</el-button>-->
                </span>
                <span v-else class="hide-button">
                  <el-button size="mini" type="primary" @click.stop="" v-if="data.resourceType.type ==10 && !data.srtUrl"> 添加字幕 </el-button>
                  <el-button size="mini" type="primary" @click.stop="delRes(data.resourceId)">删除</el-button>
                </span>
              </span>
              <span style="margin-right: 10px" v-show="data.updateTime">{{data.updateTime}}</span>
            </span>
        </el-tree>
      </div>
      <input type="file" id="inputs" multiple @change="upInput"/>
    </div>
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
</template>

<script>
  import {getResList, newResFileFold, reResFileFold, delResFileFold, deleteRes } from "@/api/library";
  import oss from '@/components/up-oss'
  export default {
    name: "resource",
    created() {
      this.getResource(0);
    },
    components:{
      oss
    },
    data() {
      return {
        imgSrc: {
          folder: require("../../../../assets/images/folder.png"),
          pdf: require("../../../../assets/images/pdf.png"),
          mp4: require("../../../../assets/images/mp4.png"),
          word: require("../../../../assets/images/word.png"),
          txt: require("../../../../assets/images/txt.png"),
          img: require("../../../../assets/images/img.png")
        },
        radio: 0,
        input: '',
        //多选框验证
        isCheckAll: false, // 是否全选(一级)
        //数据
        resourceData: [{ //课程资源数据列表
          courseId: '',
          courseName: '',
          resources: [
            {
              courseId: "",
              courseName: "",
              resources: [
                {
                  contentType: "",
                  courseId: "",
                  courseName: "",
                  coverUrl: "",
                  createTime: "",
                  creatorId: "",
                  creatorRealName: "",
                  resourceId: "",
                  resourceLength: "",
                  resourceSize: "",
                  resourceTitle: "",
                  resourceType: "",
                  resourceUrl: "",
                  srtSize: "",
                  srtUrl: "",
                  tenantId: "",
                  transProgress: "",
                  userId: ""
                }
              ]
            }
          ]
        }],
        //新文件夹数据
        newCatalog:{
          catalogId:0,
          catalogName:''
        },
        deleteArr:[],
        resourceArr:[],
        createCatalog : false,
        renameCatalog : false,
        allDelete:false
      };
    },
    methods: {
      //获取数据
      getResource(id,key) {
        let data = {
            resourceType: id,
            searchKey: key
        }
        let loading = this.$loading({
          lock: true,
          text: 'loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getResList(data).then(res => {
          loading.close()
          // console.log(res)
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
                this.resourceData = this.filterData(data)
                console.log(this.resourceData)
            } else {
                this.$message({
                    message: "试题列表数据获取失败",
                    type: "error"
                });
            }
        })
    },
      //点击弹出重命名的弹窗
      goRenameCatalog(data,id) {
        this.newCatalog.catalogId = id
        this.renameCatalog = true
        //创建子目录时目录不折叠
        // console.log(data)
        // const newChild = { catalogId: 101 , catalogName: "计算机网络--第一章" };
        // if (!data.catalogList) {
        //   this.$set(data, 'children', []);
        // }
        // data.catalogList.push(newChild);
      },
      //  文件下载
      fileDownload(url) {},
      fileUpload() {
        alert("上传");
      },
      change(value){
        alert(value)
      },
      //获取图片路径
      getImgSrc(type) {
        return this.imgSrc[type];
      },
      //点击弹出新建目录的弹窗
      goCreateCatalog(data,id) {
          this.newCatalog.catalogId = id
          this.createCatalog = true

          //创建子目录时目录不折叠
          // console.log(data)
          // const newChild = { catalogId: 101 , catalogName: "计算机网络--第一章" };
          // if (!data.catalogList) {
          //   this.$set(data, 'children', []);
          // }
          // data.catalogList.push(newChild);
      },
      //全选操作
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
          console.log(this.deleteArr)
          // this.$refs.tree.setCheckedKeys(idArr)
      },
      //节点复选框被选
      nodeCheck(data, checked){
        console.log(data)
        console.log(checked)
          if(checked){
              this.deleteArr.push(data.catalogId)
              this.resourceArr.push(data.resourceId)
          }else{
              let index = this.deleteArr.indexOf(data.catalogId)
              this.deleteArr.splice(index,1)

              let reindex = this.resourceArr.indexOf(data.resourceId)
              this.resourceArr.splice(index,1)
          }
          this.deleteArr =this.deleteArr.filter((item)=>{
              return item != undefined
          })
          this.resourceArr =this.resourceArr.filter((item)=>{
              return item != undefined
          })
      },
      //新建文件夹
      newFileFold(){
          let data = this.newCatalog
          newResFileFold(data).then(res => {
              console.log(res)
              if (Number(res.code) === 200) {
                  this.$message.success('文件夹新建成功');
                  this.createCatalog = false
                  this.newCatalog.catalogName = ''
                  //更新页面数据
                  this.getResource(0)
              } else {
                  this.$message.error('文件夹新建失败');
              }
          })
      },
      //重命名文件夹
      reFileFold(){
        let data = this.newCatalog
        reResFileFold(data).then(res => {
          if (Number(res.code) === 200) {
            this.$message.success('重命名成功');
            this.renameCatalog = false
            this.newCatalog.catalogName = ''
            //更新页面数据
            this.getResource(0)
          } else {
            this.$message.error(res.data.message);
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
          this.beforTestUpload()
          console.log(item)
          let fileFormData = new FormData();
          fileFormData.append('file', item.file);
          console.log(fileFormData)
          upQuiz(this.courseId, fileFormData).then(res => {
              this.$notify({
                  title: '试题导入成功',
                  message: '新增' + res.data.totalCount + '个试题',
                  type: 'success',
                  duration: 0
              });
          }).catch(error => {
              console.log(error)
          })
      },
      //文件上传验证
      beforTestUpload(file) {

          if (!this.courseId) {
              this.$notify.error({
                  title: '错误',
                  message: '请先搜索相关课程，再导入该课程的试题模板'
              });
              return false
          }

          console.log(file, '文件');
          this.files = file;
          const extension = file.name.split('.')[1] === 'xls'
          const extension2 = file.name.split('.')[1] === 'xlsx'
          const isLt2M = file.size / 1024 / 1024 < 5
          if (!extension && !extension2) {
              this.$message.warning('上传模板只能是 xls、xlsx格式!')
              return
          }
          if (!isLt2M) {
              this.$message.warning('上传模板大小不能超过 5MB!')
              return
          }
          this.fileName = file.name;
          return false // 返回false不会自动上传
      },
      //选择试题章节查询
      getChapterQuiz() {
          alert("按章节查询")
      },
      // 删除资源
      delRes(id) {
        this.resourceArr.push(Number(id))
        let arr = [...this.resourceArr]
        deleteRes(arr).then(res => {
            console.log(res)
            if (Number(res.code) === 200) {
                this.$message.success('资源删除成功');
                this.getResource(0)
            } else {
                this.$message.error('删除失败');
            }
          })
      },
      //删除文件夹
      deleteCatalog(){
          let catalogIds = [...this.deleteArr]
          if(catalogIds.length == 0){
            this.$message.warning('请选择要删除的文件夹')
            return false
          }
        let loading = this.$loading({
          lock: true,
          text: 'loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        delResFileFold(this.deleteArr).then(res => {
          loading.close()
          console.log(res)
              if (Number(res.code) === 200) {
                  this.$message.success('删除成功');
                  this.allDelete = false
                  this.getResource(0)
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
                  if(!item.childCatalogList.length!==0){
                      getFilter(item.childCatalogList)
                  }
                  if(item.resourceList.length !==0){
                      item.resourceList.forEach((list)=>{
                        console.log()
                        list.resourceList = list.resourceTitle.replace(/<[^>]+>/g,"");//去掉所有的html标记
                          item.childCatalogList.push(
                            {catalogName: list.resourceTitle,
                              resourceId: list.resourceId,
                              createTime:list.createTime,
                              srtUrl: list.srtUrl,
                              resourceType:list.resourceType})
                        })
                  }
              })
              return data
          }
          let curData = getFilter(data)
          return curData
      },
      goUp () {
        document.getElementById('inputs').click()
      },
      //资源上传
      upInput(event){
        console.log(event.target.files)
      }
  },
};
</script>

<style scoped lang="stylus" type="text/stylus">
  #inputs
    display none
  .active
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  .str-tag
    display inline-block
    padding 0 5px
    margin 0 5px
    color #218001
    border 1px solid #218001
  .hide-button
    opacity  0
    &:hover
      opacity  1
  .resource
    padding: 0 5% 20px 50px
    .title
      border-bottom 2px solid gray
      padding-bottom 20px
    .radio-group
      display flex
      padding 20px 0
      .search-btn
        border-left 0
        background-color #f4f4f4
        border-radius 4px
    .resource-warp
      .img-span
        display inline-block
        .img-icon
          width 48px
          height 48px
          margin 0 10px
      .resource-title
        display flex
        height 50px
        align-items center
        background-color #f4f4f4
        & div:first-child
          flex 1
          padding-left 25px
        & div:last-child
          padding-right 40px
      .resource-list
        padding-left: 32px
        display flex
        align-items center
        .padding-box
          width 50px
          height 45px
          & div
            height 50%
            width 100%
            border-left 1px solid #ccc
            border-bottom 1px solid #ccc
        .resource-info-box
          display flex
          & div
            margin 0 10px
    .test-warp
      .tree-title
        max-width: 500px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 8px;
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
