<template>
  <div>课堂结束
    <div style="font-size: 2.5em;cursor: pointer" @click="back">返回课程列表</div>
  </div>

</template>

<script>
  export default {
    name: "classOver",
    methods:{
      back(){
        this.$router.push({
          path: "/course/list",
        });
      }
    },
  }
</script>

<style scoped>

</style>