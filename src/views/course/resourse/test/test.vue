<template>
  <div class="test">
    <div class="title">
      <div>试题管理</div>
      <div style="" class="btn-warp">
        <div>
          <el-button type="success">下载模板</el-button>
        </div>
        <div>
          <!--<el-button @click="uploadDialog = true">导入模板</el-button>-->
          <el-upload
            :http-request="upTestFile"
            action="string"
            :show-file-list="false">
            <el-button >选择文件</el-button>
          </el-upload>
        </div>
        <div>
          <el-button type="primary" @click="toAddTest()">添加</el-button>
        </div>
      </div>
    </div>

    <el-form :inline="true" :model="formInline" style="margin-top: 40px">
      <el-form-item>
        <div style="display: flex">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="input">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn"></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-select v-model="value" placeholder="请选择" @change="getChapterQuiz">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="delAllQuiz">删除该课程全部试题</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData3"
      :header-cell-style="{'background-color': '#fafafa',}"
      height="85%"
      border
      highlight-current-row
      class="test-table">
      <el-table-column
        label="序号"
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
  // import uposs from '@/components/up-oss.vue'
  import {upQuiz} from "../../../../api/course";

  export default {
    // components:{uposs},
    data() {
      return {
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
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value:'',
        uploadDialog: false, //文件上传弹窗
        testView: false , //试题查看弹窗
        testDelete: false, //删除试题
        //courseId: '0608367675f54267aa6960fd0557cc1b',//如果指定课程的话，课程ID
        courseId: '',//如果指定课程的话，课程ID
      }
    },
    methods:{
      toEditTest () {
        this.$router.push('/course/resource/edittest/1');
      },
      toAddTest () {
        this.$router.push('/course/resource/addtest');
      },
      // 导入试题模板
      upTestFile (item) {
        this.beforTestUpload()
        console.log(item)
        let fileFormData = new FormData();
        fileFormData.append('file', item.file);
        console.log(fileFormData)
        upQuiz(this.courseId, fileFormData).then(res=>{
          this.$notify({
            title: '试题导入成功',
            message: '新增'+res.data.totalCount+'个试题',
            type: 'success',
            duration: 0
          });
        }).catch(error=>{
          console.log(error)
        })
      },
      //文件上传验证
      beforTestUpload(file){

        if(!this.courseId){
          this.$notify.error({
            title: '错误',
            message: '请先搜索相关课程，再导入该课程的试题模板'
          });
          return false
        }

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
      },
      //选择试题章节查询
      getChapterQuiz(){
        alert("按章节查询")
      },
      // 删除该课程全部试题
      delAllQuiz(){

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
    .search-btn
      border-left 0
      background-color #f4f4f4
      border-radius 4px
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

