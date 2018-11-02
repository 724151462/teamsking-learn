<template>
  <div class="academy">
    <header-the-again headerTitle="院管理"></header-the-again>

    <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
        <el-form-item label="输入搜索：">
          <el-autocomplete
              v-model="form.collegeName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryAcademy">查询</el-button>
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
            <el-input class="input-pop" v-model="addForm.data.collegeName" placeholder="请填写院" clearable></el-input>
          </div>
        </div>

        <div class="pop-academy">
          <div class="item-title">
            <span class="color-red"></span><span>院负责人：</span>
          </div>
          <div class="item-input-list">
            <div class="item-input" v-for="(item,index) in addForm.data.manager">
              <el-input class="input-pop" v-model="item.workNumber" @blur="blurFunction(item.workNumber,index)"  @change="blurFunction(item.workNumber,index)" placeholder="请输入工号" clearable></el-input>
              <span>{{item.realName === '' ? '暂无负责人' : item.realName}}</span>
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

    import { sysCollegePage } from '../../api/school'
    import { sysCollege } from '../../api/school'
    import { sysCollegeDelete } from '../../api/school'
    import { sysTenantTeacher } from '../../api/school'
    import { sysCollegeEdit } from '../../api/school'
    import { sysCollegeList } from '../../api/school'

    export default {
        name: "",
        data(){
            return{
                academySelectList: [],
                popError:'',
               // input:'',
                form: {
                  pageSize:5,
                  pageIndex:1,
                  collegeName:''
                },
                addForm:{
                  title:'添加院系',
                  data:{
                    tenantId: '',
                    collegeName:'',
                    collegeId:'',
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
                tableTitle:'院列表',
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
                        prop:'collegeId'
                    },
                    {
                        name:'学院',
                        prop:'collegeName'
                    },
                    {
                        name:'学院负责人',
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
        this.queryAcademy();
        let academyList = [];
        sysCollegeList().then(
          res=>{
            //console.log('院列表', res.data);
            res.data.filter(
              element =>{
                academyList.push({"value": element.collegeName} );
                return true;
              }
            );
            this.academySelectList = academyList;
            //console.log('院列表1', academyList);
            //console.log('academySelectList:',this.academySelectList);
          }
        ).catch( error=>{} );
      },
        methods:{
          showComponentInfo:function(type,info){
              // console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
              switch (type) {
                case 'edit':
                  this.edit(info);
                  break;
                case 'add':
                  this.appendNewAcademy(info);
                  break;
                case 'deleteAll':
                  this.deleteAcademy('list',info);
                  break;
                case 'delete':
                  this.deleteAcademy('one',info);
                  break;
              }
          },
          save:function(){
            this.blurFunction(this.addForm.data.manager.length-1);
            if(this.popError !== '') return;
            //检测manager中的信息
            for( let i = this.addForm.data.manager.length-1; i >= 0; i-- ){
              if( this.addForm.data.manager[i].realName === '暂无此负责人' || this.addForm.data.manager[i].realName === "" ){
                this.addForm.data.manager.splice(i,1);
              }
            }
            //console.log('manager信息:',this.addForm.data.manager);
            if( this.addForm.data.collegeId !== "" ){
              this.dialogVisible = false;
              // console.log( "提交信息:", this.addForm.data );
              sysCollegeEdit( this.addForm.data ).then(  res => { }).catch( error => { } );
            }else{
              this.dialogVisible = false;
              sysCollege( this.addForm.data ).then( res => {  } ).catch(  );
            }
            let that = this;
            setTimeout(function(){
              that.queryAcademy();
            },500);
          },
          deleteAcademy:function(type,academyList){
            // console.log('academyList:',academyList);
            let academyIdList =[];
            if( type === 'list'){
              academyList.filter(
                item => {
                  academyIdList.push( parseInt(item.collegeId) );
                  return true
                }
              );
            }
            if( type === 'one'){
              academyIdList.push( academyList.collegeId );
            }
            sysCollegeDelete( academyIdList ).then( res => {  } ).catch( error => {} );
            let that = this;
            setTimeout(function(){ that.queryAcademy(); },300);
          },
          queryAcademy:function() {
            sysCollegePage( this.form ).then(
              res => {
                this.tableData = res.data;
              }).catch(error=>{})
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
          appendNewAcademy:function(){
            this.dialogVisible            = !this.dialogVisible;
            this.addForm.title            = '添加院';
            this.addForm.data.collegeId   = "";
            this.addForm.data.tenantId    = 1;
            this.addForm.data.collegeName = '';
            this.addForm.data.manager     = [ {realName: '', userId: 1, workNumber: ''} ];
          },
          edit:function(info){  // 编辑一个院
            this.dialogVisible            = !this.dialogVisible;
            this.addForm.title            = "编辑院信息";
            this.addForm.data.collegeId   = info.collegeId;
            this.addForm.data.tenantId    = '';
            this.addForm.data.collegeName = info.collegeName;
            this.addForm.data.manager     = info.manager.length===0?[ {realName: '', userId: '', workNumber: ''} ]:info.manager;
          },
          blurFunction:function(id,index){
            this.popError = '';
            let a = this.addForm.data.manager.filter(
              (element,index,arr) => {
                //this.queryWorkNumber(element.workNumber);
                if( element.workNumber === "" ) return false;
                for( let i = index+1; i < arr.length; i++ ){
                  if( element.workNumber === arr[i].workNumber  && index !== i ) return true;
                }
                return false
              });
            this.queryWorkNumber(id,index);
            if( a.length > 0 ){
              this.popError = '院负责人不能重复';
              this.open4();
            }
          },
          queryWorkNumber:function(id,index){
             //console.log("id:"+id);
              sysTenantTeacher(id).then(
                res => {
                  //console.log( '返回信息:' , res.data.realName,res.data.userId );
                  this.addForm.data.manager[index].realName = res.data.realName;
                  this.addForm.data.manager[index].userId = res.data.userId;
                }
              ).catch(
                () => {
                  //console.log(error);
                  this.addForm.data.manager[index].realName = '暂无此负责人'
                }
              )
          },
          handleClose(done) { done(); },
          handleCurrentChange:function( number ){
            this.form.pageIndex = number;
            this.queryAcademy();
          },
          open4() { this.$message.error(this.popError);},
          querySearchAsync(queryString, cb) {
            let academySelectList = this.academySelectList;
            let results = queryString ? academySelectList.filter(this.createStateFilter(queryString)) : academySelectList;
            cb(results);
          },
          createStateFilter(queryString) {
            return (state) => {
              return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
          handleSelect(item) {
            //console.log(item);
          }
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
