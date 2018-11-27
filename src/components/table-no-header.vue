<template>
  <div>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          v-for="(list, index) in tables"
          :key="index"
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
          <el-button v-for="(item, index) in buttonStylus" :key="index" type="text" size="small" @click="returnData(scope.row,item.type)">{{ item.name }}</el-button>
          <!--
            buttonStylus：{
              name：'xx'，
              type：‘操作类型’
            }
          -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props:["tables","tableData","buttonStylus"],
    methods:{
      returnData(e,type){
        // let data = {
        //   date:e,
        //   sys:type
        // }
        // console.log(data)
        this.$emit('showComponentInfo',type,e)
      }
    }
  }
</script>

<style scoped>

</style>
