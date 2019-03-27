<template>
  <div style="display: inline-block;margin: 0 10px">
    <el-button type="primary" @click="goUp" id="male">{{btnText}}</el-button>
    <!-- <div>{{schedule}}</div> -->
    <input type="file" :id="inputs" @change="upInput">
  </div>
</template>

<script>
import oss from "ali-oss";
import axios from "axios";
import { webUpload } from "../api/oss";

export default {
  name: "up-oss",
  props: {
    size: {
      default: 2 * 1024 * 1024 * 1024
    },
    btnText: {
      default: "上传"
    },
    inputs: {
      default: "inputs"
    },
    fileType: {
      default: ""
    },
    fileKind: {
      default: "default"
    }
  },
  data() {
    return {
      schedule: 0, //上传进度
      ossData: null,
      fileData: null,
      imageData: {
        accessid: "",
        dir: "",
        expire: "",
        host: "",
        policy: "",
        signature: ""
      },
      isError: 3,
      //需要返回的文件信息
      fileName: "",
      fileSize: "",
      dir: ""
      // fileName:'',
    };
  },
  methods: {
    //触发上传按钮
    goUp() {
      document.getElementById(this.inputs).click();
    },
    //清空输入框
    inputNull(event) {
      let dom = document.getElementById(this.inputs);
      dom.value = "";
      // dom.outerHTML = dom.outerHTML;
      this.fileData = null;
    },
    //捕获到文件
    upInput(event) {
      if (event) {
        this.fileData = event;
        this.fileName = new Date().getTime() + event.target.files[0].name;
        this.fileSize = event.target.files[0].size;
      }
      //这里加一个获取验签信息的错误处理
      if (Number(this.isError) === 0) {
        this.errors();
        return false;
      }
      if (this.ossData === null && Number(this.isError) !== 0) {
        this.ossCheck();
        return false;
      }
      let file = this.fileData.target.files[0];
      let name =
        new Date().getTime() +
        file.name.replace(
          /[\-\s+\_\+\,\!\|\~\`\(\)\#\$\%\^\&\*\{\}\:\;\"\L\<\>\?]/g,
          ""
        );
      console.log(file.type);

      if (this.fileType !== "") {
        let chekcType = this.fileType.split(",").some(element => {
          return file.type === element;
        });
        if (!chekcType) {
          this.$message({
            message: "文件格式错误",
            type: "error"
          });
          this.inputNull();
          return false;
        }
      }
      if (file.size > this.size) {
        this.$message({
          message: "上传文件超出可上传范围，请重新选择文件上传",
          type: "error"
        });
        this.inputNull();
        return false;
      }
      let client = new oss(this.ossData);
      //多文件上传请修改这里
      this.forInputs(client, name, file);
    },
    //获取签证
    ossCheck(name) {
      let dir = this.resType(this.fileName);
      this.dir = dir;
      webUpload({ ossPath: dir })
        .then(res => {
          //console.log(res)
          if (Number(res.code) === 200) {
            let request = new FormData();
            this.imageData = res.data;
            this.imageData.key = res.data.dir + "/" + this.fileName;
            request.append("key", res.data.dir + "/" + this.fileName);
            request.append("policy", res.data.policy);
            request.append("OSSAccessKeyId", res.data.accessid);
            request.append("success_action_status", "200");
            request.append("Signature", res.data.signature);
            request.append("file", this.fileData.target.files[0]);
            this.startUp(request);
          } else {
            this.$message.error("获取验签失败，请联系管理员");
          }
        })
        .catch(err => {
          console.log(err);
          console.log('获取验签失败');
          this.$message.error("获取验签失败,请重试");
        });
    },
    //上传文件到OSS
    startUp(request) {
      this.$store.commit("SET_LOADING_TEXT", "正在上传...");
      this.$store.commit("SHOWLOADING");
      axios({
        method: "post",
        url: this.imageData.host,
        data: request,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(res => {
          this.$store.commit("SET_LOADING_TEXT", "正在加载");

          this.$store.commit("HIDELOADING");
          let url = this.imageData.host + "/" + this.imageData.key;
          this.inputNull();
          this.$emit("ossUp", url, this.fileName, this.fileSize);
        })
        .catch(function(error) {
          this.$store.commit("SET_LOADING_TEXT", "正在加载");

          this.$store.commit("HIDELOADING");
          this.$message.error("上传失败");
          console.log("error", error);
        });
    },
    //检验文件类型，生成dir
    resType(name) {
      let dir = "";
      if (this.fileKind === "avatar") {
        dir = "teskedu/avatar";
      } else if (this.fileKind === "resource") {
        let index = name.lastIndexOf("."),
          imgArr = ["jpeg", "jpg", "png"],
          audioArr = ["mp3", "wav"],
          videoArr = ["mp4", "avi", "rmvb", "wmv", "mkv"],
          docArr = ["pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
        let curType = name.substring(index + 1, name.length).toLowerCase();

        if (
          imgArr.find(item => {
            return curType == item;
          })
        ) {
          dir = "teskedu/resource/img";
        } else if (
          videoArr.find(item => {
            return curType == item;
          })
        ) {
          dir = "teskedu/resource/video";
        } else if (
          docArr.find(item => {
            return curType == item;
          })
        ) {
          dir = "teskedu/resource/doc";
        } else if (
          audioArr.find(item => {
            return curType == item;
          })
        ) {
          dir = "teskedu/resource/audio";
        } else {
          this.$message.error("请上传受支持的文件类型");
          return false;
        }
      } else if (this.fileKind === "certificate") {
        dir = "teskedu/img/certificate/";
      } else if (this.fileKind === "temp") {
        dir = "ExcelTemplate";
      }else {
        console.log('fileKind传参错误');
        return false
        // dir = name;
      }
      return dir;
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
#logo {
  display: none;
}

#pic {
  display: none;
}

#inputs {
  display: none;
}

#creImg {
  display: none;
}
</style>
