<template>
  <div class="role">
    <header-the-again headerTitle="角色管理"></header-the-again>
    <table-the-again
                     :tableTitle="tableTitle"
                     :tableOperate="tableOperate"
                     :columnNameList="columnNameList"
                     :operateList="operateList"
                     @showComponentInfo="showComponentInfo">
    </table-the-again>
  </div>
</template>

<script>
  import headerTheAgain from '@/components/header-theAgain'
  import tableTheAgain from '@/components/table-theAgain'

  import {sysRolePage} from '../../api/system'

  export default {
    name: "role",
    components:{
      tableTheAgain,
      headerTheAgain
    },
    data(){
      return {
        tableTitle:'角色管理列表',
        tableOperate:[
          {
            content:'创建菜单',
            type:'check'
          }
        ],
        columnNameList:[
          {
            type:'selection'
          },
          {
            name:'菜单编号',
            prop:'id'
          },
          {
            name:'菜单名',
            prop:'time'
          },
          {
            name:'父级菜单',
            prop:'creator'
          },
          {
            name:'创建时间',
            prop:'creator'
          },
          {
            name:'创建人',
            prop:'creator'
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
    created:function(){
      sysRolePage().then(
        res => console.log('res',res)
      ).catch(
        error => console.log('error',error)
      )
    },
    methods:{
      showComponentInfo:function(type,info){
        console.log('showComponentInfo',type,"info",info);
      }
    }

  }
</script>

<style scoped lang="stylus" type="css/stylus">

</style>
