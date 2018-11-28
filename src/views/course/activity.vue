<template>
  <div class="activity">
    <div class="title">
      <div>活动管理</div>
    </div>
    <div style="width: 150px;float: right;padding:15px 0">
      <el-input
        placeholder="请选择日期"
        suffix-icon="el-icon-date"
        v-model="input2">
      </el-input>
    </div>
    <div class="activity-warp">
      <div class="activity-title">
        <!--一级选择框-->
        <div><el-checkbox v-model="isCheckAll" @change="checkAll">全选</el-checkbox></div>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small">删除</el-button>
        </div>
      </div>
      <el-collapse accordion>
        <el-collapse-item v-for="(course,courseIndex) in activityData" :key="course.id">
          <template slot="title">
            <!--二级课程选择框-->
            <el-checkbox
              :indeterminate="course.indeterminate"
              v-model="course.selected"
              style="padding-left: 25px"
              @change="checkCourseAll(courseIndex, $event)"></el-checkbox>
            <i class="header-icon el-icon-tickets" style="color: yellow;padding: 10px"></i>{{course.courseName}}
          </template>
          <div v-for="(chapter,chapterIndex) in course.chapter" :key="chapter.id">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                <!--三级章节课程选择框-->
                  <!--边框填充盒子(有用)-->
                <div class="pad-box"></div>
                <el-checkbox
                :indeterminate="chapter.indeterminate"
                v-model="chapter.selected"
                @change="checkChapterAll(courseIndex, chapterIndex, $event)"></el-checkbox>
                <i class="header-icon el-icon-tickets" style="color: yellow;padding: 10px"></i>{{chapter.chapterName}}
                </template>
                <div>
                  <div class="activity-list" v-for="(activity,activityIndex) in chapter.activity" :key="activity.id">
                    <div class="padding-box">
                      <!--边框填充盒子(有用)-->
                      <div></div>
                    </div>
                    <!--四级活动选择框-->
                    <div>
                      <el-checkbox
                        v-model="activity.selected"
                        :label="activity.activityTitle"
                        @change="CheckActivity(courseIndex, chapterIndex, activityIndex, $event)"><span style="font-size: 16px">{{activity.activityTitle}}</span></el-checkbox>
                    </div>
                    <div style="flex: 1">
                    </div>
                    <div class="activity-info-box">
                      {{activity.createTime}}
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
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
      //二级课程全选
      checkCourseAll(index, e){
        this.activityData[index].selected = e
        this.activityData[index].indeterminate = false //去掉二级状态
        let isChildren = this.activityData[index].chapter
        if(isChildren){ //三四级全选
          this.activityData[index].chapter.forEach( (item) =>{
            item.selected = e
            item.activity.forEach((list)=>{
              list.selected = e
            })
          })
        }
        this.checkCourseInd()
      },
      //三级课程章节全选
      checkChapterAll(courseIndex, chapterIndex, e){
        // this.checkIndeterminate(courseIndex)
        let data = this.activityData[courseIndex].chapter[chapterIndex]
        data.selected = e
        data.activity.forEach((item)=>{
          item.selected = e
        })
        // 状态检查
        this.checkChapterInd(courseIndex)
      },
      //四级活动选中
      CheckActivity(courseIndex,chapterIndex,activityIndex, e){
        let data = this.activityData[courseIndex].chapter[chapterIndex].activity[activityIndex]
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
      //课程全选状态检查
      checkCourseInd(){
        let checkedCourse = 0, courseLength = this.activityData.length
        this.activityData.forEach((item)=>{
          if(item.selected === true){
            checkedCourse++
          }
        })
        checkedCourse === courseLength ? this.isCheckAll= true : this.isCheckAll= false
      },
      //章节全选状态检查
      checkChapterInd(courseIndex){
        let checkedChapter = 0, chapterLength = this.activityData[courseIndex].chapter.length
        this.activityData[courseIndex].chapter.forEach((item)=>{
          if(item.selected === true){
            checkedChapter++
          }
        })
        if(checkedChapter === chapterLength){
          this.activityData[courseIndex].indeterminate = false
          this.activityData[courseIndex].selected = true
        }else if(checkedChapter === 0){
          this.activityData[courseIndex].indeterminate = true
          this.activityData[courseIndex].selected = false
        }else{
          this.activityData[courseIndex].indeterminate = true
          this.activityData[courseIndex].selected = false
        }
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
      //  文件下载
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
