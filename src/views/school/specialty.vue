<template>
    <div class="specialty">专业管理

        <el-form ref="form" :model="form" :inline="true" label-width="100px" class="form-query">
            <el-form-item label="输入搜索：">
                <el-input v-model="form.appraisal" placeholder="专业名称"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="form.teacher" placeholder="请选择系">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
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

        <el-pagination
                background
                layout="prev, pager, next"
                :total="1000">
        </el-pagination>


        <el-dialog
                title="添加专业"
                :visible.sync="dialogVisible"
                width="60%"
                :before-close="handleClose">


            <div class="pop-user-info">
                <div></div>
                <span>windir</span>
            </div>
            <div class="pop-content-item" v-for="item in popContentItem">
                <span class="title"> {{ item.title }} </span>
                <span class="content"> {{ item.content }} </span>
            </div>
            <div class="pop-content-item">
                <span class="title"> 评价内容 </span>
                <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="textarea">
                </el-input>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
            </span>
        </el-dialog>



    </div>
</template>

<script>
  import tableTheAgain from '../../components/table-theAgain'
    export default{
      name:'',
        data(){
          return{
              form: {
                  appraisal: '',
                  catagory: '',
                  teacher: ''
              },
              dialogVisible: false,
              tableTitle:'专业管理列表',
              tableOperate:[
                  {
                      content:'批量删除',
                      type:'deleteAll'
                  }
              ],
              columnNameList:[
                  {
                      name:'工号',
                      prop:'id'
                  },
                  {
                      name:'用户名',
                      prop:'userType'
                  },
                  {
                      name:'用户昵称',
                      prop:'userName'
                  },
                  {
                      name:'创建时间',
                      prop:'createdTime'
                  },
                  {
                      name:'状态',
                      prop:'status'
                  }
              ],
              operateList:[
                  {
                      content:'查看',
                      type:'check'
                  },
                  {
                      content:'删除',
                      type:'delete'
                  }
              ],
              tableData3: [
                  {
                      id:'20180900',
                      userType:'管理员',
                      userName:'10',
                      createdTime:'2017-06-15 14:35:51',
                      status:'启用'
                  },
                  {
                      id:'20180900',
                      userType:'管理员',
                      userName:'10',
                      createdTime:'2017-06-15 14:35:51',
                      status:'启用'
                  },
                  {
                      id:'20180900',
                      userType:'管理员',
                      userName:'10',
                      createdTime:'2017-06-15 14:35:51',
                      status:'启用'
                  },
                  {
                      id:'20180900',
                      userType:'管理员',
                      userName:'10',
                      createdTime:'2017-06-15 14:35:51',
                      status:'启用'
                  }
              ],

              popContentItem:[],
              textarea:'',

          }
        },
        components:{
            tableTheAgain
        },
        mounted:function(){
          // console.log(this.tableData1);
        },
        methods:{
          showComponentInfo:function(type,info){
              console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
              switch (type) {
                  case 'check':
                      //console.log(info);
                      this.popContentItem = this.info;
                      this.check(info);
                      break;
              }

          },
          check:function(){
              this.dialogVisible = !this.dialogVisible;
          },
          handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            onSubmit:function(){
                console.log('onSubmit!!');
            }
        }
    }
</script>

<style scoped lang="stylus" type="text/stylus">
.specialty
    .pop-user-info
        margin:0px 0 20px 0
        box-sizing border-box
        display:flex
        justify-content:space-around
        flex-direction:column
        align-items:center
        width:150px
        height:150px
        div
            width:100px
            height:100px
            background:cyan
            border-radius:50% 50%

        span
            margin:5px 0
            box-sizing:border-box
            display:inline

    .pop-content-item
        span:first-child
            font-weight:800
    .pop-content-item:last-child
        margin-top:20px

    .el-pagination{
        margin:20px 2.5% 0 0
        display:flex
        justify-content flex-end
        width:95%
    }
</style>
