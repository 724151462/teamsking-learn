<template>
  <div class="teacher">

    <header-the-again headerTitle="教师管理"></header-the-again>
    <el-form ref="form" :model="searchForm" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="searchForm.teacherInfo" placeholder="老师名称/工号/手机号"></el-input>
      </el-form-item>
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
        <el-button type="primary" @click="teacherSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      switchColumn='open'
      @showComponentInfo="showComponentInfo">
    </table-the-again>

    <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size="2"
            :current-page="searchForm.pageIndex"
            @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>
  import tableTheAgain from '../../components/table-theAgain'
  import headerTheAgain from '../../components/header-theAgain'

  import {
    sysCollegeList,
    sysDepartmentList,
    sysTeacherPage,
    sysTeacherSwitch,
    sysTeacherReset
  } from '../../api/school';

  export default{
    name:'',
    data(){
      return{
        dialogVisible: false,
        tableOperate:[
          {
            content:'添加教师',
            type:'addTeacher'
          },
          {
            content:'批量重置密码',
            type:'resetAll'
          },
        ],
        tableTitle:'教师管理列表',
        columnNameList:[
          {
            type:"selection"
          },
          {
            name:'姓名',
            prop:'teacherName'
          },
          {
            name:'工号',
            prop:'teacherNumber'
          },
          {
            name:'手机号',
            prop:'mobile'
          },
          {
            name:'院',
            prop:'collegeName'
          },
          {
            name:'系',
            prop:'departmentName'
          },
          {
            name:'创建课程',
            prop:'courseCount'
          },

        ],
        operateList:[
          {
            content:'编辑',
            type:'edit'
          },
          {
            content:'重置密码',
            type:'resetPassword'
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
        popContentItem:[],
        textarea:'',
        searchForm: {
            college: '',
            department: '',
            teacherInfo: '',
            pageIndex: 1
        },
        searchCollegeList: [],
        searchDepartmentList: [],
        departmentRows: [],
        collegeList: [],
        totalCount: 0,
        pageIndex: 1,
      }
    },
    components:{
        tableTheAgain,
        headerTheAgain
    },
    computed:{
      testList() {
        return this.$store.state.collegeList
      }
    },
    mounted(){
      this.$store.commit('getCollegeList')
      // 教师列表
      sysTeacherPage({"pageIndex": this.pageIndex})
      .then((response)=>{
          let dataArr = []
          response.data.pageData.forEach(element => {
              element.status = String(element.status)
              console.log(typeof(element.status))
              dataArr.push(element)
          });
          this.totalCount = Number(response.data.totalCount)
          console.log(this.totalCount)
          this.tableData3 = dataArr
      })
      // 院列表
      sysCollegeList()
      .then((response)=>{
          if (response.code === 200){
              this.collegeList = response.data
              this.searchCollegeList = response.data
              let all = {"collegeId": -1, "collegeName": "全部"}
            // this.collegeList.unshift(all)
              this.searchCollegeList.unshift(all)
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
              console.log(this.departmentRows)
          }
      })
    },
    methods:{
      // 院搜索值变化
      collegeChange(value) {
          // console.log(value)
          // console.log('a',this.departmentRows)
          if(value === -1){
              this.searchDepartmentList = this.departmentRows
              this.searchForm.department = -1
          }else{
              this.searchDepartmentList = this.departmentRows.filter((item,index)=>{
                  return (item.collegeId == value || item.collegeId == -1 || index == 0)
              })

              console.log('121', this.searchDepartmentList)
              this.searchForm.department = -1   
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
      teacherSearch(){
        this.searchForm.pageIndex = 1
        sysTeacherPage(this.searchForm)
          .then((response)=>{
            console.log(response)
            let dataArr = []
            response.data.pageData.forEach(element => {
                element.status = String(element.status)
                console.log(typeof(element.status))
                dataArr.push(element)
            });
            this.tableData3 = dataArr
            this.totalCount = Number(response.data.totalCount)
            this.pageIndex = 1
          })
      },
      pageChange(pageNum) {
        this.searchForm.pageIndex = pageNum
        sysTeacherPage(this.searchForm).then((response)=>{
            console.log(response)
            let dataArr = []
            response.data.pageData.forEach(element => {
                element.status = String(element.status)
                console.log(typeof(element.status))
                dataArr.push(element)
            });
            this.tableData3 = dataArr
        })
      },
      showComponentInfo:function(type,info){
        console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
        switch (type) {
          case 'check':
            //console.log(info);
            this.popContentItem = this.info;
            this.check(info);
            break;
          case 'switch': 
            let switchInfo = {id: info.teacherId,status: info.status} 
            sysTeacherSwitch(switchInfo)
                .then((response)=>{
                    console.log(response)
                })
            break;
          case 'addTeacher':
            this.$router.push('addteacher')
            break;
          case 'resetPassword':
            this.resetPassword(info)
            break;
          case 'resetAll':
            break;
            this.resetPassword(info)
          case 'edit':
            this.$router.push({
              name:'修改教师', 
              params:{"id": info.teacherId}
            })
            break;
        }
      },
      check:function(){
        this.dialogVisible = !this.dialogVisible;
      },
      resetPassword(teacher) {
          console.log(teacher.length)
          let resetArr = []
          if(teacher.length == undefined){
              resetArr.push(teacher.teacherId)
          }else{
              teacher.forEach(element => {
                  resetArr.push(element.teacherId)
              });
          }
          
          this.$confirm('是否重置密码？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              sysTeacherReset(resetArr).then((response)=>{
                  if(response.code === 200) {
                      this.$message({
                          type: 'success',
                          message: '重置成功!'
                      });
                  }
              })
          })
          .catch(() => {
          this.$message({
              type: 'info',
              message: '已取消重置'
          });          
          });
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
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .teacher
    .pop-user-info
      margin:0px 0 20px 0
      box-sizing border-box
      display:flex
      justify-content:space-around
      flex-direction:column
      align-items:center
      width:150px
      height:150px

      div
        width:100px
        height:100px
        background:cyan
        border-radius:50% 50%

      span
        margin:5px 0
        box-sizing:border-box
        display:inline

    .pop-content-item
      span:first-child
        font-weight:800
    .pop-content-item:last-child
      margin-top:20px

    .el-pagination
      margin:20px 2.5% 0 0
      display:flex
      justify-content flex-end
      width:95%
</style>

    <!--<header-the-again headerTitle="教师管理"></header-the-again>-->


    <!--<el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">-->
      <!--<el-form-item label="输入搜索：">-->
        <!--<el-input v-model="form.appraisal" placeholder="老师名称/工号"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="输入搜索：">-->
        <!--<el-input v-model="form.phone" placeholder="手机号"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->

    <!--<table-the-again-->
      <!--:tableTitle="tableTitle"-->
      <!--:tableOperate="tableOperate"-->
      <!--:columnNameList="columnNameList"-->
      <!--:tableData="tableData3"-->
      <!--:operateList="operateList"-->
      <!--@showComponentInfo="showComponentInfo">-->
    <!--</table-the-again>-->

    <!--<el-dialog-->
      <!--title="添加专业"-->
      <!--:visible.sync="dialogVisible"-->
      <!--width="60%"-->
      <!--:before-close="handleClose">-->

      <!--<div class="pop-user-info">-->
        <!--<div></div>-->
        <!--<span>windir</span>-->
      <!--</div>-->
      <!--<div class="pop-content-item" v-for="item in popContentItem">-->
        <!--<span class="title"> {{ item.title }} </span>-->
        <!--<span class="content"> {{ item.content }} </span>-->
      <!--</div>-->
      <!--<div class="pop-content-item">-->
        <!--<span class="title"> 评价内容 </span>-->
        <!--<el-input-->
          <!--type="textarea"-->
          <!--:rows="4"-->
          <!--placeholder="请输入内容"-->
          <!--v-model="textarea">-->
        <!--</el-input>-->
      <!--</div>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">保 存</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->

    <!--<el-pagination-->
      <!--background-->
      <!--layout="prev, pager, next"-->
      <!--:total="1000">-->
    <!--</el-pagination>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import tableTheAgain from '../../components/table-theAgain'-->
  <!--import headerTheAgain from '../../components/header-theAgain'-->

  <!--export default{-->
    <!--name:'',-->
    <!--data(){-->
      <!--return{-->
        <!--form: {-->
          <!--appraisal: '',-->
          <!--catagory: '',-->
          <!--teacher: ''-->
        <!--},-->
        <!--dialogVisible: false,-->
        <!--tableOperate:[-->
          <!--{-->
            <!--content:'添加教师',-->
            <!--type:'addTeacher'-->
          <!--},-->
          <!--{-->
            <!--content:'批量删除',-->
            <!--type:'deleteAll'-->
          <!--},-->
        <!--],-->
        <!--tableTitle:'教师管理列表',-->
        <!--columnNameList:[-->
          <!--{-->
            <!--type:"selection"-->
          <!--},-->
          <!--{-->
            <!--name:'姓名',-->
            <!--prop:'id'-->
          <!--},-->
          <!--{-->
            <!--name:'工号',-->
            <!--prop:'id'-->
          <!--},-->
          <!--{-->
            <!--name:'手机号',-->
            <!--prop:'userType'-->
          <!--},-->
          <!--{-->
            <!--name:'创建课程',-->
            <!--prop:'userName'-->
          <!--},-->
          <!--{-->
            <!--name:'开课数量',-->
            <!--prop:'createdTime',-->
            <!--fit:true-->
          <!--},-->
          <!--{-->
            <!--name:'创建时间',-->
            <!--prop:'status'-->
          <!--}-->
        <!--],-->
        <!--operateList:[-->
          <!--{-->
            <!--content:'编辑',-->
            <!--type:'edit'-->
          <!--},-->
          <!--{-->
            <!--content:'重置密码',-->
            <!--type:'resetPassword'-->
          <!--},-->
          <!--{-->
            <!--content:'删除',-->
            <!--type:'delete'-->
          <!--}-->
        <!--],-->
        <!--tableData3: [-->
          <!--{-->
            <!--id:'20180900',-->
            <!--userType:'管理员',-->
            <!--userName:'10',-->
            <!--createdTime:'2017-06-15 14:35:51',-->
            <!--status:'启用'-->
          <!--},-->
          <!--{-->
            <!--id:'20180900',-->
            <!--userType:'管理员',-->
            <!--userName:'10',-->
            <!--createdTime:'2017-06-15 14:35:51',-->
            <!--status:'启用'-->
          <!--},-->
          <!--{-->
            <!--id:'20180900',-->
            <!--userType:'管理员',-->
            <!--userName:'10',-->
            <!--createdTime:'2017-06-15 14:35:51',-->
            <!--status:'启用'-->
          <!--},-->
          <!--{-->
            <!--id:'20180900',-->
            <!--userType:'管理员',-->
            <!--userName:'10',-->
            <!--createdTime:'2017-06-15 14:35:51',-->
            <!--status:'启用'-->
          <!--}-->
        <!--],-->
        <!--popContentItem:[],-->
        <!--textarea:'',-->
      <!--}-->
    <!--},-->
    <!--components:{-->
        <!--tableTheAgain,-->
        <!--headerTheAgain-->
    <!--},-->
    <!--mounted:function(){ },-->
    <!--methods:{-->
      <!--showComponentInfo:function(type,info){-->
        <!--console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );-->
        <!--switch (type) {-->
          <!--case 'check':-->
            <!--//console.log(info);-->
            <!--this.popContentItem = this.info;-->
            <!--this.check(info);-->
            <!--break;-->
        <!--}-->
      <!--},-->
      <!--check:function(){-->
        <!--this.dialogVisible = !this.dialogVisible;-->
      <!--},-->
      <!--handleClose(done) {-->
        <!--this.$confirm('确认关闭？')-->
          <!--.then(_ => {-->
            <!--done();-->
          <!--})-->
          <!--.catch(_ => {});-->
      <!--},-->
      <!--onSubmit:function(){-->
        <!--console.log('onSubmit!!');-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped lang="stylus" type="text/stylus">-->
  <!--.teacher-->
    <!--.pop-user-info-->
      <!--margin:0px 0 20px 0-->
      <!--box-sizing border-box-->
      <!--display:flex-->
      <!--justify-content:space-around-->
      <!--flex-direction:column-->
      <!--align-items:center-->
      <!--width:150px-->
      <!--height:150px-->

      <!--div-->
        <!--width:100px-->
        <!--height:100px-->
        <!--background:cyan-->
        <!--border-radius:50% 50%-->

      <!--span-->
        <!--margin:5px 0-->
        <!--box-sizing:border-box-->
        <!--display:inline-->

    <!--.pop-content-item-->
      <!--span:first-child-->
        <!--font-weight:800-->
    <!--.pop-content-item:last-child-->
      <!--margin-top:20px-->

    <!--.el-pagination-->
      <!--margin:20px 2.5% 0 0-->
      <!--display:flex-->
      <!--justify-content flex-end-->
      <!--width:95%-->
<!--</style>-->
<!--<tempalte>-->
  <!--<div>-->
    <!--<div class="block">-->
      <!--<span class="demonstration">默认 click 触发子菜单</span>-->
      <!--<el-cascader-->
          <!--:options="options"-->
          <!--v-model="selectedOptions"-->
          <!--@change="handleChange">-->
      <!--</el-cascader>-->
    <!--</div>-->

    <!--<div class="block">-->
      <!--<span class="demonstration">hover 触发子菜单</span>-->
      <!--<el-cascader-->
          <!--expand-trigger="hover"-->
          <!--:options="options"-->
          <!--v-model="selectedOptions2"-->
          <!--@change="handleChange">-->
      <!--</el-cascader>-->
    <!--</div>-->

  <!--</div>-->

<!--</tempalte>-->

<!--<script>-->
  <!--export default {-->
    <!--data() {-->
      <!--return {-->
        <!--options: [{-->
          <!--value: 'zhinan',-->
          <!--label: '指南',-->
          <!--children: [{-->
            <!--value: 'shejiyuanze',-->
            <!--label: '设计原则设计原则设计原则',-->
            <!--children: [{-->
              <!--value: 'yizhi',-->
              <!--label: '一致'-->
            <!--}, {-->
              <!--value: 'fankui',-->
              <!--label: '反馈'-->
            <!--}, {-->
              <!--value: 'xiaolv',-->
              <!--label: '效率'-->
            <!--}, {-->
              <!--value: 'kekong',-->
              <!--label: '可控'-->
            <!--}]-->
          <!--}, {-->
            <!--value: 'daohang',-->
            <!--label: '导航',-->
            <!--children: [{-->
              <!--value: 'cexiangdaohang',-->
              <!--label: '侧向导航'-->
            <!--}, {-->
              <!--value: 'dingbudaohang',-->
              <!--label: '顶部导航'-->
            <!--}]-->
          <!--}]-->
        <!--}, {-->
          <!--value: 'zujian',-->
          <!--label: '组件',-->
          <!--children: [{-->
            <!--value: 'basic',-->
            <!--label: 'Basic',-->
            <!--children: [{-->
              <!--value: 'layout',-->
              <!--label: 'Layout 布局'-->
            <!--}, {-->
              <!--value: 'color',-->
              <!--label: 'Color 色彩'-->
            <!--}, {-->
              <!--value: 'typography',-->
              <!--label: 'Typography 字体'-->
            <!--}, {-->
              <!--value: 'icon',-->
              <!--label: 'Icon 图标'-->
            <!--}, {-->
              <!--value: 'button',-->
              <!--label: 'Button 按钮'-->
            <!--}]-->
          <!--}, {-->
            <!--value: 'form',-->
            <!--label: 'Form',-->
            <!--children: [{-->
              <!--value: 'radio',-->
              <!--label: 'Radio 单选框'-->
            <!--}, {-->
              <!--value: 'checkbox',-->
              <!--label: 'Checkbox 多选框'-->
            <!--}, {-->
              <!--value: 'input',-->
              <!--label: 'Input 输入框'-->
            <!--}, {-->
              <!--value: 'input-number',-->
              <!--label: 'InputNumber 计数器'-->
            <!--}, {-->
              <!--value: 'select',-->
              <!--label: 'Select 选择器'-->
            <!--}, {-->
              <!--value: 'cascader',-->
              <!--label: 'Cascader 级联选择器'-->
            <!--}, {-->
              <!--value: 'switch',-->
              <!--label: 'Switch 开关'-->
            <!--}, {-->
              <!--value: 'slider',-->
              <!--label: 'Slider 滑块'-->
            <!--}, {-->
              <!--value: 'time-picker',-->
              <!--label: 'TimePicker 时间选择器'-->
            <!--}, {-->
              <!--value: 'date-picker',-->
              <!--label: 'DatePicker 日期选择器'-->
            <!--}, {-->
              <!--value: 'datetime-picker',-->
              <!--label: 'DateTimePicker 日期时间选择器'-->
            <!--}, {-->
              <!--value: 'upload',-->
              <!--label: 'Upload 上传'-->
            <!--}, {-->
              <!--value: 'rate',-->
              <!--label: 'Rate 评分'-->
            <!--}, {-->
              <!--value: 'form',-->
              <!--label: 'Form 表单'-->
            <!--}]-->
          <!--}, {-->
            <!--value: 'data',-->
            <!--label: 'Data',-->
            <!--children: [{-->
              <!--value: 'table',-->
              <!--label: 'Table 表格'-->
            <!--}, {-->
              <!--value: 'tag',-->
              <!--label: 'Tag 标签'-->
            <!--}, {-->
              <!--value: 'progress',-->
              <!--label: 'Progress 进度条'-->
            <!--}, {-->
              <!--value: 'tree',-->
              <!--label: 'Tree 树形控件'-->
            <!--}, {-->
              <!--value: 'pagination',-->
              <!--label: 'Pagination 分页'-->
            <!--}, {-->
              <!--value: 'badge',-->
              <!--label: 'Badge 标记'-->
            <!--}]-->
          <!--}, {-->
            <!--value: 'notice',-->
            <!--label: 'Notice',-->
            <!--children: [{-->
              <!--value: 'alert',-->
              <!--label: 'Alert 警告'-->
            <!--}, {-->
              <!--value: 'loading',-->
              <!--label: 'Loading 加载'-->
            <!--}, {-->
              <!--value: 'message',-->
              <!--label: 'Message 消息提示'-->
            <!--}, {-->
              <!--value: 'message-box',-->
              <!--label: 'MessageBox 弹框'-->
            <!--}, {-->
              <!--value: 'notification',-->
              <!--label: 'Notification 通知'-->
            <!--}]-->
          <!--}, {-->
            <!--value: 'navigation',-->
            <!--label: 'Navigation',-->
            <!--children: [{-->
              <!--value: 'menu',-->
              <!--label: 'NavMenu 导航菜单'-->
            <!--}, {-->
              <!--value: 'tabs',-->
              <!--label: 'Tabs 标签页'-->
            <!--}, {-->
              <!--value: 'breadcrumb',-->
              <!--label: 'Breadcrumb 面包屑'-->
            <!--}, {-->
              <!--value: 'dropdown',-->
              <!--label: 'Dropdown 下拉菜单'-->
            <!--}, {-->
              <!--value: 'steps',-->
              <!--label: 'Steps 步骤条'-->
            <!--}]-->
          <!--}, {-->
            <!--value: 'others',-->
            <!--label: 'Others',-->
            <!--children: [{-->
              <!--value: 'dialog',-->
              <!--label: 'Dialog 对话框'-->
            <!--}, {-->
              <!--value: 'tooltip',-->
              <!--label: 'Tooltip 文字提示'-->
            <!--}, {-->
              <!--value: 'popover',-->
              <!--label: 'Popover 弹出框'-->
            <!--}, {-->
              <!--value: 'card',-->
              <!--label: 'Card 卡片'-->
            <!--}, {-->
              <!--value: 'carousel',-->
              <!--label: 'Carousel 走马灯'-->
            <!--}, {-->
              <!--value: 'collapse',-->
              <!--label: 'Collapse 折叠面板'-->
            <!--}]-->
          <!--}]-->
        <!--}, {-->
          <!--value: 'ziyuan',-->
          <!--label: '资源',-->
          <!--children: [{-->
            <!--value: 'axure',-->
            <!--label: 'Axure Components'-->
          <!--}, {-->
            <!--value: 'sketch',-->
            <!--label: 'Sketch Templates'-->
          <!--}, {-->
            <!--value: 'jiaohu',-->
            <!--label: '组件交互文档'-->
          <!--}]-->
        <!--}],-->
        <!--selectedOptions: [],-->
        <!--selectedOptions2: []-->
      <!--};-->
    <!--},-->
    <!--methods: {-->
      <!--handleChange(value) {-->
        <!--console.log(value);-->
      <!--}-->
    <!--}-->
  <!--};-->
<!--</script>-->
