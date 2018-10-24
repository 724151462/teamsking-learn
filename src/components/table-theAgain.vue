<template>
    <!--
        这个组件是对ele的el-table进行的二次封装。

        说明：
        操作按钮事件  对一条记录进行操作，不管什么操作,都返回该行数据给父组件
                      对表格进行操作，不管什么操作，都返回选中的行信息给父组件

        需要传入的参数：
            表的名称：tableTitle
            对表的操作：tableOperate
            列名数组：columnNameList
            渲染数据：tableData
            自定义的操作按钮列表：operateList

        数据结构：
            tableTitle:string,
            tableOperate:[
                {
                    content:'批量删除',
                    type:'check'
                }
            ]
            columnNameList:[
                {
                    name:'工号',
                    prop:'id'
                }
            ],
            ableData3: [
                    {
                        id:'20180900', //属性名称跟columnNameList中的prop一一对应
                    }
            ],
            operateList:[
                    {
                        content:'查看',
                        type:'check'
                    }
                ],
    -->
    <div class="table-theAgain">

        <!--<div class="tableOperate">-->
            <!--<el-button type="primary" class="" @click="onSubmit('add')" >添加管理员</el-button>-->
            <!--<el-button type="primary" class="" @click="onSubmit('add')" >批量删除</el-button>-->
        <!--</div>-->

        <div class="tableOperate">
            <el-button v-for="item in tableOperate" type="primary" class="" @click="onSubmit(item.type)" >{{ item.content }}</el-button>
            <!--<el-button type="primary" class="" @click="onSubmit('add')" >批量删除</el-button>-->
        </div>

        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 95%;margin-left:2.5%;position: relative">

            <el-table-column :label="tableTitle" class="addButton">
                <el-table-column v-for="item in columnNameList"
                                 :prop="item.prop"
                                 :label="item.name"
                                 :width="item.width"
                                 :type="item.type"
                                 align="center">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        fit="true"
                        align="center">
                    <template slot-scope="scope">
                        <el-button v-for="item in operateList" @click="onSubmit(item.type,scope.row)" type="text" size="small">{{ item.content }}</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default{

        props:[ 'tableTitle','tableOperate','columnNameList','tableData','operateList' ],
        data(){
            return {
                multipleSelection: [],
            }
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            onSubmit( type,info ) {
                console.log( '子组件类型：' + type + '\n子组件信息:' + info );
                this.$emit('showComponentInfo',type,info);
            }
        }

    }

</script>
<style scoped lang="stylus" type="text/stylus">
    .table-theAgain
        position relative

        .tableOperate{
            box-sizing:border-box
            padding-left: 10px
            padding-right: 10px
            position:absolute;
            top:4px
            right:7.5%;
            display:inline-block
            z-index:1
        }
        a
            display:inline-block
            margin-right:5px

</style>
