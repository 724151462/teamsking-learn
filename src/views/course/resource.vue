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
      </div >
      <div>
        <el-input
          placeholder="请选择日期"
          suffix-icon="el-icon-date"
          v-model="input">
        </el-input>
      </div>
    </div>
    <div class="resource-warp">
      <div class="resource-title">
        <!--一级选择框-->
        <div><el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox></div>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small">下载</el-button>
          <el-button type="primary" icon="el-icon-search" size="small">删除</el-button>
        </div>
      </div>
      <el-collapse accordion>
        <el-collapse-item v-for="(course,courseIndex) in resourceData" :key="course.id">
          <template slot="title">
            <!--二级课程选择框-->
            <el-checkbox
              :indeterminate="course.indeterminate"
              v-model="course.selected"
              style="padding-left: 25px"
              @change="checkCourseAll(courseIndex, $event)"></el-checkbox>
            <i class="header-icon el-icon-tickets" style="color: yellow;padding: 10px"></i>{{course.courseName}}
            <div style="float: right">
              <el-button type="primary" icon="el-icon-search" size="small">🔗</el-button>
              <el-button type="primary" icon="el-icon-search" size="small">删除</el-button>
            </div>
          </template>
          <div>
            <div class="resource-list" v-for="resource in course.resources" :key="resource.id">
              <div class="padding-box">
                <!--边框填充盒子(有用)-->
                <div></div>
              </div>
              <div>
                <!--三级单个资源选择框-->
                <el-checkbox
                  v-model="resource.selected"
                  :label="resource.resourceId"
                  @change="checkResource(courseIndex)"><i class="el-icon-picture"></i>{{resource.resourceTitle}}</el-checkbox>
              </div>
              <div style="flex: 1">
              </div>
              <div style="min-width: 200px" class="resource-info-box">
                <div>时长01:00:05</div>
                <div>{{resource.resourceSize}}MB</div>
                <div>2018-06-13 14:02</div>
              </div>
              <div>
                <el-button type="text"><a :href="resource.coverUrl">预览</a></el-button>&nbsp;| &nbsp;
                <el-button type="text" style="margin-left: -10px" @click="fileDownload(resource.resourceUrl)">下载</el-button>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import {getResourceList} from "../../api/course";

  export default {
    name: "resource",
    data () {
      return {
        radio: '全部文件',
        input: '',
        //多选框验证
        isCheckAll:false, // 是否全选(一级)
        checked:[],      //被选择数据的数组
        indeterminate: false, //选中，但非全选状态样式状态切换
        //数据
        resourceData:[{ //课程资源数据列表
          courseId:'',
          courseName:'',
          resources:[
            {
              courseId:'',
              courseName: '',
              resources: [{
              contentType: '',
              courseId: '',
              courseName: '',
              coverUrl: '',
              createTime: '',
              creatorId: '',
              creatorRealName: '',
              resourceId: '',
              resourceLength: '',
              resourceSize: '',
              resourceTitle: '',
              resourceType: '',
              resourceUrl: '',
              srtSize: '',
              srtUrl: '',
              tenantId: '',
              transProgress: '',
              userId: '',
              }],
            }
          ]
        }]
      };
    },
    methods:{
      //获取数据
      getResource (data) {
        getResourceList(data).then(res=>{
          if(Number(res.code) === 200){
            // console.log('资源列表数据:'+JSON.stringify(res.pageData))
            //数据处理
            // this.resourceData = res.data.pageData
            
            let data = this.dataChange(res.data.pageData)
            this.resourceData = res.data.pageData
            // console.log(this.resourceData)
          }else{
            this.$message({
              message:'资源列表数据获取失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //一级全选
      checkAll(e){
        this.isCheckAll = e
        this.indeterminate = false
            //二级全选反选
        this.resourceData.forEach ((item) =>{
          item.selected = e
          item.indeterminate = false  //去掉二级不确定状态
          // 三级全选反选
          item.resources.forEach( (list) =>{
            list.selected = e
          })
        })
        // console.log()
      },
      //二级课程全选
      checkCourseAll(index, e){
        this.resourceData[index].selected = e
        this.resourceData[index].indeterminate = false //去掉二级状态
        let isChildren = this.resourceData[index].resources
        if(isChildren){
          isChildren.forEach( (item) =>{
            item.selected = e
          })
        }

        this.checkIndeterminate(index)
      },
      //三级资源选择
      checkResource(courseIndex){
        this.checkIndeterminate(courseIndex)
      },
      //检查选中状态
      checkIndeterminate(courseIndex){
        let courceChecked = 0,
            resourcChecked = 0 ,
            courceLength = this.resourceData.length ,
            resourceLength = this.resourceData[courseIndex].resources.length;

        //三级资源全选判断
        this.resourceData[courseIndex].resources.forEach((item)=>{
          if(item.selected === true){
            resourcChecked++
          }
        })
        if(resourcChecked === resourceLength){ //所有资源被选中时，该课程为全选状态
          this.resourceData[courseIndex].selected= true
        }else{
          this.resourceData[courseIndex].selected= false
          this.resourceData[courseIndex].indeterminate= true
        }
        if(resourcChecked === 0){
          this.resourceData[courseIndex].indeterminate= false
        }
        //二级课程全选判断
        this.resourceData.forEach((item)=>{
          if(item.selected === true){
            courceChecked++
          }
        })
        courceChecked === courceLength ? this.isCheckAll= true : this.isCheckAll= false   //所有课程被选中时，改变全选状态
      },
      // 数据临时加工
      dataChange(data){
        data.forEach(function (item) {
          item.selected = false     //判定是否选中
          item.indeterminate = false //显示不确定状态、符号
          item.resources.forEach(function (item) {
            item.selected = false    //判定是否选中
            item.indeterminate = false //显示不确定状态、符号
          })
          console.log(item)
        })
        return data
      },
    //  文件下载
      fileDownload(url){
      }
    },
    created () {
      this.getResource()
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .resource
    padding:0 5% 20px 50px
    .title
      border-bottom 2px solid gray
      padding-bottom 20px
    .radio-group
      display flex
      padding 20px 0
    .resource-warp
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
