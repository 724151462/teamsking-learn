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
    <div class="resource-warp">
      <div class="resource-title">
        <!--全选-->
        <div>
          <el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-download" size="small">下载</el-button>
          <el-button icon="el-icon-delete" size="small">删除</el-button>
        </div>
      </div>
      <div>
        <el-collapse accordion>
          <el-collapse-item v-for="(course,courseIndex) in resourceData" :key="course.id">
            <template slot="title">
              <!--二级课程选择框-->
              <el-checkbox
                :indeterminate="course.indeterminate"
                v-model="course.selected"
                style="padding-left: 25px"
                @change="checkCourseAll(courseIndex, $event)"></el-checkbox>
              <div style="display: inline-flex;width: calc(100% - 100px)">
                <div style="display: inline-block"><img :src="imgSrc.folder" style="width: 20px;margin: 0 10px;"/></div>
                <div style="display: inline-block">{{course.courseName}}</div>
                <div style="flex: 1">1</div>
                <div>
                  <el-button type="primary" icon="el-icon-upload2" size="small" @click.stop="fileUpload">上传</el-button>
                </div>
              </div>
            </template>
            <div>
              <div class="resource-list" v-for="resource in course.resources" :key="resource.id">
                <div class="padding-box">
                  <!--边框填充盒子(有用)-->
                  <div></div>
                </div>
                <div>
                  <!--三级单个资源选择-->
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
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
  import {getResourceList} from "../../../../api/course";

  export default {
    name: "resource",
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
        checked: [],      //存放被选择数据的数组
        indeterminate: false, //选中，但非全选状态样式状态切换
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
        }]
      };
    },
    methods: {
      //获取数据
      getResource(data) {
        getResourceList().then(res => {
          if (Number(res.code) === 200) {
            // console.log('资源列表数据:'+JSON.stringify(res.pageData))
            //数据处理
            // this.resourceData = res.data.pageData

            let data = this.dataChange(res.data.pageData);
            this.resourceData = res.data.pageData;
            // console.log(this.resourceData)
          } else {
            this.$message({
              message: "资源列表数据获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //一级全选
    checkAll(e) {
      this.isCheckAll = e;
      this.indeterminate = false;
      //二级全选反选
      this.resourceData.forEach(item => {
        item.selected = e;
        item.indeterminate = false; //去掉二级不确定状态
        // 三级全选反选
        item.resources.forEach(list => {
          list.selected = e;
          //  将所有数据加入被选数据
          if (e) {
            list.requestId;
          } else {
          }
        });
      });
    },
    //二级课程全选
    checkCourseAll(index, e) {
      this.resourceData[index].selected = e;
      this.resourceData[index].indeterminate = false; //去掉二级状态
      let isChildren = this.resourceData[index].resources;
      if (isChildren) {
        isChildren.forEach(item => {
          item.selected = e;
        });
      }

      this.checkIndeterminate(index);
    },
    //三级资源选择
    checkResource(courseIndex) {
      this.checkIndeterminate(courseIndex);
    },
    //检查选中状态
    checkIndeterminate(courseIndex) {
      let courceChecked = 0,
        resourcChecked = 0,
        courceLength = this.resourceData.length,
        resourceLength = this.resourceData[courseIndex].resources.length;

      //三级资源全选判断
      this.resourceData[courseIndex].resources.forEach(item => {
        if (item.selected === true) {
          resourcChecked++;
        }
      });
      if (resourcChecked === resourceLength) {
        //所有资源被选中时，该课程为全选状态
        this.resourceData[courseIndex].indeterminate = false;
        this.resourceData[courseIndex].selected = true;
      } else {
        this.resourceData[courseIndex].selected = false;
        this.resourceData[courseIndex].indeterminate = true;
      }
      if (resourcChecked === 0) {
        this.resourceData[courseIndex].indeterminate = false;
      }
      //二级课程全选判断
      this.resourceData.forEach(item => {
        if (item.selected === true) {
          courceChecked++;
        }
      });
      this.isCheckAll = courceChecked === courceLength; //所有课程被选中时，改变全选状态
      // courceChecked === courceLength ? this.isCheckAll = true : this.isCheckAll = false
    },
    // 数据临时加工
    dataChange(data) {
      data.forEach(function(item) {
        item.selected = false; //判定是否选中
        item.indeterminate = false; //显示不确定状态、符号
        item.resources.forEach(function(item) {
          item.selected = false; //判定是否选中
          item.indeterminate = false; //显示不确定状态、符号
        });
        console.log(item);
      });
      return data;
    },
    //  文件下载
    fileDownload(url) {},
    fileUpload() {
      alert("上传");
    },
    //获取图片路径
    getImgSrc(type) {
      return this.imgSrc[type];
    }
  },
  created() {
    this.getResource();
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
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
</style>
