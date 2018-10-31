<template>
    <div class="class">
        班级管理

        <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
            <el-form-item label="输入搜索：">
                <el-input v-model="form.appraisal" placeholder="班级名称"></el-input>
            </el-form-item>
            <el-form-item label="专业：">
                <el-select v-model="form.teacher" placeholder="请选择专业">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年级：">
                <el-select v-model="form.teacher" placeholder="请选择年级">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="系：">
                <el-select v-model="form.teacher" placeholder="请选择系">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
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

        <el-dialog
                title="课程评价详情"
                :visible.sync="dialogVisible"
                width="60%"
                :before-close="handleClose">

            {{ this.popContentItem }}

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import tableTheAgain from '../../components/table-theAgain'
    export default {
        name: "",
        data(){
            return{
                form: {
                    appraisal: '',
                    catagory: '',
                    teacher: ''
                },
                dialogVisible: false,
                tableTitle:'班级列表',
                tableOperate:[
                    {
                        content:'添加班级',
                        type:'addCourse'
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
                        name:'编号',
                        prop:'courseId'
                    },
                    {
                        name:'所属院系',
                        prop:'courseName'
                    },
                    {
                        name:'专业',
                        prop:'courseRank'
                    },
                    {
                        name:'班级',
                        prop:'startTime'
                    },
                    {
                        name:'班级负责人',
                        prop:'endTime'
                    },
                    {
                        name:'年级',
                        prop:'count'
                    }
                ],
                operateList:[
                    {
                        content:'编辑',
                        type:'edit'
                    },
                    {
                        content:'删除',
                        type:'delete'
                    }
                ],
                tableData3: [
                    {
                        courseId:'1000001',
                        courseName:'admin',
                        courseRank:'一级',
                        startTime:'2017-06-15 14:35:51',
                        endTime:'2017-06-17 14:35:51',
                        count:'42人'
                    }
                ],
                popContentItem:[],
                textarea:'',


            }
        },
        components:{
            tableTheAgain
        },
        created:function(){

        },
        methods:{
            showComponentInfo:function(type,info){
                console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
                switch (type) {
                    case 'edit':
                        //console.log(info);
                        this.popContentItem = info;
                        console.log( this.popContentItem );
                        this.check(info);
                        break;
                }

            },
            check:function(){
                this.dialogVisible = !this.dialogVisible;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            onSubmit:function(){
                console.log('onSubmit!!');
            }
        }
    }
</script>

<style scoped lang="stylus" type="text/stylus">

    .class
        .el-pagination{
            margin:20px 2.5% 0 0
            display:flex
            justify-content flex-end
            width:95%
        }

</style>
<!--<template>-->


<!--</template>-->
<!--<script>-->
<!--export default{-->

<!--}-->

<!--</script>-->
<!--<style scoped lang="stylus" type="text/stylus">-->

<!--</style>-->

