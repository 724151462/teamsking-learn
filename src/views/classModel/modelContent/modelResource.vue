<template>
  <div class="model-resource">
    <div class="nav">
      <div class="nav-go">
        <!--<span><i class="el-icon-arrow-left"></i></span>-->
        <!--<span><i class="el-icon-arrow-right"></i></span>-->
        <!--<span style="user-select: none">|</span>-->
      </div>
      <div class="nav-list">
        <!--<div class="path">资源库<i class="el-breadcrumb__separator el-icon-arrow-right"></i></div>-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="path" @click.native="goRoot">资源库</el-breadcrumb-item>
          <el-breadcrumb-item class="path" v-for="(router,index) in routerList" :key="router.id" @click.native="routerClick(router.id,index)">{{router.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="nav-search">
        <div style="display: flex">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="search">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn" @click="getResource(0,0,search)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-data" v-show="data.catalogList.length == 0 && data.resourceList.length == 0">
      <div >暂无数据</div>
    </div>
    <div style="width: 100%" v-if="showContent === true">
      <div style="margin: 0 auto; width: 80%" v-if="resourceObj.resourceType === 40">
        <img :src="resourceObj.resourceUrl" style="height: 600px;width: 100%"/>
      </div>
      <div style="margin: 0 auto; width: 80%" v-else-if="resourceObj.resourceType === 20">
        <iframe :src="resourceObj.docUrl" frameborder="0" style="height: 600px;width: 100%"></iframe>
      </div>
      <div style="margin: 0 auto; width: 80%" v-else-if="resourceObj.resourceType === 10">
        <videoPlayer :isMp4="resourceObj.resourceUrl"></videoPlayer>
      </div>
      <!-- <img :src="imgSrc.mp4" alt="" class="res-img" v-show="resource.resourceType == 10">
        <img :src="imgSrc.word" alt="" class="res-img" v-show="resource.resourceType == 20">
        <img :src="imgSrc.mp4" alt="" class="res-img" v-show="resource.resourceType == 30">
        <img :src="imgSrc.img" alt="" class="res-img" v-show="resource.resourceType == 40"> -->
    </div>
    <div class="warp"  v-else-if="showContent === false">
      <div class="box"
           v-for="catalog in data.catalogList"
           :key="catalog.id" @click="goCatalog(catalog.catalogId,catalog.catalogName)">
        <img :src="imgSrc.folder" alt="" class="box-img">
        <p class="box-title">{{catalog.catalogName}}</p>
      </div>
      <div class="box" v-for="resource in data.resourceList" :key="resource.id" @click="resourceView(resource)">
        <img :src="imgSrc.mp4" alt="" class="res-img" v-show="resource.resourceType == 10">
        <img :src="imgSrc.word" alt="" class="res-img" v-show="resource.resourceType == 20">
        <img :src="imgSrc.mp4" alt="" class="res-img" v-show="resource.resourceType == 30">
        <img :src="imgSrc.img" alt="" class="res-img" v-show="resource.resourceType == 40">
        <p class="box-title">{{resource.resourceTitle}}</p>
      </div>
      </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import {classRes} from "@/api/library";
import {getResourceViewByUrl} from "@/api/sourceView"

import videoPlayer from '@/components/video-pay'

export default {
  created() {
    Cookie.set('modelActive', '6')
    this.getResource(0,0)
  },
  data() {
    return{
      imgSrc: {
        folder: require("@/assets/images/folder.png"),
        pdf: require("@/assets/images/pdf.png"),
        mp4: require("@/assets/images/mp4.png"),
        word: require("@/assets/images/word.png"),
        img: require("@/assets/images/img.png")
      },
      resourceObj: {
        docUrl: ''
      },
      showContent: false,
      routerList:[],
      hisRouter:[],
      search:'',
      data : {
        catalogList:[],
        resourceList:[],
      }
    }
  },
  components: {
    videoPlayer
  },
  methods:{
    getResource(parentId,resourceType,key) {
      let data = {
        parentId,
        resourceType,
        searchKey: key
      }
      console.log('搜索',data)
      // let loading = this.$loading({
      //   lock: true,
      //   text: '努力加载中',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      classRes(data).then(res => {
        // loading.close()
        console.log(res)
        if (Number(res.code) === 200) {
          this.data = res.data
          // console.log(this.resourceData)
        } else {
          this.$message({
            message: "数据加载失败",
            type: "error"
          });
        }
      })
    },
    //资源库被点击
    goRoot(){
      this.showContent = false
      this.getResource(0,0)
      this.routerList = []
    },
    goCatalog(id,name){
      this.showContent = false
      this.routerList.push({id,name})
      this.getResource(id,0)
    },
    routerClick(id,index){
      this.showContent = false
      if(index+1 == this.routerList.length){
        return false
      }else{
        this.routerList.splice(index+1,this.routerList.length)
        this.getResource(id,0)
      }
    },
    resourceView(resource) {
      console.log(resource)
      this.routerList.push({id:resource.resourceId,name:resource.resourceTitle})
      if(resource.resourceType === 20) {
        getResourceViewByUrl({url: resource.resourceUrl})
        .then(response=> {
          this.resourceObj = resource
          this.resourceObj.docUrl = response.data
          //console.log(response.data)
          this.showContent = true
        })
      }else {
        this.resourceObj = resource
        this.showContent = true
      }
    }
  }
}
</script>

<style scoped lang="stylus" type="text/stylus">
  .model-resource
    .el-breadcrumb
      .el-breadcrumb__item
        &:hover
          color: #409EFF;
          cursor: pointer;
    .empty-data
      background #ccc
      text-align center
      height 40px
      line-height 40px
    .nav
      /*height 20px*/
      padding 10px 0
      align-items center
      display flex
      background #f4f4f4
    .nav-go
      padding 0 10px;
      span
        display inline-block
        font-size 20px
        margin 0 10px
        cursor pointer
    .nav-list
      flex: 1
      .path
        &:hover
          color: #409EFF;
          cursor: pointer;
    .nav-search
      width 250px
      padding-right 20px;
      .search-btn
        border-left 0
        background-color #fff
        border-radius 4px
    .warp
      padding 40px
      .box
        width 6rem
        cursor pointer
        padding 10px
        display inline-block
        text-align center
        .box-img
          width 3.8em;
          height 3em;
        .res-img
          width 3.8em;
          height 3.8em;
        .box-title
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          text-align center
</style>
