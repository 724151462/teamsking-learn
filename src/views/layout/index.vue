<template>
    <div>
        <headers></headers>
        <router-view></router-view>
    </div>
</template>

<script>
  import headers from './header.vue'
  export default {
    components:{
      headers
    }

  }
</script>
<!--

<style scoped>

</style>-->
