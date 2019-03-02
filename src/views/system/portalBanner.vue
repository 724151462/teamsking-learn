<template>
  <div class="portalTeacher">
    <div style="height: 70px">
      <el-button style="float: right;margin-right: 50px" type="primary" @click="addBanner(1)">添加PC轮播图</el-button>
      <el-button style="float: right;margin-right: 50px" type="primary" @click="addBanner(2)">添加小程序轮播图</el-button>
    </div>
    <table-wjx
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo"
    ></table-wjx>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="图片路径">
          <upOss :btnText="'上传轮播图'" @ossUp="getBannerUrl" :fileKind="'img'"></upOss>
        </el-form-item>
        <el-form-item label="链接web" v-if="form.carouselType === 1">
          <el-input v-model="form.linkWebUrl"></el-input>
        </el-form-item>
        <el-form-item label="链接小程序" v-else>
          <el-input v-model="form.linkWxxUrl"></el-input>
        </el-form-item>
        <span v-if="form.carouselType === 1" style="color: red">提示：网页轮播图建议1920*500px</span>
        <span style="color: red" v-else>提示：小程序轮播图建议790*350px</span>
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
      dialogTitle: '',
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
          name: "链接路径",
          prop: "linkUrl"
        },
        {
          name: "轮播图类型",
          prop: "carouselType",
          formatter:(val)=>{
              let carouselType = val === 1 ? 'PC端' : '小程序'
              return carouselType
            }
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
          console.log(info)
          if(info.carouselType === 1) {
            this.dialogTitle = '编辑PC端轮播图'
            this.form.carouselType = 1
            this.form.linkWebUrl = info.linkWebUrl;
          }else{
            this.dialogTitle = '编辑小程序轮播图'
            this.form.carouselType = 2
            this.form.linkWxxUrl = info.linkWxxUrl;
          }
          this.form.carouselId = info.carouselId;
          this.form.imageUrl = info.imageUrl[0].imgUrl;
          this.btnType = "modify"
          this.dialogVisible = true;
          break;
        case "delete":
          this.deleteBanner(info);
          break;
      }
    },
    addBanner(type) {
      this.form = {}
      this.form.carouselType = type
      this.btnType = "add"
      this.dialogTitle = type === 1 ? '添加PC端轮播图' : '添加小程序轮播图'
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
          if(element.carouselType === 1) {
            element.linkUrl = element.linkWebUrl
            // element.carouselType = 'PC端'
          }else{
            element.linkUrl = element.linkWxxUrl
            // element.carouselType = '微信'
          }
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
