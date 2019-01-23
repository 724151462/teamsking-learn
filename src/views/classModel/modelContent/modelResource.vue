<template>
  <div class="model-resource">
    <div class="nav">
      <div class="nav-go">
        <span><i class="el-icon-arrow-left"></i></span>
        <span><i class="el-icon-arrow-right"></i></span>
        <span>|</span>
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
            <el-button icon="el-icon-search" class="search-btn"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-data" v-show="data.length == 0">
      <div >暂无数据</div>
    </div>
    <div class="warp">
      <div class="box"
           v-for="catalog in data"
           :key="catalog.id" @click="goCatalog(catalog.catalogId,catalog.catalogName)">
        <div style="display: flex;justify-content: center"><img :src="imgSrc.folder" alt="" class="box-img"></div>
        <p class="box-title">{{catalog.catalogName}}</p>
      </div>
      <div v-if="data.resourceList">
        <div class="box" v-for="resource in data.resourceList" :key="resource.id">
          <img :src="imgSrc.word" alt="" class="box-img"></div>
          <p class="box-title">{{resource.resourceTitle}}</p>
        </div>
      </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import {classRes} from "@/api/library";

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
        txt: require("@/assets/images/txt.png")
      },
      routerList:[],
      search:'',
      data : []
    }
  },
  methods:{
    getResource(parentId,resourceType,key) {
      let data = {
        parentId,
        resourceType,
        searchKey: key
      }
      let loading = this.$loading({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      classRes(data).then(res => {
        loading.close()
        console.log(res)
        if (Number(res.code) === 200) {
          this.data = res.data.catalogList
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
      this.getResource(0)
      this.routerList = []
    },
    goCatalog(id,name){
      this.routerList.push({id,name})
      this.getResource(id)
    },
    routerClick(id,index){
      if(index+1 == this.routerList.length){
        return false
      }else{
        this.routerList.splice(index+1,this.routerList.length)
        this.getResource(id,0)
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
      display flex
      .box
        width 6rem
        cursor pointer
        padding 10px
        .box-img
          width 3.8em;
          height 2.8em;
        .box-title
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          text-align center
</style>
