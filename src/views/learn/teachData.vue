<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="关键指标" name="first">
        <!--为echarts准备一个具备大小的容器dom-->
        <div id="chart1" style="width: 1000px;height: 400px;"></div>
        <span style="font-size:18px;font-weight: bold;display:inline-block; margin-bottom: 20px">┃详细数据</span>
        <tableNoHeader
          :tableData="tableData"
          :tables="tables"
        ></tableNoHeader>
      </el-tab-pane>
      <el-tab-pane label="课堂行为" name="second">
        <div id="chart2" style="width: 1000px;height: 400px;"></div>
        <span style="font-size:18px;font-weight: bold;display:inline-block; margin-bottom: 20px">┃详细数据</span>
        <tableNoHeader
          :tableData="tableData1"
          :tables="tables1"
        ></tableNoHeader>
      </el-tab-pane>
      <el-tab-pane label="学情质量" name="third">学情质量</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import echarts from "echarts";
import tableNoHeader from "@/components/table-no-header.vue"
export default {
  name: "",
  data() {
    return {
      activeName: 'first',
      tables: [
        {
          name: "授课时间",
          prop: "title"
        },
        {
          name: "签到比例",
          prop: "userName"
        },
        {
          name: "测验参与率",
          prop: "reviewStatus"
        },
        {
          name: "头脑风暴参与率",
          prop: "teamName"
        },
        {
          name: "投票参与率",
          prop: "createTime"
        },
        {
          name: "抢答参与率",
          prop: "createTime"
        },
        {
          name: "授课时长",
          prop: "createTime"
        }
      ],
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
      tableData1: [
        {
          title: "数据待填充",
        },
        {
          title: "数据待填充",
        }
      ]

    };
  },
  methods: {
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id));
      if(id === 'chart1') {
        this.charts.setOption({
        title: {
          text: "┃趋势图"
        },
        tooltip: {},
        xAxis: {
          type: "",
          data: ["xx月xx日", "xx月xx日", "xx月xx日", "xx月xx日", "xx月xx日"]
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function(value) {
              // Function formatter
              return value + " %";
            }
          }
        },
        series: [
          {
            name: "投票",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "测试",
            type: "line",
            data: [1, -2, 2, 5, 3, 2, 0],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "头脑风暴",
            type: "line",
            data: [5, 3, 1, 2, 2, 6, 4],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "作业",
            type: "line",
            data: [6, 5, 3, 7, 4, 5, 6],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ],
        legend: {
          data: ["投票", "测试", "头脑风暴", "作业"]
        }
      });
      }else if (id === 'chart2') {
        this.charts.setOption({
        title: {
          text: "┃趋势图"
        },
        tooltip: {},
        xAxis: {
          type: "",
          data: ["图2 xx月xx日", "xx月xx日", "xx月xx日", "xx月xx日", "xx月xx日"]
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "投票",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10],
            // // 显示某个点
            // markPoint : {
            //     data : [
            //         {type : 'max', name: '最大值'},
            //         {type : 'min', name: '最小值'}
            //     ]
            // },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "投票平均分",
            type: "line",
            data: [1, -2, 2, 5, 3, 2, 0],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "测试平均分",
            type: "line",
            data: [5, 3, 1, 2, 2, 6, 4],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "作业平均分",
            type: "line",
            data: [6, 5, 3, 7, 4, 5, 6],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "作业平均分",
            type: "line",
            data: [5, 7, 5, 3, 5, 6, 7],
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ],
        legend: {
          data: ["投票平均分", "测试平均分", "头脑风暴平均分", "作业平均分", "课堂平均分"]
        }
      });
      }
      
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  //调用
  mounted() {
    this.$nextTick(function() {
      this.drawLine("chart1");
    });
    this.$nextTick(function() {
      this.drawLine("chart2");
    });
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