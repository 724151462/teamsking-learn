<template>
  <div class="warp">
    <div class="header">
      <span style="display:inline-block;margin: 5px 10px">
        <router-link :to="{path: '/course/list/discuss', query:{id: this.$route.query.id}}">讨论</router-link>> 讨论详情
      </span>
    </div>
    <div class="content">
      <div class="issue-title">标题： {{issueObj.discussionTitle}}</div>
      <div class="issue-info">
        <span>发布人：{{issueObj.userName}}</span>
        <span>阅读：{{issueObj.readerCount}}人</span>
        <span>发布日期：{{issueObj.createTime}}</span>
      </div>
      <div style="height: 350px;">
        <div class="discuss-warp" v-for="(item,index) in replyList.pageData" :key="index">
          <div class="answer">
            <div>
              <img :src="item.avatar" width="30" alt>
              <span style="margin-left: 10px">{{item.userName}}评论内容：{{item.replyContent}}</span>
            </div>
            <div class="answer-right">
              <span>{{item.replyTime}}</span>
              <i
                class="el-icon-delete"
                style="color: green;font-size: 20px;margin-left: 10px; cursor: pointer"
              ></i>
            </div>
          </div>
          <div class="answer reply" v-for="(reply, i) in item.children" :key="reply.replyId">
            <div>
              <img :src="reply.avatar" width="30" alt>
              <span
                style="margin-left: 10px"
                v-if="reply.parentReplyId === item.replyId"
              >{{reply.userName}}：{{reply.replyContent}}</span>
              <span
                style="margin-left: 10px"
                v-else
              >{{reply.userName}}回复{{replyer(item.children, reply.parentReplyId)}}：{{reply.replyContent}}</span>
            </div>
            <div class="answer-right">
              <span>2019-1-18 00:00:00</span>
              <i
                class="el-icon-delete"
                style="color: green;font-size: 20px;margin-left: 10px; cursor: pointer"
                v-show="show"
                 @mouseenter="show = false" @mouseleave="show = true"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-form ref="form" :model="replyForm" label-width="120px" style="margin-top: 20px">
          <el-form-item label="回复内容：">
            <el-input style="width: 1000px" type="textarea" v-model="replyForm.replyContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left: 950px" @click="sendComment">
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { discussIssue, discussReply, discussPost } from "@/api/course";
export default {
  name: "discussDialog",
  data() {
    return {
      issueObj: {},
      replyList: {},
      show: true,
      replyForm: {
        "discussionId": this.$route.query.disId,
        "isleaf": 0,
        "levelonereplyId": 0,
        "parentReplyId": this.$route.query.disId,
        "replyContent": "",
        "replyId": "",
        "replyTime": "",
        "userId": "",
        "userName": "wjx"
      }
    };
  },
  mounted() {
    this.getIssue();
    this.getReply();
  },
  methods: {
    getIssue() {
      discussIssue({ discussId: this.$route.query.disId }).then(response => {
        this.issueObj = response.data;
      });
    },
    getReply() {
      discussReply({ discussId: this.$route.query.disId }).then(response => {
        this.replyList = response.data;
        console.log(this.replyList);
      });
    },
    replyer(list, pid) {
      console.log("adf", list, pid);
      let userName = list.filter(element => {
        if (element.replyId === pid) {
          return element.userName;
        }
      });
      return userName[0].userName;
    },
    // 发送评论
    sendComment() {
      discussPost(this.replyForm)
      .then(response=> {
        if(response.code === 200) {
          this.$message({
            message: '评论成功',
            type: 'success'
          })
          this.getReply()
        }
      })
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.warp {
  width: 100%;
  height 700px
  margin: 0 auto;
  border: 1px solid;
  border-radius: 5px;

  .header {
    color: #fff;
    height: 50px;
    background: rgba(0, 0, 0, 0.6);
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    line-height: 50px;

    .back {
      cursor: pointer;
      margin-right: 30px;
    }
  }

  .content {
    padding: 20px 55px;

    .issue-title {
      font-size: 20px;
      font-weight: bold;
      font-family: '微软雅黑';
    }

    .issue-info {
      margin-top: 10px;
      color: rgb(154, 154, 154);

      span {
        margin-right: 20px;
      }
    }

    .answer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    .answer> div {
      display: flex;
      align-items: center;

      .answer-right {
        width: 200px;
      }
    }

    .reply {
      margin-left: 20px;
    }
  }
}

.discuss-warp {
  margin-bottom: 30px;
}
</style>