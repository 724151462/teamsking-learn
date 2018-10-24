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
          <el-form-item label="数学老师：">
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
                      type="selection"
                      width="55">
              </el-table-column>
              <el-table-column
                      label="用户昵称"
                      width="120">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="课程名称"
                      width="120">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="评价"
                      show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="所属以及分类"
                      show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="数学老师"
                      show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="评价时间"
                      show-overflow-tooltip>
              </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import {courseSetPage} from '@/api/course'
  export default {
    data() {
      return {
        form: {
          appraisal: '',
          catagory: '',
          teacher: ''
        },
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: []
      }
    },

    methods: {
      getList(){
        courseSetPage().then(res=>{
          console.log(res)
        }).catch(error=>{
          console.log(error)
        })
      },
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

      .grid-content
        box-sizing: border-box
        padding: 10px 0 10px 10px
        background: #f5f7fa

      .form-query
        padding-top:22px 
        display: flex
        align-items: center
        justify-content: space-between
       

</style>
