<template>
  <div>
    <el-form :model="data" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名师照片" required>
        <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
          <img v-if="data.courseCover" :src="data.courseCover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="老师姓名" required>
        <el-input v-model="data.name" style="width: 220px;"></el-input>
      </el-form-item>

      <el-form-item label="老师头街" required>
        <el-input v-model="data.introduction" style="width: 220px;"></el-input>
      </el-form-item>

      <el-form-item label="老师介绍" required>
        <el-input type="textarea" v-model="data.introduction"></el-input>
      </el-form-item>

      <el-form-item label="新浪微博">
        <el-input v-model="data.introduction" style="width: 220px;"></el-input>
      </el-form-item>

      <el-form-item label="微信">
        <el-input v-model="data.introduction" style="width: 220px;"></el-input>
      </el-form-item>

      <el-form-item label="标签">
        <el-input v-model="data.introduction" style="width: 220px;"></el-input>
        <div>使用空格间隔标签</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        data:{
          imageUrl:'',  //头像图片
          name:'',  //老师姓名
          introduction:'',  //老师介绍
        }
      }
    },
    methods:{
      //图片上传方法
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden

  .avatar-uploader .el-upload:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 78px
    height: 78px
    line-height: 78px
    text-align: center
    border:1px solid #ded5d5

  .avatar
    width: 178px
    height: 178px
    display: block
</style>
