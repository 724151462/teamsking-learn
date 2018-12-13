<template>
    <div>
      <div style="text-align: right;padding-top: 10px;padding-bottom: 10px;">
        <el-button type="success">导出excel</el-button>
      </div>
      <itemTable :tableData="tableData" :tables="tables" :buttonStylus="tableStylus" @showComponentInfo="showComponentInfo"></itemTable>
      <el-dialog
          :visible.sync="isDialog"
          width="60%"
          title="投票结果">

        <div class="main">
          <div class="header-container">
            <div>
                <img :src="require('@/assets/images/vote.png')" alt="">
                <span style="margin: 0 20px 0 10px">投票进度</span>
                <span>共1道题 | 50人作答</span>
            </div>
          </div>
          <span style="color:rgb(130,178,198);float: right;margin-right:100px">提示：按照提交顺序排序</span>
          <div style="margin-top: 20px">
              <span>题目1：在以下能有效防控欠款产生的措施中，。。。。。。</span>
              <span style="color:rgb(130,178,198)">(单选题)</span>
          </div>
          <div class="answer-container">
              <div class="answer-item">
                  <span>A.啊啊啊啊啊啊啊啊啊啊啊</span>
                  <div>
                      <el-progress :text-inside="true" class="progress" :stroke-width="18" :percentage="20"></el-progress>
                      <span style="margin-left: 5px;color:rgb(130,178,198)">25人</span>
                  </div>
              </div>
              
          </div>
        </div>
    </el-dialog>
    </div>
</template>

<script>
  import itemTable from '@/components/table-no-header.vue'
  export default {
    components:{
      itemTable
    },
    data(){
      return{
        tables:[
          {
            name:'题目',
            prop:'title'
          },
          {
            name:'所属章',
            prop:'center'
          },
          {
            name:'状态',
            prop:'fbr'
          },
          {
            name:'已作答/应作答',
            prop:'time'
          },
          {
            name:'截止时间',
            prop:'time'
          },
          
        ],
        tableData:[
          {
            title:'投票问卷1',
            center:'所属章',
            fbr:'状态超好',
            time:'5/4'
          },
          {
            title:'投票问卷1',
            center:'所属章',
            fbr:'状态超好',
            time:'5/4'
          },
          {
            title:'投票问卷1',
            center:'所属章',
            fbr:'状态超好',
            time:'5/4',
          },
        ],
        tableStylus:[
          {
            name:'查看详情',
            type:'detail'
          }
        ],
        isDialog:false,
        addUp:{
          title:'',
          center:''
        }
      }
    },
    created(){
      this.$emit('teachingNav','questionnaire')
    },
    methods:{
      showComponentInfo(e){
        switch (e) {
          case 'detail':
            this.isDialog = true
            break;
        
          default:
            break;
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
.header-container
    display flex
    height 50px
    justify-content space-between
    padding 10px 20px
    div
        display flex
        align-items center
    img 
        width 30px
        height 30px
  .main
      width 96%;
      margin 10px auto
      padding 30px
      background rgb(247,248,250)
  .answer-container
      margin 20px auto
      .progress
          width: 300px; display: inline-block
      .answer-item
          display flex
          justify-content space-between
          width 90%
          margin 0 auto
</style>
