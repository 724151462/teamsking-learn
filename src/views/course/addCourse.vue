<template>
  <div>
    <div>
      <span>课程信息</span>
      <el-button plain>返回</el-button>
    </div>
    <div>
      <el-form :model="data" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="课程名称" required="true">
          <el-input v-model="data.courseName" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="课程分类" required="true">
          <el-select v-model="value" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" required="true">

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        data:{
          courseName:'',  //课程名称
          courseCategoryParent:'',  //课程分类

        },
        rules:[]
      }
    }
  }
</script>

<style scoped>

</style>
