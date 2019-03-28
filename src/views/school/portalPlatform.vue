<template>
  <el-form
    style="margin-top: 30px;"
    :rules="rules"
    :model="platformData"
    ref="ruleForm"
    label-width="150px"
  >
    <el-form-item label="平台名称：" prop="tenantName">
      <el-input
        v-model="platformData.tenantName"
        placeholder="请输入学校名称"
        class="has-text-input"
        :debounce="10"
        :maxlength="36"
        style="width: 230px;"
      ></el-input>
      <span style="position:relative;right:40px;">
        <span style="color:red">{{this.platformData.tenantName.length || 0}}</span>/36
      </span>
    </el-form-item>
    <el-form-item label="平台简称：" prop="shortName">
      <el-input
        v-model="platformData.shortName"
        placeholder="请输入学校简称"
        class="has-text-input"
        :debounce="10"
        :maxlength="36"
        style="width: 230px;"
      ></el-input>
      <span style="position:relative;right:40px;">
        <span style="color:red">{{this.platformData.shortName.length || 0}}</span>/36
      </span>
    </el-form-item>
    <el-form-item label="平台介绍：" prop="introduction">
      <el-input
        type="textarea"
        :rows="6"
        :maxlength="512"
        style="width: 400px;"
        placeholder="请输入内容"
        v-model="platformData.introduction"
      ></el-input>
      <span style="position:relative;display:inline-bloke;top:10px">
        <span style="color:red;">{{this.platformData.introduction.length || 0}}</span>/512
      </span>
    </el-form-item>
    <el-form-item label="logo：" required>
      <upOss
        btn-text='上传logo'
        inputs='logo'
        style="margin:0"
        @ossUp="upLogo"
        upDir="tskedu/logo"
      ></upOss>
      <div style="margin-top:20px">
        <img width="170px" height="40px" :src="platformData.tenantLogo" alt="LOGO">
      </div>
    </el-form-item>
    <el-form-item label="平台图片：" required>
      <upOss :btn-text="'上传图片'" :inputs="'pic'" style="margin:0" @ossUp="upPic" upDir="tskedu/logo"></upOss>
      <div style="margin-top:20px">
        <img width="400px" height="400px" :src="platformData.tenantPic" alt="平台图片">
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import upOss from "@/components/up-oss";
import { platformInfo, getPlatformInfo } from "@/api/system";
export default {
  data() {
    return {
      logoSrc: "",
      platSrc: "",
      platformData: {
        shortName: "",
        tenantLogo: "",
        tenantName: "",
        tenantPic: ""
      },
      rules: {
        tenantName: [
          { required: true, message: "请输入平台名称", trigger: "blur" },
          { max: 36, message: "最大为36个字符", trigger: "blur" }
        ],
        shortName: [
          { required: true, message: "请输入平台简称", trigger: "blur" },
          { max: 36, message: "最大为36个字符", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "请输入平台简介", trigger: "blur" },
          { max: 512, message: "最大为512个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    getPlatformInfo().then(response => {
      this.platformData = response.data;
    });
  },
  methods: {
    saveInfo() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (!this.platformData.tenantLogo || !this.platformData.tenantPic) {
            this.$message.warning("请上传平台图片");
          } else {
            platformInfo(this.platformData).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
              } else {
                this.$store.commit("ERR_MSG", response.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    upLogo(...params) {
      console.log(params);
      this.platformData.tenantLogo = params[0];
    },
    upPic(...params) {
      this.platformData.tenantPic = params[0];
    }
  },
  components: {
    upOss
  }
};
</script>
<style lang="stylus" scoped>
</style>
