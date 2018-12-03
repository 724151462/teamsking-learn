<template>
  <div class="activity">
    <div class="title">
      <div>活动管理</div>
    </div>
    <div class="search-box">
      <el-input
        placeholder="输入课程名称查询资源"
        v-model="input">
      </el-input>
      <div>
        <el-button icon="el-icon-search" class="search-btn"></el-button>
      </div>
    </div>
    <div class="activity-warp">

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
