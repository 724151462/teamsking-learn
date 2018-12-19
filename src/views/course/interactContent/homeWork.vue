<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动'}">互动</router-link>> 作业/小组任务
    </span>
    <div>
      <el-input
        type="textarea"
        v-model="homeWork.describe"
        placeholder="请输入题目"
        style="width:600px;"
        autofocus="autofocus"
      />
      <div class="margin-sides">
        <i class="el-icon-picture"></i>
        <span>添加图片</span>
        <upOss @ossUp="getUrl"></upOss>
      </div>
      <div>
        <span>标题</span>
        <div>
          <el-input
            class="margin-sides"
            placeholder="请添加标题"
            style="width:600px;"
            v-model="homeWork.title"
          ></el-input>
        </div>
      </div>
      <div>
        <span>所属章节</span>
        <div>
          <el-select class="margin-sides" v-model="homeWork.chapterId">
            <el-option
              v-for="item in chapterList"
              :key="item.chapterId"
              :label="item.chapterName"
              :value="item.chapterId"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div>
        <div>
          <div>任务小组划分方式：学生以小组为单位完成此活动，并按小组提交结果</div>
        </div>
      </div>
      <div>
        <el-select class="margin-sides" v-model="homeWork.schemeId">
          <el-option
            v-for="(group,index) in groupList"
            :key="index"
            :label="group.schemeName"
            :value="group.schemeId"
          ></el-option>
        </el-select>
        <span style="margin-left:100px">提交截止</span>
        <el-input type="text" v-model="homeWork.pubTime" size="small" style="width: 60px;"></el-input>天后公布成绩
      </div>
      <div>
        <span>设置评分点（评分标准，助教评分可参考）</span>
        <span v-if="normalScore">已分配{{scoreTotal}}分，还可分配{{leftScore}}分</span>
        <span v-if="overScore" style="color: red">已超出{{leftScore}}分</span>
        <div class="margin-sides" style="margin-left: 0">
          <el-button @click="addScorePoint">+添加评分点</el-button>
          <div v-for="(item, index) in homeWork.homeworkMarks" :key="index" class="margin-sides">
            <el-input v-model="item.markPoint" style="width: 400px" placeholder="输入评分点内容"></el-input>
            <el-input v-model="item.markScore" style="width: 60px;margin-left:20px"></el-input>分
            <span>占作业分值 {{item.score+'%'}}</span>
            <span class="delBtn" @click="delScorePoint(index)">删除</span>
          </div>
        </div>
        <el-checkbox
          v-model="homeWork.markType"
          class="margin-sides"
          :true-label="20"
          :false-label="10"
        >允许助教评分</el-checkbox>
      </div>
      <div>
        <span>参考答案</span>
        <el-input type="textarea" v-model="homeWork.answer"></el-input>
      </div>
    </div>
    <el-button @click="hwSave">保存</el-button>
  </div>
</template>

<script>
import upOss from "@/components/up-oss";
import {
  assetCreate,
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
        homeworkMarks: [],
        schemeId: ""
      },
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
        assetType: 20,
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
      this.groupList = response.data;
    });
  },
  methods: {
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
      console.log("资源链接：" + url);
      this.addImgList.push(url);
      this.asset.assetTitle = fileName;
      this.asset.assetUrl = url;
      assetCreate(this.asset).then(response => {
        this.homeWork.assets.push(response.data.assetId);
        console.log("asset", this.homeWork);
      });
    },
    hwSave() {
      homeWorkSave(this.homeWork).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "成功",
            type: "success"
          });
        }
      });
    }
  },
  computed: {
    scoreTotal() {
      let total = 0;
      this.homeWork.homeworkMarks.forEach(element => {
        total += Number(element.score);
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
  components: { upOss }
};
</script>

<style>
</style>
