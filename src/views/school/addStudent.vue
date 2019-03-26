<template>
  <div>
    <mb-nav :pathList="[{path:'/school/student',name:'学生管理'}]" nowName="添加学生"></mb-nav>
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
      <el-form-item label="手机号码">
        <el-input v-model="form.mobile" class="input"></el-input>
      </el-form-item>
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
          @clear="clearSelect(1,'department')"
          @change="selectChange"
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
          @clear="clearSelect(2,'speciality')"
          v-model="form.speciality"
          placeholder="专业"
          @change="selectChange"
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
        <el-select clearable @clear="clearSelect(3,'class')" v-model="form.class" placeholder="班级">
          <el-option
            v-for="(item, index) in classList"
            :key="index"
            :label="item.className"
            :value="item.classId"
          ></el-option>
        </el-select>
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
import { sysCollegeList, sysDepartmentList } from "@/api/school";
import mbNav from "@/components/breadcrumb";

export default {
  data() {
    return {
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
        console.log("班级列表", response.data);
        if (response.code === 200) {
          this.classList = response.data;
        }
      });
    },
    //联选选中时
    selectChange(target,id){
      let selectArray = ["college", "department", "speciality", "class"],
          index = selectArray.indexOf(target);
      let targetArr = selectArray.slice(index, 4);
      console.log(selectArray[index+1]);
      this[selectArray[index+1]]()
      // target.forEach(item => {
      //   this.form[item] = ''
      // });
    },
    //清空选线时，联动清空
    clearSelect(target) {
      let selectArray = ["college", "department", "speciality", "class"];
      let targetArr = selectArray.slice(selectArray.indexOf(target), 4);      
      targetArr.forEach(item => {        
        this.form[item] = ''
        item == target ? '' : this[`${item}List`] = []
      });
    },
    //新增学生
    addNewStudent: function() {
      let sex = this.form.sex == "男" ? 1 : 2;
      let formData = {
        classId: this.form.class,
        collegeId: this.form.college,
        realName: this.form.realName,
        specialityId: this.form.speciality,
        gender: this.form.sex,
        mobile: this.form.mobile,
        studentNo: this.form.studentNo,
        departmentId: this.department,
        status: this.status
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          // sysStudentAdd(formData)
          //   .then(response => {
          //     if (response.code === 200) {
          //       this.resetFormData();
          //       this.open2();
          //     } else {
          //       this.$store.commit("ERR_MSG", response.msg);
          //     }
          //   })
          //   .catch(err => {
          //     this.$store.commit("ERR_MSG", err.msg);
          //   });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    collegeChange() {},
    open2() {
      this.$confirm("添加成功, 是否继续添加?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {})
        .catch(() => {
          this.$router.push({ path: "/school/teacher" });
        });
    },
    resetFormData() {
      this.form = {
        teacherNo: "",
        realName: "",
        gender: "",
        mobile: "",
        jobName: "",
        jobYear: "",
        collegeId: "",
        departmentId: "",
        introduct: ""
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