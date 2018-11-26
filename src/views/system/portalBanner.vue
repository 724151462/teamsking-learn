<template>
  <div class="portalTeacher">
    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="标题名称：">
        <!--<el-autocomplete-->
        <!--:fetch-suggestions="querySearchAsync"-->
        <!--placeholder="名师风采"-->
        <!--@select="handleSelect">-->
        <!--</el-autocomplete>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" >查询</el-button>
      </el-form-item>
    </el-form>

    <table-wjx
        :tableTitle="tableTitle"
        :tableOperate="tableOperate"
        :columnNameList="columnNameList"
        :tableData="tableData3"
        :operateList="operateList"
        @showComponentInfo="showComponentInfo">
    </table-wjx>


  </div>
</template>

<script>

  import tableWjx from '../../components/table-wjx'

  import { sysRecommenTeacherPage } from '../../api/school'


  export default {
    components:{
      tableWjx
    },
    data() {
      return {
        activeIndex: '2',
        tableTitle:'轮播图',
        tableData3:[],
        columnNameList:[
          {
            type:"index"
          },
          {
            name:'图片名称',
            prop:'teacherImg'
          },
          {
            name:'缩略图',
            prop:'teacherName'
          },
          {
            name:'PC跳转',
            prop:"jianshu"
          },
          {
            name:'小程序跳转',
            prop:"jianshu"
          }
        ],
        operateList:[
          {
            content:'编辑',
            type:'edit',
          },
          {
            content:'编辑',
            type:'edit',
          },{
            content:'删除',
            type:'delete',
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
