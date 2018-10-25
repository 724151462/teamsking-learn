<template>
    <el-row class="header">
        <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                {{ headerTitle }}
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
  props:['headerTitle'],
  data(){
    return {

    }
  }
}

</script>
<style scoped lang="stylus" type="text/stylus">
  .header
    .grid-content
      margin-bottom: 20px
      box-sizing: border-box
      padding: 10px 0 10px 10px
      background: #f5f7fa

</style>
