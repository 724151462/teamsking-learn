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
            <el-form-item>
                <el-select v-model="searchForm.college" :readonly="true" placeholder="院" @change="collegeChange">
                    <el-option 
                    v-for="(item, index) in searchCollegeList" 
                    :key="index" 
                    :label="item.collegeName"
                    :value="item.collegeId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.department" :readonly="true" placeholder="系" @change="departmentChange">
                    <el-option 
                    v-for="(item, index) in searchDepartmentList" 
                    :key="index" 
                    :label="item.departmentName"
                    :value="item.departmentId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.speciality" placeholder="专业" @change="specialityChange">
                    <el-option 
                    v-for="(item, index) in searchSpecialityList" 
                    :key="index" 
                    :label="item.specialityName"
                    :value="item.specialityId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.studentClass" placeholder="班级">
                    <el-option 
                    v-for="(item, index) in classSearchList" 
                    :key="index" 
                    :label="item.className"
                    :value="item.classId"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-autocomplete
            v-model="state4"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入班级"
            value-key="className"
            @select="handleSelect"
            ></el-autocomplete> -->
            <el-form-item>
                <el-input v-model="searchForm.search" placeholder="选择输入姓名/学号">
                </el-input>
            </el-form-item>
            <!-- <el-form-item label="系名称">
                    <el-select v-model="departmentId" placeholder="系名称">

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

                <el-button type="primary" @click="searchStudent">查询</el-button>

        </el-form>

        <table-the-again
                :tableTitle="tableTitle"
                :tableOperate="tableOperate"
                :columnNameList="columnNameList"
                :tableData="tableData3"
   
                @showComponentInfo="showComponentInfo">
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
                        <el-option value="-2" label="无院"></el-option>
                        <el-option 
                            v-for="(item, index) in collegeList" 
                            :key="index" 
                            :label="item.collegeName"
                            :value="item.collegeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系名称">
                    <el-select v-model="departmentId" placeholder="系名称">
                        <el-option value="-2" label="无系"></el-option>
                        <el-option 
                            v-for="(item, index) in departmentList" 
                            :key="index" 
                            :label="item.departmentName"
                            :value="item.departmentId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业">
                    <el-select v-model="specialityId" placeholder="专业">
                        <el-option value="-2" label="无专业"></el-option>
                        <el-option 
                            v-for="(item, index) in specialityList" 
                            :key="index" 
                            :label="item.specialityName"
                            :value="item.specialityId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级">
                    <el-select v-model="classId" placeholder="班级">
                        <el-option value="-1" label="请添加班级"></el-option>
                        <el-option ref="class"
                            v-for="(item, index) in classList" 
                            :key="index" 
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
                    college: '',
                    department: '',
                    speciality: '',
                    search: '',
                    studentClass: ''
                },
                searchCollegeList: [],
                searchDepartmentList: [],
                searchSpecialityList: [],
                searchClassList: [],
                searchStudentList: [],
                tableTitle:'学生列表',
                timeout: '',
                tableOperate:[
                ],
                columnNameList:[
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
                    // {
                    //     content:'编辑',
                    //     type:'edit'
                    // },
                    // {
                    //     content:'重置密码',
                    //     type:'resetPassword'
                    // },
                    // {
                    //     content:'删除',
                    //     type:'delete'
                    // }
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
                    this.searchCollegeList = response.data
                    let all = {"collegeId": -1, "collegeName": "全部"}
                    let nullOption = {"collegeId": -2, "collegeName": "无院"}
                    this.collegeList.unshift(nullOption)
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
                    let nullOption = {"departmentId": -2, "departmentName": "无系"}
                    this.departmentRows.unshift(nullOption)
                    this.departmentRows.unshift(all)
                }
            })
            // 专业列表
            sysSpecialityList({collegeId: -1, departmentId: -1})
            .then((response)=>{
                if (response.code === 200){
                    this.specialityRows = response.data
                    this.searchSpecialityList = response.data
                    let all = {"specialityId": -1, "specialityName": "全部"}
                    // this.searchSpecialityList.unshift(all)
                    this.specialityRows.unshift(all)
                }
            })
            // 班级列表
            sysClassList({specialityId: -1})
            .then((response)=>{
                console.log(response.data)
                if (response.code === 200){
                    this.classRows = response.data
                    this.classSearchList = response.data
                    let all = {"classId": -1, "className": "全部"}
                    // this.classSearchList.unshift(all)
                    this.classRows.unshift(all)
                }
            })
        },
        methods:{
            // 院搜索值变化
            collegeChange(value) {
                // console.log(value)
                // console.log('a',this.departmentRows)
                // console.log(this.departmentRows)
                this.searchForm.department = -1
                if(value === -1){
                    console.log('coid', this.departmentRows)
                    this.searchDepartmentList = this.departmentRows
                    // this.searchForm.department = -1
                }else if (value === -2){
                    this.searchDepartmentList = this.departmentRows.filter((item)=>{
                        console.log('coid', item)
                        return (item.collegeId == null || item.departmentId == -1 || item.departmentId == -2)
                    })
                }
                else{
                    console.log('list', this.departmentRows)
                    this.searchDepartmentList = this.departmentRows.filter((item)=>{
                        console.log('coid', item)
                        return (item.collegeId == value || item.departmentId == -1 || item.departmentId == -2)
                    })
                    console.log('121', this.searchDepartmentList)
                    // this.searchForm.department = -1   
                }
                         
            },
            // 系搜索值变化
            departmentChange(value) {
                console.log('dep', value)   
                this.searchForm.speciality = -1             
                if(value === -1){
                    this.searchSpecialityList = this.specialityRows
                }else if (value === -2){
                    this.searchSpecialityList = this.specialityRows.filter((item)=>{
                        return (item.departmentId == null || item.specialityId == -1 || item.specialityId == -2)
                    })
                }else {
                    this.searchSpecialityList = this.specialityRows.filter((item)=>{
                        return (item.departmentId == value || item.specialityId == -1 || item.specialityId == -2)
                    })
                }
                
            },
            // 专业搜索值变化
            specialityChange(value) {
                console.log('spec', value)
                this.searchForm.studentClass = -1
                if(value === -1){
                    this.classSearchList = this.classRows
                }else{
                    this.classSearchList = this.classRows.filter((item)=>{
                        console.log(item)
                        return item.specialityId == value || item.classId == -1
                    })
                }
                
                // console.log(this.classSearchList)
            },
            // 查找按钮事件
            searchStudent() {
                // let {studentClass, college, department, speciality , studentInfo} = this.searchForm
                
                console.log(this.classSearchList)
                if(!this.searchForm.studentClass){
                    this.searchForm.studentClass = -1
                }
                if(!this.searchForm.college){
                    this.searchForm.college = -1
                }
                if(!this.searchForm.department){
                    this.searchForm.department = -1
                }
                if(!this.searchForm.speciality){
                    this.searchForm.speciality = -1
                }
                this.searchForm.pageIndex = 1
                sysStudentPage(this.searchForm).then((response)=>{
                    console.log(response)
                    let dataArr = []
                    response.data.pageData.forEach(element => {
                        element.status = String(element.status)
                        console.log(typeof(element.status))
                        dataArr.push(element)
                    });
                    this.tableData3 = dataArr
                    this.totalCount = Number(response.data.totalCount)
                })
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
            pageChange(pageNum) {
                this.searchForm.pageIndex = pageNum
                sysStudentPage(this.searchForm).then((response)=>{
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





