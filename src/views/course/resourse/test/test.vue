<template>
  <div class="test">
    <div class="title">
      <div>试题管理</div>
      <div style="" class="btn-warp">
        <div>
          <el-button type="success">下载模板</el-button>
        </div>
        <div>
          <el-upload
            :action="uploadURL"
            :limit="1">
              <el-button >导入</el-button>
          </el-upload>
        </div>
        <div>
          <el-button type="primary" @click="toAddTest()">添加</el-button>
        </div>
      </div>
    </div>
    <el-table
      :data="tableData3"
      :header-cell-style="{'background-color': '#fafafa',}"
      height="85%"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      class="test-table">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="date"
        min-width="120px"
        label="所属课程">
      </el-table-column>
      <el-table-column
        prop="name"
        label="所属章节">
      </el-table-column>
      <el-table-column
        prop="name"
        label="难度">
      </el-table-column>
      <el-table-column
        prop="address"
        width="200"
        class="tigan"
        show-overflow-tooltip
        label="题干">
      </el-table-column>
      <el-table-column
        prop="name"
        label="题目类型"
        min-width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="答案"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="testView = true">查看</el-button>
          <el-button type="text" size="small" @click="toEditTest">编辑</el-button>
          <el-button type="text" size="small" @click="testDelete = true">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--试题查看弹窗-->
    <el-dialog
      title="试题查看"
      :visible.sync="testView"
      width="50%">
       <div class="test-body">
         <p><span style="margin-right: 20px"><b>(单选题)</b></span>1、在下列设备中，不能作为危机输入设备的是?</p>
         <br>
         <div class="options">
           <span>A、扫描仪</span>
           <span>B、扫描仪</span>
           <span>C、扫描仪</span>
           <span>D、扫描仪</span>
         </div>
       </div>
      <span slot="footer" class="dialog-footer" style="text-align: left">
        <p>正确答案:<span>C</span></p>
        <p>解析:<span>鼠标是一种常用的输入设备</span></p>
      </span>
    </el-dialog>
    <!--删除确认框-->
    <el-dialog
      title="删除试题"
      :visible.sync="testDelete"
      width="40%">
      <span style="font-size: 16px">确认删除该试题？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="testDelete = false">取 消</el-button>
    <el-button type="primary">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import {upTest} from "../../../../api/course";

  export default {
    data() {
      return {
        tableLabel:[
          {label:'序号', prop: '', width: ''},
          {label:'课程名称', prop: '', width: ''},
          {label:'所属章节', prop: '', width: ''},
          {label:'题干', prop: '', width: '200'},
          {label:'难度', prop: '', width: ''},
          {label:'题目类型', prop: '', width: ''},
          {label:'答案', prop: '', width: ''},
        ],
        tableData3: [
          {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区18 弄题干祭祀的计算机就iiii 计就就 计就i  cpu金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普18 弄题干祭祀的计算机就iiii 计就就 计就i  cpu陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄题干祭祀的计算机就iiii 计就就 计就i  cpu'
        }],
        testList:[
          {

          }
        ],
        testView: false , //试题查看弹窗
        testDelete: false, //删除试题
        courseId:'',//如果指定课程的话，课程ID
        uploadURL: '' //模板文件保存的URL地址
      }
    },
    methods:{
      toEditTest () {
        this.$router.push('/course/resource/edittest');
      },
      toAddTest () {
        this.$router.push('/course/resource/addtest');
      },
      handleCurrentChange (val) {
        console.log(val)
      },
      // 导入试题模板
      upTestFile () {
        fileFormData = new FormData();
        fileFormData.append('file', this.files, this.fileName);
      },
      //文件上传验证
      beforTestUpload(file){
        console.log(file,'文件');
        this.files = file;
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!extension && !extension2) {
          this.$message.warning('上传模板只能是 xls、xlsx格式!')
          return
        }
        if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 5MB!')
          return
        }
        this.fileName = file.name;
        return false // 返回false不会自动上传
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .el-table .cell
    overflow: hidden
    white-space: nowrap
    text-overflow:ellipsis
  .test
    padding:0 5% 20px 50px
    .title
      width 100%
      display flex
      align-items center
      border-bottom 2px solid gray
      padding-bottom 10px
      & div:first-chilf
        height 45px;
        width 100px;
    .btn-warp
      flex 1
      display flex
      justify-content flex-end
      & div
        margin 0 10px
      & div:last-child
        margin-right 0
    .test-table
      width 100%
      margin 0 auto
      margin-top 40px
    .test-body
      padding 40px
      font-size 15px
      .options
        & span
          margin-right 30px
        & span:last-chid
          margin-right 0
    .dialog-footer
      & p
        color red
        padding-right 40px
        padding-left 20px
        & span
          color black
</style>

