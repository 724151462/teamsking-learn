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
            name:'测验名称',
            prop:'notesTitle',
          },
          {
            name:'状态',
            prop:'notesContent',
          },
          {
            name:'已提交/应提交',
            prop:'zyname',
          },
          {
            name:'提交截止时间',
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
            name:'学生测验成绩',
            type:'testMark',
          },
        ],

      }
    },
    created(){
      this.$emit('teachingNav','test')
    },
    components: {
      tableNoHeader,
    },
    methods: {
      showComponentInfo(...params) {
        let type = params[0]
        let groupId = '3'
        console.log(type)
        switch (type) {
          case 'testMark':
            this.$router.push({name: "测试成绩", params: {id:groupId}})
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

