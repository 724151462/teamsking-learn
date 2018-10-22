<template>
    <div>
        <el-container>
            <el-header style="padding:0">
              <headers></headers>
            </el-header>
            <el-container>
                <el-aside width="200px">这里是侧边栏</el-aside>
                <el-main>
                  <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
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
</style>
-->
