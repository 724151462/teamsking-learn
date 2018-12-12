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
<!--          <el-cascader
              placeholder="请选择课程分类"
              :options="categoriesList"
              :props='categoriesConfig'
              @change="yesCategories"
              filterable
          ></el-cascader>-->
          <el-select v-model="Course.courseCategoryParent" placeholder="课程一级分类" @change="yesCategories">
            <el-option
              v-for="(item , index) in categoriesList"
              :key="index"
              :label="item.categoryName"
              :value="item.categoryName">
            </el-option>
          </el-select>
          <el-select
            v-model="Course.courseCategory"
            placeholder="课程二级分类"
            style="margin-left: 30px"
            v-show="isCourseChild">
            <el-option
              v-for="item in categoriesChildList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起止时间" required>
          <div class="block">
            <el-date-picker
                    v-model="Course.beginTime"
                    type="datetime"
                    prefix-icon="el-icon-date"
                    placeholder="选择日期时间"
                    default-time="12:00:00">
            </el-date-picker>
            <span style="margin: 0 20px">至</span>
            <el-date-picker
                    v-model="Course.endTime"
                    type="datetime"
                    prefix-icon="el-icon-date"
                    placeholder="选择日期时间"
                    default-time="12:00:00">
            </el-date-picker>
          </div>
<!--          <el-date-picker
              v-model="courseTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>-->
        </el-form-item>

        <el-form-item label="课程封面" required>
          <img src="@/assets/images/cover/1.jpg" alt="" style="width: 280px;height: 160px;">
          <!--课程封面分辨比率为280x160-->
          <el-button type="primary"
                     style="margin-left: 20px;"
                     @click="coverPreviewShow = true"
                     >选择封面图
          </el-button>
        </el-form-item>
        <cover-preview :show="coverPreviewShow" @closeCoverPreview="closeCoverPreview"></cover-preview>

        <el-form-item label="课程价格" required>
          <el-radio v-model="Course.payMode" label="10">免费</el-radio>
<!--          <el-radio v-model="Course.payMode" label="20">收费</el-radio>
          <el-input v-model="Course.coursePrice" style="width: 80px;margin-left:50px;margin-right:20px;" v-show="Number(Course.payMode) === 20"></el-input>
          <span v-show="Number(Course.payMode) === 20">元</span>-->
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

        <el-form-item label="教学课程授权" label-width="120px" required>
            <el-button type="text" @click="isAccredit = true">设置</el-button>
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
          <div style="display: inline-block" v-for="item in CourseSetEntity" :key="item.id">
            <span class="courseExplanation" v-if="item.value !=0" style="margin-right: 10px">{{item.name}}{{item.value}}%</span>
          </div>
          <a class="sysTem" @click="isSys">设置</a>
        </el-form-item>

        <el-form-item label="课程代码">
          <el-input v-model="Course.courseCode" style="width: 120px;"></el-input>
        </el-form-item>
<!--        <div style="margin-left: 30px;margin-bottom: 22px">
          <el-checkbox v-model="Course.isCoursePackge">引用已有课程包</el-checkbox>
          <el-select v-model="Course.coursePackge" filterable placeholder="请选择" style="margin-left: 12px">
            <el-option
                    v-for="item in Course.coursePackgeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
          <span style="margin-left: 12px" class="remind-text-color">下拉选择已有课程包</span>
        </div>-->
        <el-form-item label="课程介绍" required>
          <el-row style="text-align: right">
            <el-button type="text" v-show="!iseditor1" @click="iseditor1 = true">设置</el-button>
          </el-row>
          <div id="editor1" v-show="iseditor1"></div>
        </el-form-item>

        <el-form-item label="教学目标" required>
          <el-row style="text-align: right">
            <el-button type="text" v-show="!iseditor2" @click="iseditor2 = true">设置</el-button>
          </el-row>
          <div id="editor2" v-show="iseditor2"></div>
        </el-form-item>

        <el-form-item label="教学安排" required>
          <el-row style="text-align: right">
            <el-button type="text" v-show="!iseditor3" @click="iseditor3 = true">设置</el-button>
          </el-row>
          <div id="editor3" v-show="iseditor3"></div>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center">
        <el-button type="primary" @click="goUpCourseResource">完成</el-button>
      </el-row>
    </div>
    <!--教学课程授权设置-->
      <el-dialog title="教学课程授权" :visible.sync="isAccredit" width="50%" class="addCourse-dialog">
          <el-autocomplete
                  class="accredit-input"
                  v-model="Course.accreditTeacher"
                  suffix-icon="el-icon-search"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="accreditSelect"
          ></el-autocomplete>
        <div>
          <el-checkbox-group v-model="Course.accreditTeacherList">
            <el-checkbox v-for="teacher in teachersLists" :label="teacher.teacherName" :value="teacher.teacherNumber" :name="teacher.teacherNumber" :key="teacher.id"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="isAccredit = false">确 定</el-button>
            <el-button @click="isAccredit = false">取 消</el-button>
        </div>
      </el-dialog >
    <!--弹出的设置说明-->
    <el-dialog
        title="成绩权重设定"
        :visible.sync="isSysTem"
        style="z-index: 10002"
        class="isSystem"
        width="70%">
      <el-row>
        <div class="top">
          <span>满分：100分</span>
          <span style="text-align: right;float: right">*单项考核权重为0则不计入成绩！</span>
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
                  <el-input v-model="CourseSetEntity.videoPercent.value" style="width:50px;"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.quizPercent.value" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.homeworkPercent.value" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.topicPercent.value" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.offlinePercent.value" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.votePercent.value" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.stormPercent.value" style="width:50px"></el-input>%
                </td>
              </tr>
              <!--<tr class="tr-h">
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
              </tr>-->
            </table>
          </div>
        </div>
        <div style="overflow: hidden;">
          <div style="float: left;">
            视频完成度:
          </div>
          <div style="float: left">
            <p>
              观看完单个视屏的
              <el-input v-model="CourseSetEntity.seeVideo.value" style="width:50px"></el-input>%
              即可视为学生已完成该视频
            </p>
            <p>(请谨慎设置，一旦有学生已开始学习，完成度规则将无法再更改)</p>
          </div>
        </div>
        <div class="norm">
          <span>单项评分标准</span>
          <span class="norm-right">（默认分数全部为100分，投票问卷默认90分）</span>
        </div>
        <div class="score">
          <div class="list">视频得分 = 完整观看视频 / 总视频数 * 100 分 * <span class="blue-text">{{CourseSetEntity.videoPercent.value}}</span>%</div>
          <div class="list">测试得分 = 测试得分总和 / 测验次数 * <span class="blue-text">{{CourseSetEntity.quizPercent.value}}</span>%</div>
          <div class="list">作业得分 = 作业得分总和 / 作业次数 * <span class="blue-text">{{CourseSetEntity.homeworkPercent.value}}</span>%</div>
          <div class="list">讨论得分 = 获得分数的讨论数 / 讨论次数 * 100分 * <span class="blue-text">{{CourseSetEntity.topicPercent.value}}</span>%</div>
          <div class="list">线下得分 = 线下得分 * <span class="blue-text">{{CourseSetEntity.offlinePercent.value}}</span>%</div>
          <div class="list">投票问卷得分 = 投票问卷得分 * <span class="blue-text">{{CourseSetEntity.votePercent.value}}</span>%</div>
          <div class="list">头脑风暴得分 = 头脑风暴得分 * <span class="blue-text">{{CourseSetEntity.stormPercent.value}}</span>%</div>
        </div>
      </el-row>
      <el-row style="text-align: right;">
        <el-button type="primary" @click="isSysTem = false">确 定</el-button>
        <el-button @click="isSysTem = false">取 消</el-button>
      </el-row>
    </el-dialog>
    <!--创建讲师-->
    <el-dialog
            title="新增讲师"
            :visible.sync="isTeacher"
            width="50%">

          <addTeachers v-on:goAddTeachersData="teachersData"></addTeachers>
    </el-dialog>
  </div>
</template>

<script>
  import wangEditor from 'wangeditor'
  import vueCropper from 'vue-cropper'
  import addTeachers from './upCourse/addTeacher.vue'
  import coverPreview from './coverPreview.vue'
  import { categories, tags, instructorList, teachersList, saveCourse, courseInfo } from '../../api/course'
  import { formatDate } from '../../utils/utils'
  export default {
    components:{
      addTeachers,
      coverPreview,
      vueCropper
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
          accreditTeacher:'',// 授权教师搜索框
          accreditTeacherList:[], //被授权教师列表
          isCoursePackge:true, //是否引用已有课程包
          coursePackge:'',
          coursePackgeList:[
            { "id": "1", "value": "商业贸易" },
            { "id": "2", "value": "历史学" }
            ], //课程包列表
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
        CourseSetEntity: {
          videoPercent: {// 视频成绩占比
            value: 50,
            name: '视频'
          },
          homeworkPercent :{// 作业成绩占比
            value: 0,
            name: '作业'
          },
          quizPercent :{// 测试成绩占比
            value: 30,
            name: '测试'
          },
          offlinePercent :{// 线下成绩占比
            value: 0,
            name: '线下'
          },
          stormPercent :{// 头脑风暴成绩占比
            value: 20,
            name: '头脑风暴'
          },
          topicPercent :{// 讨论成绩占比
            value: 0,
            name: '讨论'
          },
          votePercent :{// 投票成绩占比
            value: 0,
            name: '投票'
          },
          seeVideo: {// 视频进度判定
            value: 90,
            name: '视频完成度'
          },
        },
        //课程相关
        CourseInfoEntity:{
          courseDescription:null, //课程信息
          teachingArrangement:null, //教学安排
          teachingTarget:null, //教学目标
        },
        courseTime:[],  //课程开始 and 结束时间
        isAccredit:false, //弹出教学课程授权
        isSysTem:false, //弹出设置
        coverPreviewShow: false, //弹出课程封面上传
        isTeacher:false,  //弹出添加老师
        isChooseTeacher:false, //选择讲师
        rules:[],
        //三个富文本的显隐
        iseditor1:false,
        iseditor2:false,
        iseditor3:false,
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
        //二级课程
        categoriesChildList:[],
        //二级课程选择框的隐显
        isCourseChild: false,
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
        teachersLists:[],
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
      // this.selectListselectList()
      // if(this.$route.query.courseId)
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
      //赋值二级课程
      yesCategories(e){
        let course = e
        this.categoriesList.forEach( (item, index) =>{
          if(item.categoryName === course){
            this.categoriesChildList = item.children
            this.isCourseChild = true
          }
        })
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
            let msgs = JSON.parse(res.msg)
            this.$message({
              message:msgs[0].message,
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
        // this.canvasTab()
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
          // console.log('课程列表数据:'+JSON.stringify(res))
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
          // console.log('课程标签列表'+JSON.stringify(res));
          if(Number(res.code) === 200){
            let data = this.electChilder(res.data)
            this.tagsList = data
            // console.log('标签列表:' + this.tagsList)
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
          // console.log('讲师列表:' +JSON.stringify(res))
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
          console.log('教师列表:' +JSON.stringify(res))
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
          // 如果没有children
          if ( typeof(item.children) == "undefined") {

          }else if (item.children && !item.children.length) {
            delete item.children;
          } else {
            item.children = this.electChilder(item.children)
          }
        });
        return data;
      },
      //教师授权搜索框
      accreditSelect(item) {
        console.log(item);
      },
      //教师授权搜索提示框
      querySearch(queryString, cb) {
        var restaurants = JSON.stringify(this.teachersLists);
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      // 上传封面图片弹窗的关闭
      closeCoverPreview () {
        this.coverPreviewShow = false
      }
    },
    mounted(){
      if(this.$route.query.type === 'upData') {
        
      }
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
  .blue-text
    color #40caff
  .remind-text-color
    ccolor:#606266
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

  .accredit-input{
    margin-right 30px
    margin-left 65%
    border-radius 30px
  }
</style>
