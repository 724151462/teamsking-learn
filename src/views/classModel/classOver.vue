<template>
  <div class="class-over">
    <el-header>
      <span class="course-name">{{courseName}}国际贸易</span>
      <div class="icon-div">
        <div class="icon-inner" @click="back" style="cursor: pointer;">
          <img :src="require('@/assets/images/over.png')" height="35px" alt="">
          <span >返回后台</span>
        </div>
      </div>
    </el-header>
    <div class="box-warp">
      <div class="box-item">
        <div>
          <img :src="require('@/assets/images/over.png')" height="35px" alt="">
        </div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div>
          <img :src="require('@/assets/images/over.png')" height="35px" alt="">
        </div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div><img :src="require('@/assets/images/over.png')" height="35px" alt=""></div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
      <div class="box-item">
        <div><img :src="require('@/assets/images/over.png')" height="35px" alt=""></div>
        <div class="box-text">
          <p>5</p>
          <p>播放课堂资源个数</p>
        </div>
      </div>
    </div>
    <div style="padding: 0 40px;">
      <div style="display: inline-block;width: 50%">
        <span>学生明细表</span>
      </div>
      <div style="display: inline-block;width: 50%;text-align: right" >
        <el-button size="mini" type="primary" @click="export2Excel">导出表格</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;padding: 0 40px;">
      <el-table-column
        prop="date"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="测验提交次数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="投票提交次数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="头脑风暴提交次数">
      </el-table-column>
      <el-table-column label="课堂出勤">
        <template slot-scope="scope">
          {{ scope.row.name }}
          <el-button size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "classOver",
    data (){
      return {
        tableData: [{
          id: '20160502',
          name: '王小虎',
          exam: '2',
          storm: '3',
          vote: '5',
          status: '迟到'
        },
        ]
      }
    },
    methods:{
      back(){
        this.$router.push({
          path: "/course/list",
        });
      },
      export2Excel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel');
          const tHeader = ['学号', '姓名', '测验提交次数', '投票提交次数', '头脑风暴提交次数','课堂出勤'];
          const filterVal = ['id', 'name', 'exam', 'vote','storm', 'status'];
          const list = this.tableData;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, `${this.getTime()}出勤表`);
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      getTime(){
        // 获取当前日期
        let date = new Date(),
           nowMonth = date.getMonth() + 1,
           strDate = date.getDate(),
           seperator = "-";

        if (nowMonth >= 1 && nowMonth <= 9) {
          nowMonth = "0" + nowMonth;
        }

        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }

         return date.getFullYear() + seperator + nowMonth + seperator + strDate;
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @media screen and (min-width:1500px) and (max-width:2000px) {
    .el-container{
      font-size: 15px!important;
    }
  }
  .el-menu {
    position: fixed
    z-index 10
  }
  .el-menu.el-menu--horizontal {
    width 100%
  }
  .el-menu-item {
    width 200px
  }
  .el-menu-item.is-active {
    background: #409eff !important
    border none
  }
  .class-over
    .el-header
      display flex
      align-items center
      justify-content space-between
      background-color: rgb(63,159,255)
      color #fff;
      height 4.66em !important;
      .course-name
        font-size 2em;
      .icon-div
        display flex
        align-items center
        justify-content space-between
        width 120px
        .icon-inner
          display flex
          flex-direction column
          align-items center
    .box-warp
      display flex
      align-items center
      text-align right
      .box-item
        flex 1
        height 100px
        align-items center
        text-align right
        background yellow;
        padding 0 20px
        margin 40px
        display flex
        &:nth-child(1)
          background: linear-gradient(to right, #0072e8, #448fff);
        &:nth-child(2)
          background: linear-gradient(to right, #67c23a, #5ed44f);
        &:nth-child(3)
          background: linear-gradient(to right, #25d8d0, #67dcc7);
        &:nth-child(4)
          background: linear-gradient(to right, #00e3ee, #1be1f5);
        .box-text
          flex 1
          color white
          text-align right

</style>