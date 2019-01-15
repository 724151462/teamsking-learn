<template>
    <div>
        <p class="route-guide"><router-link :to="{path:'/school/teacher'}">教师用户</router-link>><span>{{currentRoute}}</span></p>
        <el-form ref="form1" :model="form" label-width="80px" class="teacherForm">
            <!-- {{testList}} -->
            <el-form-item label="用户名">
                <el-input v-model="form.userName" class="input"></el-input>
            </el-form-item>
            <el-form-item label="工号">
                <el-input v-model="form.teacherNo" class="input"></el-input>
            </el-form-item>
            <el-form-item label="教师姓名">
                <el-input v-model="form.realName" class="input"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="form.gender" label="1">男</el-radio>
                <el-radio v-model="form.gender" label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="form.mobile" class="input"></el-input>
            </el-form-item>
            <el-form-item label="职称">
                <el-input v-model="form.jobName" class="input"></el-input>
            </el-form-item>
            <el-form-item label="教龄">
                <el-input v-model="form.jobYear" class="input"></el-input>
            </el-form-item>
            <el-form-item label="院名称">
                <el-select v-model="form.collegeId" placeholder="院名称" @change="collegeChange">
                    <el-option 
                        v-for="(item, index) in collegeList" 
                        :key="index" 
                        :label="item.collegeName"
                        :value="item.collegeId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="系名称">
                <el-select v-model="form.departmentId" placeholder="系名称" @change="departmentChange">
                    <el-option 
                        v-for="(item, index) in searchDepartmentList" 
                        :key="index" 
                        :label="item.departmentName"
                        :value="item.departmentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="自我介绍">
                <el-input class="input" type="textarea" v-model="form.introduct"></el-input>
            </el-form-item>
            <el-form-item class="commit">
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
} from '../../api/school';

export default {
    data(){
        return{
            currentRoute: '',
            // 表单信息
            // form: {
            //     userName: 'wjx',
            //     teacherNo: '888888',
            //     realName: '吴佳雄',
            //     gender: '1',
            //     mobile: 18459183928,
            //     jobName: '前端菜鸟',
            //     jobYear: '1',
            //     collegeId: '',
            //     departmentId: '',
            //     introduct: '我是菜鸟我怕谁'
            // },
            form: {
                userName: '',
                teacherNo: '',
                realName: '',
                password: '',
                gender: '',
                mobile: '',
                jobName: '',
                jobYear: '',
                collegeId: '',
                departmentId: '',
                introduct: ''
            },
            // 院
            collegeList: [],
            searchCollegeList:[],
            // 系
            searchDepartmentList: [],
            departmentRows: [],

        }
    },
    computed:{
    //   testList() {
    //     return this.$store.state.collegeList
    //   }
    },
    mounted() {
        this.currentRoute = this.$route.name
        console.log(this.$route.params.id)
        sysTeacherId({"id": this.$route.query.teacherId})
        .then((response)=>{
            let teacherInfo = response.data
            this.form.collegeId = teacherInfo.collegeId
            this.form.teacherNo = teacherInfo.teacherNumber
            this.form.realName = teacherInfo.teacherName
            this.form.userName = teacherInfo.userName
            this.form.gender = String(teacherInfo.gender)
            this.form.mobile = teacherInfo.mobile
            this.form.jobName = teacherInfo.positionalTitle
            this.form.jobYear = teacherInfo.schoolAge
            this.form.collegeId = teacherInfo.collegeId
            this.form.departmentId = teacherInfo.departmentId
            this.form.introduct = teacherInfo.synopsis
        })
        // 院列表
        sysCollegeList()
        .then((response)=>{
            if (response.code === 200){
                this.collegeList = response.data
                this.searchCollegeList = response.data
                let all = {"collegeId": -1, "collegeName": "全部"}
                this.collegeList.unshift(all)
                // this.searchCollegeList.unshift(all)
                console.log(this.collegeList)
            }
        })
        // 系列表
        sysDepartmentList()
        .then((response)=>{
            if (response.code === 200){
                this.departmentRows = response.data
                this.searchDepartmentList = response.data
                let all = {"departmentId": -1, "departmentName": "全部"}
                // this.searchDepartmentList.unshift(all)
                this.departmentRows.unshift(all)
            }
        })
    },
    methods:{
        // 院搜索值变化
        collegeChange(value) {
            // console.log(value)
            console.log('a',this.departmentRows)
            if(value === -1){
                this.searchDepartmentList = this.departmentRows
                this.form.departmentId = -1
            }else{
                this.searchDepartmentList = this.departmentRows.filter((item,index)=>{
                    return (item.collegeId == value || item.collegeId == -1 || index == 0)
                })

                console.log('121', this.searchDepartmentList)
                this.form.departmentId = -1   
            }         
        },
        // 系搜索值变化
        departmentChange(value) {
            console.log('dep', value)
            // if(value === -1){
            //     return this.specialityRows
            // }
            // this.searchForm.speciality = -1
            // this.searchSpecialityList = this.specialityRows.filter((item)=>{
            //     return item.departmentId == value || item.departmentId == -1
            // })
        },
        // 提交
        ensureBtn() {
            let teacherForm = {
                "collegeId": this.form.collegeId,
                "departmentId": this.form.departmentId,
                "gender": this.form.gender,
                "positionalTitle": this.form.jobName,
                "realName": this.form.realName,
                "schoolAge": this.form.jobYear,
                "synopsis": this.form.introduct,
                "teacherId": this.$route.query.teacherId,
                "teacherNumber": this.form.teacherNo
            }
            sysTeacherModify(teacherForm)
            .then((response)=>{
                if(response.code === 200){
                    this.$message({type: 'success', message: '修改成功,正在返回列表页...'});
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 2000);
                }
            })
        },
    }
}
</script>

<style scoped lang="stylus" type="text/stylus">
    .route-guide
        margin: 20px 0
        span
            color: #3EABA8
    .teacherForm
        margin-left: 180px
        .commit
            margin-left: 300px
        .input
            width: 300px
</style>
