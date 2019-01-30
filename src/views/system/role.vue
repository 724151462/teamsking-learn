<template>
  <div class="role">
    <header-the-again headerTitle="角色管理"></header-the-again>

    <el-form ref="form" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input
          v-model="form.roleName"
          style="width: 200px;margin-left: 10px;"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryRoleList">查询</el-button>
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
      <div class="pop-academy">
        <div class="item-title">
          <span class="color-red">*</span>
          <span>请输入角色名：</span>
        </div>
        <div class="item-input">
          <el-input class="input-pop" v-model="addForm.data.roleName" placeholder="角色名称" clearable></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="addForm.title"
      :visible.sync="menuDialogVisible"
      width="60%"
      :before-close="handleClose"
      style="min-width: 800px"
    >
      <div class="pop-academy">权限菜单列表:
        <br>
        <br>
        <br>

        <Tree :sourceData="allMenuList" :nodeKey="'menuId'" :activeNode="selectedPower" :isAccordion="true" @checkedList="checkedFiles" :props="defaultProps"></Tree>

        <!--{{ addForm.data.menuList }}-->
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensurePower">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import headerTheAgain from "@/components/header-theAgain";
import tableTheAgain from "@/components/table-theAgain";
import Tree from "@/components/fileTree";

import { sysRoleList } from "../../api/system";
import { sysRoleAdd } from "../../api/system";
import { sysRoleEdit } from "../../api/system";
import { sysRoleDelete } from "../../api/system";
import { sysUserMenuList, sysUserMenuTree, sysRolePower, sysRolePowerGet } from "../../api/system";

export default {
  name: "role",
  components: {
    tableTheAgain,
    headerTheAgain,
    Tree
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
        title: ""
      },
      tableTitle: "角色管理列表",
      tableOperate: [
        {
          content: "创建角色",
          type: "created"
        },
        {
          content: "批量删除",
          type: "deleteList"
        }
      ],
      columnNameList: [
        {
          type: "selection"
        },
        {
          name: "角色名",
          prop: "roleName"
        },
        {
          name: "创建时间",
          prop: "createTime"
        },
        {
          name: "创建人",
          prop: "createName"
        }
      ],
      operateList: [
        {
          content: "删除",
          type: "delete"
        },
        {
          content: "编辑",
          type: "edit"
        },
        {
          content: "设置权限",
          type: "set"
        }
      ],
      tableData: [],
      allMenuList: [],
      selectedPower: [],
      addPowerParams: {},
      defaultProps: {
        children: "list",
        label: "name"
      },
      data2: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
    };
  },
  created: function() {
    sysUserMenuTree().then(response => {
      this.allMenuList = response.data;
    });
    this.queryRoleList();
  },
  mounted: function() {
    sysUserMenuList()
      .then(res => {
        console.log("权限菜单:", res);
        if (res.code === 200) {
          let menuTree = res.data.filter(element => {
            return element.parentId === 0;
          });
          for (let i = 0; i < menuTree.length; i++) {
            menuTree[i].children = [];
            menuTree[i].children.push(
              res.data.filter(element => {
                return element.parentId === menuTree[i].menuId;
              })
            );
          }
        } else {
          // this.open4( '查询失败:' + res.msg );
        }
        // console.log( 'menuTree' , menuTree );
      })
      .catch();
  },
  methods: {
    // 选中的文件
    checkedFiles(checkedList) {
      let powerArr = [];
      checkedList.forEach(element => {
        powerArr.push(element.menuId);
      });
      this.addPowerParams.menuIdList = powerArr;
    },
    // 确认权限
    ensurePower() {
      console.log(this.addPowerParams)
      sysRolePower(this.addPowerParams)
      .then(response=> {
        if (response.code === 200) {
          this.open2("设置成功");
          this.menuDialogVisible = false;
          this.queryRoleList();
        } else {
          this.open4("设置失败:" + response.msg);
        }
      })
    },
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
    queryRoleList: function() {
      console.log("this.form", this.form);
      sysRoleList(this.form)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.pageData;
          } else {
            this.open4("查询失败:" + res.msg);
          }
          // this.tableData=res.data;
          // console.log("tableData",this.tableData)
        })
        .catch(error => {
          this.open4("查询失败:" + error);
        });
    },
    appendRole: function() {
      this.dialogVisible = true;
      this.addForm.title = "添加角色";
      this.addForm.data = { roleName: "" };
    },
    editRole: function(roleInfo) {
      this.dialogVisible = true;
      this.addForm.title = "编辑角色";
      this.addForm.data = roleInfo;
      console.log("this.addForm.data", this.addForm.data);
    },
    editMenu: function(roleInfo) {
      this.selectedPower = []
      sysRolePowerGet(roleInfo)
      .then(response=> {
        let arr = []
        response.data.menuList.forEach(item=> {
          arr.push(item.menuId)
        })
        this.selectedPower = arr
        console.log(this.selectedPower)
      })
      this.menuDialogVisible = true;
      this.addPowerParams.createdId = Number(Cookie.get('userId'))
      this.addPowerParams.roleId = roleInfo.roleId
      this.addForm.title = "设置权限";
      this.addForm.data = roleInfo;
      console.log("this.addForm.data.menuList", this.addForm.data.menuList);
    },
    save: function() {
      if (this.addForm.title === "添加角色") {
        console.log("添加角色的信息:", this.addForm.data);
        sysRoleAdd(this.addForm.data)
          .then(res => {
            if (res.code === 200) {
              this.open2("添加成功");
              this.dialogVisible = false;
              this.queryRoleList();
            } else {
              this.open4("添加失败:" + res.msg);
            }
            // console.log('添加角色:',res);
          })
          .catch(error => {
            this.open4("添加失败:" + error);
          });
      } else if (this.addForm.title === "编辑角色") {
        console.log("编辑提交的信息:", this.addForm.data);
        sysRoleEdit(this.addForm.data)
          .then(res => {
            if (res.code === 200) {
              this.open2("编辑成功");
              this.dialogVisible = false;
              this.queryRoleList();
            } else {
              this.open4("编辑失败:" + res.msg);
            }
            // console.log( '编辑的信息返回：',res);
          })
          .catch(error => {
            this.open4("编辑失败:" + error);
          });
      }
      // this.dialogVisible = false;
      // setTimeout( ()=>{ this.queryRoleList() },300);
    },
    delete: function(type, list) {
      let roleIdList = [];
      switch (type) {
        case "one":
          roleIdList.push(list.roleId);
          break;
        case "list":
          list.filter(element => {
            roleIdList.push(element.roleId);
            return true;
          });
          break;
      }
      sysRoleDelete(roleIdList).then(res => {
        // console.log('删除成功的信息:',res);
        if (res.code === 200) {
          this.open2("删除成功");
          this.queryRoleList();
        } else {
          this.open4("删除失败" + res.msg);
        }
      });
      // setTimeout( () => { this.queryRoleList() },300 );
    },
    open2(successInfo) {
      this.$message({
        message: successInfo,
        type: "success"
      });
    },
    open4(errorInfo) {
      this.$message.error(errorInfo);
    },
    handleCurrentChange: function(number) {
      this.form.pageIndex = number;
      this.queryRoleList();
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
