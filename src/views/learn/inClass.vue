<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-select
        filterable
        v-model="course"
        placeholder="请选择">
        <el-option
          v-for="item in courseList"
          :key="item.courseId"
          :label="item.courseName"
          :value="item.courseId">
        </el-option>
      </el-select>
      <span style="margin-left: 40px">成员人数：{{this.userCount}}人</span>
    </div>
    <div>
      <span>时间：</span>
      <el-radio-group v-model="beforeDate" @change="changeDate">
        <el-radio-button :label="7">7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        style="margin-left: 40px"
        v-model="date"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd 00:00:00"
        type="daterange"
        range-separator="至"
        :picker-options="pickerOptions"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <br>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="关键指标" disabled name="first"></el-tab-pane>
      <el-tab-pane label="课堂行为" name="second">
        <!--为echarts准备一个具备大小的容器dom-->
        <div id="chart1" style="height: 400px;" v-show="isChart1"></div>
        <div style="height: 400px;" v-show="isChart1Data">
          <div style="font-size:18px;font-weight: bold;display:inline-block; margin-bottom: 20px">┃课堂行为参与率</div>
          <div style="height: 200px;width: 200px;margin: 0 auto;margin-top:50px;">
            <img :src="require('@/assets/images/noData.png')" style="height: inherit;" alt="">
          </div>
        </div>
        <span style="font-size:18px;font-weight: bold;display:inline-block; margin-bottom: 20px">┃详细数据</span>
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            label="授课时间"
            width="120">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.staticsDate.slice(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="签到比例">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.signRate}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="测验参与率">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.examRate}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="头脑风暴参与率">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.stormRate}}%</span>
            </template>
          </el-table-column>
          <el-table-column label="投票参与率">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.voteRate}}%</span>
            </template>
          </el-table-column>
          <el-table-column
            label="授课时长"
            width="120">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{mTran(scope.row.classTime)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="margin-top: 20px;text-align: center"
          @size-change="behPageChange"
          @current-change="behPageChange"
          :current-page.sync="behPage.pageIndex"
          layout="prev, pager, next, jumper"
          :total="behPage.totalPage">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="学情质量" name="third">
        <!--为echarts准备一个具备大小的容器dom-->
        <div id="chart2" style="width: 1000px;height: 400px;" v-if="isChart2"></div>
        <div style="height: 400px;" v-show="isChart2Data">
          <div style="font-size:18px;font-weight: bold;display:inline-block; margin-bottom: 20px">┃学情质量</div>
          <div style="height: 200px;width: 200px;margin: 0 auto;margin-top:50px;">
            <img :src="require('@/assets/images/noData.png')" style="height: inherit;" alt="">
          </div>
        </div>
        <span style="font-size:18px;font-weight: bold;display:inline-block; margin-bottom: 20px">┃详细数据</span>
        <el-table
          :data="tableData1"
          border
          style="width: 100%">
          <el-table-column
            label="授课时间"
            width="120">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.staticsDate.slice(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课堂平均分">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.classroomAverage}}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试平均分">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.examAverage}}</span>
            </template>
          </el-table-column>
          <el-table-column label="头脑风暴平均分">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.stormAverage}}</span>
            </template>
          </el-table-column>
          <el-table-column label="投票平均分">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.voteAverage}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--label="授课时长"-->
            <!--width="120">-->
            <!--<template slot-scope="scope">-->
              <!--<span style="margin-left: 10px">{{mTran(scope.row.classTime)}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>

        <el-pagination
          background
          style="margin-top: 20px;text-align: center"
          @size-change="analysisChange"
          @current-change="analysisChange"
          :current-page.sync="Analysis.pageIndex"
          layout="prev, pager, next, jumper"
          :total="Analysis.totalPage">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <br>
  </div>
</template>
<script>
import echarts from "echarts";
import tableNoHeader from "@/components/table-no-header.vue"
import {myCourseList, courseBaseInfo} from '@/api/course'
import {classBehavior,studyAnalysis} from '@/api/study'
import {getBeforeDate, formatTime} from "../../utils/utils";

export default {
  name: "",
  data() {
    return {
      activeName: 'second',
      course:'',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      userCount:0,
      courseList:'',
      date:'',
      beforeDate:7,
      tables1: [
        {
          name: "授课时间",
          prop: "title"
        },
        {
          name: "测验平均分",
          prop: "reviewStatus"
        },
        {
          name: "头脑风暴平均分",
          prop: "teamName"
        },
        {
          name: "投票平均分",
          prop: "createTime"
        },
        {
          name: "课堂平均分",
          prop: "createTime"
        },
        {
          name: "授课时长",
          prop: "createTime"
        }
      ],
      tableData: [
        {
          title: "数据待填充",
        },
        {
          title: "数据待填充",
        }
      ],
      isChart1:true,
      isChart1Data:false,
      isChart2:true,
      isChart2Data:false,
      behPage:{
        currentPage:1,
        totalPage:1,
        pageIndex:1
      },
      Analysis:{
        currentPage:1,
        totalPage:1,
        pageIndex:1
      },
      tableData1: []
    };
  },
  mounted() {
    //获取前七天的数据
    this.changeDate(7)
    // this.getBehaviorData()
  },
  created () {
    this.myCourseData()
  },
  watch: {
    date: function (newdata) {
      if(this.course){
        let data = {
          courseId:this.course,
          startTime: this.date[0],
          endTime: this.date[1]
        }
        this.activeName === 'second' ? this.getBehaviorData() : this.getAnalysisData()
      }
    },
    course: function () {
      let data = {
        courseId:this.course,
        startTime: this.date[0],
        endTime: this.date[1]
      }
      courseBaseInfo(this.course).then(res=>{
        this.userCount = res.data.userCount
      })
      this.activeName === 'second' ? this.getBehaviorData() : this.getAnalysisData()
    }
  },
  methods: {
    //改变时间段
    changeDate(n){
      let data = getBeforeDate(n-1)
      this.date = [data.beforeTime,data.nowTime]
    },
    //授课时长秒速转换
    mTran(time){
      return formatTime(time)
    },
    myCourseData(name){
      name = name || ''
      let data = {
        "courseName": name,
        "pageParam": {
          "pageIndex": 1,
          "pageSize": 1000
        }
      }
      myCourseList(data).then(res=>{
        this.courseList =[];
        res.data.pageData.forEach((item)=>{
          item.courseStatus == 30 ? this.courseList.push(item) : '';
        })
        this.course = this.courseList[0].courseId
        return this.courseList[0].courseId
      }).then(courseId =>{
        //根据课程ID获取课程成员人数
        courseBaseInfo(courseId).then(res=>{
          this.userCount = res.data.userCount
        })
      }).catch(err=>{
        console.log(err)
      })
    },
    //课堂行为数据获取
    getBehaviorData(pageIndex){
      let data = {
        "courseId" : this.course,
        "startTime" : this.date[0],
        "endTime": this.date[1],
        "pageParam": {
          "pageIndex": pageIndex || 1,
          "pageSize": 5,
        },
      }
      classBehavior(data)
        .then(res=>{
          this.tableData = res.data.pageData
          this.behPage.totalPage = res.data.totalPage * 10
          return res.data.pageData
      })
      .then(data=>{
        if (data.length == 0){
          this.isChart1 = false
          this.isChart1Data = true
        }else{
          let XData = [],
            YData = {
              sign:[],
              vote:[],
              exam:[],
              storm:[]
            };
          data.forEach(item=>{
            XData.push(item.staticsDate.slice(0,10))
            YData.sign.push(item.signRate)
            YData.storm.push(item.stormRate)
            YData.exam.push(item.examRate)
            YData.vote.push(item.voteRate)
          })
          this.drawBehavior(XData,YData)
          this.isChart1 = true
          this.isChart1Data = false
        }
    })
    .catch(err=>{
      console.log(err)
    })
    },
    //教学质量数据
    getAnalysisData(pageIndex){
      let data = {
        "courseId" : this.course,
        "startTime" : this.date[0],
        "endTime": this.date[1],
        "pageParam": {
          "pageIndex": pageIndex || 1,
          "pageSize": 5,
        },
      }
      studyAnalysis(data).then(res=>{
      this.tableData1 = res.data.pageData
      this.Analysis.totalPage = res.data.totalPage * 10
      return res.data.pageData
    })
      .then(data=>{
        console.log(Boolean(data.length))
        if (data.length == 0){
          this.isChart2 = false
          this.isChart2Data = true
          console.log('isChart2Data',this.isChart2Data)
        }else{
          let XData = [],
            YData = {
              classroom:[],
              vote:[],
              exam:[],
              storm:[]
            };
          data.forEach(item=>{
            XData.push(item.staticsDate.slice(0,10))
            YData.classroom.push(item.classroomAverage)
            YData.storm.push(item.stormAverage)
            YData.exam.push(item.examAverage)
            YData.vote.push(item.voteAverage)
          })
          this.drawAnalysis(XData,YData)
          this.isChart2 = true
          this.isChart2Data = false
          console.log('isChart2Data',this.isChart2Data)
        }
    })
      .catch(err=>{
      console.log(err)
    })
    },
    behPageChange(page){
      this.getBehaviorData(page)
    },
    analysisChange(page){
      this.getAnalysisData(page)
    },
    drawBehavior(X,Y) {
      this.charts = echarts.init(document.getElementById('chart1'));
        this.charts.setOption({
        title: {
          text: "┃课堂行为参与率"
        },
        tooltip: {
          // trigger: 'axis'
        },
        toolbox: {
          feature: {
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: X
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          boundaryGap: false,
          axisLabel: {
            formatter: '{value} %',
            fontFamily: 'Arial',
          },
        },
        series: [
          {
            name: "签到",
            type: "line",
            data: Y.sign,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "测试",
            type: "line",
            data: Y.exam,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "头脑风暴",
            type: "line",
            data: Y.storm,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "投票",
            type: "line",
            data: Y.vote,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ],
        legend: {
          data: ["签到", "测试", "头脑风暴", "投票"]
        }
      });
    },
    drawAnalysis(X,Y) {
      this.charts = echarts.init(document.getElementById('chart2'));
      this.charts.setOption({
        title: {
          text: "┃学情质量"
        },
        toolbox: {
          feature: {
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: X
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          boundaryGap: false,
          axisLabel: {
            // formatter: '{value} %',
            fontFamily: 'Arial',
          },
        },
        series: [
          {
            name: "课堂平均分",
            type: "line",
            data: Y.classroom,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "测试平均分",
            type: "line",
            data: Y.exam,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "头脑风暴平均分",
            type: "line",
            data: Y.storm,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "投票平均分",
            type: "line",
            data: Y.vote,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ],
        legend: {
          data: ["课堂平均分", "测试平均分", "头脑风暴平均分", "投票平均分"]
        }
      });
    },
    handleClick(tab) {
      if(tab.paneName === 'second'){
        this.getBehaviorData()
      }else{
        this.getAnalysisData()
      }
    }
  },
  components: {
    tableNoHeader
  }
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>