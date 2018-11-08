<template>
  <div class="academy">
    <header-the-again headerTitle="系管理"></header-the-again>

    <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-select v-model="form.collegeId" placeholder="请选择院">
          <el-option
              v-for="item in departmentSelectList"
              :key="item.collegeId"
              :label="item.value"
              :value="item.collegeId">
          </el-option>
        </el-select>
        <el-input v-model="form.departmentName" style="width: 200px;margin-left: 10px;" placeholder="系名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="queryDepartment">查询</el-button>
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
    {{tableData}}

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
          <el-select v-model="addForm.data.collegeId" placeholder="请选择院">
            <el-option
                v-for="item in departmentSelectList"
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
          <el-input class="input-pop" v-model="addForm.data.departmentName" placeholder="请填写系" clearable></el-input>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red"></span><span>系负责人：</span>
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
  import { sysCollegeList } from '../../api/school'
  import { sysDepartmentPage } from '../../api/school'
  import { sysDepartment } from '../../api/school'
  import { sysDepartmentEdit } from '../../api/school'
  import { sysDepartmentDelete } from '../../api/school'

  export default {
    name: "",
    data(){
      return{
        departmentSelectList: [],
        popError:'',
        input:'',
        form: {
          pageSize:5,
          pageIndex:1,
          departmentName:'',
          collegeId:-1
        },
        addForm:{
          title:'添加系',
          data:{
            collegeId:'',
            departmentId:'',
            departmentName:'',
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
            prop:'departmentId'
          },
          {
            name:'系名称',
            prop:'departmentName'
          },
          {
            name:'院名称',
            prop:'collegeName'
          },
          {
            name:'系负责人',
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
      this.getCollegeList();
      this.queryDepartment()
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
            this.appendNewDepartment(info);
            break;
          case 'deleteAll':
            this.deleteDepartment('list',info);
            break;
          case 'delete':
            this.deleteDepartment('one',info);
            break;
        }
      },
      getCollegeList:function(){
        sysCollegeList().then(
          res=>{
            this.departmentSelectList.push({value: "无分院",collegeId:-1 });
            res.data.filter(
              element =>{
                this.departmentSelectList.push({value: element.collegeName,collegeId:element.collegeId} );
                return true;
              });
            if( this.departmentSelectList.length > 0 ){
              this.form.collegeId = -1;
              this.queryDepartment();
            }
          }
        ).catch(
          error=>{ console.log(error) }
        );
      },
      queryDepartment:function() {
        let data = JSON.parse(JSON.stringify(this.form))
        for(let i = 0; i < data.length; i++){
          if(data[i] === '' || JSON.stringify(data[i]) === '""'){
            delete data[i]
          }
        }
        sysDepartmentPage( this.form ).then(
          res => {
            //console.log('系信息',res.data)
            this.tableData = res.data;
            if( this.tableData.pageData.length > 0 ){
              //
              for( let i = 0; i < this.tableData.pageData.length; i++){
                let college = this.departmentSelectList.filter(
                  item => {
                    return item.collegeId === this.tableData.pageData[i].collegeId;
                  });
                this.tableData.pageData[i].collegeName = college.length > 0 ? college[0].value : '无分院';
              }
              // console.log('改造之后',this.tableData.pageData);
            }
          }
        ).catch(
          error=>{ console.log(error); }
        )
      },
      save:function(){
        this.blurFunction(this.addForm.data.manager.length-1);
        if(this.popError !== '') return;
        for( let i = this.addForm.data.manager.length-1; i >= 0; i-- ){
          if( this.addForm.data.manager[i].realName === '暂无此负责人' || this.addForm.data.manager[i].realName === "" ){
            this.addForm.data.manager.splice(i,1);
          }
        }
        //console.log('manager信息:',this.addForm.data.manager);
        if( this.addForm.data.departmentId !== "" ){
          this.dialogVisible = false;
          console.log( "提交信息:", this.addForm.data );
          sysDepartmentEdit( this.addForm.data ).then(
            res => {
              console.log(res)
            }
          ).catch(
            error => console.log(error)
          );
        }else{
          this.dialogVisible = false;
          if(this.addForm.data.collegeId === -1){
            this.addForm.data.collegeId = '';
          }
          sysDepartment( this.addForm.data ).then(
            res => {
              console.log(res)
            }
          ).catch(
            error => console.log(error)
          );
        }
        let that = this;
        setTimeout(function(){ that.queryDepartment(); },500);
      },
      deleteDepartment:function(type,department){
        //console.log('departmentList:',department);
        let departmentList =[];
        if( type === 'list'){
          department.filter(
            item => {
              departmentList.push( parseInt(item.departmentId) );
              return true
            });
        }
        if( type === 'one'){ departmentList.push( department.departmentId ); }
        sysDepartmentDelete(departmentList).then(/* res => console.log(res.data)*/).catch( error=>console.log(error) );
        //console.log('departmentList:',departmentList);
        let that = this;
        setTimeout(function(){ that.queryDepartment(); },300);
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
      appendNewDepartment:function(){
        this.dialogVisible               = !this.dialogVisible;
        this.addForm.title               = '添加系';
        this.addForm.data.collegeId      = -1;
        this.addForm.data.departmentName = '';
        this.addForm.data.manager        = [ {realName: '', userId: '', workNumber: ''} ];
        // this.addForm = {
        //   title:'添加系',
        //   data:{
        //     collegeId:'',
        //     departmentId:'',
        //     departmentName:'',
        //     manager:[
        //       {
        //         realName: "",
        //         userId: '',
        //         workNumber: ""
        //       }
        //     ]
        //   }
      },
      edit:function(info){
        this.dialogVisible               = !this.dialogVisible;
        this.addForm.title               = "编辑系信息";
        this.addForm.data.collegeId      = info.collegeId;
        this.addForm.data.departmentId   = info.departmentId;
        this.addForm.data.departmentName = info.departmentName;
        this.addForm.data.manager        = info.manager.length === 0 ? [{realName: '', userId: '', workNumber: ''}] : info.manager;
        if( info.collegeId === null){
          this.addForm.data.collegeId = -1;
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
        this.queryDepartment();
      },
      queryWorkNumber:function(id,index){
        //console.log("id:"+id);
        sysTenantTeacher(id).then(
          res => {
            //console.log( '返回信息:' , res.data.realName,res.data.userId );
            this.addForm.data.manager[index].realName = res.data.realName;
            this.addForm.data.manager[index].userId   = res.data.userId;
          }
        ).catch( () => { /*console.log(error);*/ this.addForm.data.manager[index].realName = '暂无此负责人' } )
      },
      open4() {
        this.$message.error(this.popError);
      },
      querySearchAsync(queryString, cb) {
        let departmentSelectList = this.departmentSelectList;
        let results           = queryString ? departmentSelectList.filter(this.createStateFilter(queryString)) : departmentSelectList;
        cb(results);
      },
      createStateFilter(queryString) {
        return (state) => { return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0); };
      },
      handleSelect(item) {/*console.log(item);*/}
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
