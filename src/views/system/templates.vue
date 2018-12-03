<template>
  <div class="templates">
    <header-the-again headerTitle="模板管理"></header-the-again> 

     <el-button type="primary">添加模板</el-button>

      <div style="display:flex;flex-direction:row;justify-content:flex-start;flex-wrap:wrap;width:100%;min-height:0">
        <div class="container">
            <div class="tool">
              <el-switch
                v-model="value2"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>

              <div></div>
            </div>
            <img src="" alt="">
          </div>

          <div class="container">
            <div class="tool">
              <el-switch
                v-model="value2"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>

              <div></div>
            </div>
            <img src="" alt="">
          </div>

          
          <div class="container">
            <div class="tool">
              <el-switch
                v-model="value2"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>

              <div></div>
            </div>
            <img src="" alt="">
          </div>

          
          <div class="container">
            <div class="tool">
              <el-switch
                v-model="value2"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>

              <div></div>
            </div>
            <img src="" alt="">
          </div>

          
          <div class="container">
            <div class="tool">
              <el-switch
                v-model="value2"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>

              <div></div>
            </div>
            <img src="" alt="">
          </div>


      </div>
          


  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'

  export default {
    data() {
      return {
        value2: true
      }
    },
    components: {
      headerTheAgain
    },
  }

</script>

<style scoped>
  
  .templates{
    background: transparent;
  }

  .container{
    position: relative;
    margin-top: 15px;
    margin-right: 15px;
    width: 340px;
    height: 200px;
    background: cyan;
  }
  .container:hover .tool{
    display:block;
  }
  .tool{
    position: absolute;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    right:20px;
    top: 20px;
    display: none;
  }
  .tool div:last-child{
    box-sizing: border-box;
    margin-top:10px;
    width: 30px;
    height: 30px;
    background: orange;
    border-radius: 50% 50%;
  }


</style>