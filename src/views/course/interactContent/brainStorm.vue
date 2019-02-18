<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 头脑风暴
    </span>
    <div>
      <el-form :model="brainStorm" ref="brainStormForm" :rules="rules" label-width="100px">
        <el-form-item label="题目" prop="stormTitle">
          <el-input
            type="textarea"
            v-model="brainStorm.stormTitle"
            placeholder="请输入题目"
            style="width:600px;"
            autofocus="autofocus"
          />
        </el-form-item>
        <el-form-item label="添加图片">
          <upOss @ossUp="getUrl" :fileType="'image/jpeg,image/png'"></upOss>
          <div class="all-img-list">
            <template v-for="(item,i) in brainStorm.assetList">
              <div :key="i" style="display: flex; flex-direction: column; align-items: center">
                <div class="img-list">
                  <img @click="download(item)" style="width:50px;cursor: pointer" :src="item.assetUrl" class="img">
                </div>
              </div>
              <span :key="item.userId" class="delAsset" @click="delAsset(item)">×</span>
            </template>
            <!-- <img v-for="(item, index) in addImgList" :src="item.assetUrl" :width="50" :key="index" alt> -->
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="stormDescribe">
          <el-input placeholder="请添加描述" v-model="brainStorm.stormDescribe" style="width:600px;"></el-input>
        </el-form-item>
        <el-form-item label="所属章" prop="chapterId">
            <el-select v-model="brainStorm.chapterId">
              <el-option
                v-for="item in chapterList"
                :key="item.chapterId"
                :label="item.chapterName"
                :value="item.chapterId"
              ></el-option>
            </el-select>
        </el-form-item>
        <span style="color: red">提示：学生参与默认活动90分基础分</span>
      </el-form>
    </div>
    <el-button @click="brainStormSave">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import upOss from "@/components/up-oss";
import Cookie from "js-cookie";
import {
  interactStorm,
  assetCreate,
  chaptersListSimple,
  stormSave,
  stormPut
} from "@/api/course";
export default {
  data() {
    return {
      rules: {
        stormDescribe: [
          { required: true, message: '请填写题目', trigger: 'blur' }
        ],
        stormTitle: [
          { required: true, message: '请填写头脑风暴标题', trigger: 'blur' }
        ],
        chapterId: [
          { required: true, message: '请选择一个章节', trigger: 'change' }
        ]
      },
      brainStorm: {
        assetList: [],
        courseId: this.$route.query.id,
        stormTitle: "",
        stormDescribe: "",
        chapterId: "",
        assetIds: [],
        interactionStatus: 10
      },
      chapterList: [],
      addImgList: [],
      asset: {
        assetId: 0,
        assetMd5: "",
        assetSize: 0,
        assetTitle: "fileFold.png",
        assetType: 20,
        assetUrl:
          "http://tskedu-course.oss-cn-beijing.aliyuncs.com/1545189072795fileFold.png",
        contentType: "",
        courseId: this.$route.query.id,
        coverUrl: "",
        resourceLength: 0,
        updateId: 0
      },
      routerType: "cancel"
    };
  },
  mounted() {
    if (this.$route.query.operation === "edit") {
      interactStorm({ stormId: this.$route.query.interactId }).then(
        response => {
          this.brainStorm = response.data;
          this.brainStorm.assetList = response.data.assetList;
          console.log(this.addImgList);
        }
      );
    }
    chaptersListSimple({ courseId: this.$route.query.id }).then(response => {
      this.chapterList = response.data;
    });
    this.preventBack();
  },
  methods: {
    // 删附件
    delAsset(item) {
      this.brainStorm.assetList.forEach((element, i) => {
        if(element.assetId === item.assetId) {
          this.brainStorm.assetList.splice(i, 1)
        }
      });
    },
    preventBack() {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function() {
        history.pushState(null, null, document.URL);
      });
    },
    getUrl(url, fileName) {
      console.log("资源链接：" + url);
      this.asset.assetTitle = fileName;
      this.asset.assetUrl = url;
      this.asset.contentType = this.resType(fileName);
      assetCreate(this.asset).then(response => {
        this.brainStorm.assetList.push(response.data);
        // this.addImgList.push(response.data)
        console.log(this.addImgList)
        console.log(this.brainStorm);
      });
    },
    download(url) {
      var FileSaver = require("file-saver");
      FileSaver.saveAs(url.assetUrl);
    },
    resType(name) {
      let index = name.lastIndexOf("."),
        imgArr = ["jpeg", "jpg", "png"],
        audioArr = ["mp3", "wav"],
        videoArr = ["mp4", "avi", "rmvb", "wmv", "mkv"],
        docArr = ["pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
        typeNumber = "";
      let curType = name.substring(index + 1, name.length).toLowerCase();

      if (
        imgArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 40;
      } else if (
        videoArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 10;
      } else if (
        docArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 20;
      } else if (
        audioArr.find(item => {
          return curType == item;
        })
      ) {
        typeNumber = 30;
      } else {
        this.$message.error("请上传受支持的资源文件");
      }
      return typeNumber;
    },
    handleSuccess() {
      this.routerType = "success";
      let chapterArr = JSON.parse(localStorage.getItem("localInteractId"));
      Cookie.set("interactionStatus", "10");
      let index = "";
      let findFlag = chapterArr.some((element, i) => {
        if (element === this.brainStorm.chapterId) {
          index = i;
        }
      });
      if (index !== "") {
        Cookie.set("interactActiveIndex", index);
      } else {
        Cookie.set("interactActiveIndex", chapterArr.length);
      }
      this.$router.push({
        path: "/course/list/interact",
        query: { id: this.$route.query.id }
      });
    },
    brainStormSave() {
      let newAssets = JSON.parse(JSON.stringify(this.brainStorm.assetList));
      let imgList = [];
      newAssets.forEach(element => {
        console.log(element);
        imgList.push(element.assetId);
      });
      this.brainStorm.assetIds = imgList;
      if (this.$route.query.operation === "edit") {
        console.log(this.brainStorm);
        stormPut(this.brainStorm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "修改投票成功",
              type: "success"
            });
            this.handleSuccess();
          }
        });
      } else {
        this.$refs['brainStormForm'].validate((valid) => {
          if (valid) {
            stormSave(this.brainStorm).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: "成功",
                  type: "success"
                });
                this.handleSuccess();
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    // 取消
    cancel() {
      this.routerType = "cancel";
      this.$router.push({
        path: "/course/list/interact",
        query: { id: this.$route.query.id }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    let msg = "跳转将丢失未保存数据，是否跳转";
    if (this.routerType === "cancel") {
      msg = "跳转将丢失未保存数据，是否跳转";
    } else {
      msg = "添加成功，是否跳活动转列表页";
    }
    this.$confirm(msg, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        next();
      })
      .catch(() => {});
  },
  components: { upOss }
};
</script>

<style  lang="stylus" scoped>
.all-img-list {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;



    .img {
      width: auto;
    }
  

  .add-img {
    font-size: 50px;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #D8D8D8;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin-left: 10px;
    cursor: pointer;
  }
}

.delAsset {
  height: 20px;
  line-height: 18px;
  width: 20px;
  font-size: 20px;
  position: relative;
  top: -25px;
  cursor: pointer;
  background: rgb(99, 99, 99);
  color: #fff;
  text-align: center;
  border: 1px solid rgb(99, 99, 99);
  border-radius: 50%;
}

.add-img {
  font-size: 50px;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 40px;
  border: 1px solid #D8D8D8;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  margin-left: 10px;
  cursor: pointer;
}
</style>
