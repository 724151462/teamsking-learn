<template>
  
  <div>
    <div style="padding-top: 10px;padding-bottom: 10px;">
      <el-button size="small" type="primary" @click="isDialog = true">添加</el-button>
      <el-button size="small" type="primary" @click="delMult">删除选中项</el-button>
    </div>
    <table-the-again
      :tableOperate="tableOperate"
      :columnNameList="tables"
      :tableData="tableData"
      :operateList="tableStylus"
      @showComponentInfo="showComponentInfo"
    >
    </table-the-again>
    <el-pagination
      v-show="totalPage >= 10"
      style="margin: 20px 0;text-align:right"
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :total="totalPage">
    </el-pagination>
    <el-dialog :visible.sync="isDialog" width="60%">
      <el-form>
        <el-form-item label="标 题：">
          <el-input
            v-model="addUp.title"
            placeholder="请输入内容"
            style="width: 300px;margin-left:22px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="通知内容：">
          <el-input
            type="textarea"
            :rows="6"
            style="width: 500px;"
            placeholder="请输入内容"
            v-model="addUp.content"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="ensureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import { schoolMsg, sysMessageDel,sysMsgAdd } from "@/api/system";
export default {
  components: {
    tableTheAgain
  },
  data() {
    return {
      tables: [
        {
          name: "通知标题",
          prop: "title",
          width:'200'
        },
        {
          name: "通知内容",
          prop: "content"
        },
        {
          name: "发布人",
          prop: "realName",
          width:'100'
        },
        {
          name: "发布时间",
          prop: "publishTime",
          width:'190'
        }
      ],
      tableOperate: [
        {
          content: "+添加学生",
          type: "addStudent"
        },
        {
          content: "批量删除",
          type: "deleteAll"
        }
      ],
      tableData: [],
      currentPage:1,
      totalPage:10,
      tableStylus: [
        {
          content: "删除",
          type: "delete"
        }
      ],
      isDialog: false,
      addUp: {
        title: "",
        content: "",
        messageType: 20
      },
      delArr: []
    };
  },
  created() {
    this.$emit("upCoursesNav", "notice");
  },
  mounted() {
    this.getMessageList()
  },
  methods: {
    //分页页码改变
    handleCurrentChange(page){
      this.getMessageList(page)
    },
    getMessageList(page = 1) {
      schoolMsg({pageIndex:page}).then(response => {
          this.tableData = response.data.pageData;
          this.totalPage = response.data.totalPage * 10
          this.currentPage = response.data.pageIndex
      });
    },
    showComponentInfo(...params) {      
      switch (params[0]) {
        case "delete":
          this.delArr = [];
          this.delArr.push(params[1].messageId)
          this.delMsg()
          break;
        case "selected":
          this.delArr = [];
          let delId = params[1].forEach(element => {
            this.delArr.push(element.messageId);
          });
          // console.log(params[1]);
          break;
        default:
          break;
      }
    },
    delMult() {
      this.delMsg()
    },
    delMsg() {
        console.log(this.delArr)
        sysMessageDel({ messageIds: this.delArr })
        .then(response=> {
            if(response.code === 200) {
                this.getMessageList()
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            }
            if(response.code === 403) {
                this.$message({
                    message: '没有权限删除',
                    type: 'warning'
                })
            }
        });
    },
    ensureAdd() {
        this.addUp.courseId = this.$route.query.id
        sysMsgAdd(this.addUp)
        .then(response=> {
        if(response.code === 200) {
            this.tableData.push(response.data)
            this.$message({
            message: '添加成功',
            type: 'success'
            })
        }else if(response.code === 440){
            this.$message({
                message: '标题或内容过短',
                type: 'warning'
            })
        }
        this.isDialog = false
    }) 
    }
  },
};
</script>

<style scoped>
</style>