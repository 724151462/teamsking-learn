<template>
  <div>
    <div>
      <tableNoHeader
        :tableData="tableData" 
        :tables="tables" 
        :buttonStylus="sysButton" 
        @showComponentInfo="showComponentInfo"
      ></tableNoHeader>
    </div>
    <el-dialog
      :visible.sync="show"
      title="作答记录">
      <template v-for="item in subject">
        <p class="margin-sides" :key="item.id">{{item.title}}</p>
        <el-radio v-for="(option, i) in item.option" :key="i" :label="optionFilter(i)+option.label"></el-radio>
      </template>
      </el-dialog>
  </div>
  
</template>

<script>
  import tableNoHeader from '@/components/table-no-header.vue'
  import adialog from '@/components/dialog'
  import {testMark} from '@/api/course'
  export default {
    data() {
      return {
        markParmas: {
          courseId: this.$route.query.courseId,
          examId: this.$route.query.examId
        },
        tables:[
          {
            name:'学生',
            prop:'notesTitle',
          },
          {
            name:'状态',
            prop:'notesContent',
          },
          {
            name:'提交时间',
            prop:'zyname',
          },
          {
            name:'测试得分',
            prop:'fbr',
          },
        ],
        tableData:[
          {
            zyname:'资源名',
            notesTitle:'笔记标题11',
            notesContent:'<p>笔记内容</p>',
            fbr:'发布人',
            fbsj:'2018-1-1',
          },
          {
            zyname:'资源名',
            notesTitle:'笔记标题',
            notesContent:'笔记内容',
            fbr:'发布人',
            fbsj:'2018-1-1',
          },
        ],
        sysButton:[
          {
            name:'查看成绩',
            type:'view',
          },
        ],

        // 对话框
        show: false,
        subject: [{
          title: '第一题', id:'a', option: [{name: '123', label: '12312'}, {name: '456', label: "214215"}]  
        },
        {
          title: '第二题', id:'b', option: [{name: '123', label: '12312'}, {name: '456', label: "214215"}]  
        }], 
      }
    },
    created(){
      this.$emit('teachingNav','test')
    },
    mounted() {
      console.log('map', this.markParmas)
      testMark(this.markParmas)
      .then(response=> {
        console.log('mark', response.data)
      })
    },
    components: {
      tableNoHeader,
      adialog
    },
    methods: {
      showComponentInfo(...params) {
        let type = params[0]
        console.log(type)
        switch (type) {
          case 'view':
            this.show = true
            break;
        
          default:
            break;
        }
      },
      optionFilter(i) {
        switch (i) {
          case 0:
            return 'A '
            break;
          case 1:
            return 'B '
          case 2:
            return 'C '
          case 3:
            return 'D '
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

