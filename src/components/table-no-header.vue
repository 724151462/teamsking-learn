<template>
  <div>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          v-for="(list, tableIndex) in tables"
          :key="tableIndex"
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
          <!-- <el-button v-for="(item, buttonIndex) in buttonStylus" v-if="item.show(scope.row)" :key="buttonIndex" type="text" size="small" @click="returnData(scope.row,item.type, scope.$index)">{{ item.name }}</el-button> -->
          <div v-for="(item, buttonIndex) in buttonStylus"  v-if="item.show" :key="buttonIndex">
            <el-button v-if="item.show(scope.row)" :key="buttonIndex" type="text" size="small" @click="returnData(scope.row,item.type, scope.$index)">{{ item.name }}</el-button>
          </div>
          <div v-else>
            <el-button  v-for="(item, buttonIndex) in buttonStylus"  v-if="item.show" :key="buttonIndex" type="text" size="small" @click="returnData(scope.row,item.type, scope.$index)">{{ item.name }}</el-button>
          </div>
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
      returnData(e,type,buttonIndex){
        // let data = {
        //   date:e,
        //   sys:type
        // }
        // console.log(data)
        this.$emit('showComponentInfo',type,e,buttonIndex)
      }
    }
  }
</script>

<style scoped>

</style>
