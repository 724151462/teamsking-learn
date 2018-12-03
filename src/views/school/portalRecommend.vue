<template>
  <div class="portalTeacher">
    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="标题名称：">
        <el-input  placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" >查询</el-button>
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


  </div>
</template>

<script>

  import tableTheAgain from '../../components/table-theAgain'

  import { sysRecommenTeacherPage } from '../../api/school'


  export default {
    components:{
      tableTheAgain
    },
    data() {
      return {
        activeIndex: '2',
        tableTitle:'课程列表',
        tableData3:[],
        columnNameList:[
          {
            type:"index"
          },
          {
            name:'课程ID',
            prop:'teacherImg'
          },
          {
            name:'课程名称',
            prop:'teacherName'
          },
          {
            name:'讲师',
            prop:"jianshu"
          }
        ],
        operateList:[
          {
            content:'重新选择',
            type:'choose',
          },
          {
            content:'操作',
            type:'operate',
          },
        ],
        tableOperate:[]
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      showComponentInfo:function(type,info){
        // console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
        // switch (type) {
        //   case 'edit':
        //     this.edit(info);
        //     break;
        //   case 'add':
        //     this.appendNewAcademy(info);
        //     break;
        //   case 'deleteAll':
        //     this.deleteAcademy('list',info);
        //     break;
        //   case 'delete':
        //     this.deleteAcademy('one',info);
        //     break;
        // }
      },
    },
    created:function(){
      sysRecommenTeacherPage().then(
        res => {
          console.log('res',res);
        }
      ).catch();
    }
  }
</script>
<style scoped>
  .portalTeacher{
    margin-top: 20px;
  }
</style>
