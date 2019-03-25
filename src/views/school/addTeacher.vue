<template>
  <div>
    <mb-nav :pathList="[{path:'/school/teacher',name:'教师管理'}]" nowName="添加教师"></mb-nav>
    <p style="color: red;margin-bottom:20px">提示：工号也是教师的登录账号，密码默认为工号后6位</p>
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
        <el-button type="primary" @click="ensureBtn()">提交</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  sysCollegeList,
  sysDepartmentList,
  sysTeacherAdd
} from "../../api/school";
import mbNav from "@/components/breadcrumb";

export default {
  data() {
    return {
      // 表单信息
      form: {
        teacherNo: "",
        realName: "",
        gender: 1,
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
        ],
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
        teacherNumber: this.form.teacherNo
      };
      this.$refs["form"].validate(valid => {
        if (valid) {
          sysTeacherAdd(teacherForm)
            .then(response => {
              if (response.code === 200) {
                this.resetFormData()
                this.open2()
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
        this.$confirm('添加成功, 是否继续添加?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
        }).catch(() => {
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
       this.$refs['form'].resetFields();
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.input-pop {
  width: 200px;
}

.route-guide {
  margin: 20px 0;

  span {
    color: #3EABA8;
  }
}

.teacherForm {
  .search-icon {
    color: #c0c4cc;
    position: relative;
    right: 20px;
  }

  .input {
    width: 200px;
  }
}
</style>
