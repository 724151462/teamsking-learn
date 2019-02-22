<template>
  <div  style="position : fixed;bottom :20px;right: 20px;" class="fullScreen" @click="full()">
    <img :src="$store.state.isFullScreen ? require('@/assets/images/unfull.png') : require('@/assets/images/full.png') " alt="">
  </div>
</template>

<script>
  export default {
    name: "fullScreen",
    methods:{
      full(){
        this.$store.commit('SET_FULLSCREEN')
      }
    }
  }
</script>

<style scoped>

</style>