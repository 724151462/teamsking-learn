<template>
    <div class="department">
        系管理

        <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
            <el-form-item label="输入搜索：">
                <el-input v-model="form.appraisal" placeholder="系名称"></el-input>
            </el-form-item>
            <el-form-item label="院：">
                <el-select v-model="form.teacher" placeholder="请选择院">
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
                        content:'添加',
                        type:'add'
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
                        name:'专业',
                        prop:'courseName'
                    },
                    {
                        name:'学院',
                        prop:'courseRank'
                    },
                    {
                        name:'系别',
                        prop:'endTime'
                    },
                    {
                        name:'系负责人',
                        prop:'startTime'
                    },
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

    .department
        .el-pagination{
            margin:20px 2.5% 0 0
            display:flex
            justify-content flex-end
            width:95%
        }

</style>
