<template>
    <div class="student">

        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    学生管理
                </div>
            </el-col>
        </el-row>

        <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
            <el-form-item label="输入搜索：">
                <el-input v-model="form.appraisal" placeholder="学生名称/学号"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="form.teacher" placeholder="请选择系">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="form.teacher" placeholder="请选择专业">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="form.teacher" placeholder="请选择班级">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>

                <el-button type="primary" @click="onSubmit">查询</el-button>

            </el-form-item>
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
            title="添加学生"
            :visible.sync="dialogVisible"
            width="50%"
            >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="学号">
                    <el-input v-model="form.studentNo"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="院名称">
                    <el-select v-model="form.collegeId" placeholder="院名称" @change="collegeChange">
                    <el-option 
                        v-for="item in collegeList" 
                        :key="item.collegeId" 
                        :label="item.collegeName"
                        :value="item.collegeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系名称">
                    <el-select v-model="form.departmentId" placeholder="系名称">
                    <el-option 
                        v-for="item in departmentList" 
                        :key="item.departmentId" 
                        :label="item.departmentName"
                        :value="item.departmentId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业">
                    <el-select v-model="form.specialityId" placeholder="专业">
                    <el-option 
                        v-for="item in specialityList" 
                        :key="item.specialityId" 
                        :label="item.specialityName"
                        :value="item.specialityId"></el-option>
                    </el-select>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级">
                    <el-select v-model="form.classId" placeholder="班级">
                    <el-option 
                        v-for="item in classList" 
                        :key="item.classId" 
                        :label="item.className"
                        :value="item.classId"></el-option>
                    </el-select>
                </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addNewStudent">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
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
    sysSpecialityPage, 
    sysClassList,
    sysStudentAdd
} from '../../api/school';
    export default{
        name:'',
        data(){
            return{
                form: {
                    appraisal: '',
                    catagory: '',
                    teacher: ''
                },
                tableTitle:'学生列表',
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
                        name:'手机号',
                        prop:'mobile'
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
                collegeList:[],
                // 系列表
                departmentList:[],
                // 专业列表
                specialityList:[],
                // 班级列表
                classList:[],
                // 表单信息
                form: {
                    studentNo: '',
                    realName: '',
                    sex: '',
                    mobile: '',
                    collegeId: '',
                    departmentId: '',
                    specialityId: '',
                    classId: '',
                    
                }
            }
        },
        components:{
            tableTheAgain
        },
        mounted(){
            sysStudentPage()
            .then((response)=>{
                console.log(response.data.pageData.status)
                let dataArr = []
                response.data.pageData.forEach(element => {
                    element.status = String(element.status)
                    console.log(typeof(element.status))
                    dataArr.push(element)
                });
                this.tableData3 = dataArr
            })
            sysCollegeList()
            .then((response)=>{
                if (response.code === 200){
                    this.collegeList = response.data
                }
            })
            sysDepartmentList()
            .then((response)=>{
                if (response.code === 200){
                    this.departmentList = response.data
                }
            })
            sysSpecialityPage({ collegeId:-1,departmentId:-1  })
            .then((response)=>{
                console.log(response)
                if (response.code === 200){
                    this.specialityList = response.data.pageData
                }
            })
            sysClassList()
            .then((response)=>{
                console.log(response.data)
                if (response.code === 200){
                    this.classList = response.data
                }
            })
        },
        methods:{
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
                    case 'deleteAll':
                        console.log(info)
                    case 'addStudent':
                        this.dialogVisible = true
                        
                }
            },
            check:function(){
                this.dialogVisible = !this.dialogVisible;
            },
            onSubmit:function(){
                console.log('onSubmit!!');
            },
            // 添加新学生
            addNewStudent:function(){
                console.log(123,this.form.classId)
                let sex = this.form.sex == "男" ? 1:2
                let formData = {
                    "classId": this.form.classId,
                    "collegeId": this.form.collegeId,
                    "realName": this.form.realName,
                    "specialityId": this.form.specialityId,
                    "gender": sex,
                    "mobile": this.form.mobile,
                    "studentNo": this.form.studentNo,
                    "departmentId": this.form.departmentId
                }
                sysStudentAdd(formData).then((response)=>{
                    
                })
            },
            collegeChange:function(value){
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





