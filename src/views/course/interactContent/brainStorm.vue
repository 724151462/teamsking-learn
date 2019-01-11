<template>
  <div>
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '互动', query:{id: this.$route.query.id}}">互动</router-link>> 头脑风暴
    </span>
    <div>
      <el-input
        type="textarea"
        v-model="brainStorm.stormTitle"
        placeholder="请输入题目"
        style="width:600px;"
        autofocus="autofocus"
      />
      <div class="margin-sides">
        <i class="el-icon-picture"></i>
        <span>添加图片</span>
        <upOss @ossUp="getUrl"></upOss>
        <div>
          <img v-for="(item, index) in addImgList" :src="item" :width="50" :key="index" alt>
        </div>
      </div>
      <div class="margin-sides">标题</div>
      <el-input placeholder="请添加标题" v-model="brainStorm.stormDescribe" style="width:600px;"></el-input>
      <div class="margin-sides">
        <span>所属章</span>
      </div>
      <div class="margin-sides">
        <el-select v-model="brainStorm.chapterId">
          <el-option
            v-for="item in chapterList"
            :key="item.chapterId"
            :label="item.chapterName"
            :value="item.chapterId"
          ></el-option>
        </el-select>
      </div>
      <span style="color: red">提示：学生参与默认活动90分基础分</span>
    </div>
    <el-button @click="brainStormSave">保存</el-button>
  </div>
</template>

<script>
import upOss from "@/components/up-oss";
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
      brainStorm: {
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
      }
    };
  },
  mounted() {
    if(this.$route.query.operation === 'edit') {
      interactStorm({stormId: this.$route.query.interactId})
      .then(response=> {
        this.brainStorm = response.data
      })
    }
    chaptersListSimple({ courseId: this.$route.query.id }).then(response => {
      this.chapterList = response.data;
    })
  },
  methods: {
    getUrl(url, fileName) {
      console.log("资源链接：" + url);
      this.addImgList.push(url);
      this.asset.assetTitle = fileName;
      this.asset.assetUrl = url;
      assetCreate(this.asset).then(response => {
        this.brainStorm.assetIds.push(response.data.assetId);
      });
    },
    brainStormSave() {
      if(this.$route.query.operation === 'edit'){
        stormPut(this.brainStorm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "修改投票成功",
              type: "success"
            });
          }
        });
      }else{
        stormSave(this.brainStorm).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "成功",
            type: "success"
          });
        }
      });
      }
      
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$confirm('跳转将丢失未保存数据，是否跳转', '提示', {
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
