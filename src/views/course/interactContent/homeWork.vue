<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 作业/小组任务
    </span>
    <el-form :model="homeWork" :rules="rules" ref="homeWorkForm" label-width="100px">
      <el-form-item label="题目" prop="describe">
        <el-input
          type="textarea"
          v-model="homeWork.describe"
          placeholder="请输入题目"
          style="width:600px;"
          autofocus="autofocus"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input placeholder="请添加标题" style="width:600px;" v-model="homeWork.title"></el-input>
      </el-form-item>
      <el-form-item label="所属章" prop="chapterId">
        <el-select v-model="homeWork.chapterId">
          <el-option
            v-for="item in chapterList"
            :key="item.chapterId"
            :label="item.chapterName"
            :value="item.chapterId"
          ></el-option>
        </el-select>
      </el-form-item>

      <div class="margin-sides">
        <div style="margin-top: 20px">
          <div></div>
        </div>
      </div>
      <el-form-item label="划分方式" prop="schemeId">
        <el-select v-model="homeWork.schemeId">
          <el-option
            v-for="(group,index) in groupList"
            :key="index"
            :label="group.schemeName"
            :value="group.schemeId"
          ></el-option>
        </el-select>
        <span style="margin-left: 10px;color: red">任务小组划分方式：学生以小组为单位完成此活动，并按小组提交结果</span>
      </el-form-item>
      <el-form-item label="设置评分点">
        <div class="margin-sides" style="margin-left: 0">
          <el-button @click="addScorePoint" type="primary">+添加评分点</el-button>
          <div v-for="(item, index) in homeWork.homeworkMarks" :key="index" class="margin-sides">
            <el-input v-model="item.markPoint" style="width: 400px" placeholder="输入评分点内容"></el-input>
            <el-input v-model="item.markScore" style="width: 80px;margin-left:20px" type="number"></el-input>分
            <span>占作业分值 {{item.markScore+'%'}}</span>
            <span class="delBtn" @click="delScorePoint(index)">删除</span>
          </div>
        </div>
        <span v-if="normalScore">已分配{{scoreTotal}}分，还可分配{{leftScore}}分（评分标准，助教评分可参考）</span>
        <span v-if="overScore" style="color: red">已超出{{leftScore}}分</span>
      </el-form-item>
      <el-form-item label="允许助教评分">
        <el-checkbox v-model="homeWork.markType" :true-label="20" :false-label="10"></el-checkbox>
      </el-form-item>
      <el-form-item label="添加附件">
        <upOss @ossUp="getUrl" :btnText="'添加附件'" upDir="resource"></upOss>
      </el-form-item>
      <div>
        <div v-for="(item,i) in homeWork.assets" :key="i" style="with:100%">
          <div v-if="getFileType(item.assetUrl) === 'image'" class="box">
            <div class="pic_title">
              <img height="50" width="50" :src="item.assetUrl">
              <span>{{item.assetTitle}}</span>
            </div>
            <div class="operate">
              <span @click="download(item)"><i class="el-icon-download"></i>下载</span>
              <span @click="delAsset(i)"><i class="el-icon-delete"></i>删除</span>
            </div>
          </div>
          <div v-else-if="fileTail(item) === 'xls' || fileTail(item) === 'xlsx'" class="box">
            <!-- <span @click="download(item)">{{item.assetTitle}}</span> -->
            <div class="pic_title">
              <img  width="50" :src="require('@/assets/images/asset_excel.png')">
              <span>{{item.assetTitle}}</span>
            </div>
            <div class="operate">
              <span @click="download(item)"><i class="el-icon-download"></i>下载</span>
              <span @click="delAsset(item)"><i class="el-icon-delete"></i>删除</span>
            </div>
          </div>
          <div v-else-if="fileTail(item) === 'doc' || fileTail(item) === 'docx' || fileTail(item) === 'txt'" class="box">
            <!-- <span @click="download(item)">{{item.assetTitle}}</span> -->
            <div class="pic_title">
              <img  width="50" :src="require('@/assets/images/asset_word.png')">
              <span>{{item.assetTitle}}</span>
            </div>
            <div class="operate">
              <span @click="download(item)"><i class="el-icon-download"></i>下载</span>
              <span @click="delAsset(item)"><i class="el-icon-delete"></i>删除</span>
            </div>
          </div>
          <div v-else-if="fileTail(item) === 'ppt' || fileTail(item) === 'pptx'" class="box">
            <!-- <span @click="download(item)">{{item.assetTitle}}</span> -->
            <div class="pic_title">
              <img  width="50" :src="require('@/assets/images/asset_ppt.png')">
              <span>{{item.assetTitle}}</span>
            </div>
            <div class="operate">
              <span @click="download(item)"><i class="el-icon-download"></i>下载</span>
              <span @click="delAsset(item)"><i class="el-icon-delete"></i>删除</span>
            </div>
          </div>
          <div v-else-if="fileTail(item) === 'pdf'" class="box">
            <!-- <span @click="download(item)">{{item.assetTitle}}</span> -->
            <div class="pic_title">
              <img  width="50" :src="require('@/assets/images/asset_pdf.png')">
              <span>{{item.assetTitle}}</span>
            </div>
            <div class="operate">
              <span @click="download(item)"><i class="el-icon-download"></i>下载</span>
              <span @click="delAsset(item)"><i class="el-icon-delete"></i>删除</span>
            </div>
          </div>
        </div>
      </div>
      <el-form-item label="参考答案" prop="answer">
        <!-- <span>参考答案</span> -->
        <el-input type="textarea" v-model="homeWork.answer" required></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="hwSave" type="primary">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import upOss from "@/components/up-oss";
import Cookie from "js-cookie";
import { fileType, downLoadFile } from "@/utils/utils"
import {
  assetCreate,
  homeWorkDetail,
  homeworkPut,
  chaptersListSimple,
  homeWorkSave,
  schemeList
} from "@/api/course";
export default {
  data() {
    return {
      normalScore: true,
      overScore: false,
      chapterList: [],
      homeWork: {
        answer: "",
        chapterId: "",
        courseId: this.$route.query.id,
        describe: "",
        title: "",
        assets: [],
        pubTime: "",
        markType: 10,
        homeworkMarks: [
          // {
          //   markPoint: "",
          //   markScore: 0
          // }
        ],
        schemeId: ""
      },
      rules: {
        answer: [
          { required: true, message: "请填写参考答案", trigger: "blur" }
        ],
        describe: [{ required: true, message: "请填写题目", trigger: "blur" }],
        title: [{ required: true, message: "请填写作业标题", trigger: "blur" }],
        chapterId: [
          { required: true, message: "请选择一个章节", trigger: "change" }
        ],
        schemeId: [
          { required: true, message: "请选择划分方式", trigger: "change" }
        ]
      },
      routerType: "cancel",
      groupList: [
        {
          name: "五月天",
          id: "mayday"
        },
        {
          name: "纵贯线",
          id: "zgx"
        },
        {
          name: "动力火车",
          id: "dlhc"
        }
      ],
      addImgList: [],
      asset: {
        assetId: 0,
        assetMd5: "",
        assetSize: 0,
        assetTitle: "fileFold.png",
        assetType: 10,
        assetUrl:
          "http://tskedu-course.oss-cn-beijing.aliyuncs.com/1545189072795fileFold.png",
        contentType: "",
        courseId: this.$route.query.id,
        coverUrl: "",
        resourceLength: 0,
        updateId: 0
      }
    };
  },
  mounted() {
    chaptersListSimple({ courseId: this.$route.query.id }).then(response => {
      this.chapterList = response.data;
    });
    schemeList(this.$route.query.id).then(response => {
      response.data.unshift({ schemeId: 0, schemeName: "不划分小组" });
      this.groupList = response.data;
    });
    if (this.$route.query.operation === "edit") {
      homeWorkDetail({ homeworkId: this.$route.query.interactId }).then(
        response => {
          this.homeWork = response.data;
          // let assetArr = []
          // this.homeWork.assets.forEach(element => {
          //   assetArr.push(element.assetId)
          // });
          // this.homeWork.assets = assetArr
          console.log(this.homeWork.assets);
        }
      );
    }
    this.preventBack();
  },
  methods: {
    preventBack() {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function() {
        history.pushState(null, null, document.URL);
      });
    },
    // 添加评分点
    addScorePoint() {
      this.homeWork.homeworkMarks.push({
        markPoint: "",
        markScore: 0
      });
    },
    // 删除评分点
    delScorePoint(index) {
      this.homeWork.homeworkMarks.splice(index, 1);
    },
    // 提交数据
    saveHomework() {
      console.log(this.homeWork);
    },
    getUrl(url, fileName) {
      console.log(fileName)
      console.log("资源链接：" + url);
      this.addImgList.push(url);
      this.asset.assetTitle = fileName;
      this.asset.assetUrl = url;
      this.asset.contentType = this.fileTail(this.asset)
      assetCreate(this.asset).then(response => {
        this.homeWork.assets.push(response.data);
        console.log("asset", this.homeWork);
      });
    },
    // 判断文件后缀
    fileTail(file) {
      console.log(file)
      let url = file.assetUrl, 
          index= url.lastIndexOf('.')
      return url.substring(index+1,url.length).toLowerCase()
    },
    // 判断文件类型
    getFileType(name) {
      console.log(name)
      return fileType(name)
    },
    // 下载
    download(file) {
      // let fileType = fileType(url.assetUrl)
      // var FileSaver = require("file-saver");
      // FileSaver.saveAs(url.assetUrl);
      console.log(file)
      let url = file.assetUrl, 
          index= url.lastIndexOf('.')
      downLoadFile(url, file.assetTitle)
    },
    delAsset(index) {
      this.homeWork.assets.splice(index,1)
    },
    handleSuccess() {
      this.routerType = "success";
      let chapterArr = JSON.parse(localStorage.getItem("localInteractId"));
      Cookie.set("interactionStatus", "10");
      let index = "";
      let findFlag = chapterArr.some((element, i) => {
        if (element === this.homeWork.chapterId) {
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
    hwSave() {
      // 取出assetId，作为请求的assets的值，newObject.assign,与this.homeWork互不影响
      let imgList = [];
      this.homeWork.assets.forEach(element => {
        console.log(element);
        imgList.push(element.assetId);
      });
      let newObj = {}
      Object.assign(newObj, this.homeWork, {assets: imgList})
      console.log(this.homeWork, newObj)
      if (this.$route.query.operation === "edit") {
        homeworkPut(newObj).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "修改作业成功",
              type: "success"
            });
            this.handleSuccess();
          }
        });
      } else {
        this.$refs["homeWorkForm"].validate(valid => {
          if (valid) {
            let addHomeworkObj = Object.assign({}, this.homeWork)
            let assetList = []
            this.homeWork.assets.forEach(element=> {
              assetList.push(element.assetId)
            })
            addHomeworkObj.assets = assetList
            homeWorkSave(addHomeworkObj).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: "添加作业成功",
                  type: "success"
                });
                this.handleSuccess();
              }
            });
          } else {
            console.log("error submit!!");
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
  computed: {
    scoreTotal() {
      let total = 0;
      this.homeWork.homeworkMarks.forEach(element => {
        total += Number(element.markScore);
      });
      if (total > 100) {
        this.overScore = true;
        this.normalScore = false;
      } else {
        this.overScore = false;
        this.normalScore = true;
      }
      return total;
    },
    leftScore() {
      return Math.abs(100 - this.scoreTotal);
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(this.routerType);
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

<style <style lang="stylus" scoped>
.box
  display flex
  align-items center
  justify-content space-between
  width 80%
  height 70px
  background rgb(248, 248, 248)
  border 1px solid rgb(220, 220, 220)
  margin 10px 0
  margin-right 10px  
  .pic_title
    display flex
    justify-content center 
    align-items center
    margin-left 10px
    & span
      margin-left 10px     
  .operate
    font-size:13px
    & span
      margin-right 10px
      cursor pointer
</style>
