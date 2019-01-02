<template>
  <div class="resource">
    <div class="title">
      <div>资源管理</div>
    </div>
    <div class="radio-group">
      <div style="flex:1">
        <el-radio v-model="radio" label="全部文件">全部文件</el-radio>
        <el-radio v-model="radio" label="图片">图片</el-radio>
        <el-radio v-model="radio" label="视频">视频</el-radio>
        <el-radio v-model="radio" label="文档">文档</el-radio>
        <el-radio v-model="radio" label="音频">音频</el-radio>
      </div>
      <div style="display: flex">
        <el-input
          placeholder="输入课程名称查询资源"
          v-model="input">
        </el-input>
        <div>
          <el-button icon="el-icon-search" class="search-btn"></el-button>
        </div>
      </div>
    </div>
<!--    <div class="resource-warp">
      <div class="resource-title">
        &lt;!&ndash;全选&ndash;&gt;
        <div>
          <el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>
        </div>
        <div>
          <el-button type="primary" size="small">创建目录</el-button>
          <el-button type="primary" size="small">移动到</el-button>
          <el-button type="primary" size="small">删除</el-button>
        </div>
      </div>
      <div>
        <el-collapse accordion>
          <el-collapse-item v-for="(course,courseIndex) in resourceData" :key="course.id">
            <template slot="title">
              <div style="display: flex;align-items: center">
                <div>
                  <el-checkbox
                    :indeterminate="course.indeterminate"
                    v-model="course.selected"
                    style="padding-left: 25px"
                    @change="checkCourseAll(courseIndex, $event)"></el-checkbox>
                </div>
                <div>
                  <img :src="imgSrc.folder" style="width: 20px;margin: -3px 10px;"/>
                  {{course.courseName}}
                </div>
                <div style="flex: 1">
                  <el-button type="primary" icon="el-icon-upload2" size="small" @click.stop="fileUpload" style="float: right">上传</el-button>
                </div>
              </div>
            </template>
            <div>
              <el-collapse-item v-for="(course,courseIndex) in resourceData" :key="course.id">
                <template slot="title">
                  <div style="display: flex;align-items: center">
                    <div>
                      <el-checkbox
                        :indeterminate="course.indeterminate"
                        v-model="course.selected"
                        style="padding-left: 25px"
                        @change="checkCourseAll(courseIndex, $event)"></el-checkbox>
                    </div>
                    <div>
                      <img :src="imgSrc.folder" style="width: 20px;margin: -3px 10px;"/>
                      {{course.courseName}}
                    </div>
                    <div style="flex: 1">
                      <el-button type="primary" icon="el-icon-upload2" size="small" @click.stop="fileUpload" style="float: right">上传</el-button>
                    </div>
                  </div>
                </template>
                <div>
                  <div class="resource-list" v-for="resource in course.resources" :key="resource.id">
                    <div class="padding-box">
                      <div></div>  &lt;!&ndash;边框填充盒子(有用)&ndash;&gt;
                    </div>
                    <div>
                      &lt;!&ndash;三级单个资源选择&ndash;&gt;
                      <el-checkbox v-model="resource.selected" @change="checkResource(courseIndex)"></el-checkbox>
                    </div>
                    <div>
                  <span class="img-span">
                    <img :src="getImgSrc(resource.contentType)" class="img-icon">
                  </span>
                    </div>
                    <div>
                      <span style="display: inline-block">{{resource.resourceTitle}}</span>
                    </div>
                    <div style="flex: 1">
                      <el-tag type="danger" size="mini" style="margin: 0 5px">
                        <i class="el-icon-loading"></i>转码中
                      </el-tag>
                      <el-tag type="success" size="mini" style="margin: 0 5px">字幕</el-tag>
                    </div>
                    <div style="min-width: 200px" class="resource-info-box">
                      <div>时长01:00:05</div>
                      <div>{{resource.resourceSize}}MB</div>
                      <div>2018-06-13 14:02</div>
                    </div>
                    <div>
                      <el-button type="text">
                        <a :href="resource.coverUrl">预览</a>
                      </el-button>&nbsp;| &nbsp;
                      <el-button
                        type="text"
                        style="margin-left: -10px"
                        @click="fileDownload(resource.resourceUrl)"
                      >下载</el-button>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
              &lt;!&ndash;<div class="resource-list" v-for="resource in course.resources" :key="resource.id">&ndash;&gt;
                &lt;!&ndash;<div class="padding-box">&ndash;&gt;
                  &lt;!&ndash;<div></div>  &lt;!&ndash;边框填充盒子(有用)&ndash;&gt;&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
                &lt;!&ndash;<div>&ndash;&gt;
                  &lt;!&ndash;&lt;!&ndash;三级单个资源选择&ndash;&gt;&ndash;&gt;
                  &lt;!&ndash;<el-checkbox v-model="resource.selected" @change="checkResource(courseIndex)"></el-checkbox>&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
                &lt;!&ndash;<div>&ndash;&gt;
                  &lt;!&ndash;<span class="img-span">&ndash;&gt;
                    &lt;!&ndash;<img :src="getImgSrc(resource.contentType)" class="img-icon">&ndash;&gt;
                  &lt;!&ndash;</span>&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
                &lt;!&ndash;<div>&ndash;&gt;
                  &lt;!&ndash;<span style="display: inline-block">{{resource.resourceTitle}}</span>&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
                &lt;!&ndash;<div style="flex: 1">&ndash;&gt;
                  &lt;!&ndash;<el-tag type="danger" size="mini" style="margin: 0 5px">&ndash;&gt;
                    &lt;!&ndash;<i class="el-icon-loading"></i>转码中&ndash;&gt;
                  &lt;!&ndash;</el-tag>&ndash;&gt;
                  &lt;!&ndash;<el-tag type="success" size="mini" style="margin: 0 5px">字幕</el-tag>&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
                &lt;!&ndash;<div style="min-width: 200px" class="resource-info-box">&ndash;&gt;
                  &lt;!&ndash;<div>时长01:00:05</div>&ndash;&gt;
                  &lt;!&ndash;<div>{{resource.resourceSize}}MB</div>&ndash;&gt;
                  &lt;!&ndash;<div>2018-06-13 14:02</div>&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
                &lt;!&ndash;<div>&ndash;&gt;
                  &lt;!&ndash;<el-button type="text">&ndash;&gt;
                    &lt;!&ndash;<a :href="resource.coverUrl">预览</a>&ndash;&gt;
                  &lt;!&ndash;</el-button>&nbsp;| &nbsp;&ndash;&gt;
                  &lt;!&ndash;<el-button&ndash;&gt;
                    &lt;!&ndash;type="text"&ndash;&gt;
                    &lt;!&ndash;style="margin-left: -10px"&ndash;&gt;
                    &lt;!&ndash;@click="fileDownload(resource.resourceUrl)"&ndash;&gt;
                  &lt;!&ndash;&gt;下载</el-button>&ndash;&gt;
                &lt;!&ndash;</div>&ndash;&gt;
              &lt;!&ndash;</div>&ndash;&gt;
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>-->
    <div class="test-warp">
      <div class="test-title">
        <div style="flex: 1"></div>
        <div>
          <!--全选-->
          <!--<el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>-->
          <el-button type="primary" size="small" @click="goCreateCatalog('',0)">创建目录</el-button>
          <el-button type="primary" size="small">移动到</el-button>
          <el-button type="info" size="small" @click="deleteCatalog">删除</el-button>
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
                <img :src="imgSrc.txt" alt="" class="folder-img" v-else-if="data.resourceType == 40">
                <span class="tree-title">{{ node.label }}</span>
                <span class="str-tag" v-if="data.srtUrl != undefined">字幕</span>
              </span>
              <span>
                <span v-if="data.catalogLevel" class="hide-button">
                  <el-button size="mini" type="primary" v-show="data.catalogLevel<3" @click.stop="goCreateCatalog(data,data.catalogId)"> 创建子目录 </el-button>
                  <el-button size="mini" type="primary" v-show="data.catalogLevel" @click.stop="()=>{}"><label for="inputs">上传</label></el-button>
                  <input style="display: none" type="file" id="inputs" @change="upInput"/>
                  <el-button size="mini" style="margin-left: 5px" type="primary" @click.stop="goRenameCatalog(data,data.catalogId)"> 重命名 </el-button>
                  <el-button size="mini" type="primary" @click.stop="goAddTest(data.catalogId)"> 添加试题 </el-button>
                  <!--<el-button size="mini" type="primary" @click="() => remove(node, data)">删除</el-button>-->
                </span>
                <span v-else class="hide-button">
                  <el-button size="mini" type="primary" @click.stop="goEditTest(data.quizId)" v-if="data.resourceType.type ==10 && !data.srtUrl"> 添加字幕 </el-button>
                  <el-button size="mini" type="primary" @click.stop="goEditTest(data.quizId)"> 编辑 </el-button>
                  <el-button size="mini" type="primary" @click.stop="delQuiz()">删除</el-button>
                </span>
              </span>

              <span style="margin-right: 10px" v-show="data.updateTime">{{data.updateTime}}</span>
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
  import {getResList, newResFileFold, reResFileFold, delResFileFold, deleteRes} from "@/api/library";
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
          txt: require("../../../../assets/images/txt.png")
        },
        radio: '全部文件',
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
        interactionIdArr:[],
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
        getResList(data).then(res => {
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
      getTestList(id){
          let data = {quizType: id}
          getTestFileFold(data).then(res => {
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
                  this.catalogData = this.filterData(data)
                  console.log(this.catalogData)
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
                  this.getTestList(0)
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
      // 删除试题
      delQuiz() {
          deleteQuiz(this.quizArr).then(res => {
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
          let catalogIds = [...this.deleteArr]
          console.log(catalogIds)
          deleteTestFileFold(this.deleteArr).then(res => {
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
  },
};
</script>

<style scoped lang="stylus" type="text/stylus">
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
