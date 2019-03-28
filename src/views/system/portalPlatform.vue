<template>
  <el-form style="margin-top: 30px;" :model="platformData" ref="ruleForm" label-width="150px">
    <el-form-item label="平台名称" required>
      <el-input v-model="platformData.tenantName" style="width: 220px;"></el-input>
      <span>字数限制在36个汉字以内</span>
    </el-form-item>
    <el-form-item label="平台简称" required>
    <el-input v-model="platformData.shortName" style="width: 220px;"></el-input>
      <span>字数限制在36个汉字以内</span>
    </el-form-item>
    <el-form-item label="平台介绍" required>
      <div style="display: flex;flex-direction: column">
        <el-input type="textarea" v-model="platformData.introduction" style="width: 220px;"></el-input>
        <span>字数请限制在512个汉字以内</span>
      </div>
    </el-form-item>
    <el-form-item label="logo" required>
      <div class="logoContent">
        <upOss :btn-text="'上传logo'" :inputs="'logo'" @ossUp="upLogo" upDir="tskedu/logo"></upOss>
        <img width="100px" :src="logoSrc" alt="">
      </div>
    </el-form-item>
    <el-form-item label="平台图片" required>
      <div class="logoContent">
        <upOss :btn-text="'上传图片'" :inputs="'pic'" @ossUp="upPic" upDir="tskedu/logo"></upOss>
        <img width="100px" :src="platSrc" alt="">
      </div>
    </el-form-item>
    <el-button type="primary" @click="saveInfo" style="margin-left: 200px;margin-top: 20px">保存</el-button>
  </el-form>
</template>

<script>
  import upOss from '@/components/up-oss'
  import {
    platformInfo,
    getPlatformInfo
  }from "@/api/system"
  export default {

    data() {
      return {
        logoSrc: '',
        platSrc: '',
        platformData: {
          name: '',
          introduct: ''
        }
      };
    },
    mounted() {
      getPlatformInfo()
      .then(response=> {
        this.platformData = response.data
      })
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      saveInfo() {
        platformInfo(this.platformData)
        .then(response=> {
          if(response.code === 200) {
            this.$message({
              message: "设置成功",
              type: "success"
            })
          }
        })
      },
      upLogo(...params) {
        console.log(params)
        this.platformData.tenantLogo = params[0]
        this.logoSrc = params[0]
      },
      upPic(...params) {
        console.log(params)
        this.platformData.tenantPic = params[0]
        this.platSrc = params[0]
      },
    },
    components: {
      upOss
    }
  }
</script>
<style lang="stylus" scoped>
  .logoContent
    display flex
    align-items center
</style>
