<template>
  <div class="role">
    <header-the-again headerTitle="租户管理">
      <el-form ref="form" :inline="true" label-width="100px" class="form-query">
        <el-form-item label="输入搜索：">
          <el-input v-model="form.searchKey" style="width: 200px;margin-left: 10px" placeholder="学校名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tenantList">查询</el-button>
        </el-form-item>
      </el-form>
    </header-the-again>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-the-again>

    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="tableData.pageSize"
      :page-count="tableData.totalPage"
      :current-page="tableData.pageIndex"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <el-dialog
      :title="addForm.title"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      style="min-width: 800px"
    >
      <el-form ref="form" :model="tenantData" label-width="120px">
        <el-form-item label="学校名称" required>
          <el-input v-model="tenantData.tenantName"></el-input>
        </el-form-item>
        <el-form-item label="学校简称" required>
          <el-input v-model="tenantData.shortName"></el-input>
        </el-form-item>
        <el-form-item label="租户官网" required>
          <el-input v-model="tenantData.tenantWebsite"></el-input>
        </el-form-item>
        <el-form-item label="logo">
          <upOss upDir="tskedu/logo" style="height: 100px" :btn-text="'上传logo'" :inputs="'logo'" @ossUp="upLogo"></upOss>
          <img v-if="tenantData.tenantLogo" height="80px" :src="tenantData.tenantLogo" />
        </el-form-item>
        <el-form-item label="平台图片" style="height: 100px">
          <upOss upDir="tskedu/logo" :btn-text="'上传图片'" :inputs="'pic'" @ossUp="upPic"></upOss>
          <img v-if="tenantData.tenantPic" height="80px" :src="tenantData.tenantPic" />
        </el-form-item>
        <el-form-item label="学校域名" required>
          <el-input v-model="tenantData.tenantDomain"></el-input>
        </el-form-item>
        <el-form-item label="本地部署" required>
          <el-radio v-model="tenantData.localDeploy" label="1">
            是
          </el-radio>
          <el-radio v-model="tenantData.localDeploy" label="2">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="推送平台课程" required>
          <el-radio v-model="tenantData.pushCourse" label="1">
            是
          </el-radio>
          <el-radio v-model="tenantData.pushCourse" label="2">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="授权截止日期" required>
          <el-date-picker
            v-model="tenantData.authorizeExpire"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授权类型" required>
          <el-radio v-model="tenantData.authorizeType" label="10">
            正式
          </el-radio>
          <el-radio v-model="tenantData.authorizeType" label="20">
            试用
          </el-radio>
        </el-form-item>
        <el-form-item label="使用oss平台" required>
          <el-radio v-model="tenantData.ossPublic" label="1">
            是
          </el-radio>
          <el-radio v-model="tenantData.ossPublic" label="2">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="是否启用" required>
          <el-radio v-model="tenantData.status" label="1">
            启用
          </el-radio>
          <el-radio v-model="tenantData.status" label="3">
            禁用
          </el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import headerTheAgain from "@/components/header-theAgain";
import tableTheAgain from "@/components/table-theAgain";

import { sysRolePage } from "../../api/system";
import { sysRoleAdd } from "../../api/system";
import { tenantMod } from "../../api/system";
import { sysRoleDelete } from "../../api/system";
import { sysUserMenuList } from "../../api/system";
import { tenantGet, tenantAdd, tenantDetail } from "../../api/system";
import upOss from '@/components/up-oss'

export default {
  name: "role",
  components: {
    tableTheAgain,
    headerTheAgain,
    upOss
  },
  data() {
    return {
      addForm: {
        title: "",
        data: {
          roleName: ""
        }
      },
      menuDialogVisible: false,
      dialogVisible: false,
      form: {
        pageParam: {
          pageIndex: 1,
          pageSize: 10
        },
        searchKey: "",
      },
      tenantData: {
        localDeploy: '2',
        pushCourse: '1',
        authorizeType: '10',
        ossPublic: '1',
        status: '1'
      },
      tableTitle: "角色管理列表",
      tableOperate: [
        {
          content: "创建租户",
          type: "created"
        }
      ],
      columnNameList: [
        // {
        //   type: "selection"
        // },
        {
          name: "学校名称",
          prop: "tenantName"
        },
        {
          name: "学生数",
          prop: "studentCount"
        },
        {
          name: "教师数",
          prop: "teacherCount"
        },
        {
          name: "课程数",
          prop: "courseCount"
        },
      ],
      operateList: [
        {
          content: "修改",
          type: "edit"
        },
      ],
      tableData: []
    };
  },
  created() {
    this.tenantList()
    // this.queryRoleList();
  },
  methods: {
    tenantList() {
      tenantGet(this.form).then(response => {
        console.log(response.data.pageData);
        this.tableData = response.data.pageData;
      });
    },
    showComponentInfo(type, info) {
      console.log("type", type, "info", info);
      switch (type) {
        case "created":
          console.log("here is created");
          // this.form = {}
          this.addManager();
          break;
        case "edit":
          console.log("here is edit");
          this.editManager(info);
          break;
        case "delete":
          this.delete("one", info);
          break;
        case "deleteList":
          this.delete("list", info);
          break;
        case "set":
          this.editMenu(info);
          break;
      }
    },
    upLogo(...params) {
      console.log(params)
      this.$set(this.tenantData, 'tenantLogo', params[0])
    },
    upPic(...params) {
      console.log(params)
      this.$set(this.tenantData, 'tenantPic', params[0])
    },
    addManager() {
      this.dialogVisible = true;
      this.addForm.title = "创建租户";
      this.addForm.data = { roleName: "" };
    },
    editManager(roleInfo) {
      tenantDetail({tenantId: roleInfo.tenantId})
      .then(response=> {
        console.log(response.data)
        response.data.pushCourse = String(response.data.pushCourse)
        response.data.ossPublic = String(response.data.ossPublic)
        response.data.localDeploy = String(response.data.localDeploy)
        response.data.authorizeType = String(response.data.authorizeType)
        response.data.status = String(response.data.status)
        this.tenantData = response.data
      })
      this.addForm.title = "修改信息";
      this.dialogVisible = true;
    },
    editMenu(roleInfo) {
    },
    save() {
      console.log(this.addForm)
      if(this.addForm.title === "创建租户") {
        tenantAdd(this.tenantData)
        .then(response=> {
          if(response.code === 200) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.tenantData.tenantName = ''
            this.tenantData.shortName = ''
            this.tenantData.tenantWebsite = ''
            this.tenantData.tenantLogo = ''
            this.tenantData.tenantPic = ''
            this.tenantData.tenantDomain = ''
            this.tableData.push(response.data)
            this.dialogVisible = false;
          }
        })
      }else {
        tenantMod(this.tenantData)
        .then(response=> {
          if(response.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.tenantList()
            this.dialogVisible = false;
          }
        })
      }
    },
    delete(type, list) {
    },
    handleCurrentChange(number) {
      this.form.pageIndex = number;
      // this.queryRoleList();
    },
    handleClose(done) {
      done();
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.role {
  .el-pagination {
    margin: 20px 2.5% 0 0;
    display: flex;
    justify-content: flex-end;
    width: 95%;
  }

  .pop-academy {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: left;
  }

  .color-red {
    color: red;
  }

  .item-title {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    width: 30%;

    span {
      line-height: 40px;
    }
  }

  .item-input-list {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    width: 70%;
  }

  .item-input {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 40px;
  }

  .input-pop {
    width: 200px;
  }
}
</style>
