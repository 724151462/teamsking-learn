<template>
  <div>
    <!--加载动画-->
    <div v-show="showLoading">
      <div class="tq_loading__mask"></div>
      <div class="tq_loading-wrapper">
        <div class="tq_loading__loading-wrapper">
          <square :background="'#409eff'"></square>
        </div>
        <div class="tq_loading__text">
          正在加载
        </div>
      </div>
    </div>
    <div>
      <tableNoHeader
        :tableData="tableData" 
        :tables="tables" 
        :buttonStylus="sysButton" 
        @showComponentInfo="showComponentInfo"
      ></tableNoHeader>
    </div>
  </div>
  
</template>

<script>
  import tableNoHeader from '@/components/table-no-header.vue'
  import {testList} from '@/api/course'
  import { mapGetters } from "vuex";
  import Square from "@/components/cubeShadow.vue";
  export default {
    data() {
      return {
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
    computed: {
      ...mapGetters(["showLoading"])
    },
    created(){
      this.$emit('teachingNav','test')
    },
    mounted() {
      this.$store.commit("SHOWLOADING");
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
        this.$store.commit("HIDELOADING");
      })
    },
    components: {
      tableNoHeader,
      Square
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

