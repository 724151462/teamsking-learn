<template>
  <div class="menu">

    <header-the-again  headerTitle="菜单管理"></header-the-again>


    <table-the-again></table-the-again>




  </div>
</template>

<script>
  import tableTheAgain from '../../components/table-theAgain'
  import headerTheAgain from '../../components/header-theAgain'


  export default {

    data(){
      return{

      }
    },
    components:{
      tableTheAgain,
      headerTheAgain
    }
  }
</script>

<style scoped lang="stylus" type="css/stylus">

</style>
