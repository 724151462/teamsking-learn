<template>
  <div class="resource">
    <tip title="资源管理"></tip>
    <div class="radio-group" style="overflow: hidden">
      <div style="flex:1">
        <el-radio v-model="radio" :label="0" @change="radioChange(radio)">全部文件</el-radio>
        <el-radio v-model="radio" :label="40" @change="radioChange(radio)">图片</el-radio>
        <el-radio v-model="radio" :label="10" @change="radioChange(radio)">视频</el-radio>
        <el-radio v-model="radio" :label="20" @change="radioChange(radio)">文档</el-radio>
        <el-radio v-model="radio" :label="30" @change="radioChange(radio)">音频</el-radio>
      </div>
    </div>
    <div class="test-warp">
      <div class="test-title">
        <div style="flex: 1">
          <el-button type="primary" size="mini" @click="goCreateCatalog('',0)">创建目录</el-button>
          <el-button
            type="info"
            size="mini"
            v-bind:class="{ active: deleteArr.length>0}"
            @click="deleteCatalog"
          >删除</el-button>
          <!-- <el-button type="danger" size="small" @click="checkAll(true)">清空库</el-button> -->
        </div>
        <div>
          <div style="display: flex">
            <el-input placeholder="搜索资源" v-model="input"></el-input>
            <div>
              <el-button icon="el-icon-search" class="search-btn" @click="searchResource(input)"></el-button>
            </div>
          </div>
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
          @check-change="nodeCheck"
          accordion
          draggable
          :default-expanded-keys="expan"
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
          node-key="catalogId"
          ref="tree"
        >
          <span class="test-tree-node" slot-scope="{ node, data }">
            <div class="test-info" v-if="!data.resourceId">
              <img
                :width="20"
                v-if="!data.resourceId"
                style="margin-right: 3px"
                :src="require('@/assets/images/folder.png')"
                alt
              >
              <img
                :src="imgSrc.mp4"
                alt
                :width="25"
                :height="25"
                v-else-if="data.resourceType == 10"
              >
              <img
                :src="getIcon(data.catalogName)"
                alt
                :width="25"
                :height="25"
                v-else-if="data.resourceType == 20"
              >
              <img
                :src="imgSrc.img"
                alt
                :width="25"
                :height="25"
                v-else-if="data.resourceType == 40"
              >
              <span class="tree-title">{{ node.label }}</span>
            </div>
            <div class="test-info" v-else>
              <img :src="imgSrc.mp4" alt :width="25" :height="25" v-if="data.resourceType == 10">
              <img
                :src="getIcon(data.catalogName)"
                alt
                :width="25"
                :height="25"
                v-else-if="data.resourceType == 20"
              >
              <img
                :src="imgSrc.img"
                alt
                :width="25"
                :height="25"
                v-else-if="data.resourceType == 40"
              >
              <span class="tree-title" style="margin-bottom: 3px">{{ node.label }}</span>
            </div>
            <div>
              <span v-if="data.catalogLevel" class="hide-button">
                <el-button
                  size="mini"
                  type="primary"
                  v-show="data.catalogLevel<3"
                  @click.stop="goCreateCatalog(data,data.catalogId)"
                >创建子目录</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  v-show="data.catalogLevel"
                  @click.stop="goUp(data.catalogId)"
                >
                  <label for="male">上传</label>
                </el-button>
                <up-oss style="display: none;" upDir="resource" @ossUp="upRes"></up-oss>
                <el-button
                  size="mini"
                  style="margin-left: 5px"
                  type="primary"
                  @click.stop="goRenameCatalog(data,data.catalogId)"
                >重命名</el-button>
              </span>
              <span v-else>
                <span class="hide-button" style="margin-right: 10px">
                  <el-button size="mini" type="primary" @click.stop="preView(data)">预览</el-button>
                  <!--<el-button size="mini" type="primary" @click.stop="" v-if="!data.srtUrl && data.resourceType == 10">添加字幕 </el-button>-->
                  <el-button
                    size="mini"
                    type="primary"
                    @click.stop="delRes(data.resourceId,data.parentId)"
                  >删除</el-button>
                </span>
                <span style="margin-right: 10px;">{{data.resourceSize}}</span>
                <span>{{data.createTime}}</span>
                <!--<span>预览</span>-->
              </span>
            </div>
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
      width="40%"
    >
      <span style="font-size: 16px">此操作会清空试题库，请慎重！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkAll(false)">取 消</el-button>
        <el-button type="danger" @click="deleteCatalog">确 定</el-button>
      </span>
    </el-dialog>
    <!--创建目录弹窗-->
    <el-dialog title="创建目录" :visible.sync="createCatalog" width="40%">
      <el-input v-model="newCatalog.catalogName" placeholder="请输入文件夹的名字"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="createCatalog = false">取 消</el-button>
        <el-button type="primary" @click="newFileFold">确 定</el-button>
      </span>
    </el-dialog>
    <!--重命名弹窗-->
    <el-dialog title="重命名" :visible.sync="renameCatalog" width="40%">
      <el-input v-model="newCatalog.catalogName" placeholder="请输入文件夹的名字"></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="renameCatalog = false">取 消</el-button>
        <el-button type="primary" @click="reFileFold">确 定</el-button>
      </span>
    </el-dialog>
    <!--预览弹窗-->
    <el-dialog
      title="资源预览"
      :visible.sync="resourceViewDialog"
      width="60%"
      :before-close="handleVideoClose"
    >
      <div style="width: 100%">
        <div style="margin: 0 auto; width: 80%" v-if="resourceObj.resourceType === 40">
          <img :src="resourceObj.resourceUrl" style="height: 600px;width: 100%">
        </div>
        <div style="margin: 0 auto; width: 80%" v-else-if="resourceObj.resourceType === 20">
          <iframe :src="resourceObj.docUrl" frameborder="0" style="height: 600px;width: 100%"></iframe>
        </div>
        <div style="margin: 0 auto; width: 80%" v-else-if="resourceObj.resourceType === 10">
          <videoPlayer
            ref="video"
            :isMp4="resourceObj.resourceUrl"
            :state="videoState"
            @resetStatus="resetStatus"
          ></videoPlayer>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ossAliSts } from "@/api/oss";
import {
  getResList,
  newResFileFold,
  reResFileFold,
  delResFileFold,
  deleteRes,
  localUpload,
  moveRes,
  getFileDetail
} from "@/api/library";
import { fileKind } from "@/utils/utils";
import { getResourceViewByUrl } from "@/api/sourceView";
import videoPlayer from "@/components/video-pay";
import UpOss from "@/components/up-oss";
import Cookie from "js-cookie";
import tip from "@/components/tip";
import { setTimeout } from "timers";
export default {
  name: "resource",
  created() {
    this.getResource(0);
  },
  components: {
    UpOss,
    videoPlayer,
    tip
  },
  data() {
    return {
      resourceViewDialog: false,
      videoState: false,
      fileKind: "resource",
      imgSrc: {
        folder: require("../../../../assets/images/folder.png"),
        pdf: require("@/assets/images/resource/pdf.png"),
        ppt: require("@/assets/images/resource/ppt.png"),
        mp4: require("../../../../assets/images/mp4.png"),
        word: require("@/assets/images/resource/word.png"),
        unknow: require("@/assets/images/resource/unknow.png"),
        excel: require("@/assets/images/resource/excel.png"),
        txt: require("../../../../assets/images/txt.png"),
        img: require("../../../../assets/images/img.png")
      },
      radio: 0,
      input: "",
      //多选框验证
      isCheckAll: false, // 是否全选(一级)
      //数据
      resourceData: [
        {
          //课程资源数据列表
          courseId: "",
          courseName: "",
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
        }
      ],
      //新文件夹数据
      newCatalog: {
        catalogId: 0,
        catalogName: ""
      },
      deleteArr: [],
      resourceArr: [],
      createCatalog: false,
      renameCatalog: false,
      expan: [],
      allDelete: false,
      isError: 3,
      fileArr: [],
      uploadArr: [],
      ossData: null,
      resourceObj: {
        docUrl: ""
      }
    };
  },
  methods: {
    // 弹窗关闭时暂停video
    // videoPause() {
    //   if(this.resourceObj.resourceType === 10) {
    //     this.$refs.video.onPlayerPause()
    //   }
    // },
    // 弹窗关闭前视频停止
    handleVideoClose() {
      this.videoState = true;
      // this.videoState = false
      this.resourceViewDialog = false;
    },
    // 重置视频播放状态
    resetStatus(value) {
      this.videoState = value;
    },
    // 预览
    preView(resource) {
      console.log(resource);
      getFileDetail({ resourceId: resource.resourceId }).then(response => {
        this.resourceView(response.data);
        this.resourceViewDialog = true;
      });
    },
    resourceView(resource) {
      console.log(resource);
      if (resource.resourceType === 20) {
        getResourceViewByUrl({ url: resource.resourceUrl }).then(response => {
          this.resourceObj = resource;
          this.resourceObj.docUrl = response.data;
          console.log(response.data);
        });
      } else if (resource.resourceType === 10) {
        this.resourceObj = resource;
        // this.$refs.video.getParentUrl(resource.resourceUrl)
        this.$nextTick(() => {
          this.$refs.video.getParentUrl(resource.resourceUrl);
        });
      } else {
        this.resourceObj = resource;
      }
    },
    //获取数据
    getResource(id, key, isLoading = true) {
      let data = {
        resourceType: id,
        searchKey: key
      };
      if (isLoading) {
        this.$store.commit("SHOWLOADING");
      }
      getResList(data)
        .then(res => {
          this.$store.commit("HIDELOADING");
          // console.log(res)
          if (Number(res.code) === 200) {
            //如果试题库为空，则初始化新建一个默认的文件夹
            if (res.data.length === 0) {
              this.newCatalog = {
                catalogId: 0,
                catalogName: "默认文件夹"
              };
              this.newFileFold();
            }
            this.resourceData = this.filterData(res.data);
          } else {
            this.$message({
              message: "资源获取失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$store.commit("HIDELOADING");
        });
    },
    //判断文档类型
    getIcon(name) {
      let kind = fileKind(name);
      return this.imgSrc[kind];
    },
    //搜索资源
    searchResource(key) {
      let data = {
        resourceType: this.radio,
        searchKey: key
      };
      getResList(data).then(res => {
        // console.log(res)
        if (Number(res.code) === 200) {
          //如果试题库为空，则初始化新建一个默认的文件夹
          this.resourceData = this.filterData(res.data);
        } else {
          this.$message({
            message: "资源获取失败",
            type: "error"
          });
        }
      });
    },
    //资源种类改变时
    radioChange(radio) {
      this.input = "";
      this.getResource(radio);
    },
    //点击弹出重命名的弹窗
    goRenameCatalog(data, id) {
      let parentId = data.parentId || 0;
      this.expan = [parentId];
      this.newCatalog.catalogId = id;
      this.renameCatalog = true;
    },
    //获取图片路径
    getImgSrc(type) {
      return this.imgSrc[type];
    },
    //点击弹出新建目录的弹窗
    goCreateCatalog(data, id) {
      this.newCatalog.catalogId = id;
      this.createCatalog = true;
    },
    //全选操作
    checkAll(flag) {
      //获取所有文件夹节点的id用于全选
      let idArr = [];
      this.resourceData.forEach(item => {
        idArr.push(item.catalogId);
      });
      this.isCheckAll = flag;
      this.isCheckAll ? idArr : (idArr = []);
      this.deleteArr = idArr;

      this.allDelete = flag;
    },
    //节点复选框被选
    nodeCheck(data, checked) {
      // console.log(data)
      // console.log(checked)
      if (checked) {
        this.deleteArr.push(data.catalogId);
        this.resourceArr.push(data.resourceId);
      } else {
        let index = this.deleteArr.indexOf(data.catalogId);
        this.deleteArr.splice(index, 1);

        let reindex = this.resourceArr.indexOf(data.resourceId);
        this.resourceArr.splice(index, 1);
      }
      this.deleteArr = this.deleteArr.filter(item => {
        return item != undefined;
      });
      this.resourceArr = this.resourceArr.filter(item => {
        return item != undefined;
      });
    },
    //新建文件夹
    newFileFold() {
      this.$store.commit("SHOWLOADING");
      let data = this.newCatalog;
      this.expan = [this.newCatalog.catalogId];
      newResFileFold(data).then(res => {
        console.log(res);
        if (Number(res.code) === 200) {
          this.$message.success("文件夹新建成功");
          this.createCatalog = false;
          this.newCatalog.catalogName = "";
          //更新页面数据
          this.getResource(0);
          this.$store.commit("HIDELOADING");
        } else {
          this.$message.error("文件夹新建失败");
        }
      });
    },
    //重命名文件夹
    reFileFold() {
      let data = this.newCatalog;
      reResFileFold(data).then(res => {
        if (Number(res.code) === 200) {
          this.$message.success("重命名成功");
          this.renameCatalog = false;
          this.newCatalog.catalogName = "";
          //更新页面数据
          this.getResource(0);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除资源
    delRes(id, parentId) {
      this.$store.commit("SHOWLOADING");

      this.resourceArr.push(Number(id));
      let arr = [...this.resourceArr];
      this.expan = [parentId];
      deleteRes(arr).then(res => {
        this.$store.commit("HIDELOADING");
        console.log(res);
        if (Number(res.code) === 200) {
          this.$message.success("资源删除成功");
          this.getResource(0);
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    //删除文件夹
    deleteCatalog() {
      let catalogIds = [...this.deleteArr];
      if (catalogIds.length == 0) {
        this.$message.warning("请选择要删除的文件夹");
        return false;
      }
      this.$store.commit("SHOWLOADING");

      delResFileFold(this.deleteArr).then(res => {
        this.$store.commit("HIDELOADING");
        if (Number(res.code) === 200) {
          this.$message.success("删除成功");
          this.allDelete = false;
          this.getResource(0);
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    //清洗数据
    filterData(data) {
      let getFilter = data => {
        data.forEach(item => {
          if (item.childCatalogList.length !== 0) {
            return getFilter(item.childCatalogList);
          } else {
            if (item.resourceList.length !== 0) {
              let parentId = item.catalogId;
              item.resourceList.forEach(list => {
                if (list.resourceSize) {
                  list.resourceSize = this.sizeTrans(list.resourceSize);
                }
                item.childCatalogList.push({
                  catalogName: list.resourceTitle,
                  resourceId: list.resourceId,
                  createTime: list.createTime,
                  parentId: parentId,
                  srtUrl: list.srtUrl,
                  resourceType: list.resourceType,
                  resourceSize: list.resourceSize
                });
              });
            }
          }
        });
        return data;
      };
      return getFilter(data);
    },
    goUp(id) {
      Cookie.set("catalogId", id);
    },
    upRes(url, name, size) {
      //判断资源类型
      let type = this.resType(name);
      if (!type) {
        return false;
      }
      let id = Number(Cookie.get("catalogId"));
      let userId = Number(Cookie.get("userId"));
      console.log(userId);
      this.expan = [id];
      let data = {
        catalogId: id,
        userId: userId,
        resourceUrl: url,
        resourceTitle: name,
        resourceType: type,
        contentType: type,
        resourceSize: size
      };
      localUpload(data).then(res => {
        if (Number(res.code) === 200) {
          this.$message.success("上传成功");
          this.getResource(0, null, false);
        } else {
          this.$message.error("资源保存失败");
        }
      });
    },
    resType(name) {
      let index = name.lastIndexOf("."),
        imgArr = ["jpeg", "jpg", "png"],
        audioArr = ["mp3", "wav"],
        videoArr = ["mp4", "avi", "rmvb", "wmv", "mkv"],
        docArr = ["pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
        typeNumber = "";
      let curType = name.substring(index + 1, name.length).toLowerCase();

      if (
        imgArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 40;
      } else if (
        videoArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 10;
      } else if (
        docArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 20;
      } else if (
        audioArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 30;
      } else {
        this.$message.error("请上传受支持的资源文件");
      }
      return typeNumber;
    },
    //文件大小转换
    sizeTrans(limit) {
      let size = "";
      if (limit < 0.1 * 1024) {
        //如果小于0.1KB转化成B
        size = limit.toFixed(2) + "B";
      } else if (limit < 0.1 * 1024 * 1024) {
        //如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + "KB";
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        //如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }
      let sizestr = size + "";
      let len = sizestr.indexOf(".");
      let dec = sizestr.substr(len + 1, 2);
      if (dec == "00") {
        //当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
      }
      return sizestr;
    },
    //拖拽相关
    handleDrop(draggingNode, dropNode, dropType, ev) {
      //console.log(dropType)
      //console.log('拖拽的',dropNode.label,dropNode)

      let type = draggingNode.data.catalogId ? 1 : 2,
        beforeId =
          type == 1
            ? draggingNode.data.catalogId
            : draggingNode.data.resourceId,
        afterType = dropNode.data.catalogId ? 1 : 2,
        afterId =
          type == 1 ? dropNode.data.catalogId : dropNode.data.resourceId;

      let data = {};

      switch (dropType) {
        case "inner":
          data = { id: beforeId, type: type, inCatalogId: afterId };
          this.move(data);
          break;
        case "after":
          data = {
            id: beforeId,
            type: type,
            previous: {
              id: afterId,
              type: afterType
            }
          };
          console.log(data);

          console.log(
            "将被移到id:",
            dropNode.data.catalogId,
            "名字：",
            dropNode.label,
            "后面"
          );
          this.move(data);
          break;
        case "before":
          if (dropNode.previousSibling.previousSibling) {
            data = {
              id: beforeId,
              type: type,
              previous: {
                id: dropNode.previousSibling.previousSibling.data.catalogId,
                type: afterType
              }
            };
            console.log(data);

            console.log(
              "将被移到id",
              dropNode.previousSibling.previousSibling.data.catalogId,
              "名字:",
              dropNode.previousSibling.previousSibling.label,
              "后面"
            );
          } else {
            data = {
              id: beforeId,
              type: type,
              next: {
                id: afterId,
                type: afterType
              }
            };
            console.log(data);

            console.log("将被移到最顶部");
          }
          this.move(data);
          break;
      }
    },
    allowDrop(draggingNode, dropNode, dropType) {
      if (!draggingNode.data.catalogId) {
        return type === "inner" && dropNode.data.catalogId;
      } else if (draggingNode.data.catalogId) {
        return dropNode.data.catalogId;
      } else {
        return true;
      }
    },
    //文件夹/文件 移动操作
    move(data) {
      moveRes(data).then(res => {
        console.log(res);
        if (Number(res.code) === 200) {
          this.$message.success("移动成功");
          this.searchResource("");
        } else {
          this.$message.error("移动失败");
          this.searchResource("");
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
#inputs {
  display: none;
}

.active {
  color: #fff;
  background-color: #409EFF;
  border-color: #409EFF;
}

.str-tag {
  display: inline-block;
  padding: 0 5px;
  margin: 0 5px;
  color: #218001;
  border: 1px solid #218001;
}

.hide-button {
  opacity: 0;

  &:hover {
    opacity: 1;
  }
}

.resource {
  .title {
    border-bottom: 2px solid #e3e8ee;
    padding-bottom: 20px;
  }

  .radio-group {
    display: flex;
    padding: 20px 0;

    .search-btn {
      border-left: 0;
      background-color: #f4f4f4;
      border-radius: 4px;
    }
  }

  .resource-warp {
    .img-span {
      display: inline-block;

      .img-icon {
        width: 48px;
        height: 48px;
        margin: 0 10px;
      }
    }

    .resource-title {
      display: flex;
      height: 50px;
      align-items: center;
      background-color: #f4f4f4;

      & div:first-child {
        flex: 1;
        padding-left: 25px;
      }

      & div:last-child {
        padding-right: 40px;
      }
    }

    .resource-list {
      padding-left: 32px;
      display: flex;
      align-items: center;

      .padding-box {
        width: 50px;
        height: 45px;

        & div {
          height: 50%;
          width: 100%;
          border-left: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
        }
      }

      .resource-info-box {
        display: flex;

        & div {
          margin: 0 10px;
        }
      }
    }
  }

  .test-warp {
    .tree-title {
      max-width: 300px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 10px;
    }

    .img-span {
      display: inline-block;

      .img-icon {
        width: 48px;
        height: 48px;
        margin: 0 10px;
      }
    }

    .test-title {
      display: flex;
      height: 50px;
      border-bottom: 1px solid #e3e8ee;
      align-items: center;
    }

    .test-body {
      .test-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-right: 8px;

        .test-info {
          flex: 1;
          overflow: hidden;
          padding-right: 30px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
