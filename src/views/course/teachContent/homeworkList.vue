<template>
  <div>
    <!-- <el-steps :active="0" align-center :space="350" finish-status="success">
      <el-step title="作业提交阶段" >
        <span slot="description" style="color:gray">2019-01-13 00:00:00结束</span>
      </el-step>
      <el-step title="成绩公布">
        <span slot="description" style="color:gray">2019-01-13 00:00:00结束</span>
      </el-step>
    </el-steps> -->
    <div  class="margin-sides" style="font-size: 15px">
      <span style="color: red">注：</span>
      <span style="color: rgb(72,191,247)">老师在提交作业阶段可随时查看，可打回不满意的作业。<br>
          学生提交阶段结束后，老师无法再打回，只能评分评语。</span>
    </div>
    <div>
      <div style="float: right" class="margin-sides">
        <el-select v-model="filter.group" class="margin-sides">
          <el-option v-for="(group, index) in groups" :key="index" :label="group.name" :value="group.value">
          </el-option>
        </el-select>
        <el-select v-model="filter.status" class="margin-sides">
          <el-option v-for="(group, index) in status" :key="index" :label="group.name" :value="group.value">
          </el-option>
        </el-select>
        <el-input suffix-icon="el-icon-search" style="width: 200px" placeholder="姓名/作业名称"></el-input>
        <el-button>搜索</el-button>
      </div>
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
  import adialog from '@/components/dialog'
  import {homeWorkList} from '@/api/course'
  export default {
    data() {
      return {
        tables:[
          {
            name:'作业名称',
            prop:'title',
          },
          {
            name:'状态',
            prop:'interactionStatus',
          },
          {
            name:'提交截止时间',
            prop:'expireTime',
          },
          {
            name:'已提交/应提交/待批阅',
            prop:'submitStatus',
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
            type:'mark',
          },
        ],

        filter: {
          group: '',
          status: ''
        },
        groups: [
          {
            name: '第一小组',
            value: '1',
            member: [
              {
                name: '小明',
                status: 1
              },
            ]
          }
        ],
        status: [
          {
            name: '待批改',
            value: 1
          },
          {
            name: '已批改',
            value: 2
          }
        ],
        dialogConfig: {
            btnShow: true,
            title: '查看笔记',
            width: '40',
            labelWidth: '120',
            top: '20',
            inputWidth: '70',
            eventType: ''
        }, 
      }
    },
    created(){
      this.$emit('teachingNav','operation')
    },
    mounted() {
      homeWorkList({courseId:this.$route.query.id})
      .then(response=> {
        response.data.pageData.forEach(element=> {
          switch (element.interactionStatus) {
            case 10:
              element.interactionStatus = '已开始'
              break;
            case 20:
              element.interactionStatus = '未开始'
              break;
            case 30:
              element.interactionStatus = '已结束'
              break;
            default:
              break;
          }
          element.submitStatus = `${element.submitCount}/${element.allCount}/${element.notReviewCount}`
        })
        this.tableData = response.data.pageData
        console.log(this.tableData)
      })

    },
    components: {
      tableNoHeader,
      adialog
    },
    methods: {
      showComponentInfo(...params) {
        let type = params[0]
        console.log(params[1])
        switch (type) {
          case 'mark':
            this.$router.push({path: '/course/list/teach/homeworkdetail', query: {id: this.$route.query.id, homeworkId: params[1].homeworkId}})
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

