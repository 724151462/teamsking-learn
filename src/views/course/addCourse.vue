<template>
  <div>
    <!--加载动画-->
    <div v-show="showLoading">
      <div class="tq_loading__mask"></div>
      <div class="tq_loading-wrapper">
        <div class="tq_loading__loading-wrapper">
          <square :background="'#409eff'"></square>
        </div>
        <div class="tq_loading__text">正在加载</div>
      </div>
    </div>
    <mb-nav :pathList="[{path:'/course/list',name:'课程列表'}]" nowName="创建课程"></mb-nav>
    <div class="addCourse-center">
      <el-form :model="Course" :rules="courseRules" ref="Course" label-width="100px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="Course.courseName" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="课程分类" required>
          <el-select
            style="width: 220px;"
            v-model="Course.courseCategoryParent"
            placeholder="课程一级分类"
            filterable
            @change="yesCategories"
          >
            <el-option
              v-for="(item , index) in categoriesList"
              :key="index"
              :label="item.categoryName"
              :value="item.categoryId"
            ></el-option>
          </el-select>
          <el-select
            v-model="Course.courseCategory"
            placeholder="课程二级分类"
            style="margin-left: 30px;width: 220px;"
            filterable
            v-show="isCourseChild"
          >
            <el-option
              v-for="item in categoriesChildList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起止时间" prop="beginTime">
          <div class="block">
            <el-date-picker
              style="width:180px"
              :disabled="begTimeDis"
              v-model="Course.beginTime"
              type="date"
              prefix-icon="el-icon-date"
              placeholder="选择开始时间"
              value-format="yyyy-MM-dd 00:00:00"
            ></el-date-picker>
            <span style="margin: 0 20px">至</span>
            <el-form-item prop="endTime" style="display: inline-block">
              <el-date-picker
                v-model="Course.endTime"
                type="date"
                style="width:180px"
                prefix-icon="el-icon-date"
                placeholder="选择结束时间"
                value-format="yyyy-MM-dd 00:00:00"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="课程封面" required>
          <div class="avatar-uploader" @click="coverPreviewShow = true">
            <img v-if="Course.courseCover" :src="Course.courseCover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-form-item>

        <cover-preview
          :show="coverPreviewShow"
          @closeCoverPreview="closeCoverPreview"
          @chooseCover="chooseCover"
        ></cover-preview>

        <!--<el-form-item label="课程价格" required>-->
        <!--<el-radio v-model="Course.payMode" :label="10">免费</el-radio>-->
        <!--<el-radio v-model="Course.payMode" label="20">收费</el-radio>-->
        <!--<el-input v-model="Course.coursePrice" style="width: 80px;margin-left:50px;margin-right:20px;" v-show="Number(Course.payMode) === 20"></el-input>-->
        <!--<span v-show="Number(Course.payMode) === 20">元</span>-->
        <!--</el-form-item>-->
        <el-form-item label="课程标签">
          <div class="course-tag-warp" v-show="Course.courseTagIds.length !== 0">
            <el-tag
              size="small"
              v-for="tag in Course.courseTagIds"
              :key="tag.id"
              @close="tagRemove(tag)"
              closable
            >{{tag.tagName}}</el-tag>
          </div>

          <el-row>
            <el-autocomplete
              style="width: 300px;"
              v-model="tag"
              suffix-icon="el-icon-search"
              :fetch-suggestions="tagSearch"
              placeholder="选择课程标签"
              @select="yesTages"
            ></el-autocomplete>
          </el-row>
        </el-form-item>

        <el-form-item label="讲师">
          <div class="instructor-tag-warp" v-show="CourseForm.instructor.length !== 0">
            <el-tag
              size="small"
              v-for="instructor in CourseForm.instructor"
              :key="instructor.id"
              @close="instructorRemove(instructor)"
              closable
            >{{instructor.instructorName}}</el-tag>
          </div>

          <el-row>
            <el-autocomplete
              style="width: 300px;"
              v-model="instructor"
              suffix-icon="el-icon-search"
              :fetch-suggestions="instructorSearch"
              placeholder="请输入老师名字搜索"
              @select="yesInstructor"
            ></el-autocomplete>
            <el-button
              type="primary"
              size="medium"
              style="margin-left: 20px;display: inline-block"
              @click="isTeacher = true"
            >增加讲师</el-button>
          </el-row>
        </el-form-item>

        <el-form-item label="教学课程授权" label-width="120px" required>
          <el-button type="text" @click="isAccredit = true">设置</el-button>
        </el-form-item>
        <div class="teacher-list">
          <span v-for="teacher in CourseForm.teacher" :key="teacher.id" class="teacher">{{teacher}}</span>
        </div>
        <!--{{this.CourseForm.teacher}}-->
        <el-form-item label="选课名单" required>
          <el-row>
            <span>开放范围：</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="只对本校认证的学员开放，其他学员无法学习！"
              placement="bottom-start"
            >
              <el-radio v-model="Course.courseMode" :label="20">本校学员</el-radio>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="只对选课名单内的学生开放，需要导入选课学生名单"
              placement="bottom-start"
            >
              <el-radio v-model="Course.courseMode" :label="10">选课名单学员</el-radio>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="对所有学员开放！" placement="bottom-start">
              <el-radio v-model="Course.courseMode" :label="30">全部学员</el-radio>
            </el-tooltip>
          </el-row>
          <el-row>
            <span>退课权限：</span>
            <el-checkbox v-model="Course.dropCourse">允许退课</el-checkbox>
          </el-row>
        </el-form-item>

        <el-form-item label="成绩考核" required>
          <div style="display: inline-block">
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.videoPercent"
              style="margin-right: 10px"
            >视频{{CourseSetEntity.videoPercent}}%</span>
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.docPercent"
              style="margin-right: 10px"
            >文档{{CourseSetEntity.docPercent}}%</span>
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.quizPercent"
              style="margin-right: 10px"
            >测试{{CourseSetEntity.quizPercent}}%</span>
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.homeworkPercent"
              style="margin-right: 10px"
            >作业{{CourseSetEntity.homeworkPercent}}%</span>
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.offlinePercent"
              style="margin-right: 10px"
            >线下{{CourseSetEntity.offlinePercent}}%</span>
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.votePercent"
              style="margin-right: 10px"
            >投票{{CourseSetEntity.votePercent}}%</span>
            <span
              class="courseExplanation"
              v-show="CourseSetEntity.stormPercent"
              style="margin-right: 10px"
            >头脑风暴{{CourseSetEntity.stormPercent}}%</span>
          </div>
          <a class="sysTem" @click="isSys">设置</a>
        </el-form-item>

        <el-form-item label="课程代码">
          <el-input v-model="Course.courseCode" style="width: 120px;"></el-input>
        </el-form-item>
        <!--引用课程包，二期需求-->
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
          <el-row>
            <el-button type="text" v-show="!iseditor1" @click="iseditor1 = true">设置</el-button>
            <div id="editor1" v-show="iseditor1"></div>
          </el-row>
        </el-form-item>
        <el-form-item label="教学目标" required>
          <el-row>
            <el-button type="text" v-show="!iseditor2" @click="iseditor2 = true">设置</el-button>
            <div id="editor2" v-show="iseditor2"></div>
          </el-row>
        </el-form-item>

        <el-form-item label="教学安排" required>
          <el-row>
            <el-button type="text" v-show="!iseditor3" @click="iseditor3 = true">设置</el-button>
            <div id="editor3" v-show="iseditor3"></div>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row style="text-align: center" v-if="!isUpdata">
        <el-button type="primary" @click="goUpCourseResource">完成</el-button>
        <el-button @click="()=>{this.$router.push('/course/list')}">取消</el-button>
      </el-row>
      <el-row style="text-align: center" v-else>
        <el-button type="primary" @click="goPutCourse">修改</el-button>
        <el-button @click="()=>{this.$router.push('/course/list')}">取消</el-button>
      </el-row>
    </div>
    <!--教学课程授权设置-->
    <el-dialog
      title="教学课程授权"
      :visible.sync="isAccredit"
      width="50%"
      class="addCourse-dialog teacher-dialog"
    >
      <el-autocomplete
        class="accredit-input"
        v-model="accreditTeacher"
        suffix-icon="el-icon-search"
        :fetch-suggestions="teacherSearch"
        placeholder="输入名字进行搜索"
        @select="yesTeacher"
      ></el-autocomplete>
      <div>
        <el-checkbox-group v-model="CourseForm.teacher">
          <el-checkbox
            v-for="teacher in teachersLists"
            :label="teacher.teacherName"
            :value="teacher.teacherId"
            :name="teacher.teacherNumber"
            :key="teacher.id"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isAccredit = false">确 定</el-button>
        <el-button @click="isAccredit = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--成绩权重设定-->
    <el-dialog
      title="成绩权重设定"
      :visible.sync="isSysTem"
      style="z-index: 10002"
      :before-close="sysTemCancel"
      class="isSystem"
      width="750px"
    >
      <el-row>
        <div class="top">
          <span>满分：100分</span>
          <span style="margin-left: 10px;">
            当前已分配权重：
            <span style="color: red;">{{this.temTotle}}%</span>
          </span>
          <span style="text-align: right;float: right">*单项考核权重为0则不计入成绩！</span>
        </div>
        <div class="center">
          <div class="left">
            <table class="tables">
              <tr class="tr-h no-tr">
                <td>评分项</td>
                <td>视频</td>
                <td>文档</td>
                <td>测验</td>
                <td>作业</td>
                <td>头脑风暴</td>
                <td>投票问卷</td>
                <td>线下</td>
              </tr>
              <tr class="tr-h">
                <td>权重共100%</td>
                <td>
                  <el-input v-model="CourseSetEntity.videoPercent" style="width:50px;"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.docPercent" style="width:50px;"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.quizPercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.homeworkPercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.stormPercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.votePercent" style="width:50px"></el-input>%
                </td>
                <td>
                  <el-input v-model="CourseSetEntity.offlinePercent" style="width:50px"></el-input>%
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="norm">
          <span>单项评分标准</span>
          <span class="norm-right">（默认分数全部为100分，投票问卷默认90分）</span>
        </div>
        <div class="score">
          <div class="list">
            视频得分 = 完整观看视频 / 总视频数 * 100 分 *
            <span class="blue-text">{{CourseSetEntity.videoPercent}}</span>%
          </div>
          <div class="list">
            文档得分 = 完整观看文档 / 总文档数 * 100 分 *
            <span class="blue-text">{{CourseSetEntity.docPercent}}</span>%
          </div>
          <div class="list">
            测试得分 = 测试得分总和 / 测验次数 *
            <span class="blue-text">{{CourseSetEntity.quizPercent}}</span>%
          </div>
          <div class="list">
            作业得分 = 作业得分总和 / 作业次数 *
            <span class="blue-text">{{CourseSetEntity.homeworkPercent}}</span>%
            <span style="color: red;margin-left: 10px">(取最高分)</span>
          </div>
          <div class="list">
            线下得分 = 线下得分 *
            <span class="blue-text">{{CourseSetEntity.offlinePercent}}</span>%
          </div>
          <div class="list">
            投票问卷得分 = 投票问卷得分 / 投票数 * 100 *
            <span class="blue-text">{{CourseSetEntity.votePercent}}</span>%
          </div>
          <div class="list">
            头脑风暴得分 = 头脑风暴得分总和 / 头脑风暴数 *
            <span class="blue-text">{{CourseSetEntity.stormPercent}}</span>%
          </div>
        </div>
      </el-row>
      <el-row style="text-align: right;">
        <el-button type="primary" @click="sysTemOver">确 定</el-button>
        <el-button @click="sysTemCancel">取 消</el-button>
      </el-row>
    </el-dialog>
    <!--创建讲师-->
    <el-dialog title="新增讲师" :visible.sync="isTeacher" width="50%">
      <addTeachers v-on:goAddTeachersData="teachersData"></addTeachers>
    </el-dialog>
  </div>
</template>

<script>
import wangEditor from "wangeditor";
import vueCropper from "vue-cropper";
import addTeachers from "./upCourse/addTeacher.vue";
import coverPreview from "./coverPreview.vue";
import { mapGetters } from "vuex";
import Square from "@/components/cubeShadow.vue";
import mbNav from "@/components/breadcrumb";
import {
  categories,
  tags,
  instructorList,
  teachersList,
  saveCourse,
  courseInfo,
  putCourse
} from "../../api/course";
import { formatDate } from "../../utils/utils";
export default {
  components: {
    addTeachers,
    mbNav,
    Square,
    coverPreview,
    vueCropper
  },
    computed: {
    ...mapGetters(["showLoading"])
  },
  data() {
    return {
      Course: {
        courseName: "", //课程名称
        courseCategoryParent: "", //课程分类
        courseCategory: "", //课程子分类
        courseTagIds: [], // 课程标签
        beginTime: "", //开课时间
        endTime: "", //结课时间
        courseCover: "", //课程封面
        payMode: 10, //课程价格 10授课 20售卖
        coursePrice: 0, //课程价格
        courseMode: 20, //10：教师导入 20 本校学生 30 全部学员 ,
        dropCourse: true, //1 允许退课 2 不允许
        courseCode: "", //课程代码/课程编码
        // teacher:'', //教师id
        //一下的默认值
        studyMode: 10, //课程学习模式
        difficultyStatus: 10, //课程难度
        courseType: 10 //课程类别
      },
      //给到的教师信息
      CourseForm: {
        instructor: [], //要保存的讲师Id
        teacher: [] //要保存的教师Id
      },
      //课程完成度设置
      CourseSetEntity: {
        // 视频成绩占比
        videoPercent: 0,
        //文档占比
        docPercent: 0,
        //作业占比
        homeworkPercent: 0,
        // 测试成绩占比
        quizPercent: 0,
        // 线下成绩占比
        offlinePercent: 0,
        // 头脑风暴成绩占比
        stormPercent: 0,
        // 讨论成绩占比
        topicPercent: 0,
        // 投票成绩占比
        votePercent: 0
      },
      //课程相关
      CourseInfoEntity: {
        courseDescription: "", //课程信息
        teachingArrangement: "", //教学安排
        teachingTarget: "" //教学目标
      },
      instructor: "", //讲师搜索时用
      tag: "", //标签搜索用
      accreditTeacher: "", // 授权教师用
      // accreditTeacherList:[], //被授权教师列表
      isAccredit: false, //弹出教学课程授权弹出课程封面上传
      isTeacher: false, //弹出添加老师
      isSysTem: false, //弹出设置
      coverPreviewShow: false, //
      isChooseTeacher: false, //选择讲师
      rules: [],
      //判断是否为编辑课程
      isUpdata: false,
      //三个富文本的显隐
      iseditor1: false,
      iseditor2: false,
      iseditor3: false,
      //以下三个是富文本属性
      editor1: null,
      editor2: null,
      editor3: null,
      //一下是三个的监听方法
      addEditor1: null,
      addEditor2: null,
      addEditor3: null,
      //课程分类
      categoriesList: [], //一级课程
      categoriesChildList: [], //二级课程
      isCourseChild: false, //二级课程选择框的隐显
      //课程标签列表
      tagLists: [],
      //讲师列表
      instructorLists: [],
      //教师列表
      teachersLists: [],
      //表单提交验证
      courseRules: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        beginTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" }
        ]
      },
      temTotle: 0, //当前已设权重
      begTimeDis: false
    };
  },
  watch: {
    CourseSetEntity: {
      deep: true,
      handler: function(val, oldVal) {
        this.isUpdata ? delete val.courseId : "";
        let total = 0;
        Object.values(val).forEach(item => {
          total += Number(item);
        });
        this.temTotle = total;
      }
    }
  },
  created() {
    this.selectList();
    //课程编辑
    if (this.$route.query.courseId && this.$route.query.courseId !== "") {
      this.getUpData(this.$route.query.courseId);
      this.isUpdata = true;
    }
  },
  methods: {
    //课程编辑时获取该课程的数据
    getUpData(e) {
      courseInfo(e)
        .then(res => {
          // console.log(res)
          //后台请求到的数据不完全适合展示，需要清洗
          let data = this.upDataFilter(res.data);
          // console.log(data)
          //已发布并且已经开始的课程不能修改开始时间
          if (data.course.courseStatus == 30) {
            let begin = new Date(data.course.beginTime).getTime(),
              now = new Date().getTime();
            now > begin ? (this.begTimeDis = true) : (this.begTimeDis = false);
          }
          this.Course = data.course;
          //教师相关信息
          this.CourseForm.instructor = data.instructor;
          this.CourseForm.teacher = data.teacher;
          this.CourseSetEntity = data.set;
          this.CourseInfoEntity = data.info;

          // 课程介绍
          this.editor1.txt.html(data.info.courseDescription);
          //教学目标
          this.editor2.txt.html(data.info.teachingTarget);
          //教学安排
          this.editor3.txt.html(data.info.teachingArrangement);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //创建讲师
    teachersData(e) {
      if (e !== "") {
        this.instructorLists.push(e);
      }
      this.isTeacher = false;
    },
    //教师
    yesTeacher(e) {
      this.CourseForm.teacher.push(e.teacherName);
    },
    //讲师
    yesInstructor(e) {
      delete e.value;
      let flag = this.CourseForm.instructor.find(item => {
        return item.instructorId == e.instructorId;
      });

      flag
        ? this.$message.warning("已选择该讲师")
        : this.CourseForm.instructor.push(e);
      this.instructor = "";
    },
    //标签数据赋值
    yesTages(e) {
      delete e.value;

      let flag = this.Course.courseTagIds.find(item => {
        return item.tagId == e.tagId;
      });

      flag
        ? this.$message.warning("已选择此标签")
        : this.Course.courseTagIds.push(e);
      this.tag = "";
    },
    //一级分类被选择，赋值二级课程
    yesCategories(e) {
      let course = e;
      this.categoriesList.forEach((item, index) => {
        if (item.categoryId === course) {
          // console.info(item)
          this.categoriesChildList = item.children;
          this.Course.courseCategory = "";
          item.children
            ? (this.isCourseChild = true)
            : (this.isCourseChild = false);
        }
      });
    },
    //创建课程
    goUpCourseResource() {
      //课程父分类为必选
      if (!this.Course.courseCategoryParent) {
        this.$message.warning("请选择课程分类");
        return false;
      }
      let data = this.goDataFilter();
      this.$refs["Course"].validate(valid => {
        if (valid) {
          this.$store.commit("SHOWLOADING");
          // console.log(data);
          saveCourse(data).then(res => {
            this.$store.commit("HIDELOADING");
            if (Number(res.code) === 200) {
              this.$message.success("课程创建成功");
              this.$router.push({
                path: "/course/list"
              });
            } else {
              console.log(res.msg);
              this.$message.error(getErrorMsg(res.msg));
            }
          });
        } else {
          this.$message.error("请补全必填项");
          return false;
        }
      });
    },
    //弹出设置
    isSys() {
      this.isSysTem = true;
      // this.canvasTab()
    },
    //标签移除
    tagRemove(e) {
      this.tag = "";
      let data = this.Course.courseTagIds,
        newData = [];
      data.forEach(item => {
        if (item.tagId !== e.tagId) {
          newData.push(item);
        }
      });
      console.log(newData);
      this.Course.courseTagIds = newData;
    },
    //讲师移除
    instructorRemove(e) {
      this.instructor = "";
      let data = this.CourseForm.instructor,
        newData = [];
      data.forEach(item => {
        if (item.instructorId !== e.instructorId) {
          newData.push(item);
        }
      });
      this.CourseForm.instructor = newData;
    },
    //标签搜索筛选
    tagSearch(queryString, cb) {
      //后台返回所有标签列表，前端进行模糊查询匹配
      tags()
        .then(res => {
          if (Number(res.code) === 200) {
            console.log(res);
            let data = [],
              rsdata = [];
            //临时填充value用于组件值的展示
            res.data.forEach(item => {
              item.value = item.tagName;
              rsdata.push(item);
            });
            data = rsdata.filter(item => {
              return item.tagName.indexOf(queryString) != -1;
            });
            // this.tagLists = data
            // 调用 callback 返回建议列表的数据
            cb(data);
          } else {
            this.$message({
              message: "讲师列表获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取讲师搜索的列表
    instructorSearch(queryString, cb) {
      instructorList({ instructorName: queryString })
        .then(res => {
          if (Number(res.code) === 200) {
            //给查询到的值加入value字段，用于搜索组件值的显示，数据提交时需将value字段删除
            let data = [];
            res.data.forEach(item => {
              item.value = item.instructorName;
              data.push(item);
            });
            // 调用 callback 返回建议列表的数据
            cb(data);
          } else {
            this.$message({
              message: "讲师列表获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //从后台获取基础信息
    //授权教师搜索
    teacherSearch(queryString, cb) {
      teachersList(sessionStorage.getItem("tenantId"))
        .then(res => {
          console.info("搜索教师", res);
          if (Number(res.code) === 200) {
            //给查询到的值加入value字段，用于搜索组件值的显示，数据提交时需将value字段删除
            let data = [],
              rsdata = [];
            res.data.forEach(item => {
              item.value = item.teacherName;
              if (item.teacherName.indexOf(queryString) != -1) {
                data.push(item);
              }
            });
            // console.log(data)
            // 返回数据
            cb(data);
          } else {
            this.$message({
              message: "教师列表获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectList() {
      //课程分类列表
      categories()
        .then(res => {
          // console.log("课程分类", res);
          if (Number(res.code) === 200) {
            // let data = this.electChilder(res.data) //删除为空的子节点
            this.categoriesList = res.data;
            // console.log('课程分类')
            // console.log(this.categoriesList)
          } else {
            this.$message({
              message: "课程分类获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error("课程分类获取失败");
        });
      //课程标签列表
      tags()
        .then(res => {
          if (Number(res.code) === 200) {
            let data = this.electChilder(res.data);
            this.tagsList = data;
            //Course课程信息下的列表仅存了标签的ID
            // console.log('标签列表:')
            // console.log(this.tagsList)
          } else {
            this.$message({
              message: "课程课程标签获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      //获取讲师列表的数据
      instructorList()
        .then(res => {
          // console.log('讲师列表:')
          // console.log(res)
          if (Number(res.code) === 200) {
            this.instructorLists = res.data;
          } else {
            this.$message({
              message: "讲师列表获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      //获取教师列表的数据
      teachersList(sessionStorage.getItem("tenantId"))
        .then(res => {
          // console.log('教师列表:')
          // console.log(res)
          if (Number(res.code) === 200) {
            this.teachersLists = res.data;
          } else {
            this.$message({
              message: "获取教师列表失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //删除空的childer
    electChilder(data) {
      data.forEach(item => {
        // 如果没有children
        if (typeof item.children == "undefined") {
        } else if (item.children && !item.children.length) {
          delete item.children;
        } else {
          item.children = this.electChilder(item.children);
        }
      });
      return data;
    },
    //教师授权搜索提示框
    querySearch(queryString, cb) {
      var restaurants = JSON.stringify(this.teachersLists);
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 上传封面图片弹窗的关闭
    closeCoverPreview() {
      this.coverPreviewShow = false;
    },
    // 封面图替换
    chooseCover(url) {
      this.coverPreviewShow = false;
      this.Course.courseCover = url;
    },
    //课程编辑时对取到的数据进行处理
    upDataFilter(data) {
      //获取到的数据有些字段的值只有id，渲染时要将值补上
      let redata = data,
        currentTags = [],
        curTeacher = [];
      //标签数据
      redata.course.courseTagIds.forEach(item => {
        this.tagsList.forEach(list => {
          // console.log(list)
          if (list.tagId === item) {
            currentTags.push(list);
          }
        });
      });
      // 教师列表
      redata.teacher.forEach(item => {
        curTeacher.push(item.teacherName);
      });
      //是否可退课，1为允许，2为不允许
      data.course.dropCourse = redata.course.dropCourse === 1 ? true : false;
      data.course.courseTagIds = currentTags;
      data.teacher = curTeacher;
      return data;
    },
    //上传，修改课程时数据清洗
    goDataFilter() {
      let data = {
        course: this.Course,
        info: this.CourseInfoEntity,
        set: this.CourseSetEntity,
        teacher: this.CourseForm.teacher,
        instructor: this.CourseForm.instructor
      };
      let currentTag = [],
        currnetteacher = [],
        currentinstructor = [];
      this.Course.courseTagIds.forEach(item => {
        currentTag.push(item.tagId);
      });
      this.CourseForm.teacher.forEach(item => {
        this.teachersLists.forEach(list => {
          if (item === list.teacherName) {
            currnetteacher.push(list.userId);
          }
        });
      });
      this.CourseForm.instructor.forEach(item => {
        currentinstructor.push(item.instructorId);
      });

      let curData = JSON.parse(JSON.stringify(data));

      curData.course.courseTagIds = currentTag;
      curData.teacher = currnetteacher;
      curData.instructor = currentinstructor;
      curData.course.dropCourse = this.Course.dropCourse ? 1 : 2;
      return curData;
    },
    //修改课程
    goPutCourse() {
      let data = this.goDataFilter();
      this.$store.commit("SHOWLOADING");
      putCourse(data)
        .then(res => {
          // console.log(res)
                        this.$store.commit("HIDELOADING");;
          if (Number(res.code) === 200) {
            this.$message.success("课程信息修改成功");
            this.$router.push("/course/list");
          } else if (Number(res.code) === 440) {
            let msgs = JSON.parse(res.msg);
            this.$message({
              message: msgs[0].message,
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setTotle() {
      let arr = Object.values(this.CourseSetEntity);
      arr.forEach(item => {
        this.temtotle += Number(item);
      });
    },
    //成绩权重设置完毕
    sysTemOver() {
      this.isUpdata ? delete this.CourseSetEntity.courseId : "";
      let totle = 0;
      Object.values(this.CourseSetEntity).forEach(item => {
        totle += Number(item);
      });
      if (totle !== 100) {
        this.$message.warning("权重不可超过或小于100%");
      } else {
        this.isSysTem = false;
      }
    },
    //取消成绩权重设置
    sysTemCancel() {
      if (this.isUpdata) {
        this.isSysTem = false;
      } else {
        for (let i in this.CourseSetEntity) {
          this.CourseSetEntity[i] = 0;
        }
        this.isSysTem = false;
      }
    }
  },
  mounted() {
    //编辑课程
    if (this.$route.query.type === "upData") {
      // console.log("课程编辑")
    }
    //课程介绍
    let self = this;
    this.editor1 = new wangEditor("#editor1");
    this.editor1.customConfig.onblur = function(html) {
      console.log("课程编辑");
      console.log(html);
      self.CourseInfoEntity.courseDescription = html;
    };
    this.editor1.customConfig.zIndex = 100;
    this.addEditor1 = this.editor1.customConfig.onchange = function(html) {
      self.CourseInfoEntity.courseDescription = html;
    };
    this.editor1.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      // 'link',  // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "table", // 表格
      "code", // 插入代码
      "undo" // 撤销
    ];
    this.editor1.customConfig.zIndex = 10;
    this.editor1.create();
    //教学目标
    this.editor2 = new wangEditor("#editor2");
    this.editor2.customConfig.onblur = function(html) {
      self.CourseInfoEntity.teachingTarget = html;
    };
    this.editor2.customConfig.zIndex = 100;
    this.addEditor2 = this.editor2.customConfig.onchange = function(html) {
      self.CourseInfoEntity.teachingTarget = html;
    };
    this.editor2.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      // 'link',  // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "table", // 表格
      "code", // 插入代码
      "undo" // 撤销
    ];
    this.editor2.customConfig.zIndex = 10;
    this.editor2.create();
    //教学安排
    this.editor3 = new wangEditor("#editor3");
    this.editor3.customConfig.onblur = function(html) {
      self.CourseInfoEntity.teachingArrangement = html;
    };
    this.editor3.customConfig.zIndex = 100;
    this.addEditor3 = this.editor3.customConfig.onchange = function(html) {
      self.CourseInfoEntity.teachingArrangement = html;
    };
    this.editor3.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      // 'link',  // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "table", // 表格
      "code", // 插入代码
      "undo" // 撤销
    ];
    this.editor3.customConfig.zIndex = 10;
    this.editor3.create();
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.blue-text {
  color: #40caff;
}

.remind-text-color {
  ccolor: #606266;
}

.addCourse {
  overflow: hidden;
  height: 50px;
}

.course-tag-warp {
  width: 300px;
  border-radius: 5px;
  /* border 1px solid #e9e9e9 */
  padding-left: 5px;
  padding-bottom: 10px;

  & span {
    margin-right: 5px;
  }
}

.teacher-list {
  margin-left: 20px;
  font-size: 14px;
  margin-bottom: 20px;

  .teacher {
    margin-right: 10px;
    color: #b3b3b3;
  }
}

.instructor-tag-warp {
  width: 300px;
  border-radius: 5px;
  /* border 1px solid #e9e9e9 */
  border-bottom: 0;
  /* padding 5px */
  padding-left: 5px;
  padding-bottom: 10px;

  /* margin-bottom 10px; */
  & span {
    margin-right: 5px;
  }
}

.isSystem {
  .top {
    padding-bottom: 10px;
    overflow: hidden;
    width: 672px;
  }

  .center {
    .left {
      display: inline-block;

      .tables {
        border: 1px solid #E4E4E6;

        .tr-h {
          height: 45px;
          line-height: 45px;
          border-top: 1px solid #E4E4E6;
          display: block;

          td {
            width: 80px;
            text-align: center;
            border-right: 1px solid #E4E4E6;

            .icons {
              display: inline-block;
              background: #000;
              color: #ffffff;
              width: 30px;
              height: 30px;
              line-height: 30px;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              margin-top: 10px;
            }
          }

          td:nth-child(1) {
            background: #F2FCFF;
          }

          td:nth-last-child(1) {
            border-right: none;

            input {
              height: 30px;
              padding: 0;
            }
          }
        }

        .no-tr {
          border-top: none;
        }
      }
    }

    .right {
      margin-left: 50px;
      display: inline-block;
      width: 100px;
      height: 100px;
      vertical-align: top;

      #echart {
        width: 100%;
        height: 100%;
      }
    }
  }

  .norm {
    margin-top: 10px;
    border: 1px solid #E4E4E6;
    padding-top: 10px;
    padding-bottom: 10px;
    text-indent: 10px;
    width: 672px;

    .norm-right {
      font-size: 12px;
      color: #59C2BB;
    }
  }

  .score {
    padding-top: 10px;
    border-left: 1px solid #E4E4E6;
    border-right: 1px solid #E4E4E6;
    border-bottom: 1px solid #E4E4E6;
    text-indent: 10px;
    margin-bottom: 10px;
    width: 672px;

    .list {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}

.addCourse-center {
  .courseExplanation {
    color: #b3b3b3;
  }

  .sysTem {
    color: #3EABA8;
    margin-left: 20px;
  }
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 280px;
  height: 160px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader img {
  height: 160px;
  width: 280px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 280px;
  height: 160px;
  line-height: 160px;
  text-align: center;
  border: 1px solid #ded5d5;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.accredit-input {
  margin-right: 30px;
  margin-bottom: 20px;
  margin-left: calc(100% - 220px);
  border-radius: 30px;
}
</style>
