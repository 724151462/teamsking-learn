<template>
  <div class="role">
    <header-the-again headerTitle="租户管理"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="form.search" style="width: 200px;margin-left: 10px" placeholder="学校名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryTenantList">查询</el-button>
      </el-form-item>
    </el-form>

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
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="学校名称" required>
          <el-input v-model="form.tenantName"></el-input>
        </el-form-item>
        <el-form-item label="学校简称" required>
          <el-input v-model="form.shortName"></el-input>
        </el-form-item>
        <el-form-item label="logo">
          <upOss :btn-text="'上传logo'" :inputs="'logo'" @ossUp="upLogo"></upOss>
        </el-form-item>
        <el-form-item label="平台图片">
          <upOss :btn-text="'上传图片'" :inputs="'pic'" @ossUp="upPic"></upOss>
        </el-form-item>
        <el-form-item label="学校域名" required>
          <el-input v-model="form.tenantDomain"></el-input>
        </el-form-item>
        <el-form-item label="本地部署" required>
          <el-radio v-model="form.localDeploy" label="1">
            是
          </el-radio>
          <el-radio v-model="form.localDeploy" label="2">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="推送平台课程" required>
          <el-radio v-model="form.pushCourse" label="1">
            是
          </el-radio>
          <el-radio v-model="form.pushCourse" label="2">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="授权截止日期" required>
          <el-date-picker
            v-model="form.authorizeExpire"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="授权类型" required>
          <el-radio v-model="form.authorizeType" label="10">
            正式
          </el-radio>
          <el-radio v-model="form.authorizeType" label="20">
            试用
          </el-radio>
        </el-form-item>
        <el-form-item label="试用oss平台" required>
          <el-radio v-model="form.ossPublic" label="1">
            是
          </el-radio>
          <el-radio v-model="form.ossPublic" label="2">
            否
          </el-radio>
        </el-form-item>
        <el-form-item label="是否启用" required>
          <el-radio v-model="form.status" label="1">
            启用
          </el-radio>
          <el-radio v-model="form.status" label="3">
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
import { sysRoleEdit } from "../../api/system";
import { sysRoleDelete } from "../../api/system";
import { sysUserMenuList } from "../../api/system";
import { sysTenantManagerPage, tenantGet, tenantAdd } from "../../api/system";
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
        title: "添加角色",
        data: {
          roleName: ""
        }
      },
      menuDialogVisible: false,
      dialogVisible: false,
      form: {},
      tableTitle: "角色管理列表",
      tableOperate: [
        {
          content: "删除",
          type: "delete"
        },
        {
          content: "创建租户",
          type: "created"
        }
      ],
      columnNameList: [
        {
          type: "selection"
        },
        {
          name: "学校名称",
          prop: "tenantName"
        },
        {
          name: "学生数",
          prop: "createTime"
        },
        {
          name: "教师数",
          prop: "createName"
        },
        {
          name: "课程数",
          prop: "createName"
        },
        {
          name: "课程包数",
          prop: "createName"
        }
      ],
      operateList: [
        {
          content: "修改",
          type: "delete"
        },
        {
          content: "添加管理员",
          type: "edit"
        }
      ],
      tableData: ""
    };
  },
  created: function() {
    tenantGet({
      pageParam: {
        pageIndex: 1,
        pageSize: 10
      },
      searchKey: ""
    }).then(response => {
      console.log(response.data.pageData);
      this.tableData = response.data.pageData;
    });
    // this.queryRoleList();
  },
  methods: {
    showComponentInfo: function(type, info) {
      console.log("type", type, "info", info);
      switch (type) {
        case "created":
          console.log("here is created");
          this.appendRole();
          break;
        case "edit":
          console.log("here is edit");
          this.editRole(info);
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
      this.form.tenantLogo = params[0]
    },
    upPic(...params) {
      console.log(params)
      this.form.tenantPic = params[0]
    },
    queryTenantList: function() {
      sysTenantManagerPage(this.form)
        .then(res => {
          this.tableData = res.data;
          console.log("租户管理员列表:", this.tableData);
        })
        .catch();
    },
    appendRole: function() {
      this.dialogVisible = true;
      this.addForm.title = "添加角色";
      this.addForm.data = { roleName: "" };
    },
    editRole: function(roleInfo) {
    },
    editMenu: function(roleInfo) {
    },
    save: function() {
      console.log(this.form)
      tenantAdd(this.form)
      .then(response=> {
        if(response.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.tableData.push(response.data)
          this.dialogVisible = false;
        }
      })
    },
    delete: function(type, list) {
    },
    handleCurrentChange: function(number) {
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
