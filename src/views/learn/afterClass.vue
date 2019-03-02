<template>
  <div class="after-class">
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
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd 00:00:00"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <br>
    <div id="afterLean" style="min-height:400px;margin-bottom: 40px;"></div>
    <br>
    <div id="afterNum" style="min-height:400px;margin-bottom: 40px;"></div>
    <br>
    <div id="studyLong" style="min-height:400px;margin-bottom: 40px;"></div>
    <br>
    <div id="studyOther" style="min-height: 400px;margin-bottom: 40px;"></div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import {getBeforeDate, formatDate} from "../../utils/utils";
  import {afterOther, timeBucketOther, leanRate} from '@/api/study'
  import {myCourseList, courseBaseInfo} from '@/api/course'
  export default {
  data() {
    return {
      id: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      course:'',
      userCount:0,
      courseList:'',
      date:'',
      endTime:'',
      beforeDate:7,
      studyTime:{
        zeroPoint: 0,
        onePoint: 5,
        twoPoint: 0,
        threePoint: 3,
        fourPoint: 0,
        fivePoint: 2,
        sixPoint: 0,
        sevenPoint: 0,
        eightPoint: 0,
        ninePoint: 0,
        tenPoint: 0,
        elevenPoint: 0,
        twelvePoint: 0,
        thirteenPoint: 0,
        fourteenPoint: 5,
        fifteenPoint: 0,
        sixteenPoint: 0,
        seventeenPoint: 0,
        eighteenPoint: 1,
        nineteenPoint: 0,
        twentyPoint: 2,
        twentyOnePoint: 0,
        twentyTwoPoint: 0,
        twentyThreePoint: 0,
      },
      learn:{
        studyDocCount:[],
        studyDocRate:[],
        studyVideoDuration:[],
        studyVideoRate:[]
      },
      other:{
        docWatchCount: 0,//文档资源观看
        loginCount: 0,
        noteRate: 0,
        studyBehaviorthRate: 0,
        studyLengthRate: 0,
        videoCount: 0,
        //docWatchCount: 2,//教案观看
        // libraryCount: 2,  //人均参加活动
        // loginCount: 3,  //登录次数
        // noteRate: 1900,  //人均笔记
        // studyBehaviorthRate: 0, // 人均日行为
        // studyLengthRate: 13,  //人均学习时长
      }
    };
  },
  mounted() {
    //获取前七天的数据
    //this.changeDate(7)
  },
  created () {
    this.myCourseData()
  },
  watch: {
    date: function (newdata) {
      let data = {
        courseId:this.course,
        startTime: this.date[0],
        endTime: this.date[1]
      }
      this.learnRateData(data)
      this.otherData(data)
      this.timeBucketData(data)
    },
    course: function (newData) {
      let data = {
        courseId:this.course,
        startTime: this.date[0],
        endTime: this.date[1]
      }
      courseBaseInfo(this.course).then(res=>{
        this.userCount = res.data.userCount
        return res.data.endTime
      })
        .then((endTime)=>{
        let end = new Date(endTime).getTime();
        if (end < Date.now()){
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() > end;
            }
          }
          end = end - 1000 * 60 * 60 * 24 * 1
          let beforeMs = end - 1000 * 60 * 60 * 24 * parseInt(6)
          this.date = [formatDate(beforeMs),formatDate(end)]
        }else{
          this.changeDate(7)
        }
      })
    }
  },
  methods: {
    //改变时间段
    changeDate(n){
      let data = getBeforeDate(n-1)
      this.date = [data.beforeTime,data.nowTime]
    },
    learnChartInit(){
      let myChart = echarts.init(document.getElementById('afterLean'));
      let timeData = [], //横轴数据
        studyDocRate=[],  //视频观看进度
        studyVideoRate=[]; //文档观看进度
      this.learn.studyDocRate.forEach(item=>{
        let date =  Object.keys(item)[0]
        studyDocRate.push(Number(Object.values(item)[0]))
        timeData.push(Object.keys(item)[0].substring(0,10))
      })
      this.learn.studyVideoRate.forEach(item=>{
        studyVideoRate.push(Number(Object.values(item)[0]))
      })
      let option = {
        title: {
          text: '课后平均学习度'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['文档观看进度','视频观看进度',]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
        },
        series: [
          {
            name:'文档观看进度',
            type:'line',
            data:studyDocRate
          },
          {
            name:'视频观看进度',
            type:'line',
            data:studyVideoRate
          }
        ]
      };
      myChart.setOption(option);
    },
    numChartInit(){
      let myChart = echarts.init(document.getElementById('afterNum'));

      let timeData = [], //横轴数据
        minMAxArr = [],
        yMin = 0,   //Y轴数据
        yMax= 0 ,   //Y轴数据
        studyDocNum=[],  //视频观看进度
        studyVideoNum=[]; //文档观看进度
      //计算Y轴的最大，最小值
      this.learn.studyDocCount.forEach(item=>{
        studyDocNum.push(Number(Object.values(item)[0]))
        minMAxArr.push(Number(Object.values(item)[0]))
        timeData.push(Object.keys(item)[0].substring(0,10))
      })
      this.learn.studyVideoDuration.forEach(item=>{
        minMAxArr.push(Number(Object.values(item)[0]))
        studyVideoNum.push(Number(Object.values(item)[0]))
      })
      //对数组进行排序，取出最大值和最小值填充到Y轴
      minMAxArr.sort((a,b)=> {return a - b})
      yMin = minMAxArr[0]
      yMax = minMAxArr[minMAxArr.length-1]

      let option = {
        title: {
          text: '课后平均学习量'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['文档观看次数','视频观看次数',]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
          data: timeData
        },
        yAxis: {
          type: 'value',
          min: yMin,
          max: yMax,
        },
        series: [
          {
            name:'文档观看次数',
            type:'line',
            data:studyDocNum
          },
          {
            name:'视频观看次数',
            type:'line',
            data:studyVideoNum
          }
        ]
      };
      myChart.setOption(option);
    },
    //学习时段图表
    timeBucketChartInit () {
      let myChart = echarts.init(document.getElementById('studyLong'));
      let seriesData = [],
        timeArr = [],
        yMin = 0,
        yMax = 0;
      seriesData = Object.keys(this.studyTime)
      timeArr =  Object.values(this.studyTime)
      //对数组进行排序，取出最大值和最小值填充到Y轴
      timeArr.sort((a,b)=> {return a - b})
      yMin = timeArr[0]
      yMax = timeArr[timeArr.length-1]
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: '学习时段'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['学习时段']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
          data: ['0:00', '1:00','2:00','3:00','4:00','5:00','6:00',
                  '7:00','8:00','9:00','10:00','11:00','12:00',
                  '13:00','14:00','15:00','16:00','17:00','18:00',
                  '19:00','20:00','21:00','22:00','23:00']
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          min: yMin,
          max: yMax,
          data: [0, 10,20,30,40,50,60]
        },
        series: [{
          name:'学习时段',
          data: [this.studyTime.zeroPoint,
            this.studyTime.onePoint,this.studyTime.twoPoint,this.studyTime.threePoint,this.studyTime.fourPoint,
            this.studyTime.fivePoint,this.studyTime.sixPoint,this.studyTime.sevenPoint,this.studyTime.eightPoint,
            this.studyTime.ninePoint,this.studyTime.tenPoint,this.studyTime.elevenPoint,this.studyTime.twelvePoint,
            this.studyTime.thirteenPoint,this.studyTime.fourteenPoint,this.studyTime.fifteenPoint,this.studyTime.sixteenPoint,
            this.studyTime.seventeenPoint,this.studyTime.eighteenPoint,this.studyTime.nineteenPoint,this.studyTime.twentyPoint,
            this.studyTime.twentyOnePoint,this.studyTime.twentyTwoPoint,this.studyTime.twentyThreePoint
          ],
          type: 'line'
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //其它统计的图表init
    otherChartInit (){
      let colorArr1=['rgb(241, 86, 85)','rgb(24, 207, 202)','#447eda'],
        colorArr2=['#F4A460','#F4A460','#800000','#C0C0C0','#FF6347'],
        colorArr3=['#00FFFF','#00FF7F','#006400','#FFD700','#DAA520'],
        colorArr4=[],
        colorArr5=[],
        colorArr6=['#FFC125','#FFC0CB','#FFBBFF','#FFB90F','rgb(252, 134, 64)'];

      let plantCap =[
        {
          name: '人均学习时长',
          value: this.other.studyLengthRate
        }, {
          name: '人均笔记数',
          value: this.other.noteRate
        }, {
          name: '登录次数',
          value: this.other.loginCount
        }, {
          name: '视频资源观看次数',
          value: this.other.videoCount
        }, {
          name: '文档资源观看次数',
          value: this.other.docWatchCount
        }, {
          name: '人均日行为学习数',
          value: this.other.studyBehaviorthRate
        }
      ]
      //圆球偏移,大小，在一定范围内随机
      let datalist = [
      {//人均学习
        offset: [Math.random() * 10 , Math.random() * (65 - 60) + 60],
        symbolSize: Math.random() * (180 - 120) + 120,
        opacity: 1,
        color: colorArr1[Math.floor(Math.random() * 3-1)]
      },
      {//人均笔记
        offset: [Math.random() * (45 - 35) + 35, Math.random() * (90 - 80) + 80],
        symbolSize: 90,
        opacity: 1,
        color: colorArr2[Math.floor(Math.random() * 5-1)]
      },
        {
        //登录次数
        offset: [Math.random() * (75 - 60) + 60, Math.random() * (85 - 85) + 70],
        symbolSize: Math.random() * (110 - 90) + 90,
        opacity: 1,
        color: colorArr3[Math.floor(Math.random() * 5-1)]
      },
        {
        //视频资源
        offset: [Math.random() * (35 - 25) + 25, Math.random() * (38 - 30) + 30],
        symbolSize:  Math.random() * (150 - 140) + 140,
        color: 'rgb(97, 200, 127)'
      },
        {
        //教案资源观看
        offset: [50, 15],
        symbolSize: 100,
        color: 'rgb(112, 83, 182)'
      },
        {
        //人均日学习
        offset: [75, Math.random() * 35],
        symbolSize: 120,
        color: colorArr6[Math.floor(Math.random() * 5-1)]
      }
      ];
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
        title: {
          text: '其它统计'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
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
    /*******
     * ↓ ↓ ↓数据获取
     * *****/
    //获取我可以管理的课程列表
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
    //课后平均学习数据
    learnRateData(data){
      leanRate(data).then(res=>{
        // console.log('课后平均学习度',res.data)
        this.learn = res.data
        // console.log(res)
          this.learnChartInit()
          this.numChartInit()
      }).catch((err)=>{
        console.log(err)
      })
    },
    //学习时段
    timeBucketData(data){
      timeBucketOther(data).then(res=>{
        console.log('学习时段',res.data)
        delete res.data.cmpTime
        delete res.data.courseId
        delete res.data.courseUserCount
        delete res.data.tstudyDaytimeId
        delete res.data.staticsDate

        this.studyTime = res.data
        this.timeBucketChartInit()
      }).catch((err)=>{
      })
    },
    //获取其它行为的统计数据
    otherData(data){
      // let data = {
      //   "courseId": "0608367675f54267aa6960fd0557cc1b",
      //   "endTime": "2019-01-26 07:23:51",
      //   "startTime": "2019-01-23 07:23:51"
      // }
      afterOther(data).then(res=>{
        // console.log('其它行为',res)
        this.other = res.data
        this.otherChartInit()
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
