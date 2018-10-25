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
      title="课程评价详情"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">

      <div class="pop-user-info">
        <div></div>
        <span>windir</span>
      </div>
      <div class="pop-content-item" v-for="item in popContentItem">
        <span class="title"> {{ item.title }} </span>
        <span class="content"> {{ item.content }} </span>
      </div>
      <div class="pop-content-item">
        <span class="title"> 评价内容 </span>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </div>

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
            name:'用户昵称',
            width:120,
            prop:'username'
          },
          {
            name:'课程名称',
            width:120,
            prop:'courseName'
          },
          {
            name:'评价',
            width:120,
            prop:'evaluate'
          },
          {
            name:'所属以及分类',
            width:120,
            prop:'evaluate'
          },
          {
            name:'教学老师',
            width:120,
            prop:'evaluate'
          },
          {
            name:'评价时间',
            width:120,
            prop:'time'
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
            username:'windir',
            courseName:'高等数学',
            evaluate:"5",
            time:'2018'
          },
          {
            username:'windir',
            courseName:'高等数学',
            evaluate:"5",
            time:'2018'
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
