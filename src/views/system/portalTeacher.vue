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

  import { teacherRecList } from '../../api/system'


  export default {
    components:{
      tableWjx
    },
    data() {
      return {
        activeIndex: '2',
        tableTitle:'名师列表',
        tableData3:[],
        columnNameList:[
          {
            type:"index"
          },
          {
            name:'老师头像',
            prop:'avatar',
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
      teacherRecList().then(
        res => {
          console.log('res',res);
          res.data.page.pageData.forEach(element => {
            console.log(element.avatar)
            element.avatar = [{ imgUrl: element.avatar }];
          });
          this.tableData3 = res.data.page.pageData
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
