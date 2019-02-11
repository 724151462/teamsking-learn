<template>
  <div class="tag">
    <header-the-again headerTitle="标签管理"></header-the-again>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-the-again>

    <el-dialog :title="dialog.title" :visible.sync="dialog.dialogVisible">
      <el-input v-model="tagObj.tagName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableTheAgain from "../../components/table-theAgain";
import headerTheAgain from "@/components/header-theAgain";
import {
  getTag,
  setTag,
  modTag,
  delTag
} from "@/api/system"

export default {
  data() {
    return {
      dialog: {
        dialogVisible: false,
        title: ''
      },
      tagObj: {},
      page: {
        "pageParam": {
          "pageIndex": 1,
          "pageSize": 10
        },
        "searchKey": ""
      },
      tableTitle: '标签管理',
      columnNameList:[
          {
            type:"selection"
          },
          {
            name:'标签名',
            prop:'tagName'
          },
          {
            name:'创建时间',
            prop:'createTime'
          },

        ],
      tableData: [
        
      ],
      tableOperate:[
        {
          content:'添加标签',
          type:'addTag'
        },
      ],
      operateList:[
          {
            content:'修改',
            type:'editTag'
          },
          {
            content:'删除',
            type:'delTag'
          }
        ],
    };
  },
  components: {
    headerTheAgain,
    tableTheAgain
  },
  mounted() {
    this.getTagList()
  },
  methods: {
    getTagList() {
      getTag(this.page)
      .then(response=> {
        this.tableData = response.data.pageData
      })
    },
    showComponentInfo(...params) {
      console.log(params)
      switch (params[0]) {
        case 'addTag':
          this.tagObj.tagName = ''
          this.dialog.title = '添加标签'
          this.dialog.dialogVisible = true
          break;
        case 'editTag':
          this.tagObj = params[1]
          this.dialog.title = '修改标签'
          this.dialog.dialogVisible = true
          break;
        case 'delTag':
          this.$confirm('删除标签, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delTag([params[1].tagId])
            .then(response=> {
              if (response.code === 200) {
                this.getTagList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        default:
          break;
      }
    },
    ensureBtn() {
      if(this.dialog.title === '添加标签') {
        setTag(this.tagObj)
        .then(response=> {
          if(response.code === 200) {
            this.dialog.dialogVisible = false
            this.getTagList()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
        })
      } else {
        modTag(this.tagObj)
        .then(response=> {
          if(response.code === 200) {
            this.dialog.dialogVisible = false
            this.getTagList()
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
      }
      
    }
  }
};
</script>

<style scoped>
.tag .demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
