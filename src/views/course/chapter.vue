<template>
  <div class="course-tab-container">
    <el-button style="margin-bottom: 20px;margin-left: 94%" @click="coursePublish" type="primary">发布课程</el-button>
    <div>
      <span class="shuxian">|</span>
      <span style="font-size:20px;font-weight: bold;margin-left: 10px">教学模式</span>
      <div class="radio">
        <el-radio
          @change="changeTModel"
          v-model="patternId"
          v-for="(option, index) in pattern"
          :key="index"
          :label="option.label"
        >{{option.modelName}}</el-radio>
      </div>
    </div>
    <div class="main-container">
      <el-collapse>
        <el-collapse-item v-for="(chapter, chapterIndex) in sourceData" :key="chapterIndex">
          <template slot="title">
            <div class="chapter-index">
              <div class="chapter-index chapter-inner">{{chapterIndex+1}}</div>
            </div>
            <div class="title-container">
              <span>{{chapter.chapterName}}</span>
              <div slot="right-side" class="operate">
                <span @click.stop="addJieBtn(chapter)">+添加节</span>
                <span @click.stop="delChapter(chapter)">删除</span>
                <!-- <span class="spread" @click="spread(chapter)">{{fold}}</span> -->
              </div>
            </div>
          </template>
          <el-collapse-item
            style="margin-left: 30px"
            v-for="(jie, jieIndex) in chapter.catalogSection"
            :key="jieIndex"
          >
            <template slot="title">
              <div
                class="title-container"
                style="margin-left: 40px;"
              >
                <span>{{jie.sectionName}}</span>
                <div class="operate">
                  <span @click.stop="addContentBtn(jie)">+添加内容</span>
                  <span @click.stop="delSection(jie)">删除</span>
                  <!-- <span  class="spread" @click="spread(chapter)">展开</span> -->
                </div>
              </div>
            </template>
            <div
              style="margin: 0 auto; width:90%;"
              v-for="(content, contentIndex) in jie.catalogItem"
              :key="contentIndex"
            >
              <div style="padding: 5px 10px;">
                <div class="itemTitleContainer">
                  <div style="display: flex;align-items: center;margin-right: 10px">
                    <img :src="typeIcon(content)" width="40" alt style="margin-right: 10px">
                    <span>{{content.itemName}}</span>
                    <div
                      class="video-info"
                      v-if="content.contentType === 10"
                    >
                      <span style="margin-left: 15px">时长：{{content.resourceLength | timeTransfer}}</span>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="strUrl(content)"
                        placement="top-start"
                      >
                        <img
                          :src="require('../../assets/images/cc.png')"
                          style="margin-left: 5px"
                          height="18px"
                        >
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="transProgress(content)"
                        placement="top-start"
                      >
                        <img
                          :src="require('../../assets/images/tcode.png')"
                          style="margin-left: 5px"
                          height="18px"
                        >
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="operate">
                    <span v-if="content.contentType===10" @click="addSubjectBtn(content)">+内嵌题</span>
                    <span @click="delItem(content, jie.catalogItem, contentIndex)">删除</span>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse-item>
      </el-collapse>
      <div class="addChapter" @click="addChapterBtn">添加章</div>
      <adialog
        :dialogConfig="dialogConfig"
        :dataObj="dataObj"
        :formData="formData"
        @showComponentInfo="showComponentInfo"
        :show.sync="show"
      ></adialog>
    </div>

    <!-- 添加内容对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-tabs v-model="activeName2" :stretch="true" type="card" @tab-click="handleClick">
        <el-tab-pane label="视频" name="first">
          <!-- <div class="searchContainer">
            <span>从资源库导入</span>
            <el-input
              style="width: 300px"
              type="text"
              placeholder="输入视频名称查找"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <div class="courseSelect">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div> -->
          <el-tree :data="fileList" ref="tree" show-checkbox node-key="id" :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <img
                :width="15"
                v-if="data.catalogId"
                style="margin-right: 3px"
                :src="require('@/assets/images/folder.png')"
                alt
              >
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="文档" name="second">
          <el-tree :data="docList" ref="tree1" show-checkbox node-key="id" :props="defaultDocProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <img
                :width="15"
                v-if="data.catalogId"
                style="margin-right: 3px"
                :src="require('@/assets/images/folder.png')"
                alt
              >
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="contentType === '视频'" type="primary" @click="localVideoDialog = true">本地上传视频</el-button>
        <upOss v-else style="margin: 0px 10px 10px 0px" :btnText="'本地上传文档'" @ossUp="getDocUrl">
        </upOss>
        <el-button type="primary" @click="addItem">确 认</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加题目对话框 -->
    <el-dialog title="添加题目" top="30vh" :visible.sync="subjectVisible" width="65%">
      <div class="subject-container">
        <div class="subject-left">
          <!-- <video :src="videoUrl"></video> -->
          <videoPlayer :isMp4="videoUrl" :poster="coverUrl"></videoPlayer>
        </div>
        <div class="subject-right">
          <div class="row-container">
            <span>视频内测验时间点（共{{subjectList.length}}处）</span>
            <span class="test-btn" @click="addTime">+ 新增时间点</span>
          </div>
          <div class="row-container margin" v-for="(subject, index) in subjectList" :key="index">
            <div>
              <span>第{{index + 1}}处:</span>
              <input
                v-model="subject.time"
                type="text"
                style="border: 1px solid black; width: 120px; margin-left:5px"
                placeholder="输入00:00:00格式"
                @blur="saveAddTime(index)"
              >
            </div>
            <div class="subject-operate">
              <span>预览</span>
              <span @click="editSubject(index)">编辑</span>
              <span @click="delSubject(index)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAllSubj">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑题目对话框 -->
    <el-dialog title="编辑题目" top="40vh" :visible.sync="editSubjectVisible" width="55%">
      <div>
        <div>
          <span style="color:rgb(85, 200, 255)">资源库导入</span>
        </div>
        <div style="float: right">
          <el-input
            type="text"
            placeholder="请输入测试题名称"
            suffix-icon="el-icon-search"
            style="width: 300px"
          ></el-input>
          <el-button>查询</el-button>
        </div>
        <div class="subjRadio">
          <Tree :sourceData="fileList" @checkedList="checkedFiles" :props="defaultProps">

          </Tree>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSubjectVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnsure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除确认弹窗 -->
    <el-dialog title="删除" :visible.sync="delDialog" top="30vh" :modal="false">
      <span>{{delDialogParm.info}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="delEvent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 本地上传视频弹窗 -->
    <el-dialog title="添加视频" :visible.sync="localVideoDialog" top="30vh" :modal="false">
      <div style="display: flex;width: 100%">
        <div style="display: flex;flex-direction: column;justify-content: space-around;height: 300px">
          <div style="display: flex;flex-direction: column;">
            <upOss style="margin: 0px 10px 10px 0px" :btnText="'上传视频'" @ossUp="getVideoUrl">
            </upOss>
            <span>请上传格式为mp4或flv格式，且小于2GB的视频</span>
          </div>
            <div style="display: flex;flex-direction: column;">
              <upOss style="margin: 0px 10px 10px 0px" :btnText="'上传视频字幕'">
              </upOss>
              <span>请上传srt格式的字幕</span>
            </div>
            
        </div>
        <videoPlayer style="width:500px; margin-left:50px" v-if="videoUrl !== ''" :isMp4.sync="videoUrl" :poster="coverUrl"></videoPlayer>
        <div v-else style="width: 500px;background: rgb(192,199,204);text-align:center">
          <span style="display:inline-block; margin-top:140px;">请先上传视频</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="localVideoDialog = false">取 消</el-button>
        <el-button type="primary" @click="localVideoUpload">确 定</el-button>
      </span>
      
      
    </el-dialog>
  </div>
</template>

<script>
import adialog from "@/components/dialog";
import videoPlayer from "@/components/video-pay";
import Tree from "@/components/fileTree"
import upOss from "@/components/up-oss"
import {
  chaptersList,
  chaptersAdd,
  chaptersDelete,
  sectionAdd,
  sectionDelete,
  itemAdd,
  studyModeModify,
  courseBaseInfo,
  itemDelete,
  publish
} from "@/api/course";
import { getResList, localUpload } from "@/api/library";

export default {
  data() {
    return {
      // courseId: '0608367675f54267aa6960fd0557cc1b',
      // 删除确认弹窗
      delDialog: false,
      // 删除参数
      delDialogParm: {},
      courseId: this.$route.query.id,
      studyMode: {
        courseId: this.$route.query.id,
        studyMode: ""
      },
      chapterFold: false,
      jieFold: false,
      pattern: [
        { label: "10", modelName: "开放学习" },
        { label: "20", modelName: "顺序学习" }
      ],
      patternId: "10",
      // 对话框
      show: false,
      dialogConfig: {
        btnShow: true,
        title: "",
        width: "40",
        labelWidth: "120",
        top: "40",
        inputWidth: "70",
        eventType: ""
      },
      dataObj: {},
      dialogVisible: false,
      activeName2: "first",
      // 课程选择
      value: "",
      options: [],
      checkedList: [],
      checkAll: false,
      formData: [],
      tempChapter: "",
      sourceData: [
        
      ],

      addTitle: "",
      // 添加视频
      videoForm: {
        itemName: "",
        contentId: "",
        contentType: 10,
        courseId: this.$route.query.id,
        itemResource: {

        }
      },
      radio: "1.2",
      // 添加内容类型tab
      contentType: "视频",
      // 添加文档
      docForm: {
        itemName: "",
        contentType: 20,
        courseId: this.$route.query.id,
        itemResource: {

        }
      },
      // 添加本地视频弹窗
      localVideoDialog: false,
      // 添加题目对话框
      subjectVisible: false,
      subjectList: [
        {
          time: "",
          title: "",
          ids: []
        }
      ],
      // 题目弹窗的视频地址
      videoUrl: "",
      // 课程资源
      resource: {
        courseId: this.$route.query.id,
      },
      temCheckedList: [],
      // 题目弹窗的视频封面
      coverUrl: "",
      // 添加题目的时间
      addTimeInput: "",
      editSubjectVisible: false,
      // 资源库导入题目
      sourceSubList: [
        { title: "静态题1", id: "subj1" },
        { title: "静态题2", id: "subj2" }
      ],
      // 添加题目缓存的下标
      sourceSubListIndex: "",
      // 选项model
      subjPick: "",
      // =====资源=====
      defaultProps: {
        children: "childCatalogList",
        label: "catalogName"
      },
      defaultDocProps: {
        children: "childCatalogList",
        label: "catalogName"
      },
      videoCheckedList: [],
      fileList: [],
      docList: [],
      tempSection: [],
      // 删除小项
      tempItems: [],
      tempItemIndex: ''
    };
  },
  created() {
    chaptersList(this.courseId).then(response => {
      this.sourceData = response.data;
    });
    courseBaseInfo(this.courseId).then(response => {
      this.patternId = String(response.data.studyMode);
    });
    getResList({ resourceType: 10 }).then(response => {
        this.fileList = this.filterData(response.data);
    });
    getResList({ resourceType: 20 }).then(response => {
      this.docList = this.filterData(response.data);
    });
  },
  methods: {
    // 发布课程
    coursePublish() {
      publish(this.$route.query.id)
      .then(response=> {
        if(response.code === 200) {
          this.$message({
            message: '发布成功',
            type: 'success'
          })
        }
      })
    },
    // 修改教学模式
    changeTModel(value) {
      this.studyMode.studyMode = value;
      // console.log(this.studyMode)
      studyModeModify(this.studyMode).then(response => {
        console.log(response.data);
      });
    },
    chapterClick(value) {
      // console.log(value)
      //   this.chapterFold =
    },
    addChapterBtn() {
      this.dialogConfig.eventType = "addChapter";
      this.dialogConfig.title = "添加章";
      this.formData = [];
      this.formData.push({
        key: "章名称：",
        inputType: "string",
        value: "chapterName"
      });
      this.show = true;
    },
    spread(item) {
      console.log("spread", item);
    },
    showComponentInfo(type, data) {
      console.log("事件:", type, "表单数据:", data);
      switch (type) {
        case "addChapter":
          console.log(data.chapterName);
          this.addChapter(data.chapterName);
          break;

        case "addJie":
          this.addJie(data.jieName);
          break;
      }
    },
    addChapter(chapterName) {
      chaptersAdd({
        chapterStatus: 2,
        courseId: this.courseId,
        chapterName: chapterName
      }).then(response => {
        this.$message({
          message: "添加章成功",
          type: "success"
        });
        this.sourceData.push(response.data);
      });
    },
    // 删除章
    delChapter(chapter) {
      let delArr = [];
      delArr.push(chapter.chapterId);
      this.delDialogParm = {};
      this.delDialogParm.info = "确认删除章？";
      this.delDialogParm.type = "delChapter";
      this.delDialogParm.chapterIds = delArr;
      this.delDialog = true;
    },
    delChapterEnsure() {
      chaptersDelete(this.delDialogParm.chapterIds).then(response => {
        if (response.code === 200) {
          this.sourceData.forEach((element, i) => {
            if (element.chapterId === this.delDialogParm.chapterIds[0]) {
              this.sourceData.splice(i, 1);
            }
          });
          this.$message({
            message: "删除章成功",
            type: "success"
          });
          this.delDialog = false;
        }
      });
    },
    // 删除节
    delSection(section) {
      let delArr = [];
      delArr.push(section.sectionId);
      this.tempChapter = section.chapterId;
      this.delDialogParm = {};
      this.delDialogParm.info = "确认删除节？";
      this.delDialogParm.type = "delSection";
      this.delDialogParm.sectionIds = delArr;
      this.delDialog = true;
    },
    sectionDeleteEnsure() {
      sectionDelete(this.delDialogParm.sectionIds).then(response => {
        this.sourceData.forEach(element => {
          if (element.chapterId === this.tempChapter) {
            console.log(element.catalogSection);
            element.catalogSection.forEach((item, i) => {
              if (item.sectionId === this.delDialogParm.sectionIds[0]) {
                element.catalogSection.splice(i, 1);
              }
            });
          }
        });
        this.$message({
          message: "删除节成功",
          type: "success"
        });
        this.delDialog = false;
      });
    },
    // 删除小项
    delItem(content, item, contentIndex) {
      this.tempItems = item
      this.tempItemIndex = contentIndex
      let delArr = [];
      delArr.push(content.itemId);
      this.delDialogParm = {};
      this.delDialogParm.info = "确认删除小项？";
      this.delDialogParm.type = "delItem";
      this.delDialogParm.itemIds = delArr;
      this.delDialog = true;
    },
    delItemEnsure() {
      console.log(this.delDialogParm)
      itemDelete(this.delDialogParm.itemIds).then(response => {
        if (response.code === 200) {
          this.tempItems.splice(this.tempItemIndex, 1)
          this.$message({
            message: "删除内容成功",
            type: "success"
          });
          this.delDialog = false;
        }
      });
    },
    // 删除事件
    delEvent() {
      console.log("删除对象的参数", this.delDialogParm);
      switch (this.delDialogParm.type) {
        case "delSection":
          this.sectionDeleteEnsure();
          break;
        case "delChapter":
          this.delChapterEnsure();
        case "delItem":
          this.delItemEnsure();
        default:
          break;
      }
    },
    addJieBtn(info) {
      console.log("jie", info);
      this.tempChapter = info.chapterId;
      this.formData = [];
      this.formData.push({
        key: "节名称：",
        inputType: "string",
        value: "jieName"
      });
      this.dialogConfig.eventType = "addJie";
      this.dialogConfig.title = "添加节";
      this.show = true;
    },
    // 添加内容弹窗
    addContentBtn(data) {
      this.tempSection = data
      console.log(data);
      this.videoForm.chapterId = data.chapterId;
      this.videoForm.sectionId = data.sectionId;
      this.docForm.chapterId = data.chapterId;
      this.docForm.sectionId = data.sectionId;
      this.dialogVisible = true;
    },
    // 添加内容对话框确认按钮
    addItem() {
      console.log(this.contentType);
      console.log('缓存节', this.tempSection.catalogItem);
      let formType = {};
      let resource;
      if (this.contentType === "视频") {
        formType = this.videoForm;
        resource = this.fileNumberCheck(this.$refs.tree)
      } else {
        formType = this.docForm;
        resource = this.fileNumberCheck(this.$refs.tree1)
      }
      if(!resource) return
      formType.itemName = resource[0].catalogName
      formType.contentId = resource[0].resourceId
      this.dialogVisible = false
      console.log("ft", formType);
      itemAdd(formType).then(response => {
        console.log(response.data);
        if(response.code === 200) {
          this.tempSection.catalogItem.push(formType)
          this.$message({
            message: "添加内容成功",
            type: "success"
          })
        }
      });
    },
    fileNumberCheck(treeName) {
      let checkedList =treeName.getCheckedNodes().filter(element => {
        return element.catalogId === undefined;
      });
      if (checkedList.length > 1) {
        this.$message({
          message: "请选择单个文件",
          type: "warning"
        });
        return false;
      }else if(checkedList.length < 1) {
        this.$message({
          message: "尚未选择文件",
          type: "warning"
        });
        return false;
      }
      return checkedList
    },
    addJie(jieName) {
      console.log("jiename", jieName);
      console.log("zhangID", this.tempChapter);
      sectionAdd({
        chapterId: this.tempChapter,
        courseId: this.courseId,
        sectionName: jieName
      }).then(response => {
        this.sourceData.forEach((element, i) => {
          if (element.chapterId === this.tempChapter) {
            element.catalogSection.push(response.data);
          }
        });
        this.$message({
          message: "添加节成功",
          type: "success"
        });
      });
      // this.sourceData.push({chapter: chapterName})
    },
    handleClick(tab, event) {
      console.log(tab.label);
      this.contentType = tab.label;
    },
    // 资源类型图标
    typeIcon(info) {
      if (info.contentType === 10) {
        return require("../../assets/images/vedio.png");
      } else {
        return require("../../assets/images/word.png");
      }
    },
    // 字幕信息
    strUrl(info) {
      if (info.strUrl) {
        return "有字幕";
      } else {
        return "无字幕";
      }
    },
    // 转码信息过滤
    transProgress(info) {
      switch (info) {
        case 10:
          return "正在转码";
          break;
        case 20:
          return "已转码";
          break;
        case 30:
          return "转码失败";
          break;
        default:
          return "暂无信息";
          break;
      }
    },
    addSubjectBtn(subject) {
      console.log("题目所在的内容", subject);
      this.videoUrl = subject.resourceUrl;
      this.coverUrl = subject.coverUrl;
      this.subjectList = [];
      this.subjectVisible = true;
    },
    filterData(data) {
      let getFilter = data => {
        data.forEach(item => {
          // 文件夹处理
          if (!item.childCatalogList.length !== 0) {
            getFilter(item.childCatalogList);
          }
          // 文件处理
          if (item.resourceList.length !== 0) {
            item.resourceList.forEach(list => {
              item.childCatalogList.push({
                catalogName: list.resourceTitle,
                resourceId: list.resourceId
              });
            });
          }
        });
        return data;
      };
      let curData = getFilter(data);
      return curData;
    },
    // 添加时间点
    addTime() {
      if (this.subjectList.length >= 3) {
        alert("亲，3题差不多了哦");
        return;
      } else {
        this.subjectList.push({ time: "" });
      }
    },
    // 保存时间点
    saveAddTime(index) {
      // this.subjectList[index].time = this.addTimeInput
    },
    // 删除时间点
    delSubject(index) {
      this.subjectList.splice(index, 1);
      console.log(this.subjectList);
    },
    // 编辑题目弹窗
    editSubject(index) {
      console.log("当前点击的添加时间点", index);
      this.sourceSubListIndex = index;
      this.checkedFiles(this.temCheckedList)
      this.editSubjectVisible = true;
    },
    // 选完题确认按钮
    editEnsure() {
      console.log(this.sourceSubListIndex);
      this.subjectList[this.sourceSubListIndex].title = this.subjPick;
      console.log("题目列表对象", this.subjectList);
    },
    // 保存所有的题目信息
    saveAllSubj() {
      console.log(this.subjectList);
      this.subjectVisible = false;
    },
    // 选中的文件
    checkedFiles(checkedList) {
      this.temCheckedList = checkedList
      if (checkedList.length > 1) {
        this.$message({
          message: "请选择单个文件",
          type: "warning"
        });
        return false;
      }else if(checkedList.length < 1) {
        this.$message({
          message: "尚未选择文件",
          type: "warning"
        });
        return false;
      }
      let ids = this.subjectList[this.sourceSubListIndex].ids = []
      ids.push(checkedList[0])
    },
    // 本地上传视频
    getVideoUrl(...params) {
       
      this.videoForm.itemResource.resourceTitle = params[1].substring(13);// 名称
      this.videoForm.itemResource.resourceUrl = params[0]; // 路径
      this.videoForm.itemResource.resourceType = 10; // 资源类型
      let start = params[0].lastIndexOf(".");
      let end = params[0].length
      this.videoForm.contentType = 10
      this.videoForm.chapterId = this.tempSection.chapterId
      this.videoForm.sectionId = this.tempSection.sectionId
      this.videoForm.catalogId = null
      this.videoForm.itemName = params[1].substring(13);
      this.videoUrl = params[0]
    },
    getDocUrl(...params) {
      this.docForm.itemResource.resourceTitle = params[1].substring(13);// 名称
      this.docForm.itemResource.resourceUrl = params[0]; // 路径
      this.docForm.itemResource.resourceType = 20; // 资源类型
      let start = params[0].lastIndexOf(".");
      let end = params[0].length
      this.docForm.contentType = 20
      this.docForm.catalogId = null
      this.docForm.itemName = params[1].substring(13);
      this.contentAdd(this.docForm)
    },
    localVideoUpload() {
      console.log(this.videoForm)
      this.contentAdd(this.videoForm)
      this.localVideoDialog = false
    },
    contentAdd(formName) {
      itemAdd(formName).then(response => {
        console.log(response.data);
        if(response.code === 200) {
          this.$message({
            message: "添加内容成功",
            type: "success"
          })
        }
      });
    }
  },
  filters: {
    timeTransfer(s) {
      var t;
      if (s > -1) {
        var hour = Math.floor(s / 3600);
        var min = Math.floor(s / 60) % 60;
        var sec = s % 60;
        if (hour < 10) {
          t = "0" + hour + ":";
        } else {
          t = hour + ":";
        }

        if (min < 10) {
          t += "0";
        }
        t += min + ":";
        if (sec < 10) {
          t += "0";
        }
        t += sec;
      }
      return t;
    }
  },
  components: {
    adialog,
    videoPlayer,
    Tree,
    upOss
  }
};
</script>

<style lang="stylus" type="text/stylus" scoped>
.course-tab-container {
  div {
    .shuxian {
      color: rgb(235,176,78);
      font-weight: bold;
      font-size: 20px;
    }

    .radio {
      display: inline;
      margin-left: 50px;
    }
  }

  .main-container {
    margin-top: 20px;
  }

  .chapter-index {
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: white;
    background-color: rgb(113, 183, 249);
    border: 1px solod white;
    border-radius: 50%;
    margin-right: 20px;

    .chapter-inner {
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-left: 3px;
      background-color: rgb(58, 148, 239);
    }
  }

  .title-container {
    display: inline-block;
    width: 90%;
    heitght: 40px;
    line-height: 40px;
    border: 1px solid rgb(230, 230, 230);
    padding: 0 10px;
    border-radius: 5px;
  }
  .title-container:hover {
    background-color: rgb(243,247,255)
  }
  .itemTitleContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 20px;

    .video-info {
      display: flex;
      align-item: center;

      img {
        cursor: pointer;
      }
    }
  }
  .itemTitleContainer:hover {
    background-color: rgb(243,247,255)
  }

  .chapter-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;
  }

  .operate {
    display: inline-block;
    float: right;
    cursor: pointer;

    .spread {
      z-index: 10;
      position: relative;
      padding-right: 8px;
    }

    span {
      margin-left: 20px;
    }
  }

  .addChapter {
    height: 50px;
    line-height: 50px;
    border: 2px dashed rgb(148, 171, 190);
    border-radius: 15px;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
  }
}

.searchContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  padding-top: 0;
  border-bottom: 1px solid #e4e7ed;
}

.courseSelect {
  padding: 10px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.radioContainer {
  display: flex;
  justify-content: space-between;
  width: 400px;
  margin: 0 auto;

  .el-radio+.el-radio {
    margin-left: 0px;
  }
}

.subject-container {
  height: 400px;
  display: flex;
  justify-content: space-between;

  .subject-left {
    background: pink;
    width: 720px;
  }

  .subject-right {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 420px;

    .row-container {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      width: 94%;

      .test-btn {
        background-color: rgb(82, 204, 102);
        padding: 5px 10px;
        color: #fff;
        cursor: pointer;
      }
    }

    .margin {
      padding-top: 20px;

      .subject-operate {
        span {
          margin-left: 10px;
          color: rgb(76, 197, 255);
          cursor: pointer;
        }
      }
    }
  }
}

.subjRadio {
  clear: both;
  display: flex;
  flex-direction: column;

  .el-radio+.el-radio {
    margin: 10px 0;
  }
}
</style>

