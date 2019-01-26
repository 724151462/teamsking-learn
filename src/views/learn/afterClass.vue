<template>
  <div class="after-class">
    <div style="margin-bottom: 20px">
      <el-select>
        <el-option>123</el-option>
      </el-select>
      <span>成员人数：65人</span>
    </div>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="studyLong" style="width: 400px;height:400px;"></div>
    <p>其他统计</p>
    <div id="studyOther" style="min-height: 400px"></div>
  </div>
</template>

<script>
  import echarts from "echarts";
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
      ]
    };
  },
  mounted() {
    this.chartInit()
    this.otherInit()

  },
  created () {
  },
  methods: {
    testInit(){

    },
    chartInit () {
      var myChart = echarts.init(document.getElementById('studyLong'));
      // 指定图表的配置项和数据
      var option = {
        title : {
          text: '课后学习时长',
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问','邮件营销','联盟广告']
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
              {value:335, name:'直接访问'},
              {value:310, name:'邮件营销'},
              {value:234, name:'联盟广告'},
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    otherInit (){
      let plantCap = this.planCap
      var datalist = [{
        offset: [56, 48],
        symbolSize: 120,
        opacity: .95,
        color: '#f467ce'
      }, {
        offset: [35, 80],
        symbolSize: 100,
        opacity: .88,
        color: '#7aabe2'
      }, {
        offset: [0, 0],
        symbolSize: 100,
        opacity: .84,
        color: '#ff7123'
      }, {
        offset: [68, 30],
        symbolSize: 100,
        opacity: .8,
        color: '#ffc400'
      }, {
        offset: [36, 20],
        symbolSize: 100,
        opacity: .75,
        color: '#5e333f'
      }, {
        offset: [64, 10],
        symbolSize: 100,
        opacity: .7,
        color: '#6b3442'
      }, {
        offset: [75, 75],
        symbolSize: 100,
        opacity: .68,
        color: '#8a3647'
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
      console.log(datas)
      var option = {
        grid: {
          show: true,
        },
        xAxis: [{
          gridIndex: 0,
          type: 'value',
          show: true,
          min: 0,
          max: 100,
          nameLocation: 'middle',
          nameGap: 5
        }],
        yAxis: [{
          gridIndex: 0,
          min: 0,
          show: true,
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
    }
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
