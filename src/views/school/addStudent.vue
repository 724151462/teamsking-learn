<template>
  <div>
    <mb-nav :pathList="[{path:'/school/student',name:'学生管理'}]" :nowName="`${currentRouter}学生`"></mb-nav>
    <p style="color: red;margin-bottom:20px">提示：学号也是学生的登录账号，密码默认为学号后6位</p>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="学号" prop="studentNo">
        <el-input v-model="form.studentNo" class="input"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" class="input"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="手机号码">
        <el-input v-model="form.mobile" class="input"></el-input>
      </el-form-item> -->
      <el-form-item label="所属院" prop="college">
        <el-select
          filterable
          clearable
          v-model="form.college"
          placeholder="院名称"
          @clear="clearSelect('college')"
          @change="(value)=>{
            if(value !== ''){
            selectChange('college',value)
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
      <el-form-item label="所属系" prop="department">
        <el-select
          filterable
          clearable
          v-model="form.department"
          placeholder="系"
          @clear="clearSelect('department')"
          @change="(value)=>{
            if(value !== ''){
            selectChange('department',value)
            }
          }"
        >
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.departmentName"
            :value="item.departmentId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属专业">
        <el-select
          clearable
          @clear="clearSelect('speciality')"
          v-model="form.speciality"
          placeholder="专业"
          @change="(value)=>{
            if(value !== ''){
            selectChange('speciality',value)
            }
          }"
        >
          <el-option
            v-for="(item, index) in specialityList"
            :key="index"
            :label="item.specialityName"
            :value="item.specialityId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级">
        <el-select
          clearable
          @change="(value)=>{
            if(value !== ''){
            selectChange('class',value)
            }
          }"
          @clear="clearSelect('class')"
          v-model="form.class"
          placeholder="班级"
        >
          <el-option
            v-for="(item, index) in classList"
            :key="index"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级">
        <el-input v-model="form.grade" style="width:200px" placeholder="输入年级">

        </el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="2"
          active-color="#13ce66"
          inactive-color="#dcdfe6"
          @change="onSubmit('switch',scope.row)"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addNewStudent()">提交</el-button>
        <el-button
          @click="()=>{
            this.$router.push({path:'/school/student'})
          }"
        >取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  sysCollegeList,
  sysStudentAdd,
  sysStudentModify,
  sysStudentInfo,
  sysDepartmentList,
  sysSpecialityList,
  sysClassList
} from "@/api/school";
import mbNav from "@/components/breadcrumb";

export default {
  data() {
    return {
      currentRouter: "添加",
      form: {
        studentNo: "",
        realName: "",
        sex: 1,
        speciality: "",
        mobile: "",
        department: "",
        college: "",
        class: "",
        status: 1
      },
      // 院
      collegeList: [],
      departmentList: [],
      specialityList: [], // 专业列表
      classList: [], // 班级列表
      rules: {
        realName: [
          { required: true, message: "请输入学生姓名", trigger: "blur" }
        ],
        college: [{ required: true, message: "请选择所属院", trigger: "blur" }],
        department: [
          { required: true, message: "请选择所属系", trigger: "blur" }
        ],
        studentNo: [
          { required: true, message: "请输入学生学号", trigger: "blur" },
          { min: 6, max: 13, message: "长度在6到13之间", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    mbNav
  },
  mounted() {
    this.$route.query.studentId
      ? (this.currentRouter = "编辑")
      : (this.currentRouter = "添加");
    if (this.$route.query.studentId) {
      sysStudentInfo(this.$route.query.studentId)
        .then(res => {
          if (res.code === 200) {
            console.log(res);
            this.form = {
              studentNo: res.data.studentNo,
              realName: res.data.realName,
              sex: res.data.gender,
              speciality: res.data.specialityId,
              mobile: res.data.mobile,
              department: res.data.departmentId,
              college: res.data.collegeId,
              class: res.data.classId,
              status: 1
            };
            this.departmentInit(res.data.collegeId);
            this.specialityInit(res.data.departmentId);
            this.classInit(res.data.specialityId);
          } else {
            this.$store.commit("ERR_MSG", res.msg);
          }
        })
        .catch(err => {
          this.$store.commit("ERR_MSG", err.msg);
        });
    }
    this.collegeInit();
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
    departmentInit(collegeId = -1) {
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
    // 专业列表
    specialityInit(departmentId = -1) {
      sysSpecialityList({ departmentId }).then(response => {
        if (response.code === 200) {
          this.specialityList = response.data;
        }
      });
    },
    // 班级列表
    classInit(specialityId = -1) {
      sysClassList({ specialityId }).then(response => {
        if (response.code === 200) {
          this.classList = response.data;
        }
      });
    },
    //联选选中时
    selectChange(target, id) {
      let selectArray = ["college", "department", "speciality", "class"],
        index = selectArray.indexOf(target),
        children = selectArray[index + 1],
        targetArr = selectArray.slice(index + 1, 4);
      targetArr.forEach(item => {
        this.form[item] = "";
        item == target ? "" : (this[`${item}List`] = []);
      });
      target == "class" ? "" : this[`${children}Init`](id);
    },
    //清空选线时，联动清空
    clearSelect(target) {
      let selectArray = ["college", "department", "speciality", "class"];
      let targetArr = selectArray.slice(selectArray.indexOf(target), 4);
      targetArr.forEach(item => {
        this.form[item] = "";
        item == target ? "" : (this[`${item}List`] = []);
      });
    },
    //新增学生
    addNewStudent: function() {
      let formData = {
        classId: this.form.class,
        collegeId: this.form.college,
        realName: this.form.realName,
        specialityId: this.form.speciality,
        gender: this.form.sex,
        mobile: this.form.mobile,
        studentNo: this.form.studentNo,
        departmentId: this.form.department,
        status: this.form.status,
        grade: this.form.grade
      };
      // let formData = Object.assign(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.$route.query.studentId) {
            sysStudentModify(formData)
              .then(response => {
                if (response.code === 200) {
                  this.$alert("修改成功", "提示", {
                    confirmButtonText: "确定",
                    type: "success"
                  }).then(() => {
                    this.$router.push({ path: "/school/teacher" });
                  });
                } else {
                  this.$store.commit("ERR_MSG", response.msg);
                }
              })
              .catch(err => {
                this.$store.commit("ERR_MSG", err.msg);
              });
          } else {
            sysStudentAdd(formData)
              .then(response => {
                if (response.code === 200) {
                  this.resetFormData();
                  this.open2();
                } else {
                  this.$store.commit("ERR_MSG", response.msg);
                }
              })
              .catch(err => {
                this.$store.commit("ERR_MSG", err.msg);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    open2() {
      this.$confirm("添加成功, 是否继续添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {})
        .catch(() => {
          this.$router.push({ path: "/school/student" });
        });
    },
    resetFormData() {
      this.form = {
        studentNo: "",
        realName: "",
        sex: 1,
        speciality: "",
        mobile: "",
        department: "",
        college: "",
        class: "",
        status: 1
      };
      this.$refs["form"].resetFields();
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.input {
  width: 200px;
}
</style>