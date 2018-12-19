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
  import {interactList} from '@/api/course'
  export default {
    data() {
      return {
        stormParams: {courseId: this.$route.query.id},
        tables:[
          {
            name:'题目',
            prop:'interactionName',
          },
          {
            name:'状态',
            prop:'interactionStatus',
          },
          {
            name:'已作答/应作答',
            prop:'answerStatus',
          },
          {
            name:'截止时间',
            prop:'endTime',
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
        answerList: [],

        // 对话框
        show: false,
      }
    },
    created(){
      this.$emit('teachingNav','storm')
    },
    mounted() {
      interactList(this.stormParams)
      .then(response=> {
        let stormArr = []
        response.data.forEach(element=> {
          element.interactions.forEach(item=> {
            if(item.interactionType === 50) {
              console.log('item.interactionStatus', item.interactionStatus)
              item.answerStatus = `?/${item.userCount}`
              item.endTime = '?'
              switch (item.interactionStatus) {
                case 10:
                  item.interactionStatus = '已开始'
                  break;
                case 20:
                  item.interactionStatus = '未开始'
                  break;
                case 30:
                  item.interactionStatus = '已结束'
                  break;
                default:
                  break;
              }
              
              stormArr.push(item)
            }
          })
        })
        this.tableData = stormArr
      })
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

