<template>
  <div class="upCourseUp-videos">
    <div class="top-bottom">
      <el-button type="primary" @click="isAddExercise = true">添加</el-button>
    </div>
    <div>
      <el-table
          :data="data"
          border>
        <template v-for="list in tables">
          <template v-if="list.formatter">
            <el-table-column
                :label="list.name"
                align="center">
              <template scope="scope">
                <div>
                  {{list.formatter(scope.row[list.prop],scope.row)}}
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
                align="center"
                :label="list.name"
                :prop="list.prop"
                :width="list.width"
            >
            </el-table-column>
          </template>
        </template>
        <el-table-column
            label="操作"
            width="120"
            align="center"
        >
          <template slot-scope="scope">
            <a class="preview">下载</a>
            <a class="preview" @click="deleteQuizs(scope.row.quizId)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        title="添加题目"
        :visible.sync="isAddExercise"
        width="70%">
      <addExercises v-on:yesExrecises="onExercises"></addExercises>
    </el-dialog>
  </div>
</template>

<script>
  import { quizPage, deleteQuiz } from '../../../../api/course'
  import addExercises from './addExercise.vue'
  export default {
    components:{
      addExercises
    },
    data(){
      return{
        isAddExercise:false,  //打开弹窗
        tables:[
          {
            name:'题目编号',
            width:120,
            prop:'quizTitle'
          },
          {
            name:'题目类型',
            width:120,
            prop:'quizType', //10 单选 20 多选
            formatter:function(val){
              if(Number(val) === 10){
                return '单选'
              }else if(Number(val) === 20){
                return '多选'
              }
            }
          },
          {
            name:'题干',
            // width:120,
            prop:'quizTitle'
          },
          {
            name:'解析',
            width:120,
            prop:'quizAnalysis'
          },
          {
            name:'使用次数',
            width:120,
            prop:'useCount'
          },
        ],
        data:[],
        courseid:'',
        listQuery:{
          resourceType:30, // 10:video 20:doc 30:audio
          pageIndex:1,
          pageSize:10
        },
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','exercise')
      if (this.$route.query.courseid && this.$route.query.courseid !== '') {
        this.courseid = this.$route.query.courseid
        this.getList()
      }
    },
    methods:{
      deleteQuizs (e) {
        deleteQuiz(e).then(res=>{
          if(Number(res.code) === 200){
            this.getList()
            this.$message({
              message:'删除成功',
              type:'success'
            })
          }else{
            this.$message({
              message:'删除失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      onExercises (e) {
        this.isAddExercise = false
        if (e === 'close') {
          return false
        }
        this.getList()
      },
      getList () {
        quizPage(this.courseid,this.listQuery).then(res=>{
          // console.log(res)
          if(Number(res.code) === 200){
            this.data = res.data.pageData
          }else{
            this.$message({
              message:'获取题目列表出错',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  @import "../../../../assets/css/course/resource.styl"
</style>
