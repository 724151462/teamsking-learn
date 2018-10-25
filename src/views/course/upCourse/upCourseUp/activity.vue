<template>
  <div>活动库</div>
</template>

<script>
  export default {
    data(){
      return{
        data:[]
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.$emit('resourceNav','activity')
    }
  }
</script>

<style scoped>

</style>