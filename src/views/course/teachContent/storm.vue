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
      title="全部回答">
      <div v-for="(answer, index) in answerList" :key="index">
        <div class="left">
          <img src="" alt="">
        </div>
        <div class="right">

        </div>
      </div>
      </el-dialog>
  </div>
  
</template>

<script>
  import tableNoHeader from '@/components/table-no-header.vue'
  export default {
    data() {
      return {
        tables:[
          {
            name:'题目',
            prop:'notesTitle',
          },
          {
            name:'状态',
            prop:'notesContent',
          },
          {
            name:'已作答/应作答',
            prop:'zyname',
          },
          {
            name:'截止时间',
            prop:'fbr',
          },
        ],
        tableData:[
          {
            zyname:'资源名',
            notesTitle:'笔记标题1',
            notesContent:'<p>笔记内容</p>',
            fbr:'发布人',
            fbsj:'2018-1-1',
            popover: 'dsawf'
          },
          {
            zyname:'资源名',
            notesTitle:'笔记标题',
            notesContent:'笔记内容',
            fbr:'发布人',
            fbsj:'2018-1-1',
            popover: 'twqfwq'
          },
        ],
        sysButton:[
          {
            name:'查看详情',
            type:'view',
          },
        ],


        // 对话框
        show: false,
      }
    },
    created(){
      this.$emit('teachingNav','storm')
    },
    components: {
      tableNoHeader,
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

