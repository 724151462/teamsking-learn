<template>
  <div class="addTeacher">
    <el-form :model="data" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding-right: 13%">
      <el-form-item label="名师照片" required>
        <img :src="data.instructorAvatar" alt="" v-show="data.instructorAvatar" style="width: 75px;height: 100px">
          <el-button size="small" type="success" style="margin-left: 25px;">
            <label for="male">点击上传</label>
          </el-button>
          <up-oss style="display: none" @ossUp="getUrl"></up-oss>
          <span class="upload-tip">请上传不小于<span class="text-red">15kb</span>的<span class="text-red">jpg</span>或<span class="text-red">png</span>图片</span>
      </el-form-item>

      <el-form-item label="老师姓名" required>
        <el-input v-model="data.instructorName"></el-input>
      </el-form-item>

      <el-form-item label="老师头街" required class="type-warp">
        <el-input v-model="data.instructorType" maxlength="32" ></el-input>
        <span class="type-num"><span class="text-red">{{this.instructorTypeNum}}</span>/32</span>
      </el-form-item>

      <el-form-item label="老师介绍" required class="info-warp">
        <el-input
                type="textarea"
                v-model="data.instructorInfo"
                resize="none" :rows="5"
                @keyup.native="infoChange($event)"
                maxlength="1000"></el-input>
        <span class="info-num"><span class="text-red">{{this.instructorInfoNum}}</span>/1000</span>
      </el-form-item>

<!--
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
-->
    </el-form>

    <span slot="footer" style="text-align: right;display:block;padding-right:5%">
      <el-button type="primary" @click="yesGoInstructor">确 定</el-button>
      <el-button @click="returnFun">取 消</el-button>
    </span>
  </div>
</template>

<script>
  import upOss from '@/components/up-oss'
  import { addInstructor } from '../../../api/course'
  export default {
    components:{
      upOss
    },
    data(){
      return{
        data:{
          instructorAvatar:'',  //头像图片
          instructorName:'',  //老师姓名
          instructorType:'',  //老师头衔
          instructorInfo:'',  //老师介绍
          // status:1,

          // introduction:'',  //老师介绍
        },
        instructorInfoNum: 0, //老师介绍的字数
        instructorTypeNum: 0, //老师头衔的字数
      }
    },
    methods:{
      //上传封面
      getUrl (url){
        this.data.instructorAvatar = url
      },
      returnFun () {
        this.$emit('goAddTeachersData')
      },
      //创建讲师
      yesGoInstructor () {
        addInstructor(this.data).then(res=>{
          if(Number(res.code) === 200){
            this.$message.success('讲师创建成功')
            this.data={
                instructorAvatar:'',
                instructorName:'',
                instructorType:'',
                instructorInfo:'',
            }
            this.$emit('goAddTeachersData',res.data)
          }else{
            this.$message({
              message:'创建失败，请检查您输入的内容',
              type:'error'
            })
          }
        })
      },
      //图片上传方法
      handleAvatarSuccess(res, file) {
        this.instructorAvatar = URL.createObjectURL(file.raw);

      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 教师介绍文本域发生变化
      infoChange(event){
        //可视区保持为滚动条下方
        var flag = event.path[0].scrollHeight - event.path[0].scrollTop === event.path[0].clientHeight;
        if(!flag){
            event.path[0].scrollTop = event.path[0].scrollHeight - event.path[0].clientHeight
        }
        // 当前字数
        this.data.instructorInfoNum = event.path[0].value.length
      }
    },
    watch:{
      'data.instructorType': function (curVal, oldVal) {
        this.instructorTypeNum = curVal.length
      },
      'data.instructorInfo':function (curVal) {
        this.instructorInfoNum = curVal.length
      }
    },
    computed:{
      //老师头衔的字数
      // instructorTypeNum: function () {
      //   return this.instructorType.length
      // }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .text-red
    color red

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
  .upload-tip
    margin-left 10px
    color #ccc
  .type-warp
    position: relative
    .type-num
      position absolute
      bottom 0
      right 5px

  .info-warp
    position relative
    .info-num
      position absolute
      bottom 0
      right 15px
</style>
