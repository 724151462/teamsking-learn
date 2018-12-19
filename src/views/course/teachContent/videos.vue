<template>
  <div style="margin-top: 30px">
    <jiaTable
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></jiaTable>
    <el-dialog title="学生观看详情" :visible.sync="isDialog">
      <jiaTable
      :tableTitle="tableTitle1"
      :tableOperate="tableOperates"
      :columnNameList="columnNameLists"
      :tableData="tableDatas"
      @showComponentInfo="showComponentInfo"
    ></jiaTable>
    </el-dialog>
  </div>
</template>

<script>
import jiaTable from '@/components/table-wjx'
  export default {
    data() {
      return {
        tableTitle:"视频列表",
        tableTitle1:"学生列表",
        tableData:[
          {
            videoName:'序号',
            videoTime:'teacherName',
            progress:50
          },
        ],
        columnNameList:[
          {
            type:"index"
          },
          {

            name:'视频名称',
            prop:'videoName',
          },
          {
            name:'视频时长',
            prop:'videoTime'
          },
          {
            name:'学生平均观看进度',
            prop:"progress",
            progress: {}
          }
        ],
        operateList:[
          {
            content:'观看详情',
            type:'detail',
          },
        ],
        tableOperate:[],

        tableDatas:[
          {
            videoName:'序号',
            videoTime:'teacherName',
            progress:50
          },
        ],
        columnNameLists:[
          {
            type:"index"
          },
          {

            name:'学生',
            prop:'videoName',
          },
          {
            name:'观看进度',
            prop:'videoTime'
          },
          {
            name:'观看时长',
            prop:"progress",
            progress: {}
          }
        ],
        operateLists:[

        ],
        tableOperates: null,
        isDialog: false
      }
    },
    methods:{
      showComponentInfo(type) {
        switch (type) {
          case 'detail':
            this.isDialog = true
            break;
        
          default:
            break;
        }
      }
    },
    created(){
      this.$emit('teachingNav','videos')
    },
    components: {jiaTable}
  }
</script>

<style scoped>
</style>
