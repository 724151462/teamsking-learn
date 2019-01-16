<template>
  <div class="portalTeacher">
    <div style="height: 70px">
      <el-button style="float: right;margin-right: 50px" type="primary" @click="addBanner">添加</el-button>
    </div>
    <table-wjx
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-wjx>
    <el-dialog title="添加轮播图" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="图片路径">
          <upOss :btnText="'上传轮播图'" @ossUp="getBannerUrl"></upOss>
        </el-form-item>
        <el-form-item label="链接web">
          <el-input v-model="form.linkWebUrl"></el-input>
        </el-form-item>
        <el-form-item label="链接小程序">
          <el-input v-model="form.linkWxxUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import aDialog from "@/components/dialog";
import upOss from "@/components/up-oss";
import tableWjx from "../../components/table-wjx";

import { bannerList, addBanner, delBanner, modBanner } from "@/api/system";
import { error } from "util";

export default {
  components: {
    tableWjx,
    upOss
  },
  data() {
    return {
      form: {},
      dialogVisible: false,
      activeIndex: "2",
      tableTitle: "轮播图",
      tableData3: [],
      columnNameList: [
        {
          type: "index"
        },
        {
          name: "图片路径",
          prop: "imageUrl",
          imgList: {}
        },
        {
          name: "链接web端",
          prop: "linkWebUrl"
        },
        {
          name: "链接微信小程序",
          prop: "linkWxxUrl"
        },
        {
          name: "租户id",
          prop: "tenantId"
        }
      ],
      operateList: [
        {
          content: "编辑",
          type: "edit"
        },
        {
          content: "删除",
          type: "delete"
        }
      ],
      tableOperate: [],
      btnType: ""
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    showComponentInfo: function(type, info) {
      // console.log( '父组件接收到的类型：' , type + '父组件接收到的信息：' , info );
      switch (type) {
        case "edit":
          this.form.carouselId = info.carouselId;
          this.form.imageUrl = info.imageUrl[0].imgUrl;
          this.form.linkWebUrl = info.linkWebUrl;
          this.form.linkWxxUrl = info.linkWxxUrl;
          this.btnType = "modify"
          this.dialogVisible = true;
          break;
        case "delete":
          this.deleteBanner(info);
          break;
      }
    },
    addBanner() {
      this.btnType = "add"
      this.dialogVisible = true;
    },
    deleteBanner(item) {
      delBanner([item.carouselId]).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getBannerList();
        }
      });
    },
    getBannerUrl(url, name) {
      this.form.imageUrl = url;
    },
    ensureBtn() {
      if (this.btnType === "add") {
        addBanner(this.form)
          .then(response => {
            if (response.code === 200) {
              this.getBannerList()
              this.$message({
                message: "添加成功",
                type: "success"
              });
            } else if (response.code === 1000) {
              this.$message({
                message: response.msg,
                type: "warning"
              });
            }
            this.dialogVisible = false;
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "danger"
            });
          });
      } else {
        modBanner(this.form)
          .then(response => {
            if (response.code === 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            } else if (response.code === 1000) {
              this.$message({
                message: response.msg,
                type: "warning"
              });
            }
            this.dialogVisible = false;
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "danger"
            });
          });
      }
    },
    getBannerList() {
      bannerList()
      .then(res => {
        res.data.forEach(element => {
          element.imageUrl = [{ imgUrl: element.imageUrl }];
        });
        this.tableData3 = res.data;
      })
      .catch();
    }
  },
  created: function() {
    this.getBannerList()
  }
};
</script>
<style scoped>
.portalTeacher {
  margin-top: 20px;
}
</style>
