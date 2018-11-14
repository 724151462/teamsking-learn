<template>
    <div class="student">

        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    学生管理
                </div>
            </el-col>
        </el-row>

        <el-form ref="form2" :model="searchForm" :inline="true" label-width="100px" class="form-query">
            <el-form-item label="输入搜索：">
                <el-input v-model="searchForm.inputInfo" :readonly="true" style="width: 400px" placeholder="院/系/专业"></el-input>
            </el-form-item>
            <!-- <el-form-item label="系名称">
                    <el-select v-model="departmentId" placeholder="系名称">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="-2" label="无系"></el-option>
                        <el-option 
                            v-for="item in departmentList" 
                            :key="item.departmentId" 
                            :label="item.departmentName"
                            :value="item.departmentId"></el-option>
                        </el-select>
                </el-form-item> -->

            <!-- <el-form-item label="院/系/专业">
                <el-input v-model="mutilInfo" disabled></el-input>
            </el-form-item>
            <el-autocomplete
            v-model="searchForm.searchClass"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            ></el-autocomplete> -->

            <el-autocomplete
            v-model="state4"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            value-key="className"
            @select="handleSelect"
            ></el-autocomplete>

                <el-button type="primary" @click="onSubmit">查询</el-button>

        </el-form>

        <table-the-again
                :tableTitle="tableTitle"
                :tableOperate="tableOperate"
                :columnNameList="columnNameList"
                :tableData="tableData3"
                :operateList="operateList"
                @showComponentInfo="showComponentInfo"
                switchColumn='open'>
        </table-the-again>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <el-form ref="form1" :model="form" label-width="80px">
                <el-form-item label="学号">
                    <el-input v-model="form.studentNo"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <!-- <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="手机号码">
                    <el-input v-model="form.mobile" :disabled="mobileEnable"></el-input>
                </el-form-item>
                <el-form-item label="院名称">
                    <el-select v-model="collegeId" placeholder="院名称">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="-2" label="无院"></el-option>
                        <el-option 
                            v-for="item in collegeList" 
                            :key="item.collegeId" 
                            :label="item.collegeName"
                            :value="item.collegeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系名称">
                    <el-select v-model="departmentId" placeholder="系名称">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="-2" label="无系"></el-option>
                        <el-option 
                            v-for="item in departmentList" 
                            :key="item.departmentId" 
                            :label="item.departmentName"
                            :value="item.departmentId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业">
                    <el-select v-model="specialityId" placeholder="专业">
                        <el-option value="-1" label="全部"></el-option>
                        <el-option value="-2" label="无专业"></el-option>
                        <el-option 
                            v-for="item in specialityList" 
                            :key="item.specialityId" 
                            :label="item.specialityName"
                            :value="item.specialityId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级">
                    <el-select v-model="classId" placeholder="班级">
                        <el-option value="-1" label="请添加班级"></el-option>
                        <el-option ref="class"
                            v-for="item in classList" 
                            :key="item.classId" 
                            :label="item.className"
                            :value="item.classId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-switch active-value=1
                        inactive-value=2
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        v-model="status"></el-switch>
                </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="ensureBtn()">提交</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
        <el-pagination
                background
                layout="prev, pager, next"
                :total="totalCount"
                @current-change="pageChange">
        </el-pagination>

    </div>
</template>

<script>
import tableTheAgain from '../../components/table-theAgain'
import {
    sysCollegeList,
    sysStudentPage,
    sysStudentSwitch,
    sysDepartmentList,
    sysSpecialityList, 
    sysClassList,
    sysStudentAdd,
    sysStudentModify,
    sysStudentDelete
} from '../../api/school';
import { setTimeout } from 'timers';
    export default{
        name:'',
        data(){
            return{
                classSearchList: [],
                state4: '',
                timeout:  null,
                searchForm: {
                    inputInfo: '',
                    class: ''
                },
                tableTitle:'学生列表',
                timeout: '',
                tableOperate:[
                    {
                        content:'添加学生',
                        type:'addStudent'
                    },
                    {
                        content:'批量删除',
                        type:'deleteAll'
                    },
                ],
                columnNameList:[
                    {
                        type:'selection'
                    },
                    {
                        name:'姓名',
                        prop:'realName'
                    },
                    {
                        name:'学号',
                        prop:'studentNo'
                    },
                    {
                        name:'系',
                        prop:'departmentName',
                        fit:true
                    },
                    {
                        name:'专业',
                        prop:'specialityName'
                    },
                    {
                     name:'班级',
                     prop:'className'
                    },
                  {
                    name:'创建时间',
                    prop:'createTime'
                  }
                ],
                operateList:[
                    {
                        content:'编辑',
                        type:'edit'
                    },
                    {
                        content:'重置密码',
                        type:'resetPassword'
                    },
                    {
                        content:'删除',
                        type:'delete'
                    }
                ],
                tableData3: [
                ],
                selectOptions: [],
                dialogVisible: false,
                // 院列表
                collegeList: [],
                collegeSelected: '',
                // 系列表
                departmentList: [],
                departmentRows: [],
                // 专业列表
                specialityList: [],
                specialityRows: [],
                // 班级列表
                classList: [],
                classRows: [],
                // 表单信息
                form: {
                    studentNo: '',
                    realName: '',
                    sex: '',
                    mobile: '',
                    status: true
                },
                mobileEnable: true,
                studentId: '',
                status: false,
                dialogTitle: '',
                collegeId: '',
                departmentId: '',
                specialityId: '',
                classId: '',
                totalCount: 0,
                pageIndex: 1,
                formEvent: ''
            }
        },
        components:{
            tableTheAgain
        },
        mounted(){
            // 学生列表
            sysStudentPage({"pageIndex": this.pageIndex})
            .then((response)=>{
                console.log(response.data.pageData.status)
                let dataArr = []
                response.data.pageData.forEach(element => {
                    element.status = String(element.status)
                    console.log(typeof(element.status))
                    dataArr.push(element)
                });
                this.totalCount = Number(response.data.totalCount)
                this.tableData3 = dataArr
            })
            // 院列表
            sysCollegeList()
            .then((response)=>{
                if (response.code === 200){
                    this.collegeList = response.data
                }
            })
            // 系列表
            sysDepartmentList()
            .then((response)=>{
                if (response.code === 200){
                    this.departmentRows = response.data
                }
            })
            // 专业列表
            sysSpecialityList()
            .then((response)=>{
                if (response.code === 200){
                    this.specialityRows = response.data
                }
            })
            // 班级列表
            sysClassList()
            .then((response)=>{
                console.log(response.data)
                if (response.code === 200){
                    this.classRows = response.data
                    this.classSearchList = this.classRows
                }
            })
        },
        watch:{
            collegeId: function(val){
                console.log(val)
                if(val == -1 || val == -2 || val == '无院'){
                    this.departmentList = this.departmentRows
                }else{
                    this.departmentList = this.departmentRows.filter(function (x) { return x.collegeId == val });
                }
                if (this.departmentList.length>0) {
                    console.log(this.departmentId)
                    if (this.departmentId) {
                        this.departmentId = this.departmentId
                        return
                    }
                    this.departmentId = this.departmentList[0].departmentId
                }else{
                    this.departmentId = ""
                }
            },
            departmentId: function(val){
                console.log('depid', val)
                if(val == -1 || val == -2 || val == '无系'){
                    this.specialityList = this.specialityRows
                }else{
                    this.specialityList = this.specialityRows.filter(function (x) { return x.departmentId == val });
                }
                if (this.specialityList.length>0) {
                    if (this.specialityId) {
                        this.specialityId = this.specialityId
                        return
                    }
                    this.specialityId = this.specialityList[0].specialityId
                }else{
                    this.specialityId = ""
                }
            },
            specialityId: function(val){
                if(val == -1 || val == -2 || val == '无专业'){
                    this.classList = this.classRows
                }else{
                    this.classList = this.classRows.filter(function (x) { return x.specialityId == val });
                }
                if (this.classList.length>0) {
                    if (this.classId) {
                        this.classId = this.classId
                        return
                    }
                    this.classId = this.classList[0].classId
                }else{
                    this.classId = ""
                }
            }
        },
        methods:{
            querySearchAsync(queryString, cb) {
                var classSearchList = this.classSearchList;
                var results = queryString ? classSearchList.filter(this.createStateFilter(queryString)) : classSearchList;
                console.log('result', results)
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.className.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item)
                console.log(item.collegeName,item.departmentName,item.specialityName);
                let collegeName = item.collegeName == null ? '' : item.collegeName
                let departmentName = item.departmentName == null ? '' : item.departmentName
                let specialityName = item.specialityName == null ? '' : item.specialityName
                this.searchForm.inputInfo = collegeName + departmentName + specialityName
            },
            showComponentInfo:function(type,info){
                console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
                switch (type) {
                    case 'check':
                        //console.log(info);
                        this.check(info);
                        break;
                    case 'switch': 
                        let switchInfo = {id: info.studentId,status: info.status} 
                        sysStudentSwitch(switchInfo)
                            .then((response)=>{
                                console.log(response)
                            })
                        break;
                    case 'delete':
                        this.delStudent(info)
                        break
                    case 'deleteAll':
                        this.delStudent(info)
                        break
                    case 'addStudent':
                        this.dialogTitle = '添加学生'
                        this.formEvent = 'addNewStudent'
                        this.initStudent()
                        this.mobileEnable = false
                        console.log(this.mobileEnable)
                        this.dialogVisible = true;
                        break;
                    case 'edit':
                        this.dialogTitle = '编辑学生'
                        this.initStudent(info)
                        this.mobileEnable = true
                        console.log(this.mobileEnable)
                        this.formEvent = 'editStudent'
                        this.dialogVisible = true
                        break;
                        
                }
            },
            check:function() {
                this.dialogVisible = !this.dialogVisible;
            },
            onSubmit:function() {
                // this.specialityRows.forEach(element => {
                //     console.log('---',element)
                // });
                console.log(123)
            },
            delStudent(student) {
                console.log(student.length)
                let delArr = []
                if(student.length == undefined){
                    delArr.push(student.studentId)
                }else{
                    student.forEach(element => {
                        delArr.push(element.studentId)
                    });
                }
                
                this.$confirm('是否删除学生？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sysStudentDelete(delArr).then((response)=>{
                        if(response.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    })
                })
                .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
            },
            ensureBtn() {
                if(this.formEvent == 'addNewStudent'){
                    this.addNewStudent()
                }else if (this.formEvent == 'editStudent'){
                    this.editStudent()
                }
            },
            // 添加新学生
            addNewStudent:function() {
                console.log(123,this.form.classId)
                let sex = this.form.sex == "男" ? 1:2
                let formData = {
                    "classId": this.classId,
                    "collegeId": this.collegeId,
                    "realName": this.form.realName,
                    "specialityId": this.specialityId,
                    "gender": sex,
                    "mobile": this.form.mobile,
                    "studentNo": this.form.studentNo,
                    "departmentId": this.departmentId,
                    "status": this.status
                }
                sysStudentAdd(formData).then((response)=>{
                    if(response.code === 200){
                        this.$message({
                            type: 'success',
                            message: '添加成功！'
                        });
                        this.dialogVisible = false
                    }else{
                        this.$message({
                            type: 'error',
                            message: JSON.parse(response.msg)[0].message
                        });
                    }
                })
            },
            // 初始化修改表单的学生信息
            initStudent(info) {
                if(info){
                    let sex = info.sex == "男" ? 1:2
                    this.form.realName = info.realName
                    this.collegeId = info.collegeId == null? '无院' : info.collegeId
                    this.departmentId = info.departmentId == null? '无系' : info.departmentId
                    this.specialityId = info.specialityId == null? '无专业' : info.specialityId
                    this.classId = info.classId == null? '请添加班级' : info.classId
                    this.form.mobile = info.mobile
                    this.form.studentNo = info.studentNo
                    this.form.sex = info.gender
                    this.status = info.status 
                    this.studentId = info.studentId
                }else{
                    this.form.realName = ''
                    this.collegeId = ''
                    this.departmentId = ''
                    this.specialityId = ''
                    this.classId = ''
                    this.form.mobile = ''
                    this.form.studentNo = ''
                    this.form.sex = '男'
                    this.status = 2
                }
                
                
            },
            // 修改学生信息
            editStudent() {
                let sex = this.form.sex == "男" ? 1:2
                let formData = {
                    "studentId": this.studentId,
                    "status": this.status,
                    "classId": this.classId,
                    "collegeId": this.collegeId == '无院' ? -1 : this.collegeId,
                    "realName": this.form.realName,
                    "specialityId": this.specialityId,
                    "gender": sex,
                    "mobile": this.form.mobile,
                    "studentNo": this.form.studentNo,
                    "departmentId": this.departmentId
                }
                sysStudentModify(formData).then((response)=>{
                    if(response.code === 200){
                        this.$message({
                            type: 'success',
                            message: '修改成功！'
                        });
                        this.dialogVisible = false
                    }else{
                        this.$message({
                            type: 'error',
                            message: JSON.parse(response.msg)[0].message
                        });
                    }
                })
            },
            pageChange(pageNum) {
                sysStudentPage({"pageIndex": pageNum}).then((response)=>{
                    console.log(response)
                    let dataArr = []
                    response.data.pageData.forEach(element => {
                        element.status = String(element.status)
                        console.log(typeof(element.status))
                        dataArr.push(element)
                    });
                    this.tableData3 = dataArr
                })
            }
        }
    }
</script>

<style scoped lang="stylus" type="text/stylus">
    .student
        .el-pagination
            margin:20px 2.5% 0 0
            display:flex
            justify-content flex-end
            width:95%


</style>





