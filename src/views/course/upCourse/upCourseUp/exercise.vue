<template>
  <div class="upCourseUp-videos">
    <div class="top-bottom">
      <el-button type="primary" @click="isAddExercise = true">添加</el-button>
    </div>
    <div>
      <el-table
          :data="data"
          border>
        <el-table-column
            v-for="list in tables"
            :prop="list.prop"
            :label="list.name"
            :width="list.width">
        </el-table-column>
        <el-table-column
            label="操作"
            width="120"
        >
          <template slot-scope="scope">
            <a class="preview">预览</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        title="添加题目"
        :visible.sync="isAddExercise"
        width="30%">
      <span>这里是添加题目的题目内容</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isAddExercise = false">取 消</el-button>
    <el-button type="primary" @click="isAddExercise = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        isAddExercise:false,  //打开弹窗
        tables:[
          {
            name:'题目编号',
            width:120,
            prop:'id'
          },
          {
            name:'题目类型',
            width:120,
            prop:'style'
          },
          {
            name:'题干',
            // width:120,
            prop:'tj'
          },
          {
            name:'答案',
            width:120,
            prop:'da'
          },
          {
            name:'解析',
            width:120,
            prop:'jj'
          },
          {
            name:'使用次数',
            width:120,
            prop:'cs'
          },
        ],
        data:[
          {
            id:1,   //序号
            style:'选择题',  //类型
            tj:'我是提干',  //提干
            da:'dsan',  //答案
            jj:'解析',  //解析
            cs:'11',  //使用次数
          }
        ]
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','exercise')
    },
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  @import "../../../../assets/css/course/resource.styl"
</style>