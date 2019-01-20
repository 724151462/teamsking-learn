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
      <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
        <el-input label="搜索" style="width:30%;margin-right:10px" v-model="vDetailParams.realName" placeholder="输入学生姓名"></el-input>
        <el-button @click="searchStu">查找</el-button>
      </div>
      <jiaTable
      :tableTitle="tableTitle1"
      :tableOperate="tableOperates"
      :columnNameList="columnNameLists"
      :tableData="tableDatas"
    ></jiaTable>
    </el-dialog>
  </div>
</template>

<script>
import jiaTable from '@/components/table-wjx'
import {
  videoList,
  videoDetail
} from '@/api/course'
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
            prop:'vodeoName',
          },
          {
            name:'视频时长',
            prop:'videoLength'
          },
          {
            name:'学生平均观看进度',
            prop:"schedule",
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
            vodeoName:'序号',
            videoTime:'teacherName',
            schedule:50
          },
        ],
        columnNameLists:[
          {
            type:"index"
          },
          {

            name:'学生',
            prop:'realName',
          },
          {
            name:'观看进度',
            prop:'currentTime'
          },
          {
            name:'观看时长',
            prop:"schedule",
            progress: {}
          }
        ],
        operateLists:[

        ],
        tableOperates: null,
        isDialog: false,
        vDetailParams: {
          itemId: '',
          realName: ''
        }
      }
    },
    mounted() {
      videoList({courseId: this.$route.query.id})
      .then(response=> {
        response.data.pageData.forEach(element => {
          element.schedule = (element.schedule * 100).toFixed(2)
          element.videoLength = this.timeTransfer(element.videoLength)
        });
        this.tableData = response.data.pageData
      })
    },
    methods:{
      showComponentInfo(type,item) {
        switch (type) {
          case 'detail':
            this.vDetailParams.itemId = item.itemId
            videoDetail(this.vDetailParams)
            .then(response=> {
              response.data.forEach(element => {
                element.schedule = (element.schedule * 100).toFixed(2)
                element.currentTime = this.timeTransfer(element.currentTime)
              });
              this.tableDatas = response.data
              console.log(this.tableDatas)
            })
            this.isDialog = true
            break;
        
          default:
            break;
        }
      },
      timeTransfer(s) {
        var t;
        if (s > -1) {
          var hour = Math.floor(s / 3600);
          var min = Math.floor(s / 60) % 60;
          var sec = s % 60;
          if (hour < 10) {
            t =  hour + "小时";
          } else {
            t = hour + "小时";
          }

          // if (min < 10) {
          //   t += "0";
          // }
          t += min + "分";
          // if (sec < 10) {
          //   t += "分";
          // }
          t += sec + "秒";
        }
        return t;
      },
      searchStu() {
        videoDetail(this.vDetailParams)
        .then(response=> {
          response.data.forEach(element => {
            element.schedule = Number((element.schedule * 100).toFixed(2))
            element.currentTime = this.timeTransfer(element.currentTime)
          });
          this.tableDatas = response.data
        })
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
