<template>
  <div class="academy">
    <header-the-again headerTitle="专业管理"></header-the-again>

    <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">

        <el-select v-model="form.collegeId"
                   @change="checkedCollege"
                   placeholder="请选择院">
          <el-option
              v-for="item in collegeList"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId">
          </el-option>
        </el-select>

        <el-select v-model="form.departmentId"
                   placeholder="请选择系"
                   style="width: 200px;margin-left: 10px;">
          <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentId">
          </el-option>
        </el-select>

        <el-input v-model="form.specialityName" style="width: 200px;margin-left: 10px;" placeholder="专业名称"></el-input>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="querySpeciality">查询</el-button>
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
          <span class="color-red">*</span><span>院：</span>
        </div>
        <div class="item-input">
          <el-select v-model="addForm.data.collegeId" placeholder="请选择院"
                     @change="checkedCollege('pop')">
            <el-option
                v-for="item in collegeList"
                :key="item.collegeId"
                :label="item.value"
                :value="item.collegeId">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>系：</span>
        </div>
        <div class="item-input">
          <el-select v-model="addForm.data.departmentId" placeholder="请选择系">
            <el-option
                v-for="item in popDepartmentList"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span><span>专业：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop" v-model="addForm.data.specialityName" placeholder="请填写专业" clearable></el-input>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red"></span><span>系负责人：</span>
        </div>
        <div class="item-input-list">
          <div class="item-input" v-for="(item,index) in addForm.data.manager">
            <el-input class="input-pop" v-model="item.workNumber" @blur="blurFunction(item.workNumber,index)" placeholder="请输入工号" clearable></el-input>
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
  import { sysCollegeList } from '../../api/school'
  import { sysSpecialityPage } from '../../api/school'
  import { sysDepartmentList } from '../../api/school'
  import { sysSpeciality } from '../../api/school'
  import { sysSpecialityEdit } from '../../api/school'
  import { sysSpecialityDelete } from '../../api/school'

  export default {
    data(){
      return{
        collegeAndDepartment:'',
        collegeList: [],
        departmentList:[],
        popDepartmentList:[],

        popError:'',
        form: {
          pageSize:5,
          pageIndex:1,
          departmentId:-1,
          collegeId:-1,
          specialityName:'',
        },
        addForm:{
          title:'添加专业',
          data:{
            collegeId:'',
            departmentId:'',
            departmentName:'',
            specialityName:'',
            specialityId:'',
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
        tableTitle:'系列表',
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
            prop:'specialityId'
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
            name:'专业负责人',
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
      this.$emit('floorStatus','school');
      this.getCollegeList();  //获取院列表
      this.sysDepartmentList();  //获取系列表
      this.querySpeciality();  //查询专业
    },
    methods:{
      showComponentInfo:function(type,info){
        //console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
        switch (type) {
          case 'edit':
            this.edit(info);break;
          case 'add':
            this.appendNewDepartment(info);break;
          case 'deleteAll':
            this.delete('list',info);break;
          case 'delete':
            this.delete('one',info);break;
        }
      },
      getCollegeList:function(){ //查询院列表
        sysCollegeList().then(
          res=>{
            this.collegeList.push({value: "全部",collegeId:-1 });
            res.data.filter(
              element =>{
                this.collegeList.push({value: element.collegeName,collegeId:element.collegeId} );
                return true;
              });
            if( this.collegeList.length > 0 ){
              this.form.collegeId = -1;
              //this.querySpeciality();
            }
          }
        ).catch(
          error=>{ console.log(error) }
        );
      },
      sysDepartmentList:function(){ //查询系列表
        sysDepartmentList().then(
          res => {
            let departmentList = res.data;
            // console.log('departmentList:',departmentList);

            this.collegeAndDepartment = this.collegeList;
            for(let a = 0; a < departmentList.length; a++ ){
              if( departmentList[a].collegeId === null ){
                departmentList[a].collegeId = -1;
              }
            }
            for( let i = 0; i < this.collegeAndDepartment.length; i++ ){
              this.collegeAndDepartment[i].department = [];
              this.collegeAndDepartment[i].collegeName = this.collegeAndDepartment[i].value;
              this.collegeAndDepartment[i].department.push( { departmentName:'全部',departmentId:-1 } );
              for( let j = 0; j < departmentList.length; j++){
                if( this.collegeAndDepartment[i].collegeId === departmentList[j].collegeId  ){
                  this.collegeAndDepartment[i].department.push( departmentList[j] );
                }
              }
            }
            this.checkedCollege();
            //this.checkedCollege('pop');
          }
        ).catch(
          error => console.log(error)
        );
      },
      querySpeciality:function() { //查询专业信息
        //console.log('提交的表单信息L:',this.form);
        sysSpecialityPage(this.form).then(
          res => {
            this.tableData = res.data;
            console.log("专业信息",this.tableData);
          }
        ).catch(
          error=>{ console.log(error); }
        )
      },
      //查询专业列表
    querySpecialityList:function(){

    },
      save:function(){
        if(this.popError !== '') return;
        for( let i = this.addForm.data.manager.length-1; i >= 0; i-- ){
          if( this.addForm.data.manager[i].realName === '暂无此负责人' || this.addForm.data.manager[i].realName === "" ){
            this.addForm.data.manager.splice(i,1);
          }
        }
        if( this.addForm.title === "添加专业" ){
          console.log( '添加的专业的信息:',this.addForm.data);
          sysSpeciality( this.addForm.data ).then(
            res => { console.log('添加记录的信息：',res) } ).catch(error => console.log(error))
        }
        if( this.addForm.title === "编辑专业" ){
          console.log('编辑专业信息：',this.addForm.data)
          sysSpecialityEdit(this.addForm.data).then(
            res => { console.log('编辑记录的信息：',res)}
          ).catch(error => console.log(error));
        }
        setTimeout( ()=>this.querySpeciality() ,300);
        this.dialogVisible = false;
      },
      delete:function(type,specialityList){
        let specialityLists = [];
        if( type === 'list' ){
          specialityList.filter(
            element => {
              specialityLists.push( element.specialityId);
              return true;
            }
          )
          console.log('要删除的专业信息(list):',specialityLists);
        }
        if( type === 'one' ){
          specialityLists.push( specialityList.specialityId);
          console.log('要删除的专业信息(one):',specialityLists);
        }
        sysSpecialityDelete(specialityLists).then(res=>{console.log(res)}).catch(error=>console.log(error));
        setTimeout( ()=>this.querySpeciality() ,300);
      },
      addInput:function(){
        this.popError = "";
        if(this.addForm.data.manager.length < 5){
          this.addForm.data.manager.push({realName: '', userId: '', workNumber: ''});
        }else{
          this.popError = '最多添加五位专业负责人';
        }
        this.queryWorkNumber();
      },
      deleteInput:function(index){
        this.addForm.data.manager.splice(index,1);
      },
      checkedCollege:function(type){ //选中院触发事件
        if( type === 'pop' ){
          console.log('pop', this.addForm.data.collegeId);
          this.popDepartmentList = this.collegeList.filter(element => {return element.collegeId === this.addForm.data.collegeId;})[0].department;
          if( this.popDepartmentList.length === 0 ){
            this.popDepartmentList.push({ departmentName:'全部',departmentId: -1 });
          }
          //this.addForm.data.departmentId = -1;
        }else{
          this.departmentList = this.collegeList.filter(element => {return element.collegeId === this.form.collegeId;})[0].department;
          if( this.departmentList.length === 0 ){
            this.departmentList.push({ departmentName:'全部',departmentId: -1 });
          }
          this.form.departmentId = -1;
        }
          // this.form.departmentId =  this.departmentList[0].departmentId;
      },
      appendNewDepartment:function(){
        this.dialogVisible = !this.dialogVisible;
        this.addForm.data  = {
                               collegeId:'',
                               departmentId:'',
                               specialityName:'',
                               manager:[
                                 {
                                   realName: '',
                                   userId: '',
                                   workNumber: ''
                                 }
                               ]
                             }
      },
      edit:function(info){
        this.dialogVisible = true;
        console.log("编辑专业",info);
        this.addForm.title = '编辑专业';
        this.addForm.data = info;
        if( this.addForm.data.manager.length ===0 ){
          this.addForm.data.manager = [{realName: '', userId: '', workNumber: ''}];
        }
        this.checkedCollege('pop');
      },
      blurFunction:function(id,index){ //输入框失去焦点时触发 检测输入框内容是否重复
        this.popError = '';
        let a = this.addForm.data.manager.filter(
          (element,index,arr) => {
            //this.queryWorkNumber(element.workNumber);
            if( element.workNumber === "" ) return false;
            for( let i = index+1; i < arr.length; i++ ){
              if( element.workNumber === arr[i].workNumber  && index !== i ) {
                return true;
              }
            }
            return false
          });
        this.queryWorkNumber(id,index);
        if( a.length > 0 ){
          this.popError = '专业负责人不能重复';
          this.open4();
        }
      },
      handleClose(done) {
        done();
      },
      handleCurrentChange:function( number ){
        // console.log( number );
        this.form.pageIndex = number;
        this.querySpeciality();
      },
      queryWorkNumber:function(id,index){
        sysTenantTeacher(id).then(
          res => {
            this.addForm.data.manager[index].realName = res.data.realName;
            this.addForm.data.manager[index].userId   = res.data.userId;
          }
        ).catch( () => { this.addForm.data.manager[index].realName = '暂无此负责人' } )
      },
      open4() {
        this.$message.error(this.popError);
      },
      querySearchAsync(queryString, cb) {
        let collegeList = this.collegeList;
        let results     = queryString ? collegeList.filter(this.createStateFilter(queryString)) : collegeList;
        cb(results);
      },
      createStateFilter(queryString) {
        return (state) => { return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0); };
      },
      handleSelect(item) { },
    },
    watch:{  },
    mounted:function(){  }
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
