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

  import { courseRecList, recRemove } from '../../api/system'


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
            prop:'courseId'
          },
          {
            name:'课程名称',
            prop:'courseName'
          },
          {
            name:'讲师',
            prop:"instructorName"
          }
        ],
        operateList:[
          {
            content:'重新选择',
            type:'choose',
          },
          {
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
        switch (type) {
          case 'edit':
            this.edit(info);
            break;
          case 'add':
            this.appendNewAcademy(info);
          case 'delete':
            recRemove({removeDO:{recommendType: 10, recommendId: info.recommendId}})
            .then(response=> {
              if (response.code === 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              }
            })
            break;
        }
      },
    },
    created:function(){
      courseRecList().then(
        res => {
          console.log('res',res);
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
