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
  </div>
  
</template>

<script>
  import tableNoHeader from '@/components/table-no-header.vue'
  export default {
    data() {
      return {
        tables:[
          {
            name:'作业名称',
            prop:'notesTitle',
          },
          {
            name:'学生名称',
            prop:'notesContent',
          },
          {
            name:'状态',
            prop:'zyname',
          },
          {
            name:'所属组',
            prop:'fbr',
          },
          {
            name:'提交时间',
            prop:'fbsj',
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
            name:'评分',
            type:'mark',
          },
        ],

      }
    },
    created(){
      this.$emit('teachingNav','operation')
    },
    components: {
      tableNoHeader,
    },
    methods: {
      showComponentInfo(...params) {
        let type = params[0]
        console.log(type)
        switch (type) {
          case 'mark':
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

