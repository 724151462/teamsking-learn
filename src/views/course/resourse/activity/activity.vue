<template>
  <div class="activity">
    <div class="title">
      <div>活动管理</div>
    </div>
    <el-form :inline="true" :model="formInline" style="margin-top: 40px">
      <el-form-item>
        <div style="display: flex">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="input">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn"></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-select v-model="value" placeholder="请选择" @change="getChapterQuiz">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="delAllQuiz">删除该课程全部试题</el-button>
      </el-form-item>
    </el-form>
    <div class="activity-warp">
      <div class="activity-title">
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
          <el-collapse-item v-for="(course,courseIndex) in activityData" :key="course.id">
            <template slot="title">
              <!--课程选择框-->
              <el-checkbox
                :indeterminate="course.indeterminate"
                v-model="course.selected"
                style="padding-left: 25px"
                @change="checkCourseAll(courseIndex, $event)"></el-checkbox>
              <div style="display: inline-flex;width: calc(100% - 100px)">
                <div style="display: inline-block"><img :src="imgSrc.folder" style="width: 20px;margin: 0 10px;"/></div>
                <div style="display: inline-block">{{course.chapterName}}</div>
                <!--<div style="flex: 1">1</div>-->
                <!--<div>-->
                  <!--<el-button type="primary" icon="el-icon-upload2" size="small" @click.stop="fileUpload">上传</el-button>-->
                <!--</div>-->
              </div>
            </template>
            <!--章节-->
            <el-collapse v-for="(chapter) in course.chapter" :key="chapter.id" style="padding-left: 50px;">
              <el-collapse-item :title="chapter.chapterName">
                <div style="display: flex">
                  <div>单选框</div>
                  <div style="flex: 1">测试：Word的基础操作 查看></div>
                  <div>2018-6-31 12:00</div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <!--<div v-for="(chapter, chapterIndex) in course.chapter" :key="chapter.id" style="padding-left: 80px;">-->
              <!--<div style="display: inline-flex;width: calc(100% - 100px)">-->
                <!--<div style="display: inline-block">{{chapter.chapterName}}</div>-->
                <!--<div style="flex: 1"></div>-->
                <!--<div>-->
                  <!--2018-6-31 12:00-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        imgSrc: {folder: require("../../../../assets/images/folder.png"),},
        input2: '',
        //多选框验证
        isCheckAll:false, // 是否全选(一级)
        checked:[],      //被选择数据的数组
        indeterminate: false, //选中，但非全选状态样式状态切换
        //数据
        activityData:[
          {
          courseId: "0608367675f54267aa6960fd0557cc1b",
          courseName: "马列主义",
          indeterminate: false,
          chapter: [
            {
              chapterName : '第一章 什么是马列主义',
              selected: false,
              indeterminate: false,
              activity:[
                {
                  createTime: '2018-6-15 12:00',
                  indeterminate: false,
                  activityTitle: '测试:马列主义的中心实习',
                  selected:false
                },
                {
                  createTime: '2018-6-15 12:00',
                  indeterminate: false,
                  activityTitle: '头脑风暴:如何更好的学习',
                  selected:false
                },
                {
                  createTime: '2018-6-15 12:00',
                  indeterminate: false,
                  activityTitle: '头脑风暴:大数据的形式',
                  selected:false
                }
              ]
            },
            {
              chapterName : '第二章 要背下来的知识点',
              selected: false,
              indeterminate: false,
              activity:[
                {
                  createTime: '2018-6-15 12:00',
                  indeterminate: false,
                  activityTitle: '测试:马列主义的中心实习',
                  selected:false
                },
                {
                  createTime: '2018-6-15 12:00',
                  indeterminate: false,
                  activityTitle: '头脑风暴:如何更好的学习',
                  selected:false
                },
                {
                  createTime: '2018-6-15 12:00',
                  indeterminate: false,
                  activityTitle: '头脑风暴:大数据的形式',
                  selected:false
                }
              ]
            }
          ],
          selected: false
        },
          {
            courseId: "0608367675f54267aa6960fd0557cc1b",
            courseName: "马列主义",
            indeterminate: false,
            chapter: [
              {
                chapterName : '第一章 什么是马列主义',
                selected: false,
                indeterminate: false,
                activity:[
                  {
                    createTime: '2018-6-15 12:00',
                    indeterminate: false,
                    activityTitle: '测试:马列主义的中心实习',
                    selected:false
                  },
                  {
                    createTime: '2018-6-15 12:00',
                    indeterminate: false,
                    activityTitle: '头脑风暴:如何更好的学习',
                    selected:false
                  },
                  {
                    createTime: '2018-6-15 12:00',
                    indeterminate: false,
                    activityTitle: '头脑风暴:大数据的形式',
                    selected:false
                  }
                ]
              },
              {
                chapterName : '第二章 要背下来的知识点',
                selected: false,
                indeterminate: false,
                activity:[
                  {
                    createTime: '2018-6-15 12:00',
                    indeterminate: false,
                    activityTitle: '测试:马列主义的中心实习',
                    selected:false
                  },
                  {
                    createTime: '2018-6-15 12:00',
                    indeterminate: false,
                    activityTitle: '头脑风暴:如何更好的学习',
                    selected:false
                  },
                  {
                    createTime: '2018-6-15 12:00',
                    indeterminate: false,
                    activityTitle: '头脑风暴:大数据的形式',
                    selected:false
                  }
                ]
              }
            ],
            selected: false
          }
        ]
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
        this.activityData.forEach ((item) =>{
          item.selected = e
          item.indeterminate = false  //去掉二级不确定状态
          // 三级全选反选
          item.chapter.forEach( (list) =>{
            list.selected = e
            // 四级全选反选
            list.activity.forEach((tag)=>{
              tag.selected = e
            })
          })
        })
      },
      //活动全选状态检查
      checkActivityInd(){
        let checkedCourse = 0, courseLength = this.activityData.length
        this.activityData.forEach((item)=>{
          if(item.selected === true){
            checkedCourse++
          }
        })
        checkedCourse === courseLength ? this.isCheckAll= true : this.isCheckAll= false
      },
      // 数据临时加工
/*      dataChange(data){
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
      },*/
      // 文件下载
      fileDownload(url){
      }
    },
    created () {
      // this.getResource()
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .activity
    padding:0 5% 20px 50px
    .title
      border-bottom 2px solid gray
      padding-bottom 20px
    .search-box
      width: 350px
      float: right
      padding:15px 0
      display: flex
      .search-btn
        border-left 0
        background-color #f4f4f4
        border-radius 4px
    .activity-warp
      padding-top 75px
      .activity-title
        display flex
        height 50px
        align-items center
        background-color #f4f4f4
        & div:first-child
          flex 1
          padding-left 25px
        & div:last-child
          padding-right 40px
      .activity-list
        padding-left: 90px
        display flex
        align-items center
        height 45px
        .padding-box
          width 50px
          height 45px
          & div
            height 50%
            width 100%
            border-left 1px solid #ccc
            border-bottom 1px solid #ccc
        .activity-info-box
          padding-right 50px
          color #999
          font-size 16px
      .pad-box
        width: 50px;
        height: 25px;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        margin-left 32px
        float: left

</style>
