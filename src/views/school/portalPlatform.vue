<template>
  <el-form class="" :model="platformData" ref="ruleForm" label-width="150px" class="demo-ruleForm">
    <el-form-item label="平台名称" required>
      <el-input v-model="platformData.name" style="width: 220px;"></el-input>
      <span>字数限制在36个汉字以内</span>
    </el-form-item>
    <el-form-item label="平台介绍" required>
      <div style="display: flex;flex-direction: column">
        <el-input type="textarea" v-model="platformData.introduct" style="width: 220px;"></el-input>
        <span>字数请限制在512个汉字以内</span>
      </div>
    </el-form-item>
    <el-form-item label="白色背景logo" required>
      <el-input type="file" id='white' v-model="platformData.whiteLogo" style="width: 220px; display:none"></el-input>
      <el-button @click="uploadClick('white')">编辑logo</el-button>
    </el-form-item>
    <el-form-item label="黑色背景logo" required>
      <el-input type="file" id="black" v-model="platformData.blackLogo" style="width: 220px;display:none"></el-input>
      <el-button @click="uploadClick('black')">编辑logo</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {

    data() {
      return {
        platformData: {
          name: '',
          introduct: ''
        }
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      uploadClick(id){
        console.log(id)
        document.getElementById(id).click()
      }
    }
  }
</script>
<style lang="stylus" scoped>

</style>
