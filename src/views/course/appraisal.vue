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
            <el-button type="text" @click="appraisalDetail(scope.row)">查看</el-button>
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
        <div class="appraisal-body" v-for="(item, index) in detailEvaluateList">
          <div class="appraisal-left">
            <div class="appraisal-img">
              <img :src="item.avatar" height="50px" alt="" class="">
            </div>
          </div>
          <div class="appraisal-right">
            <div>
              <span>{{item.nickName}}</span>
              <el-rate v-model="rateValue" disabled style="display: inline-block"></el-rate>
              <span>{{item.createTime}}</span>
            </div>
            <p>{{item.content}}</p>
            <el-button type="text" style="color: #999999; float: right" @click="deleteEvealuate(item)">删除</el-button>
          </div>
        </div>
        
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { evaluatePage,evaluateDetail,evaluateDelete } from '@/api/course'
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
        // 某课程下的评价列表
        detailEvaluateList: [],
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
      // 课程下评论列表
      appraisalDetail(item) {
        evaluateDetail({courseId: item.courseId})
        .then(response=> {
          if(response.data.pageData.length === 0) {
            this.$message({
              message: '暂无数据',
              type: 'warning'
            })
          }else{
            this.detailEvaluateList = response.data.pageData
            console.log(this.detailEvaluateList)
            this.dialogVisible = true
          }
        })
      },
      // 删除评论
      deleteEvealuate(item) {
        evaluateDelete([item.evaluateId])
        .then(response=> {
          this.getList()
        })
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
    display flex
    align-items center
    flex-direction column
    .appraisal-left
      height 100%
      width 50px
      border 1px soild blue
      padding-right 10px
      .appraisal-img
        height 50px
        width 50px
    .appraisal-body
      width 100%
      display flex
      align-items flex-start
      justify-content flex-start
    .appraisal-right
      background-color: #FAFAFA
      padding 5px
      width 100%
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
