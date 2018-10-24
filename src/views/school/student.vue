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
                @showComponentInfo="showComponentInfo">
        </table-the-again>

        <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
        </el-pagination>

    </div>
</template>

<script>
    import tableTheAgain from '../../components/table-theAgain'
    export default{
        name:'',
        data(){
            return{
                form: {
                    appraisal: '',
                    catagory: '',
                    teacher: ''
                },
                dialogVisible: false,
                tableTitle:'学生列表',
                tableOperate:[
                    {
                        content:'添加学生',
                        type:'addTeacher'
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
                        name:'工号',
                        prop:'id'
                    },
                    {
                        name:'用户名',
                        prop:'userType'
                    },
                    {
                        name:'用户昵称',
                        prop:'userName'
                    },
                    {
                        name:'创建时间',
                        prop:'createdTime',
                        fit:true
                    },
                    {
                        name:'状态',
                        prop:'status'
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
                    {
                        id:'20180900',
                        userType:'管理员',
                        userName:'10',
                        createdTime:'2017-06-15 14:35:51',
                        status:'启用'
                    },
                    {
                        id:'20180900',
                        userType:'管理员',
                        userName:'10',
                        createdTime:'2017-06-15 14:35:51',
                        status:'启用'
                    },
                    {
                        id:'20180900',
                        userType:'管理员',
                        userName:'10',
                        createdTime:'2017-06-15 14:35:51',
                        status:'启用'
                    },
                    {
                        id:'20180900',
                        userType:'管理员',
                        userName:'10',
                        createdTime:'2017-06-15 14:35:51',
                        status:'启用'
                    }
                ],
            }
        },
        components:{
            tableTheAgain
        },
        mounted:function(){ },
        methods:{
            showComponentInfo:function(type,info){
                console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
                switch (type) {
                    case 'check':
                        //console.log(info);
                        this.check(info);
                        break;
                }
            },
            check:function(){
                this.dialogVisible = !this.dialogVisible;
            },
            onSubmit:function(){
                console.log('onSubmit!!');
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





