<template>
  <el-container>
    <div class="menu-switch">
      <div :class="isInteractStart === true ? ['switch-outer','full']: ['switch-outer','no-full']">
        <i
          :class="isInteractStart === true ? 'el-icon-caret-right' : 'el-icon-caret-left'"
          @click.stop="menuShow"
        ></i>
      </div>
    </div>
    <transition name="slide-fade">
      <el-aside v-show="isInteractStart === false"
        class="side"
        style="width:280px; border: 1px solid #F2F6FC; position: fixed;height:85%"
      >
        <el-menu
          :default-active="activeSection"
          class="el-menu-vertical-demo"
          @select="menuSelect"
          :unique-opened="true"
        >
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
                v-for="(section, i) in chapter.seactions"
                :key="i"
              >{{section.sectionName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
    </transition>
    <el-main :class="isInteractStart === true ? 'main-full': 'main-hide'">
      <div v-if="selectedSection === ''">
        <div class="no-content">
          <img :src="require('@/assets/images/noResource.png')" alt>
          <span>请选择一个章节</span>
        </div>
      </div>
      <div v-else>
        <div class="secTitle">
          <span>{{selectedSection}}</span>
        </div>
        <template v-if="itemList.length !== 0">
          <el-tabs type="border-card" v-model="activeName" @tab-click="viewSource">
            <el-tab-pane
              v-for="(item,index) in itemList"
              :name="String(index)"
              :key="index"
              style="min-height: 500px;"
            >
              <span slot="label">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="item.itemName"
                >
                  <template v-if="item.resourceType === 10">
                    <img :src="require('@/assets/images/play.png')" height="20" slot="reference">
                    <span>{{item.itemName}}</span>
                  </template>
                  <template v-else>
                    <img :src="require('@/assets/images/watch.png')" height="20" slot="reference">
                    <span>{{item.itemName}}</span>
                  </template>
                </el-popover>
              </span>
              <template v-if="item.resourceType === 10">
                <videoPlayer :isMp4="item.resourceUrl"></videoPlayer>
              </template>
              <template v-else-if="item.resourceType === 40">
                <div style="display: flex; align-item: center;justify-content: center">
                  <img :src="item.resourceUrl" height="500px" alt>
                </div>
              </template>
              <template v-else>
                <iframe style="height:800px;width:100%" :src="viewUrl" frameborder="0"></iframe>
              </template>
            </el-tab-pane>
          </el-tabs>
        </template>
        <template v-else>
          <div class="no-content">
            <img :src="require('@/assets/images/noResource.png')" alt>
            <span>空空如也~</span>
          </div>
        </template>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Cookie from "js-cookie";
import { classChapter, classItem } from "@/api/course";
import { chapterView } from "@/api/sourceView";
import { connect } from "@/utils/socket";
import videoPlayer from "@/components/video-pay";
export default {
  data() {
    return {
      chapterList: [],
      isInteractStart: false,
      activeName: "0",
      activeSection: null,
      selectedSection: "",
      itemList: [],
      viewUrl: "",
      resourseVideo:
        "https://gxbvideo-gs.gaoxiaobang.com/lcms/video/file/9428b716-c0b5-11e4-9d7c-5254005b49e4_trans480p.mp4",
      resourseDoc:
        "http://tskedu-course.oss-cn-beijing.aliyuncs.com/1546572189761成员模板.xlsx"
    };
  },
  created() {
    Cookie.set("modelActive", "1");
    classChapter({ courseId: this.$route.query.id }).then(response => {
      this.chapterList = response.data;
    });
  },
  methods: {
    menuShow() {
      this.isInteractStart = !this.isInteractStart;
    },
    menuSelect(secId, x) {
      console.log(x);
      Cookie.set("chapterId", x[0]);
      Cookie.set("sectionId", secId);
      this.chapterList.forEach(element => {
        element.seactions.forEach(section => {
          if (section.sectionId === Number(secId)) {
            this.selectedSection = section.sectionName;
            console.log(element.chapterName, section.sectionName);
            this.$emit("showCurrentInfo", {
              chapterName: element.chapterName,
              sectionName: section.sectionName
            });
          }
        });
      });
      classItem({ sectionId: secId }).then(response => {
        this.itemList = response.data;
      });
      this.activeName = "0";
    },
    viewSource(value) {
      chapterView({ itemId: value.name }).then(response => {
        this.viewUrl = response.data;
      });
    }
  },
  components: {
    videoPlayer
  }
};
</script>

<style lang="stylus" scoped src="@/assets/css/menu-show.styl"></style>
<style lang="stylus" scoped>
@media screen and (min-width: 1500px) and (max-width: 2000px) {
  .el-container {
    font-size: 15px !important;
  }
}

.secTitle {
  text-align: center;
  font-size: 1.73em;
}

.no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 500px;

  & img {
    height: 300px;
  }

  & span {
    font-size: 30px;
    margin-top: 20px;
  }
}

.side::-webkit-scrollbar {
  display: none;
}
</style>

