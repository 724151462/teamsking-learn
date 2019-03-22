<template>
  <div class="courseCategory" id="courseCategory">
    <div class="tab">
      <div class="tabBar" :class="{ active:!showTab1}" @click="switchTab('second')">课程分类列表</div>
      <div class="tabBar" :class="{ active:showTab1}" @click="switchTab('first')">创建课程分类</div>

      <div class="tabContent" v-show="!showTab1">
        <tableNoHeader
          :tableData="tableData"
          :tables="tables"
          :buttonStylus="sysButton"
          @showComponentInfo="showComponentInfo"
        ></tableNoHeader>
        <!-- 展示二级分类弹窗 -->
        <el-dialog :visible.sync="dialogVisible">
          <tableNoHeader
            :tableData="level2"
            :tables="tables"
            :buttonStylus="sysButton1"
            @showComponentInfo="showComponentInfo"
          ></tableNoHeader>
        </el-dialog>
      </div>

      <div class="tabContent" v-show="showTab1">
        <el-form ref="form" :model="catalogObj" label-width="80px" style="padding: 20px">
          <el-form-item label="分类名称" required>
            <el-input style="width: 200px;" v-model="catalogObj.name" placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item label="父级分类" required>
            <el-select v-model="catalogObj.parentId">
              <el-option
                v-for="catalog in cataOptions"
                :key="catalog.categoryId"
                :label="catalog.categoryName"
                :value="catalog.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <div class="item">
          <span>排序</span>
          <el-input style="width: 200px;" v-model="input" placeholder=""></el-input>
          </div>-->
          <el-form-item label="是否显示" required>
            <el-radio v-model="catalogObj.showType" :label="1">是</el-radio>
            <el-radio v-model="catalogObj.showType" :label="2">否</el-radio>
          </el-form-item>

          <el-form-item label="分类描述" required>
            <el-input style="width: 200px;" v-model="catalogObj.description" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="saveCatalog" type="primary" style="margin-left: 20px;margin-bottom: 10px">保存</el-button>
      </div>
      <!-- 保存分类弹窗 -->
      <el-dialog
        :title="addForm.title"
        :visible.sync="saveDialog"
        width="60%"
        style="min-width: 800px"
      >
        <el-form :model="catalogObj2" label-width="120px">
          <el-form-item label="分类名称" required>
            <el-input v-model="catalogObj2.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类描述" required>
            <el-input v-model="catalogObj2.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveDialog = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { courseCatalogList, courseCatalogAdd, courseCatalogDel, courseCatalogEdit } from "@/api/system";
import tableNoHeader from "@/components/table-no-header";
export default {
  name: "courseCategory",
  data() {
    return {
      catalogObj: {},
      catalogObj2: {},
      showTab1: false,
      dialogVisible: false,
      saveDialog: false,
      input: "",
      radio: "1",
      textarea3: "",
      showHeader: false,
      tableTitle: "角色管理列表",
      addForm: {
        title: ""
      },
      form: {},
      tables: [
        {
          name: "分类名称",
          prop: "categoryName"
        },
        {
          name: "级别",
          prop: "level"
        },
        {
          name: "描述",
          prop: "description"
        }
      ],
      tableData: [
        {
          zyname: "资源名",
          notesTitle: "笔记标题1",
          notesContent: "<p>笔记内容</p>",
          fbr: "发布人",
          fbsj: "2018-1-1",
          popover: "dsawf"
        },
        {
          zyname: "资源名",
          notesTitle: "笔记标题",
          notesContent: "笔记内容",
          fbr: "发布人",
          fbsj: "2018-1-1",
          popover: "twqfwq"
        }
      ],
      sysButton: [
        {
          name: "查看二级分类",
          type: "detail"
        },
        {
          name: "添加二级分类",
          type: "addCatalog"
        },
        {
          name: "删除",
          type: "delete"
        }
      ],
      sysButton1: [
        {
          name: "编辑",
          type: "edit"
        },
        {
          name: "删除",
          type: "delete"
        }
      ],
      tableData: [],
      level2: [],
      cataOptions: [],
      parentId: ''
    };
  },
  created() {
    this.getCatalog()
  },
  methods: {
    getCatalog() {
      courseCatalogList().then(response => {
        response.data.forEach(element => {
          element.level = "一级";
          if(element.children)
            {element.children.forEach(lv2=> {
              lv2.level = "二级"
            })
          }
        });
        this.tableData = response.data;
        this.cataOptions = response.data;
      });
    },
    saveCatalog() {
      console.log(this.catalogObj)
      this.catalogObj.catalogId = ''
      this.catalogObj.showType = Number(this.catalogObj.showType)
      courseCatalogAdd(this.catalogObj)
      .then(response=> {
        if (response.code === 200) {
          this.$message({
            message: "添加分类成功",
            type: "success"
          });
        }
      })
    },
    switchTab: function(rank) {
      switch (rank) {
        case "first":
          this.showTab1 = true;
          break;
        case "second":
          this.showTab1 = false;
          break;
      }
      //this.showTab1 = !this.showTab1;
      console.log(this.showTab1);
    },
    showComponentInfo: function(type, info) {
      console.log("type", type, "info", info);
      switch (type) {
        case "addCatalog":
          this.form = {};
          this.addForm.title = "添加分类";
          this.catalogObj2.parentId = info.categoryId
          this.saveDialog = true;
          break;
        case "detail":
          this.level2 = info.children;
          this.catalogObj2.parentId = info.categoryId
          this.parentId = info.categoryId
          this.dialogVisible = true;
          break;
        case "delete":
          courseCatalogDel([info.categoryId])
          .then(response=> {
            if (response.code === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.dialogVisible = false
              courseCatalogList().then(response => {
                response.data.forEach(element => {
                  element.level = "一级";
                  if(element.children)
                    {element.children.forEach(lv2=> {
                      lv2.level = "二级"
                    })
                  }
                });
                this.tableData = response.data;
              });
            }
          })
          break;
        case "edit":
          console.log(info);
          // this.catalogObj2.showType = Number(this.catalogObj2.showType)
          this.catalogObj2 = info
          this.addForm.title = "编辑分类";
          // this.form = info;
          this.saveDialog = true;
          break;
      }
    },
    save() {
      console.log(this.catalogObj2)
      let params = Object.assign({}, this.catalogObj2)
      params.name = this.catalogObj2.categoryName
      if(this.addForm.title === "编辑分类") {
        console.log(this.catalogObj2)
        params.parentId = this.parentId
        console.log(params)
        courseCatalogEdit(params)
        .then(response => {
          if (response.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            // this.level2.forEach((element,i)=> {
            //   console.log(element)
            //   // if(element.children){
            //   //     element.children.forEach((lv2,i) => {
            //         if(element.categoryId === this.catalogObj2.categoryId) {
            //           console.log(421,element, response.data)
            //           element = response.data
            //         }
            //   //     });
            //   //   }
            //   })
            courseCatalogList().then(response => {
              response.data.forEach(element => {
                element.level = "一级";
                if(element.children)
                  {element.children.forEach(lv2=> {
                    lv2.level = "二级"
                  })
                }
              });
              this.tableData = response.data;
              this.dialogVisible = false
            });
            this.saveDialog = false
          }
        });
      }else{
        params.categoryId = null
        courseCatalogAdd(params)
        .then(response => {
          if (response.code === 200) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            // this.tableData.forEach(element=> {
            //   if(element.categoryId === this.catalogObj2.parentId) {
            //     response.data.level = "二级"
            //     element.children.push(response.data)
            //   }
            // })
            this.getCatalog()
            this.saveDialog = false
          }
        });
      }
    }
  },
  components: {
    tableNoHeader
  }
};
</script>

<!--<style scoped lang="stylus" type="text/stylus">-->
<style scoped>
.tab {
  position: relative;
  display: flex;
  justify-content: flex-start;

  /*background: orange;*/
  font-size: 16px;
  line-height: 50px;
}
.tab .tabBar {
  width: 200px;
  height: 100%;
  /*background: cyan;*/
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid rgb(230, 230, 230);
  border-bottom: none;
  text-align: center;
  background: rgb(240, 240, 240);
}
.tab div:first-child {
  border-right: none;
}
.tab .active {
  background: white;
  color: #409eff;
}
.tab .tabContent {
  position: absolute;
  margin-bottom: 20px;
  left: 0;
  top: 50px;
  width: 90%;
  min-height: 0;
  /*background: orange;*/
  border: 1px solid rgb(230, 230, 230);
}
.red {
  color: red;
}

.demo-table-expand {
  font-size: 0;
  padding: 0;
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

.el-table__expanded-cell[class*="cell"] {
  padding: 0 !important;
}
#courseCategory {
  height: 600px;
}
.courseCategory .el-table__expanded-cell {
  padding: 0 !important;
}
</style>
