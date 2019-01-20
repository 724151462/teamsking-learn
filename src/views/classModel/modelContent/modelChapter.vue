<template>
  <el-container>
    <el-aside style="width:280px; border: 1px solid gray; position: fixed;height:85%">
      <el-menu default-active="2" class="el-menu-vertical-demo" @select="menuSelect">
        <el-submenu
          :index="String(chapter.chapterId)"
          v-for="(chapter, index) in chapterList"
          :key="index"
        >
          <template slot="title">
            <span>{{chapter.chapterName}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              :index="String(section.sectionId)"
              v-for="(section, i) in chapter.seactions" :key="i"
            >{{section.sectionName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <div v-if="selectedSection === ''">请选择一个章节</div>
      <div v-else>
        <div class="secTitle">
          <span>{{selectedSection}}</span>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane v-for="item in itemList">
            <span slot="label">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="item.itemName"
              >
              <template v-if="item.contentType === 10">
                  <img :src="require('@/assets/images/play.png')" height="20" slot="reference">
                  <span>{{item.itemName}}</span>
              </template>
                <template v-else>
                    <img :src="require('@/assets/images/watch.png')" height="20" slot="reference">
                    <span>{{item.itemName}}</span>
                </template>
              </el-popover>
            </span>
            <template v-if="item.contentType === 10">
                  <videoPlayer :isMp4="item.resourceUrl"></videoPlayer>
              </template>
                <template v-else>
                    <iframe style="height:100%;width:100%" :src="'https://api.idocv.com/view/url?url='+item.resourceUrl" frameborder="0"></iframe>
                </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Cookie from "js-cookie";
import { classChapter, classItem } from "@/api/course";
import { connect } from "@/utils/socket";
import videoPlayer from "@/components/video-pay"
export default {
  data() {
    return {
      chapterList: [],
      selectedSection: "",
      itemList: [],
      resourseVideo: 'https://gxbvideo-gs.gaoxiaobang.com/lcms/video/file/9428b716-c0b5-11e4-9d7c-5254005b49e4_trans480p.mp4',
      resourseDoc: 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/1546572189761成员模板.xlsx' 
    };
  },
  created() {
    Cookie.set("modelActive", "1");
    classChapter({ courseId: this.$route.query.id }).then(response => {
      this.chapterList = response.data;
    });
  },
  methods: {
    menuSelect(secId, x) {
        Cookie.set('chapterId', x[0]) 
      this.chapterList.forEach(element => {
        element.seactions.forEach(section => {
          console.log(section.sectionId, secId);
          if (section.sectionId === Number(secId)) {
            this.selectedSection = section.sectionName;
          }
        });
      });
      classItem({ sectionId: secId }).then(response => {
        this.itemList = response.data;
      });
    }
  },
  components: {
      videoPlayer
  }
};
</script>

<style lang="stylus" scoped>
@media screen and (min-width: 1500px) and (max-width: 2000px) {
  .el-container {
    font-size: 15px !important;
  }
}
.el-main 
    padding-left 300px
.secTitle {
  text-align: center;
  font-size: 1.73em;
}

</style>

