<template>
  <div>
    <div class="addCourse">
      <span>课程信息</span>
      <el-button plain style="float:right">返回</el-button>
    </div>
    <div class="addCourse-center">
      <el-form :model="data" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="课程名称" required>
          <el-input v-model="data.courseName" style="width: 220px;"></el-input>
        </el-form-item>

        <el-form-item label="课程分类" required>
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起止时间" required>
          <el-date-picker
                  v-model="data.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="课程封面" required>
          <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="课程价格" required>
          <el-radio v-model="data.courseStatus" label="1">免费</el-radio>
          <el-radio v-model="data.courseStatus" label="2">收费</el-radio>
          <el-input v-model="data.coursePrice" style="width: 80px;margin-left:50px;margin-right:20px;"></el-input>
          <span>元</span>
        </el-form-item>

        <el-form-item label="课程标签" required>
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="讲师" required>
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" round style="margin-left: 20px;">创建讲师</el-button>
        </el-form-item>

        <el-form-item label="教学老师" required>
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选课名单" required>
          <el-row>
            <span>开放范围：</span>
            <el-radio v-model="data.courseStatus" label="1">选课名单学员</el-radio>
            <el-radio v-model="data.courseStatus" label="2">本校学员</el-radio>
            <el-radio v-model="data.courseStatus" label="3">全部学员</el-radio>
          </el-row>
          <el-row>
            <span>退课权限：</span>
            <el-checkbox v-model="data.isQuitCourse">允许退课</el-checkbox>
          </el-row>
        </el-form-item>

        <el-form-item label="成绩考核" required>
          <span class="courseExplanation">视频50% | 测验30% | 讨论20%</span>
          <a class="sysTem" @click="isSys">设置</a>
        </el-form-item>

        <el-form-item label="课程介绍" required>
          <div id="editor1"></div>
        </el-form-item>

        <el-form-item label="教学目标" required>
          <div id="editor2"></div>
        </el-form-item>

        <el-form-item label="教学安排" required>
          <div id="editor3"></div>
        </el-form-item>
      </el-form>
      <el-row style="text-align: right">
        <el-button type="primary">完成</el-button>
        <el-button type="success">下一步，上传课程资源</el-button>
      </el-row>
    </div>

    <!--弹出的设置说明-->
    <el-dialog
            title="设置"
            :visible.sync="isSysTem"
            width="50%">
      <span>这是一段信息</span>
      <el-row>
        <el-button @click="isSysTem = false">取 消</el-button>
        <el-button type="primary" @click="isSysTem = false">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import wangEditor from 'wangeditor'
  export default {
    data(){
      return{
        data:{
          courseName:'',  //课程名称
          courseCategoryParent:'',  //课程分类
          time:[],  //开始时间结束时间
          courseStatus:'1', //是否免费
          coursePrice:0,  //收费价格
          isQuitCourse:false, //是否允许退课
        },
        isSysTem:false, //弹出设置
        imageUrl:'',  //封面图片字段
        rules:[],
        //以下三个是富文本属性
        editor1:null,
        editor2:null,
        editor3:null,
        //下拉框选择
        options:[{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
        selectValue:0,
      }
    },
    methods:{
      //弹出设置
      isSys(){
        this.isSysTem = true
      },
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
    },
    mounted(){
      this.editor1 = new wangEditor('#editor1')
      this.editor1.create()
      this.editor2 = new wangEditor('#editor2')
      this.editor2.create()
      this.editor3 = new wangEditor('#editor3')
      this.editor3.create()
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .addCourse
    overflow: hidden
    height:50px

  .addCourse-center
    .courseExplanation
      color:#b3b3b3

    .sysTem
      color:#3EABA8
      margin-left:20px

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
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center
    border:1px solid #ded5d5

  .avatar
    width: 178px
    height: 178px
    display: block

</style>
