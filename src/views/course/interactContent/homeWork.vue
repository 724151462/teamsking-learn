<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 作业/小组任务
    </span>
    <div>
      <span>题目</span>
      <div style="margin-top:10px">
        <el-input
          type="textarea"
          v-model="homeWork.describe"
          placeholder="请输入题目"
          style="width:600px;"
          autofocus="autofocus"
        />
      </div>
      
      <div class="margin-sides">
        <upOss @ossUp="getUrl" :btnText="'添加附件'"></upOss>
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
      <div class="margin-sides">
        <span>所属章</span>
        <div>
          <el-select v-model="homeWork.chapterId">
            <el-option
              v-for="item in chapterList"
              :key="item.chapterId"
              :label="item.chapterName"
              :value="item.chapterId"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="margin-sides">
        <div style="margin-top: 20px">
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
            <span>占作业分值 {{item.markScore+'%'}}</span>
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
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
import upOss from "@/components/up-oss";
import Cookie from 'js-cookie'
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
        schemeId: "",
        routerType: 'cancel'
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
      response.data.unshift({schemeId: null, schemeName: '不划分小组'})
      this.groupList = response.data;
    });
    if (this.$route.query.operation === "edit") {
      homeWorkDetail({ homeworkId: this.$route.query.interactId }).then(
        response => {
          this.homeWork = response.data;
          let assetArr = []
          this.homeWork.assets.forEach(element => {
            assetArr.push(element.assetId)
          });
          this.homeWork.assets = assetArr
          console.log(this.homeWork.assets)
        }
      );
    }
    this.preventBack()
  },
  methods: {
    preventBack() {
      history.pushState(null, null, document.URL); 
      window.addEventListener('popstate', function() { 
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
      console.log("资源链接：" + url);
      this.addImgList.push(url);
      this.asset.assetTitle = fileName;
      this.asset.assetUrl = url;
      assetCreate(this.asset).then(response => {
        this.homeWork.assets.push(response.data.assetId);
        console.log("asset", this.homeWork);
      });
    },
    handleSuccess() {
      this.routerType = 'success'
      let chapterArr = JSON.parse(localStorage.getItem('localInteractId'))
      Cookie.set('interactionStatus', "10")
      let index = ''
      let findFlag = chapterArr.some((element, i)=> {
        if(element === this.homeWork.chapterId) {
          index = i
        }
      })
      if(index !== '') {
        Cookie.set('interactActiveIndex', index)
      }else{
        Cookie.set('interactActiveIndex', chapterArr.length)
      }
      this.$router.push({path:"/course/list/interact",query: {id: this.$route.query.id}})
    },
    hwSave() {
      if (this.$route.query.operation === "edit") {
        homeworkPut(this.homeWork).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "修改作业成功",
              type: "success"
            });
            this.handleSuccess()
          }
        });
      } else {
        homeWorkSave(this.homeWork).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "添加作业成功",
              type: "success"
            });
            this.handleSuccess()
          }
        });
      }
    },
    // 取消
    cancel() {
      this.routerType = "cancel"
      this.$router.push({path:"/course/list/interact",query: {id: this.$route.query.id}})
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
  beforeRouteLeave (to, from, next) {
    let msg = '跳转将丢失未保存数据，是否跳转'
    if(this.routerType === 'cancel') {
      msg = '跳转将丢失未保存数据，是否跳转'
    }else {
      msg = '添加成功，是否跳活动转列表页'
    }
    this.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {      
    });
  },
  components: { upOss }
};
</script>

<style>
</style>
