<template>
  <div>
    <div class="addCourse">
      <span>课程信息</span>
      <el-button plain style="float:right">返回</el-button>
    </div>
    <div class="addCourse-center">
      <el-form :model="Course" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="课程名称" required>
          <el-input v-model="Course.courseName" style="width: 220px;"></el-input>
        </el-form-item>

        <el-form-item label="课程分类" required>
          <el-cascader
              placeholder="请选择课程分类"
              :options="categoriesList"
              :props='categoriesConfig'
              @change="yesCategories"
              filterable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="起止时间" required>
          <el-date-picker
              v-model="courseTime"
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
            <img v-if="Course.courseCover" :src="Course.courseCover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="课程价格" required>
          <el-radio v-model="Course.payMode" label="10">免费</el-radio>
          <el-radio v-model="Course.payMode" label="20">收费</el-radio>
          <el-input v-model="Course.coursePrice" style="width: 80px;margin-left:50px;margin-right:20px;" v-show="Number(Course.payMode) === 20"></el-input>
          <span v-show="Number(Course.payMode) === 20">元</span>
        </el-form-item>

        <el-form-item label="课程标签" required>
          <el-cascader
              placeholder="请选择课程标签"
              :options="tagsList"
              :props='tagsConfig'
              @change="yesTages"
              filterable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="讲师" required>
          <el-select
              v-model="CourseForm.instructor"
              multiple
              filterable
              allow-create
              default-first-option
              @change="yesInstructor"
              placeholder="请选择讲师">
            <el-option
                v-for="item in instructorLists"
                :key="item.instructorId"
                :label="item.instructorName"
                :value="item.instructorId">
            </el-option>
          </el-select>
          <el-button type="primary" round style="margin-left: 20px;" @click="isTeacher = true">创建讲师</el-button>
        </el-form-item>

        <el-form-item label="教学老师" required>
          <el-select
              v-model="CourseForm.teacher"
              multiple
              filterable
              allow-create
              default-first-option
              @change="yesTeacher"
              placeholder="请选择讲师">
            <el-option
                v-for="item in teachersLists"
                :key="item.userId"
                :label="item.teacherName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选课名单" required>
          <el-row>
            <span>开放范围：</span>
            <el-radio v-model="Course.courseMode" label="10">选课名单学员</el-radio>
            <el-radio v-model="Course.courseMode" label="20">本校学员</el-radio>
            <el-radio v-model="Course.courseMode" label="30">全部学员</el-radio>
          </el-row>
          <el-row>
            <span>退课权限：</span>
            <el-checkbox v-model="Course.dropCourse">允许退课</el-checkbox>
          </el-row>
        </el-form-item>

        <el-form-item label="成绩考核" required>
          <span class="courseExplanation">视频50% | 测验30% | 讨论20%</span>
          <a class="sysTem" @click="isSys">设置</a>
        </el-form-item>

        <el-form-item label="课程代码">
          <el-input v-model="Course.courseCode" style="width: 120px;"></el-input>
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
        <el-button type="success" @click="goUpCourseResource">下一步，上传课程资源</el-button>
      </el-row>
    </div>

    <!--弹出的设置说明-->
    <el-dialog
        title="成绩权重设定"
        :visible.sync="isSysTem"
        style="z-index: 10002"
        class="isSystem"
        width="70%">
      <el-row>
        <div class="top">
          <span>满分：100</span>
          <span>最终得分 = A + B + C + D + E + F +G</span>
          <span>*单项考核权重为0则不计入成绩！</span>
        </div>
        <div class="center">
          <div class="left">
            <table class="tables">
              <tr class="tr-h no-tr">
                <td>评分项</td>
                <td>视频</td>
                <td>测验</td>
                <td>作业</td>
                <td>讨论</td>
                <td>线下</td>
                <td>投票问卷</td>
                <td>头脑风暴</td>
              </tr>
              <tr class="tr-h">
                <td>权重共100%</td>
                <td>
                  <el-input v-model="CourseSetEntity.videoPercent" style="width:50px;" @change="canvasTab"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.quizPercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.homeworkPercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.topicPercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.offlinePercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.votePercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.stormPercent" style="width:50px"></el-input>%
                </td>
              </tr>
              <tr class="tr-h">
                <td>单项分数</td>
                <td>
                  <span class="icons" style="background:#FE6370">A</span>
                </td>
                <td>
                  <span class="icons" style="background:#63BAEE">B</span>
                </td>
                <td>
                  <span class="icons" style="background:#B8E664">C</span>
                </td>
                <td>
                  <span class="icons" style="background:#E38EF7">D</span>
                </td>
                <td>
                  <span class="icons" style="background:#FFB8CA">E</span>
                </td>
                <td>
                  <span class="icons" style="background:#ED9B63">F</span>
                </td>
                <td>
                  <span class="icons" style="background:#FFC0CB">G</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="right">
            <div id="echart"></div>
          </div>
        </div>
        <div class="norm">
          <span>单项评分标准</span>
          <span class="norm-right">（默认分数全部为100分，投票问卷默认90分）</span>
        </div>
        <div class="score">
          <div class="list">视频得分 = 完整观看视频 / 总视频数 * 100 分 * {{CourseSetEntity.videoPercent}}%</div>
          <div class="list">测试得分 = 测试得分总和 / 测验次数 * {{CourseSetEntity.quizPercent}}%</div>
          <div class="list">作业得分 = 作业得分总和 / 作业次数 * {{CourseSetEntity.homeworkPercent}}%</div>
          <div class="list">讨论得分 = 获得分数的讨论数 / 讨论次数 * 100分 * {{CourseSetEntity.topicPercent}}%</div>
          <div class="list">线下得分 = 线下得分 * {{CourseSetEntity.offlinePercent}}%</div>
          <div class="list">投票问卷得分 = 投票问卷得分 * {{CourseSetEntity.votePercent}}%</div>
          <div class="list">头脑风暴得分 = 头脑风暴得分 * {{CourseSetEntity.stormPercent}}%</div>
        </div>
      </el-row>
<!--
      <el-row style="text-align: right;">
        <el-button @click="isSysTem = false">取 消</el-button>
        <el-button type="primary" @click="isSysTem = false">确 定</el-button>
      </el-row>
-->
    </el-dialog>

    <!--创建讲师-->
        <el-dialog
            title="添加授课老师"
            :visible.sync="isTeacher"
            width="50%">

          <addTeachers v-on:goAddTeachersData="teachersData"></addTeachers>
        </el-dialog>
  </div>
</template>

<script>
  import wangEditor from 'wangeditor'
  import echarts from 'echarts'
  import addTeachers from './upCourse/addTeacher.vue'
  import { categories, tags, instructorList, teachersList, saveCourse, courseInfo } from '../../api/course'
  import { formatDate } from '../../utils/utils'
  export default {
    components:{
      addTeachers
    },
    data(){
      return{
        Course:{
          courseName:'',  //课程名称
          courseCategoryParent:'',  //课程分类
          courseCategory:'',  //课程子分类
          courseTagParent:'', //课程标签
          courseTag:'', //课程子标签
          beginTime:'', //开课时间
          endTime:'', //结课时间
          courseCover:'', //课程封面
          payMode:'10',  //课程价格 10授课 20售卖
          coursePrice:0, //课程价格
          courseMode:'10',  //10：教师导入 20 本校学生 30 全部学员 ,
          dropCourse:false, //1 允许退课 2 不允许
          courseCode:'',  //课程代码/课程编码
          teacher:'', //教师id
          //一下的默认值
          studyMode:10, //课程学习模式
          difficultyStatus:10,  //课程难度
          courseType:10,  //课程类别
        },
        //给到的教师信息
        CourseForm:{
          instructor:[],  //要保存的讲师Id
          teacher:[], //要保存的教师Id
        },
        //课程完成度
        CourseSetEntity:{
          homeworkPercent:0, // 作业成绩占比
          offlinePercent:0,  // 线下成绩占比
          quizPercent:30, //测验成绩占比
          stormPercent:0,  //头脑风暴占比
          topicPercent:20,  //讨论成绩占比
          videoPercent:50,  //视频成绩占比
          votePercent:0, //投票问卷占比
        },
        //课程相关
        CourseInfoEntity:{
          courseDescription:null, //课程信息
          teachingArrangement:null, //教学安排
          teachingTarget:null, //教学目标
        },
        courseTime:[],  //课程开始 and 结束时间
        isSysTem:false, //弹出设置
        isTeacher:false,  //弹出添加老师
        rules:[],
        //以下三个是富文本属性
        editor1:null,
        editor2:null,
        editor3:null,
        //一下是三个的监听方法
        addEditor1:null,
        addEditor2:null,
        addEditor3:null,
        //课程分类
        categoriesList:[],
        //配置二级
        categoriesConfig:{
          label:'categoryName',
          value:'categoryId',
          children:'children'
        },
        //课程标签列表
        tagsList:[],
        //配置二级
        tagsConfig:{
          label:'tagName',
          value:'tagId',
          children:'children'
        },
        //讲师列表
        instructorLists:[],
        //教师列表
        teachersLists:[]
      }
    },
    watch:{
      //监听日期变化
      courseTime(a){
        this.Course.beginTime = formatDate(new Date(a[0]).getTime())
        this.Course.endTime = formatDate(new Date(a[1]).getTime())
      }
    },
    created(){
      this.$emit('floorStatus','course')
      this.selectList()
      // if(this.$route.query.courseId)
      console.log(this.$route.query)
      if(this.$route.query.courseId && this.$route.query.courseId !== ''){
        this.getUpData(this.$route.query.courseId)
      }
    },
    methods:{
      //进入查询编辑数据
      getUpData(e){
        courseInfo(e).then(res=>{
          console.log(res)
        }).catch(error=>{
          console.log(error)
        })
      },
      //创建讲师
      teachersData (e) {
        if(e !== ''){
          this.instructorLists.push(e)
        }
        this.isTeacher = false
      },
      //教师
      yesTeacher (e) {
        this.CourseForm.teacher = e
      },
      //讲师
      yesInstructor (e) {
        this.CourseForm.instructor = e
      },
      //标签数据赋值
      yesTages(e){
        this.Course.courseTagParent = e[0]
        this.Course.courseTag = e[1]
      },
      //分类数据赋值
      yesCategories(e){
        this.Course.courseCategoryParent = e[0]
        this.Course.courseCategory = e[1]
      },
      goUpCourseResource(){
        let data = {
          course:this.Course,
          info:this.CourseInfoEntity,
          set:this.CourseSetEntity
        }
        data.course.dropCourse = !data.course.dropCourse ? 1 : 2
        let fun = null

        saveCourse(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200) {
            this.$router.push({
              path:'/course/upCourses/resource'
            })
          }else if(Number(res.code) === 440){
            this.$message({
              message:res.msg,
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //弹出设置
      isSys(){
        this.isSysTem = true
        this.canvasTab()
      },
      //表格渲染
      canvasTab(){
        let self = this
        setTimeout(function () {
          let myChart = echarts.init(document.getElementById('echart'));
          // 绘制图表
          myChart.setOption({
            color:['#FE6370','#63BAEE','#B8E664','#E38EF7','#FFB8CA','#ED9B63','#FFC0CB'],
            series: [
              {
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data:[
                  {value:self.CourseSetEntity.videoPercent, name:'视频'},
                  {value:self.CourseSetEntity.quizPercent, name:'测验'},
                  {value:self.CourseSetEntity.homeworkPercent, name:'作业'},
                  {value:self.CourseSetEntity.topicPercent, name:'讨论'},
                  {value:self.CourseSetEntity.offlinePercent, name:'线下'},
                  {value:self.CourseSetEntity.votePercent, name:'投票问卷'},
                  {value:self.CourseSetEntity.stormPercent, name:'头脑风暴'}
                ]
              }
            ]
          })
        },0)
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
      },
      //获取基础选择列表分类信息
      selectList () {
        //课程列表
        categories().then(res=>{
          if(Number(res.code) === 200){
            //数据处理
            let data = this.electChilder(res.data)
            this.categoriesList = data
          }else{
            this.$message({
              message:'课程分类数据获取失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
        //课程标签列表
        tags().then(res=>{
          if(Number(res.code) === 200){
            let data = this.electChilder(res.data)
            this.tagsList = data
          }else{
            this.$message({
              message:'课程列表获取失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
        //讲师列表
        instructorList().then(res=>{
          // console.log(res)
          if(Number(res.code) === 200){
            this.instructorLists = res.data
          }else{
            this.$message({
              message:'讲师列表获取失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
        //教师列表
        teachersList().then(res=>{
          // console.log(res)
          if(Number(res.code) === 200){
            this.teachersLists = res.data
          }else{
            this.$message({
              message:'获取教师列表失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      //删除空的childer
      electChilder (data) {
        data.forEach(item => {
          if (item.children && !item.children.length) {
            delete item.children;
          } else {
            item.children = this.electChilder(item.children)
          }
        });
        return data;
      },
    },
    mounted(){
      //课程介绍
      let self = this
      this.editor1 = new wangEditor('#editor1')
      this.editor1.customConfig.onblur = function (html) {
        self.CourseInfoEntity.courseDescription = html
      }
      this.editor1.customConfig.zIndex = 100
      this.addEditor1 = this.editor1.customConfig.onchange = function (html) {
        self.CourseInfoEntity.courseDescription = html
      }
      this.editor1.create()
      //教学目标
      this.editor2 = new wangEditor('#editor2')
      this.editor2.customConfig.onblur = function (html) {
        self.CourseInfoEntity.teachingTarget = html
      }
      this.editor2.customConfig.zIndex = 100
      this.addEditor2 = this.editor1.customConfig.onchange = function (html) {
        self.CourseInfoEntity.teachingArrangement = html
      }
      this.editor2.create()
      //教学安排
      this.editor3 = new wangEditor('#editor3')
      this.editor3.customConfig.onblur = function (html) {
        self.CourseInfoEntity.teachingArrangement  = html
      }
      this.editor3.customConfig.zIndex = 100
      this.addEditor3 = this.editor1.customConfig.onchange = function (html) {
        self.CourseInfoEntity.teachingTarget = html
      }
      this.editor3.create()
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .addCourse
    overflow: hidden
    height:50px

  .isSystem
    .top
      padding-bottom:10px
      overflow:hidden

    .center
      .left
        display:inline-block

        .tables
          border:1px solid #E4E4E6

          .tr-h
            height:45px
            line-height: 45px
            border-top:1px solid #E4E4E6
            display:block

            td
              width:80px
              text-align:center
              border-right:1px solid #E4E4E6

              .icons
                display: inline-block
                background: #000
                color:#ffffff
                width:30px
                height: 30px
                line-height:30px
                -webkit-border-radius: 50%
                -moz-border-radius: 50%
                border-radius: 50%
                margin-top: 10px

            td:nth-child(1)
              background:#F2FCFF

            td:nth-last-child(1)
              border-right:none

              input
                height:30px
                padding:0

          .no-tr
            border-top:none

      .right
        margin-left:50px
        display:inline-block
        width:100px
        height:100px
        vertical-align:top

        #echart
          width: 100%
          height:100%

    .norm
      margin-top:10px
      border:1px solid #E4E4E6
      padding-top:10px
      padding-bottom:10px
      text-indent:10px

      .norm-right
        font-size:12px
        color:#59C2BB

    .score
      padding-top:10px
      border-left:1px solid #E4E4E6
      border-right:1px solid #E4E4E6
      border-bottom:1px solid #E4E4E6
      text-indent:10px
      margin-bottom:10px

      .list
        padding-top:10px
        padding-bottom:10px

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
