<!--<template>-->
    <!--<div class="specialty">专业管理-->

        <!--<el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">-->
            <!--<el-form-item label="输入搜索：">-->
                <!--<el-input v-model="form.appraisal" placeholder="专业名称"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="">-->
                <!--<el-select v-model="form.teacher" placeholder="请选择系">-->
                    <!--<el-option label="区域一" value="shanghai"></el-option>-->
                    <!--<el-option label="区域二" value="beijing"></el-option>-->
                <!--</el-select>-->
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

        <!--<el-pagination-->
                <!--background-->
                <!--layout="prev, pager, next"-->
                <!--:total="1000">-->
        <!--</el-pagination>-->


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



    <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import tableTheAgain from '../../components/table-theAgain'-->
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
              <!--tableTitle:'专业管理列表',-->
              <!--tableOperate:[-->
                  <!--{-->
                      <!--content:'批量删除',-->
                      <!--type:'deleteAll'-->
                  <!--},-->
                  <!--{-->
                    <!--content:'添加',-->
                    <!--type:'add'-->
                  <!--}-->
              <!--],-->
              <!--columnNameList:[-->
                  <!--{-->
                    <!--type:'selection'-->
                  <!--},-->
                  <!--{-->
                      <!--name:'编号',-->
                      <!--prop:'id'-->
                  <!--},-->
                  <!--{-->
                      <!--name:'所属院名称',-->
                      <!--prop:'userType'-->
                  <!--},-->
                  <!--{-->
                      <!--name:'所属系名称',-->
                      <!--prop:'userName'-->
                  <!--},-->
                  <!--{-->
                      <!--name:'专业',-->
                      <!--prop:'createdTime'-->
                  <!--},-->
                  <!--{-->
                      <!--name:'专业负责人',-->
                      <!--prop:'status'-->
                  <!--}-->
              <!--],-->
              <!--operateList:[-->
                  <!--{-->
                      <!--content:'查看',-->
                      <!--type:'check'-->
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
            <!--tableTheAgain-->
        <!--},-->
        <!--mounted:function(){-->
          <!--// console.log(this.tableData1);-->
        <!--},-->
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
<!--.specialty-->
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

    <!--.el-pagination{-->
        <!--margin:20px 2.5% 0 0-->
        <!--display:flex-->
        <!--justify-content flex-end-->
        <!--width:95%-->
    <!--}-->
<!--</style>-->
<template>
  <div class="academy">
    <!--院管理-->
    <header-the-again headerTitle="专业管理"></header-the-again>

    <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <!--<el-input v-model="form.collegeName" placeholder="院名称"></el-input>-->
        <el-autocomplete
            v-model="form.collegeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="专业名称"
            @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="系：">
        <!--<el-input v-model="form.collegeName" placeholder="院名称"></el-input>-->
        <el-autocomplete
            v-model="form.collegeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请选择系"
            @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="院：">
        <!--<el-input v-model="form.collegeName" placeholder="院名称"></el-input>-->
        <el-autocomplete
            v-model="form.collegeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入院"
            @select="handleSelect"
        ></el-autocomplete>
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
          <span class="color-red">*</span><span>专业：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop" v-model="addForm.data.collegeName" placeholder="请填写院" clearable></el-input>
        </div>
      </div>

      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red"></span><span>专业负责人：</span>
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
        input:'',
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
            name:'所属学院',
            prop:'collegeName'
          },
          {
            name:'所属系',
            prop:'manager',
            // formatter:(val)=>{
            //   let str = '';
            //   for( let i = 0; i < val.length; i++ ){
            //     if( val.length === 1 ){
            //       str = val[0].realName;
            //     }else{
            //       if( i === 0 ){
            //         str = val[0].realName;
            //       }else{
            //         str += ',' + val[i].realName;
            //       }
            //     }
            //   }
            //   return str
            // }
          },
          {
            name:'专业',
            prop:'collegeName'
          },
          {
            name:'专业负责人',
            prop:'collegeName'
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
      this.getTableData();
      let academyList = [];
      sysCollegeList().then(
        res=>{
          //console.log('院列表', res.data);
          res.data.filter(
            element =>{
              academyList.push({"value": element.collegeName} );
              return true;
            }
          )
          this.academySelectList = academyList;
          //console.log('院列表1', academyList);
          //console.log('academySelectList:',this.academySelectList);
        }
      ).catch(
        error=>{
          //console.log(error);
        }
      );

    },
    methods:{
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      showComponentInfo:function(type,info){
        // console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
        switch (type) {
          case 'edit':
            //console.log(info);
            this.edit(info);
            break;
          case 'add':
            // console.log("父组件:",type,info)
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
      handleCurrentChange:function( number ){
        // console.log( number );
        this.form.pageIndex = number;
        this.getTableData();
      },
      getTableData:function() {
        sysCollegePage( this.form ).then(
          res => {
            this.tableData = res.data;
            //console.log( this.tableData );
          }).catch(
          error=>{
            //console.log(error);
          })
      },
      onSubmit:function(){
        // console.log('onSubmit!!');
      },
      queryAcademy:function(){ //查询院列表
        this.getTableData();
      },
      addInput:function(){ //添加院负责人输入框
        this.popError = "";
        if(this.addForm.data.manager.length < 5){
          this.addForm.data.manager.push({realName: '', userId: '', workNumber: ''});
        }else{
          this.popError = '最多添加五位院负责人';
        }
        this.queryWorkNumber();
      },
      deleteInput:function(index){ //删减院负责人输入框
        //console.log(index);
        this.addForm.data.manager.splice(index,1);
      },
      appendNewAcademy:function(){ //添加一个院
        this.dialogVisible = !this.dialogVisible;
        this.addForm.title = '添加院';
        this.addForm.data.collegeId = "";
        this.addForm.data.tenantId = 1;
        this.addForm.data.collegeName = '';
        this.addForm.data.manager = [ {realName: '', userId: 1, workNumber: ''} ];
      },
      edit:function(info){  // 编辑一个院
        this.dialogVisible = !this.dialogVisible;
        this.addForm.title = "编辑院信息";
        this.addForm.data.collegeId = info.collegeId;
        this.addForm.data.tenantId = '';
        this.addForm.data.collegeName = info.collegeName;
        this.addForm.data.manager = info.manager.length===0?[ {realName: '', userId: '', workNumber: ''} ]:info.manager;
      },
      save:function(){ //保存提交
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
          sysCollegeEdit( this.addForm.data ).then(
            res => {
              // console.log( '添加后返回的信息：',res);
            }
          ).catch(
            error=> {
              //console.log(error)
            }
          )
        }else{
          this.dialogVisible = false;
          // console.log( "提交信息:", this.addForm.data );
          sysCollege( this.addForm.data ).then(
            res => {
              // console.log( '添加后返回的信息：',res);
            }
          ).catch(
            //error=>console.log(error)
          );
        }
        let that = this;
        setTimeout(function(){
          that.getTableData();
        },500);

      },
      deleteAcademy:function(type,academyList){ //删除院列表
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

        sysCollegeDelete( academyIdList ).then(
          res => {
            //console.log(res)
          }
        ).catch(
          error => {
            //console.log(error)
          }
        )
        // console.log('academyIdList:' , academyIdList);
        let that = this;
        setTimeout(function(){
          that.getTableData();
        },300);
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
      open4() { //弹窗提示
        this.$message.error(this.popError);
      },


      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        ];
      },
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
    watch:{

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

