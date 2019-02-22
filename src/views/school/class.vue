<template>
  <div class="academy">
    <header-the-again headerTitle="班级管理"></header-the-again>

    <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">

        <el-input v-model="form.className"  style="width: 200px;margin-left: 10px;" placeholder="班级名称"></el-input>

        <el-autocomplete
            style="width: 200px;margin-left: 10px;"
            v-model="form.specialityName"
            :fetch-suggestions="querySearchAsync"
            value-key="specialityName"
            label="specialityName"
            placeholder="请输入专业"
            @select="handleSelect">
        </el-autocomplete>

        <el-input v-model="collegeAndDepartment" style="width: 200px;margin-left: 10px;" placeholder="院系" disabled ></el-input>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryClass">查询</el-button>
      </el-form-item>
    </el-form>

    <table-the-again
        :tableTitle="tableTitle"
        :tableOperate="tableOperate"
        :columnNameList="columnNameList"
        :tableData="tableData.pageData"
        :operateList="operateList"
        @showComponentInfo="showComponentInfo">
    </table-the-again>

    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="tableData.pageSize"
        :page-count="tableData.totalPage"
        :current-page="tableData.pageIndex"
        @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog
        :title="addForm.title"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        style="min-width: 800px">

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>院系：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop" v-model="popCollegeAndDepartment" placeholder="院系" disabled clearable></el-input>
        </div>
      </div>


      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>选择专业：</span>
        </div>
        <div class="item-input">
          <!--<el-input class="input-pop" v-model="addForm.data.departmentName" placeholder="请选择专业" clearable></el-input>-->
          <el-autocomplete
              style="width: 200px;"
              v-model="addForm.data.specialityName"
              :fetch-suggestions="querySearchAsync"
              value-key="specialityName"
              label="specialityName"
              placeholder="请输入专业"
              @select="popHandleSelect">
          </el-autocomplete>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>请选择级别：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop" v-model="addForm.data.classYear" placeholder="级别" clearable></el-input>
        </div>
      </div>
      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>班级名称：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop" v-model="addForm.data.className" placeholder="班级名称" clearable></el-input>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red"></span><span>班级负责人：</span>
        </div>
        <div class="item-input-list">
          <div class="item-input" v-for="(item,index) in addForm.data.manager">
            <el-input class="input-pop" v-model="item.workNumber" @blur="blurFunction(item.workNumber,index)"  @change="blurFunction(item.workNumber,index)" placeholder="请输入工号" clearable></el-input>
            <span>{{item.realName === '' ? '暂无此负责人' : item.realName}}</span>
            <i class="el-icon-remove"
               v-if="index !== 0 || addForm.data.manager.length > 1"
               @click="deleteInput(index)"
               style="font-size: 23px;margin-left: 10px;margin-right: 10px;">
            </i>
            <i class="el-icon-circle-plus"
               v-if="index === addForm.data.manager.length-1 && index < 4"
               @click="addInput"
               style="font-size: 23px">
            </i>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import tableTheAgain from '../../components/table-theAgain'
  import headerTheAgain from '../../components/header-theAgain'

  import { sysTenantTeacher } from '../../api/school'
  // import { sysCollegeList } from '../../api/school'
  import { sysSpecialityList } from '../../api/school'
  import { sysClassPage } from '../../api/school'
  import { sysClass } from '../../api/school'
  import { sysClassUpdate } from '../../api/school'
  import { sysClassDelete } from '../../api/school'
  // import { sysDepartmentPage } from '../../api/school'
  // import { sysDepartment } from '../../api/school'
  // import { sysDepartmentEdit } from '../../api/school'
  // import { sysDepartmentDelete } from '../../api/school'

  export default {
    name: "",
    data(){
      return{
        departmentSelectList: [],

        specialityList:[],
      // currentCollege:'',
      //  currentDepartment:'',

        collegeAndDepartment:'',
        popCollegeAndDepartment:'',

        popError:'',
        input:'',
        form: {   /*{ collegeId:-1,departmentId:-1,specialityId:-1,pageIndex:1,pageSize:2 }*/
          pageSize:5,
          pageIndex:1,
          specialityId:-1,
          collegeId:-1,
          departmentId:-1,
          className:'',
        },
        addForm:{
          title:'添加系',
          data:{
            specialityId:'',
            className:'',
            classId:'',
            manager:[
              {
                realName: "",
                userId: '',
                workNumber: ""
              }
            ]
          }
        },
        tableData:{},
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
            prop:'classId'
          },
          {
            name:'所属院名称',
            prop:'collegeName'
          },
          {
            name:'所属系名称',
            prop:'departmentName'
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
            name:'班级负责人',
            prop:'manager',
            formatter:(val)=>{
              let str = '';
              for( let i = 0; i < val.length; i++ ){
                if( val.length === 1 ){
                  str = val[0].realName;
                }else{
                  if( i === 0 ){
                    str = val[0].realName;
                  }else{
                    str += ',' + val[i].realName;
                  }
                }
              }
              return str
            }
          },
          {
            name:'年级',
            prop:'classYear'
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
      }
    },
    components:{
      tableTheAgain,
      headerTheAgain
    },
    created:function(){
      this.querySpecialityList();
      this.queryClass();
    },
    methods:{
      showComponentInfo:function(type,info){
        //console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
        switch (type) {
          case 'edit':
            //console.log(info);
            this.edit(info);
            break;
          case 'add':
            // console.log("父组件:",type,info)
            this.appendNewClass(info);
            break;
          case 'deleteAll':
            this.deleteClass('list',info);
            break;
          case 'delete':
            this.deleteClass('one',info);
            break;
        }
      },
      querySpecialityList:function(){
        sysSpecialityList().then(
          res =>{
            //this.specialityList.push({});
            this.specialityList = res.data;
            console.log( '专业列表:',this.specialityList );
          }
        ).catch( error => console.log(error) )
      },
      queryClass:function(){
        // sysClassPage({ collegeId:-1,departmentId:-1,specialityId:-1,pageIndex:1,pageSize:2 }).then(
        sysClassPage(this.form).then(
          res => {
            console.log('分页查询班级列表：',res);
            this.tableData = res.data;
          }
        ).catch( error => console.log(error) );
      },
      save:function(){
        if(this.popError !== '') return;
        for( let i = this.addForm.data.manager.length-1; i >= 0; i-- ){
          if( this.addForm.data.manager[i].realName === '暂无此负责人' || this.addForm.data.manager[i].realName === "" ){
            this.addForm.data.manager.splice(i,1);
          }
        }
        if( this.addForm.title === '添加班级' ){
          sysClass(this.addForm.data).then(
            res => { console.log('添加成功',res) }
          ).catch(
            error => { console.log('添加失败',error) }
            )
        }else if( this.addForm.title === "修改班级"){
          sysClassUpdate(this.addForm.data).then(
            res => { console.log('修改成功',res) }
          ).catch(
            error => { console.log('修改失败',error) }
            )
        }
        this.dialogVisible = false;
        setTimeout( ()=>this.queryClass(),500);
      },
      deleteClass:function(type,classList){
        console.log('classList',classList);
        let classIdList = [];
        if( type === 'list') {
          classList.filter(
            item => {
              classIdList.push( parseInt(item.classId) );
            }
          )
        }
        if( type === 'one'){
          classIdList.push( parseInt(classList.classId) )
        }

        sysClassDelete(classIdList).then(
          res => { console.log('删除成功:',res) }
        ).catch(
          error => { console.log( '删除失败',error )}
        );
        //console.log( '删除的班级列表', classIdList);
        setTimeout( ()=>{ this.queryClass() },300);
      },
      addInput:function(){
        this.popError = "";
        if(this.addForm.data.manager.length < 5){
          this.addForm.data.manager.push({realName: '', userId: '', workNumber: ''});
        }else{
          this.popError = '最多添加五位院负责人';
        }
        this.queryWorkNumber();
      },
      deleteInput:function(index){
        this.addForm.data.manager.splice(index,1);
      },
      appendNewClass:function(){
        this.dialogVisible               = !this.dialogVisible;
        this.addForm.title = '添加班级';
        this.addForm.data = {specialityId:'', className:'', manager:[{realName: "", userId: '', workNumber: ""}]}
      },
      edit:function(info){
        this.dialogVisible = !this.dialogVisible;
        this.addForm.title = '修改班级';
        this.addForm.data  = info;
        if( info.manager.length === 0){
          this.addForm.data.manager = [{realName: "", userId: '', workNumber: ""}]
        }
      },
      blurFunction:function(id,index){ //输入框失去焦点时触发 检测输入框内容是否重复
        this.popError = '';
        //去重
        let a = this.addForm.data.manager.filter(
          (element,index,arr) => {
            //this.queryWorkNumber(element.workNumber);
            if( element.workNumber === "" ) return false
            for( let i = index+1; i < arr.length; i++ ){
              if( element.workNumber === arr[i].workNumber  && index !== i ) {
                return true
              }
            }
            return false
          });
        this.queryWorkNumber(id,index);
        if( a.length > 0 ){
          // console.log( '院负责人不能重复');
          this.popError = '院负责人不能重复';
          this.open4();
        }
      },
      handleClose(done) {
        done();
      },
      handleCurrentChange:function( number ){
        // console.log( number );
        this.form.pageIndex = number;
        this.queryClass();
        console.log('this.form.pageIndex',this.form.pageIndex);
      },
      queryWorkNumber:function(id,index){
        //console.log("id:"+id);
        sysTenantTeacher(id).then(
          res => {
            //console.log( '返回信息:' , res.data.realName,res.data.userId );
            this.addForm.data.manager[index].realName = res.data.realName;
            this.addForm.data.manager[index].userId   = res.data.userId;
          }
        ).catch( () => { this.addForm.data.manager[index].realName = '暂无此负责人' } )
      },
      open4() {
        this.$message.error(this.popError);
      },
      querySearchAsync(queryString, cb) {
        let specialityList = this.specialityList;
        //console.log("搜索：",specialityList);
        let results = queryString ? specialityList.filter(this.createStateFilter(queryString)) : specialityList;
        cb(results);
        if( queryString === '' ){
          this.form.specialityId = -1;
          console.log('this.form.departmentId',this.form.departmentId);
        }
      },
      createStateFilter(queryString) {
        return (state) => {
          //console.log("state:",state,'queryString:',queryString);
          return (state.specialityName.toLowerCase().indexOf(queryString.toLowerCase()) === 0); };
      },
      handleSelect(item) {
          if( item.collegeName == null ){
            this.collegeAndDepartment = item.departmentName;
          }else if( item.departmentName == null ){
            this.collegeAndDepartment = item.collegeName;
          }else{
            this.collegeAndDepartment = item.collegeName + item.departmentName;
          }
        this.form.specialityId = item.specialityId;
       // console.log('this.form.specialityId:',this.form.specialityId);
      },
      popHandleSelect(item){
        if( item.collegeName == null ){
          this.popCollegeAndDepartment = item.departmentName;
        }else if( item.departmentName == null ){
          this.popCollegeAndDepartment = item.collegeName;
        }else{
          this.popCollegeAndDepartment = item.collegeName + item.departmentName;
        }
        this.addForm.data.specialityId = item.specialityId;
        console.log('this.addForm.specialityId',this.addForm.specialityId);
      }
    },
    watch:{
      // form:function(newFoem,oldForm){
      //   console.log('newFoem',newFoem,'oldForm',oldForm);
      // }
    },
    mounted:function(){
    }
  }
</script>
<style scoped lang="stylus" type="text/stylus">
  .academy
    .el-pagination
      margin:20px 2.5% 0 0
      display:flex
      justify-content:flex-end
      width:95%

    .pop-academy
      box-sizing:border-box
      display:flex
      justify-content:flex-start
      align-items:left
    .color-red
      color:red
    .item-title
      box-sizing border-box
      display:flex
      justify-content:flex-end
      flex-shrink:0
      width:30%
      span
        line-height:40px

    .item-input-list
      box-sizing:border-box
      display:flex
      justify-content:flex-start
      flex-direction:column
      width:70%

    .item-input
      margin-bottom:20px
      display:flex
      justify-content:flex-start
      align-items:center
      line-height:40px

    .input-pop
      width:200px
</style>
