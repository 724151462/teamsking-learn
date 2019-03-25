<template>
  <div>
    <mb-nav :pathList="[{path:'/school/teacher',name:'教师管理'}]" nowName="编辑教师"></mb-nav>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="teacherForm">
      <el-form-item label="工号" prop="teacherNo">
        <el-input v-model="form.teacherNo" class="input" placeholder="工号"></el-input>
      </el-form-item>
      <el-form-item label="教师姓名" prop="realName">
        <el-input v-model="form.realName" placeholder="教师姓名" class="input"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="form.gender" :label="1">男</el-radio>
        <el-radio v-model="form.gender" :label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.mobile" placeholder="手机号码" class="input"></el-input>
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="form.jobName" placeholder="职称" class="input"></el-input>
      </el-form-item>
      <el-form-item label="教龄">
        <el-input v-model="form.jobYear" placeholder="职龄" class="input"></el-input>
      </el-form-item>
      <el-form-item label="院名称">
        <el-select
          filterable
          clearable
          v-model="form.collegeId"
          placeholder="院名称"
          @clear="()=>{
            form.departmentId=''
            departmentinit()
          }"
          @change="(value)=>{
            if(value !== ''){
            departmentinit(value)
            }
          }"
        >
          <el-option
            v-for="(item, index) in collegeList"
            :key="index"
            :label="item.collegeName"
            :value="item.collegeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系名称">
        <el-select filterable clearable v-model="form.departmentId" placeholder="系名称">
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.departmentName"
            :value="item.departmentId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自我介绍">
        <el-input type="textarea" v-model="form.introduct" style="width:350px" rows="6"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="ensureBtn()">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  sysCollegeList,
  sysDepartmentList,
  sysTeacherAdd,
  sysTeacherId,
  sysTeacherModify
} from "../../api/school";
import mbNav from "@/components/breadcrumb";

export default {
  data() {
    return {
      // 表单信息
      form: {
        userName: "",
        teacherNo: "",
        realName: "",
        password: "",
        gender: "",
        mobile: "",
        jobName: "",
        jobYear: "",
        collegeId: "",
        departmentId: "",
        introduct: ""
      },
      // 院
      collegeList: [],
      departmentList: [],
      rules: {
        realName: [
          { required: true, message: "请输入教师名称", trigger: "blur" }
        ],
        teacherNo: [
          { required: true, message: "请输入教师工号", trigger: "blur" },
          { min: 6, max: 13, message: "工号长度在6到13之间", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    mbNav
  },
  mounted() {
    this.collegeInit();
    sysTeacherId({ id: this.$route.query.teacherId })
      .then(response => {
        let teacherInfo = response.data;
        this.form.collegeId = teacherInfo.collegeId;
        this.form.teacherNo = teacherInfo.teacherNumber;
        this.form.realName = teacherInfo.teacherName;
        this.form.gender = teacherInfo.gender;
        this.form.mobile = teacherInfo.mobile;
        this.form.jobName = teacherInfo.positionalTitle;
        this.form.jobYear = teacherInfo.schoolAge;
        this.form.departmentId = teacherInfo.departmentId;
        this.form.introduct = teacherInfo.synopsis;
        return;
      })
      .then(id => {
        this.departmentinit(id);
      });
  },
  methods: {
    // 院列表
    collegeInit() {
      sysCollegeList()
        .then(response => {
          if (response.code === 200) {
            this.collegeList = response.data;
          } else {
            this.$store.commit("ERR_MSG", response.msg);
          }
        })
        .catch(err => {
          this.$store.commit("ERR_MSG", err.msg);
        });
    },
    // 系列表
    departmentinit(collegeId = -1) {
      sysDepartmentList({ collegeId })
        .then(response => {
          if (response.code === 200) {
            this.departmentList = response.data;
          } else {
            this.$store.commit("ERR_MSG", response.msg);
          }
        })
        .catch(err => {
          this.$store.commit("ERR_MSG", err.msg);
        });
    },
    // 提交
    ensureBtn() {
      let teacherForm = {
        collegeId: this.form.collegeId,
        departmentId: this.form.departmentId,
        gender: this.form.gender,
        positionalTitle: this.form.jobName,
        realName: this.form.realName,
        schoolAge: this.form.jobYear,
        synopsis: this.form.introduct,
        teacherId: this.$route.query.teacherId,
        teacherNumber: this.form.teacherNo
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          sysTeacherModify(teacherForm)
            .then(response => {
              if (response.code === 200) {
                this.open2();
              } else {
                this.$store.commit("ERR_MSG", response.msg);
              }
            })
            .catch(err => {
              this.$store.commit("ERR_MSG", err.msg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    open2() {
      this.$alert("修改成功", "提示", {
        confirmButtonText: "确定",
        type: "success"
      }).then(() => {
          this.$router.push({ path: "/school/teacher" });
        })
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.route-guide {
  margin: 20px 0;

  span {
    color: #3EABA8;
  }
}

.teacherForm {
  .input {
    width: 200px;
  }
}
</style>
