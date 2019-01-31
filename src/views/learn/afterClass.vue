<template>
  <div class="after-class">
    <div style="margin-bottom: 20px">
      <el-select>
        <el-option>123</el-option>
      </el-select>
      <span>成员人数：65人</span>
    </div>
    <div id="afterLean" style="min-height:400px;margin-bottom: 40px;"></div>
    <p></p>
    <div id="afterNum" style="min-height:400px;margin-bottom: 40px;"></div>
    <p>学习时段</p>
    <div id="studyLong" style="min-height:400px;margin-bottom: 40px;"></div>
    <p>其他统计</p>
    <div id="studyOther" style="min-height: 400px;margin-bottom: 40px;"></div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import {afterOther, timeBucketOther, leanRate} from '@/api/study'
  import {myCourseList} from '@/api/course'
  export default {
  data() {
    return {
      id: "",
      //其它统计的数据初始化
      planCap:[
        {
          name: '人均学习时长',
          value: '222'
        }, {
          name: '人均笔记数',
          value: '115'
        }, {
          name: '登录次数',
          value: '113'
        }, {
          name: '人均参加活动次数',
          value: '100'
        }, {
          name: '作业完成次数',
          value: '100'
        }, {
          name: '教案资源观看次数',
          value: '100'
        }, {
          name: '人均日行为学习数',
          value: '100'
        }
      ],
      studyTime:{
        "zeroPoint": 0,
        "onePoint": 5,
        "twoPoint": 0,
        "threePoint": 3,
        "fourPoint": 0,
        "fivePoint": 2,
        "sixPoint": 0,
        "sevenPoint": 0,
        "eightPoint": 0,
        "ninePoint": 0,
        "tenPoint": 0,
        "elevenPoint": 0,
        "twelvePoint": 0,
        "thirteenPoint": 0,
        "fourteenPoint": 5,
        "fifteenPoint": 0,
        "sixteenPoint": 0,
        "seventeenPoint": 0,
        "eighteenPoint": 1,
        "nineteenPoint": 0,
        "twentyPoint": 2,
        "twentyOnePoint": 0,
        "twentyTwoPoint": 0,
        "twentyThreePoint": 0,
      },
      learn:[{
        studyDocCount:[],
        studyDocRate:[],
        studyVideoDuration:[],
        studyVideoRate:[]
      }],
      other:{
        docWatchCount: 0,  //教案观看
        libraryCount: 2,  //人均参加活动
        loginCount: 3,  //登录次数
        noteRate: 1900,  //人均笔记
        studyBehaviorthRate: 0, // 人均日行为
        studyLengthRate: 13,  //人均学习时长
      }
    };
  },
  mounted() {
    //初始化图表
    this.numChartInit()
    this.otherChartInit()
    this.timeBucketChartInit()
  },
  created () {
    this.myCourseData()
    this.learnRateData()
    //获取图表的数据
    this.otherData()
    this.timeBucketData()
  },
  methods: {
    learnChartInit(){
      let myChart = echarts.init(document.getElementById('afterLean'));
      let timeData = [], //横轴数据
        studyDocRate=[],  //视频观看进度
        studyVideoRate=[]; //文档观看进度
      this.learn[0].studyDocRate.forEach(item=>{
        let date =  Object.keys(item)[0]
        studyDocRate.push(Object.values(item)[0])
        timeData.push(Object.keys(item)[0].substring(0,10))
      })
      this.learn[0].studyVideoRate.forEach(item=>{
        studyVideoRate.push(`${Object.values(item)[0]}`)
      })
      let option = {
        title: {
          text: '课后平均学习度'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['视频观看进度','文档观看进度']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeData
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
          // nameTextStyle:{
          //   fontStyle:'italic',
          //   fontFamily:'monospace',
          // },
        },
        series: [
          {
            name:'视频观看进度',
            type:'line',
            stack: '总量',
            data:studyVideoRate
          },
          {
            name:'文档观看进度',
            type:'line',
            stack: '总量',
            data:studyDocRate
          },
        ]
      };
      myChart.setOption(option);
    },
    //
    numChartInit(){
      let myChart = echarts.init(document.getElementById('afterNum'));

      let option = {
        title: {
          text: '课后平均学习量'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'邮件营销',
            type:'line',
            stack: '总量',
            data:[120, 132, 101, 134, 90, 230, 210]
          },
          {
            name:'联盟广告',
            type:'line',
            stack: '总量',
            data:[220, 182, 191, 234, 290, 330, 310]
          },
          {
            name:'视频广告',
            type:'line',
            stack: '总量',
            data:[150, 232, 201, 154, 190, 330, 410]
          },
          {
            name:'直接访问',
            type:'line',
            stack: '总量',
            data:[320, 332, 301, 334, 390, 330, 320]
          },
          {
            name:'搜索引擎',
            type:'line',
            stack: '总量',
            data:[820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      };
      myChart.setOption(option);
    },
    //学习时段图表
    timeBucketChartInit () {
      let myChart = echarts.init(document.getElementById('studyLong'));
      let seriesData = []
      for(let i in this.studyTime) {seriesData.push(this.studyTime[i])}
      // 指定图表的配置项和数据
      let option = {
        xAxis: {
          type: 'category',
          data: ['0:00', '1:00','2:00','3:00','4:00','5:00','6:00',
                  '7:00','8:00','9:00','10:00','11:00','12:00',
                  '13:00','14:00','15:00','16:00','17:00','18:00',
                  '19:00','20:00','21:00','22:00','23:00','24:00']
        },
        yAxis: {
          type: 'category',
          data: [0, 10,20,30,40,50,60]
        },
        series: [{
          data: seriesData,
          type: 'line'
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //其它统计的图表init
    otherChartInit (){
      let plantCap = this.planCap
      //圆球偏移,大小，在一定范围内随机
      var datalist = [
      {//人均学习
        offset: [Math.random() * 5 , Math.random() * (65 - 60) + 60],
        symbolSize: Math.random() * (180 - 120) + 120,
        opacity: 1,
        color: '#447eda'
      },
      {//人均笔记
        offset: [Math.random() * (40 - 30) + 30, Math.random() * (90 - 80) + 80],
        symbolSize: 80,
        opacity: 1,
        color: 'rgb(244, 123, 193)'
      },
        {
        //登录次数
        offset: [Math.random() * (60 - 50) + 50, Math.random() * (85 - 70) + 70],
        symbolSize: Math.random() * (90 - 70) + 70,
        opacity: 1,
        color: 'rgb(110, 213, 230)'
      }, {
        //人均日学习
        offset: [80, 30],
        symbolSize: 100,
        opacity: .8,
        color: 'rgb(241, 86, 85)'
      }, {
        //作业完成次数
        offset: [25, 20],
        symbolSize: 160,
        color: 'rgb(97, 200, 127)'
      }, {
        //教案资源观看
        offset: [50, 15],
        symbolSize: 100,
        color: 'rgb(112, 83, 182)'
      }, {
        //人均参加活动
        offset: [75, 75],
        symbolSize: 120,
        color: 'rgb(252, 134, 64)'
      }];
      var datas = [];
      for (var i = 0; i < plantCap.length; i++) {
        var item = plantCap[i];
        var itemToStyle = datalist[i];
        datas.push({
          name: item.name + '\n' + item.value,
          value: itemToStyle.offset,
          symbolSize: itemToStyle.symbolSize,
          label: {
            normal: {
              textStyle: {
                fontSize: 11
              }
            }
          },
          itemStyle: {
            normal: {
              color: itemToStyle.color,
              opacity: itemToStyle.opacity
            }
          },
        })
      }
      var option = {
        grid: {
          show: false,
        },
        xAxis: [{
          gridIndex: 0,
          type: 'value',
          show: false,
          min: 0,
          max: 100,
          nameLocation: 'middle',
          nameGap: 5
        }],
        yAxis: [{
          gridIndex: 0,
          min: 0,
          show: false,
          max: 100,
          nameLocation: 'middle',
          nameGap: 30
        }],
        series: [{
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 120,
          label: {
            normal: {
              show: true,
              formatter: '{b}',
              color: '#fff',
              textStyle: {
                fontSize: '20'
              }
            },
          },
          itemStyle: {
            normal: {
              color: '#00acea'
            }
          },
          data: datas
        }]
      };
      var myChart = echarts.init(document.getElementById('studyOther'));
      myChart.setOption(option);
    },
    //获取我可以管理的课程列表
    /*******
     * ↓ ↓ ↓数据获取
     * *****/
    myCourseData(name){
      name = name || ''
      let data = {
        "courseName": name,
        "pageParam": {
          "pageIndex": 1,
          "pageSize": 10
        }
      }
      myCourseList(data).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    },
    learnRateData(courseId,startTime,endTime){
      let data = {
        "courseId": "0608367675f54267aa6960fd0557cc1b",
        "endTime": "2019-01-26 07:23:51",
        "startTime": "2019-01-23 07:23:51"
      }
      leanRate(data).then(res=>{
        this.learn = res.data
        console.log(res)
        this.learnChartInit()
      }).catch((err)=>{

      })
    },
    timeBucketData(courseId,startTime,endTime){
      let data = {
        "courseId": "0608367675f54267aa6960fd0557cc1b",
        "endTime": "2019-01-26 07:23:51",
        "startTime": "2019-01-23 07:23:51"
      }
      timeBucketOther(data).then(res=>{
        console.log(res)
      }).catch((err)=>{
      })
    },
    //获取其它行为的统计数据
    otherData(courseId,startTime,endTime){
      let data = {
        "courseId": "0608367675f54267aa6960fd0557cc1b",
        "endTime": "2019-01-26 07:23:51",
        "startTime": "2019-01-23 07:23:51"
      }
      afterOther(data).then(res=>{
        console.log(res)
      }).catch((err)=>{
      })
    },
  }
};
</script>

<style scoped lang="stylus" type="text/stylus" >
  .after-class
    .test-warp
      .left
        width: 50%
        display: inline-block;
        vertical-align: top;
        .item
          display inline-block
          position relative
          vertical-align top
          max-width 200px
          max-height 200px
          min-width 100px
          min-height 100px
          border-radius 50%
          margin 20px
        .study
          width 200px
          height: 200px
          background-color aqua
        .login
          background red
      .right
        width 50%
        display: inline-block;
        vertical-align: top;
        .item
          display inline-block
          position relative
          vertical-align top
          max-width 200px
          max-height 200px
          min-width 100px
          min-height 100px
          border-radius 50%
          margin 20px 20px
        .login
          background red

</style>
