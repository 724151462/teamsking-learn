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
        <el-input v-model="form.appraisal"  placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
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
          :key="list.id"
          :prop="list.prop"
          :label="list.name">
        </el-table-column>
        <el-table-column
          label="授课教师"
          width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ allTeacher(scope.row.instructor) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="dialogVisible = true">查看</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">

      <div class="appraisal-warp">
        <div class="appraisal-left">
          <div class="appraisal-img">
            <img src="" alt="" class="">
          </div>
        </div>
        <div class="appraisal-body">
          <div>
            <div>张三</div>
            <div><el-rate v-model="rateValue" disabled></el-rate></div>
            <div>-2018-12-25 10:46:30</div>
          </div>
          <p>很有帮助的课程，谢谢老师</p>
        </div>
        <div class="appraisal-right">
          <el-button type="text" style="color: #999999;">删除</el-button>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { evaluatePage } from '@/api/course'
  export default {
    data() {
      return {
        data:[
          {
            name:'课程名称',
            prop:'courseName'
          },
          {
            name:'所属分类',
            prop:'categoryName'
          },
          {
            name:'评价条数',
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
        multipleSelection: [],
        rateValue: 5 //评分
      }
    },
    created(){
      this.getList()
      //this.getCatagoryList();
    },
    methods: {
      // 教师显示
      allTeacher(teachers=[]) {
        console.log(teachers)
        let str = ''
        teachers.forEach( item => str += (item + ','))
        return str.substr(0,str.length-1)
      },
      getList(){
        evaluatePage(this.listQuery).then(res=>{
          console.log(res)
          if (res.code === 200){
              this.tableData3 = res.data
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
    align-items center
    .appraisal-left
      height 100%
      width 50px
      border 1px soild blue
      padding-right 10px
      .appraisal-img
        background-color yellow
        height 100%
        width 100%
    .appraisal-body
      height 100%
      background-color #FAFAFA
      flex 1
      & div
        display flex
    .appraisal-right
      height 100%
      line-height 60px
      background-color: #FAFAFA
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
