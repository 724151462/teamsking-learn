<template>
  <div>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          v-for="list in tables"
          :prop="list.prop"
          :label="list.name"
          :width="list.width">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          fit="true"
          v-if="buttonStylus && buttonStylus.length > 0"
          :width="buttonStylus.length * 80"
          align="center">
        <template slot-scope="scope">
          <el-button v-for="item in buttonStylus" type="text" size="small" @click="returnData(scope.row)">{{ item.name }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props:["tables","tableData","buttonStylus"],
    methods:{
      returnData(e){
        this.$emit('returnFun',e)
      }
    }
  }
</script>

<style scoped>

</style>