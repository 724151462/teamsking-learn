<template>
  <div class="appraisal">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          课程评价
        </div>
      </el-col>
    </el-row>

    <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="form.appraisal" ></el-input>
      </el-form-item>
      <el-form-item label="课程分类：">
        <el-select v-model="form.catagory" placeholder="请选择课程分类">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教学老师：">
        <el-select v-model="form.teacher" placeholder="请选择教师">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 95%;margin-left:2.5%"
      @selection-change="handleSelectionChange">

      <el-table-column label="课程评价列表">
        <el-table-column
          v-for="list in data"
          :key="list"
          :prop="list.prop"
          :label="list.name"
          :width="list.width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <a @click="dialogVisible = true">查看</a>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">

      <el-row>
        <div class="appraisal-warp">
          <div class="appraisal-left">
            <div class="appraisal-img"></div>
            <!--<img src="" alt="" class="appraisal-img">-->
          </div>
          <div class="appraisal-body">
            <p>fff</p>
          </div>
          <div class="appraisal-right">
            删除
          </div>
        </div>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { coursePage } from '../../api/course'
  export default {
    data() {
      return {
        data:[
          {
            name:'课程名称',
            width:120,
            prop:'courseName'
          },
          {
            name:'所属分类',
            width:120,
            prop:'classify'
          },
          {
            name:'分数',
            width:120,
            prop:'score'
          },
          {
            name:'评价条数',
            width:120,
            prop:'evaluate'
          },
        ],
        dialogVisible: false,
        popContentItem:[
          {
            title:'课程',
            content:'PS大师课程'
          },
          {
            title:'课程所属分类',
            content:'一级分类'
          },
          {
            title:'教学老师',
            content:'张老师'
          },
          {
            title:'评价',
            content:'5星'
          },
          {
            title:'日期',
            content:'2017-06-15 14:35:51'
          }
        ],
        textarea:'',
        listQuery:{
          page:1,
          rows:1,
        },
        form: {
          appraisal: '',
          catagory: '',
          teacher: ''
        },
        tableData3: [
          {
            courseName:'色彩构成',    //课程名称
            classify:"计算机-设计",   //所属分类
            evaluate:"35",           // 评价条数
            score:'5'                //分数
          },
          {
            courseName:'搜索引擎技术',
            classify:"计算机-程序",
            evaluate:"50",
            score:'3.5'
          }
        ],
        multipleSelection: []
      }
    },
    created(){
      this.getList()
      //this.getCatagoryList();
    },
    methods: {
      getList(){
        coursePage(this.listQuery).then(res=>{
          console.log(res)
          if (res.code === 200){
              //this.tableData3 = res.data.xxx
              // /api/v1/sys/category/page
              console.log(res.data);
          }
        }).catch(error=>{
          console.log(error)
        })
      },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        },
        popInfo(){
          console.log('点击弹出');
        },
      // getCatagoryList(){
      //     sysCategoryPage(this.listQuery).then(res=>{
      //         if(res.code === 200){
      //             console.log(res.data);
      //         }
      //     }).catch(error=>{
      //         console.log(error);
      //     })
      // },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .appraisal
      -webkit-font-smoothing:antialiased
  .appraisal-warp
    height 60px
    display flex
    .appraisal-left
      height 100%
      width 50px
      border 1px soild blue
      padding-right 10px
      .appraisal-img
        height 100%
        width 100%
    .appraisal-body
      height 100%
      flex 1
    .appraisal-right
      height 100%
    .grid-content
      box-sizing: border-box
      padding: 10px 0 10px 10px
      background: #f5f7fa

    .form-query
      padding-top:22px
      display: flex
      align-items: center
      justify-content: space-between

    .pop-user-info
      margin:0px 0 20px 0
      box-sizing border-box
      display:flex
      justify-content:space-around
      flex-direction:column
      align-items:center
      width:150px
      height:150px
      /*background:cyan*/
      div
        width:100px
        height:100px
        background:cyan
        border-radius:50% 50%

      span
        margin:5px 0
        box-sizing:border-box
        display:inline
        /*background:yellow*/

    .pop-content-item
      span:first-child
        font-weight:800
    .pop-content-item:last-child
       margin-top:20px
</style>
