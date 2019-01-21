<template>
  <div>
    <el-container>
      <modelAside
        @dialogShow="dialogShow"
        :sourceList="voteList"
        :textObj="textObj"
        :dataKey="dataKey"
        @activeEvent="activeVote"
        @beginEvent="beginVote"
      ></modelAside>
      <el-main>
        <div v-if="voteObj === ''">
            <span>请选择或添加投票</span>
        </div>
        <div v-else>
            
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { voteList } from "@/api/course";

import modelAside from "@/components/modelAside";
export default {
  data() {
    return {
      textObj: {
        addBtn: "添加投票",
        interactItemBtn: "开始活动"
      },
      dataKey: {
        itemId: "voteId",
        itemTitle: "voteTitle"
      },
      dialogShow: false,
      addVoteParams: {
        classroomId: this.$route.query.classroomId,
        courseId: this.$route.query.id
      },
      voteList: [
        {
          voteId: 1,
          voteTitle: "测试投票"
        }
      ],

      voteObj: "",
    };
  },
  created() {
    Cookie.set("modelActive", "4");
    this.getVoteList();
  },
  methods: {
    getVoteList() {
      voteList(this.addVoteParams).then(response => {
        //   this.voteList = response.data
      });
    },
    // 点击获取测试
    activeVote(item) {},
    beginVote() {}
  },
  components: {
    modelAside
  }
};
</script>

<style lang="stylus" scoped>
.el-main 
  padding-left 300px


</style>

