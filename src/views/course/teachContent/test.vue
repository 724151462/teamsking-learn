<template>
  <div>
    <div>
      <tableNoHeader
        :tableData="tableData" 
        :tables="tables" 
        :buttonStylus="sysButton" 
        @showComponentInfo="showComponentInfo"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      ></tableNoHeader>
    </div>
  </div>
  
</template>

<script>
  import tableNoHeader from '@/components/table-no-header.vue'
  import {testList} from '@/api/course'
  export default {
    data() {
      return {
        loading: true,
        tables:[
          {
            name:'测验名称',
            prop:'examTitle',
          },
          {
            name:'所属章',
            prop:'chapterName',
          },
          {
            name:'状态',
            prop:'interactionStatus',
          },
          {
            name:'已提交/应提交',
            prop:'submitStatus',
          },
          {
            name:'提交截止时间',
            prop:'expireTime',
          },
        ],
        tableData:[
          // {
          //   zyname:'资源名',
          //   notesTitle:'笔记标题1',
          //   notesContent:'<p>笔记内容</p>',
          //   fbr:'发布人',
          //   fbsj:'2018-1-1',
          // },
          // {
          //   zyname:'资源名',
          //   notesTitle:'笔记标题',
          //   notesContent:'笔记内容',
          //   fbr:'发布人',
          //   fbsj:'2018-1-1',
          // },
        ],
        sysButton:[
          {
            name:'学生测验成绩',
            type:'testMark',
          },
        ],
        testListParmas:{
          courseId: this.$route.query.id
        }
      }
    },
    created(){
      this.$emit('teachingNav','test')
    },
    mounted() {
      testList(this.testListParmas)
      .then(response=> {
        response.data.pageData.forEach(element => {
          switch(element.interactionStatus) {
            case 10:
            element.interactionStatus = '未开始'
            break
            case 20:
            element.interactionStatus = '正在进行'
            break
            case 30:
            element.interactionStatus = '已结束'
            break
          }
          element.submitStatus = `${element.submitCount}/${element.allCount}`
        });
        this.tableData = response.data.pageData
        this.loading = false
      })
    },
    components: {
      tableNoHeader,
    },
    methods: {
      showComponentInfo(...params) {
        console.log(params)
        let type = params[0]
        let groupId = params[1].examId
        console.log(type)
        switch (type) {
          case 'testMark':
            this.$router.push({path: "/course/list/teach/testmark", query: {courseId:this.$route.query.id, examId:groupId}})
            break;
        
          default:
            break;
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.dialog-header
  display flex
  justify-content space-between
  align-items center
  width 95%
  margin 10px auto 
  padding 10px
  border-top 1px solid rgb(233,233,233)
  border-bottom 1px solid rgb(233,233,233)
</style>

