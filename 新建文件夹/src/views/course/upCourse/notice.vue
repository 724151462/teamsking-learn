<template>
    <div>
      <div style="text-align: right;padding-top: 10px;padding-bottom: 10px;">
        <el-button size="small" type="primary" @click="isDialog = true">添加</el-button>
      </div>
      <itemTable :tableData="tableData" :tables="tables" :buttonStylus="tableStylus" v-on:returnFun="typeFun"></itemTable>
      <el-dialog
          :visible.sync="isDialog"
          width="60%">

        <el-form>
          <el-form-item label="标 题：">
            <el-input v-model="addUp.title" placeholder="请输入内容" style="width: 300px;margin-left:22px;"></el-input>
          </el-form-item>
          <el-form-item label="通知内容：">
            <el-input
                type="textarea"
                :rows="6"
                style="width: 500px;"
                placeholder="请输入内容"
                v-model="addUp.center">
            </el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="isDialog = false">取 消</el-button>
          <el-button type="primary" @click="isDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import itemTable from '../../../components/table-no-header.vue'
  export default {
    components:{
      itemTable
    },
    data(){
      return{
        tables:[
          {
            name:'通知标题',
            prop:'title'
          },
          {
            name:'通知内容',
            prop:'center'
          },
          {
            name:'发布人',
            prop:'fbr'
          },
          {
            name:'发布时间',
            prop:'time'
          },
        ],
        tableData:[
          {
            title:'通知标题sss',
            center:'我是通知内容',
            fbr:'xxx老师',
            time:'2018-1-1'
          },
          {
            title:'通知标题sss',
            center:'我是通知内容',
            fbr:'xxx老师',
            time:'2018-1-1'
          },
          {
            title:'通知标题sss',
            center:'我是通知内容',
            fbr:'xxx老师',
            time:'2018-1-1'
          },
        ],
        tableStylus:[
          {
            name:'编辑',
            type:'up'
          },
          {
            name:'删除',
            type:'delete'
          }
        ],
        isDialog:false,
        addUp:{
          title:'',
          center:''
        }
      }
    },
    created(){
      this.$emit('upCoursesNav','notice')
    },
    methods:{
      typeFun(e){
        console.log(e)
      }
    }
  }
</script>

<style scoped>

</style>