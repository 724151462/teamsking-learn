<template>
  <div class="portalTeacher">
    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="标题名称：">
        <el-input  placeholder="请输入教师名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" >查询</el-button>
      </el-form-item>
    </el-form>

    <table-wjx
        :tableTitle="tableTitle"
        :tableOperate="tableOperate"
        :columnNameList="columnNameList"
        :tableData="tableData"
        :operateList="operateList"
        @showComponentInfo="showComponentInfo">
    </table-wjx>


    <el-dialog
        title="所有老师"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        style="min-width: 800px">


        <table-the-again
            :tableTitle="popData.tableTitle"
            :tableOperate="popData.tableOperate"
            :columnNameList="popData.columnNameList"
            :tableData="popData.tableData"
            :operateList="popData.operateList"
            @showComponentInfo="showComponentInfo">
        </table-the-again>


      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
        </span>
    </el-dialog>





  </div>
</template>

<script>

  import tableWjx from '../../components/table-wjx'
  import tableTheAgain from '../../components/table-theAgain'

  import { sysRecommenTeacherPage } from '../../api/school'
  import { sysRecommenTenantTeacherPage } from '../../api/school'


  export default {
    components:{
      tableWjx,
      tableTheAgain
    },
    data() {
      return {


        dialogVisible:true,


        activeIndex: '2',
        tableTitle:'名师列表',
        tableData:[],
        columnNameList:[
          {
            type:"index"
          },
          {

            name:'老师头像',
            prop:'imgUrls',
            imgList: {}
          },
          {
            name:'老师姓名',
            prop:'teacherName'
          },
          {
            name:'老师简介',
            prop:"synopsis"
          }
        ],
        operateList:[
          {
            content:'重新选择',
            type:'choose',
          },
        ],
        tableOperate:[],
        popData:{
          tableTitle:'所有老师',
          tableData:[],
          tableOperate:[],
          columnNameList:[
            {
              type:"index"
            },
            {
              name:"老师姓名",
              prop:"teacherName"
            },
            {
              name:"老师简介",
              prop:"teacherNumber"
            },
          ],
          operateList:[
            {
              content:'替换',
              type:'replace',
            },
          ]
        }
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      showComponentInfo:function(type,info){
        // console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
        switch (type) {
          case 'choose':
            this.dialogVisible = true;
            break;
        //   case 'add':
        //     this.appendNewAcademy(info);
        //     break;
        //   case 'deleteAll':
        //     this.deleteAcademy('list',info);
        //     break;
        //   case 'delete':
        //     this.deleteAcademy('one',info);
        //     break;
        }
      },
      handleClose(done) { done(); },







    },
    created:function(){
      sysRecommenTeacherPage().then(
        res => {
          console.log('res',res);
          if(res.code === 200){
            this.tableData = res.data.page.pageData;
            if( this.tableData.length > 0 ){
              for( let i = 0; i < this.tableData.length; i++ ){
                this.tableData[i].imgUrls = [];
                this.tableData[i].imgUrls.push({imgUrl:this.tableData[i].avatar});
              }
            }
            // this.popData.tableData = this.tableData;
            console.log('this.tableData ',this.tableData );
          }

        }
      ).catch(

      );

      sysRecommenTenantTeacherPage({ pageIndex:1,pageSize:10 }).then(
        res => {
          console.log('获取的教师列表',res);
          if( res.code === 200){
            this.popData.tableData = res.data.pageData;
          }
        }
      ).catch()



    },

  }
</script>
<style scoped>
  .portalTeacher{
    margin-top: 20px;
  }
</style>
