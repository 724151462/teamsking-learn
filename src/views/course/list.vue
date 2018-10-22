<template>
    <div>课程列表</div>
</template>

<script>
  import { coursePage } from '../../api/course'
  export default {
    data (){
      return {
        data:[],
        listQuery:{
          pageIndex:1,  //页码
          pageSize:10 //显示条数
        }
      }
    },
    created(){
      coursePage(this.listQuery).then(res=>{
        console.log(res)
      }).catch(error=>{
        console.log(error)
      })
    }
  }
</script>

<style scoped>

</style>
