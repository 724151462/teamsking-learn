<template>
    <div class="course">
        <header-the-again headerTitle="课程管理">
            <div style="display:inline-block;position: relative;">
                <el-input
                    v-model="searchForm.searchString"
                    style="width:230px"
                    placeholder="课程名称/课程ID"></el-input>
                <el-button
                    type="primary"
                    style="position: absolute;right:0;border-radius: 0;"
                    @click="courseSearch">查询</el-button>
            </div>
        </header-the-again>
        <Dialog
            :dialogConfig="dialogConfig"
            :formData="formData"
            :dataObj="dataObj"
            :show.sync="show"></Dialog>
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
                :total="totalCount"
                :page-size="5"
                @current-change="pageChange">
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
import headerTheAgain from "@/components/header-theAgain";
import Dialog from '@/components/dialog'
import {
    sysCoursePage,
    sysCourseId
} from '@/api/school'
export default {
    name: "",
    data(){
        return{
            form: {
                appraisal: '',
                catagory: '',
                teacher: ''
            },
            // 分页
            totalCount: 0,
            searchForm: {
                pageIndex: 1,
                searchString: '',
                pageSize: 5
            },
            dialogVisible: false,
            // 对话框
            dialogConfig: {
                btnShow: false,
                title: '',
                width: '60',
                labelWidth: '120',
                inputWidth: '70',
                top: '10'
            },
            formData:[{
                key: '课程id：',
                inputType: 'string',
                value: 'courseId'
            },
            {
                key: '课程名：',
                inputType: 'string',
                value: 'courseName'
            },
            {
                key: '课程价格：',
                inputType: 'string',
                value: 'coursePrice'
            },
            {
                key: '课程分类：',
                inputType: 'string',
                value: 'courseCategory'
            },
            {
                key: '开课时间：',
                inputType: 'string',
                value: 'beginTime'
            },
            {
                key: '结课时间：',
                inputType: 'string',
                value: 'endTime'
            },
            {
                key: '课程人数：',
                inputType: 'string',
                value: 'userCount',
            },
            {
                key: '所属学校:',
                inputType: 'string',
                value: 'courseSchool'
            },
            {
                key: '选课开放范围：',
                inputType: 'string',
                value: ''
            },
            // {
            //     key: '性别：',
            //     inputType: 'radio',
            //     option: ['男', '女'],
            //     value: 'sex'
            // },
            // {
            //     key: '班级：',
            //     inputType: 'select',
            //     option: [{id: '1', label: '1班'}, {id:'2', label: '2班'}],
            //     value: ''
            // }
            ],
            dataObj: {},
            show: false,
            tableTitle:'课程管理列表',
            tableOperate:[
                {
                    content:'添加课程',
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
                    name:'课程id',
                    prop:'courseId'
                },
                {
                    name:'课程名',
                    prop:'courseName'
                },
                {
                    name:'课程分类',
                    prop:'courseCategory'
                },
                {
                    name:'开课时间',
                    prop:'beginTime'
                },
                {
                    name:'结课时间',
                    prop:'endTime'
                },
                {
                    name:'课程人数',
                    prop:'userCount'
                }
            ],
            operateList:[
                {
                    content:'查看',
                    type:'check'
                },
                {
                    content:'删除',
                    type:'delete'
                }
            ],
            tableData3: [
            ],
            popContentItem:[],
            textarea:'',


        }
    },
    mounted() {
        this.getCoursePage()
    },
    components:{
        tableTheAgain,
        Dialog,
        headerTheAgain
    },
    methods:{
        // 页码改变
        pageChange(pageNum) {
            this.searchForm.pageIndex = pageNum
            this.getCoursePage()
        },
        // 查询课程
        courseSearch() {
            this.getCoursePage()
        },
        // 列表请求
        getCoursePage() {
            sysCoursePage(this.searchForm).then((response)=>{
                this.tableData3 = this.handleData(response.data.pageData)
                console.log('t3', this.tableData3)
                this.totalCount = Number(response.data.totalCount)
            })
        },
        showComponentInfo:function(type,info){
            console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
            switch (type) {
                case 'check':
                    //console.log(info);
                    this.dialogConfig = {
                        btnShow: false,
                        title: '查看课程'
                    }
                    sysCourseId(info.courseId).then((response)=> {
                        this.dataObj = this.handleData(response.data)
                        this.dataObj.courseSchool = '字段未知'
                        console.log(response)
                    })
                    this.show = true
                    break;
                case 'delete':

            }

        },
        handleData(data) {
            if(data.length === undefined){
                if(data.courseCategoryParent) {
                    data.courseCategory = "二级分类"
                }else{
                    data.courseCategory = "一级分类"
                }
                return data
            }else{
                let dataArr = []
                console.log('ddd', data)
                data.forEach(element => {
                    if(element.courseCategoryParent) {
                        console.log('ppp', element)
                        element.courseCategory = "二级分类"
                    }else{
                        element.courseCategory = "一级分类"
                    }
                    dataArr.push(element)
                });
                return dataArr
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
.el-pagination {
    margin: 20px 2.5% 0 0;
    display: flex;
    justify-content: flex-end;
    width: 95%;
}
</style>
