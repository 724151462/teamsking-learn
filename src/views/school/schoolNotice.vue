<template>
  <div>
    <header-the-again headerTitle="消息管理"></header-the-again>
    <table-the-again
      :tableOperate="tableOperate"
      :columnNameList="tables"
      :tableData="tableData"
      :operateList="tableStylus"
      @showComponentInfo="showComponentInfo"
    ></table-the-again>
    <el-pagination
      v-show="totalPage >= 10"
      style="margin: 20px 0;text-align:right"
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :total="totalPage"
    ></el-pagination>
    <el-dialog
      :before-close="()=>{
            isDialog = false;
            addUp.title = ''
            addUp.content = ''
          }"
      title="发布通知"
      :visible.sync="isDialog"
      width="600px"
    >
      <el-form>
        <el-form-item label="标 题：">
          <el-input
            v-model="addUp.title"
            placeholder="请输入标题"
            class="has-text-input"
            :debounce="10"
            :maxlength="100"
            style="width: 360px;margin-left:22px;"
          ></el-input>
          <span style="position:relative;right:50px;">
            <span style="color:red">{{this.titleLength}}</span>/100
          </span>
        </el-form-item>
        <el-form-item label="通知内容：">
          <el-input
            type="textarea"
            :rows="6"
            :maxlength="1000"
            style="width: 500px;"
            placeholder="请输入内容"
            v-model="addUp.content"
          ></el-input>
          <span style="position:relative;display:inline-bloke;top:10px">
            <span style="color:red;">{{this.contentLength}}</span>/1000
          </span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="()=>{
            isDialog = false;
            addUp.title = ''
            addUp.content = ''
          }"
        >取 消</el-button>
        <el-button type="primary" @click="ensureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "../../components/header-theAgain";
import { schoolMsg, sysMessageDel, sysMsgAdd } from "@/api/system";
import { getErrorMsg } from "../../utils/utils";

export default {
  components: {
    tableTheAgain,
    headerTheAgain
  },
  data() {
    return {
      tables: [
        {
          type: "selection"
        },
        {
          name: "通知标题",
          prop: "title",
          width: "220"
        },
        {
          name: "通知内容",
          prop: "content",
          minWidth: '200'
        },
        {
          name: "发布人",
          prop: "realName",
          width: "100"
        },
        {
          name: "发布时间",
          prop: "publishTime",
          width: "190"
        }
      ],
      tableOperate: [
        {
          content: "+新增通知",
          type: "addInfo"
        },
        {
          content: "批量删除",
          type: "deleteAll"
        }
      ],
      tableData: [],
      currentPage: 1,
      totalPage: 10,
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
      //标题长度
      titleLength: 0,
      //内容长度
      contentLength: 0,
      delArr: []
    };
  },
  created() {
    this.$emit("upCoursesNav", "notice");
  },
  mounted() {
    this.getMessageList();
  },
  watch: {
    addUp: {
      deep: true,
      handler: function(value, oldVal) {
        this.titleLength = value.title.length;
        this.contentLength = value.content.length;
      }
    }
  },
  methods: {
    //分页页码改变
    handleCurrentChange(page) {
      this.getMessageList(page);
    },
    //关闭弹窗
    closeDiage() {
      isDialog = false;
    },
    getMessageList(page = 1) {
      schoolMsg({ pageIndex: page }).then(response => {
        this.tableData = response.data.pageData;
        this.totalPage = response.data.totalPage * 10;
        this.currentPage = response.data.pageIndex;
      });
    },
    showComponentInfo(...params) {
      switch (params[0]) {
        case "delete":
          this.delArr = [];
          this.delArr.push(params[1].messageId);
          this.delMsg();
          break;
        case "addInfo":
          this.isDialog = true;
          break;
        case "deleteAll":
          this.delArr = [];
          params[1].forEach(element => {
            this.delArr.push(element.messageId);
          });
          this.delMult();
          break;
        default:
          break;
      }
    },
    delMult() {
      if (this.delArr.length == 0) {
        return false;
      }
      this.delMsg();
    },
    delMsg() {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysMessageDel({ messageIds: this.delArr }).then(response => {
            if (response.code === 200) {
              this.getMessageList();
              this.$message({
                message: "删除成功",
                type: "success"
              });
            }
            if (response.code === 403) {
              this.$message({
                message: "没有权限删除",
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },
    //添加通知
    ensureAdd() {
      this.addUp.courseId = this.$route.query.id;
      sysMsgAdd(this.addUp)
        .then(response => {
          if (response.code === 200) {
            this.tableData.push(response.data);
            this.$message.success("发布成功");
            this.getMessageList();
            this.isDialog = false;
            this.addUp.title = "";
            this.addUp.content = "";
          } else if (response.code === 440) {
            let msg = getErrorMsg(response.msg);
            this.$message.warning(msg);
          }
        })
        .catch(err => {
          let msg = getErrorMsg(err.msg);
          this.$message.error(msg);
        });
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.el-textarea__inner {
  padding-bottom: 15px;
}
</style>