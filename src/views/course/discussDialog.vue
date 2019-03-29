<template>
  <div class="warp">
    <div class="header">
      <span style="display:inline-block;margin: 5px 10px">
        <router-link :to="{path: '/course/list/discuss', query:{id: this.$route.query.id}}">讨论</router-link>> 讨论详情
      </span>
    </div>
    <div class="content">
      <div class="issue-title">
        标题： {{issueObj.discussionTitle}}
        <span
          @click="inputShow"
          style="font-size:12px;font-weight: normal;margin-left: 20px; cursor:pointer"
        >{{this.disscussInput === true ? '收起' : '评论'}}</span>
      </div>
      <div class="issue-info">
        <span>发布人：{{issueObj.userName}}</span>
        <span>阅读：{{issueObj.readerCount}}人</span>
        <span>发布日期：{{issueObj.createTime}}</span>
      </div>
      <div class="dis-content">
        <div class="discuss-warp" v-for="(item,index) in replyList.pageData" :key="index">
          <div class="answer">
            <div>
              <img :src="item.avatar" width="30" alt>
              <span style="margin-left: 10px">{{item.userName}}评论内容：{{item.replyContent}}</span>
              <span class="reply-btn" @click="replyToggle(replyList.pageData,item)">{{item.repInput === true ? '收起' : '回复'}}</span>
            </div>
            <div class="answer-right">
              <span>{{item.replyTime}}</span>
              <i
                class="el-icon-delete"
                style="color: green;font-size: 20px;margin-left: 10px; cursor: pointer"
              ></i>
            </div>
          </div>
          <div v-if="item.repInput === true">
            <el-form ref="form" :model="replyForm" label-width="120px" style="margin-top: 20px">
              <el-form-item label="回复内容：">
                <el-input style="width: 1000px" type="textarea" v-model="replyForm.replyContent"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" style="margin-left: 950px" @click="sendComment('lv2')">发送</el-button>
          </div>
          <div class="reply" v-for="(reply, i) in item.children" :key="reply.replyId">
            <div class="answer">
              <div style="margin-left: 20px">
              <template v-if="reply.parentReplyId === item.replyId">
                <img :src="reply.avatar" width="30" alt>
                <span
                  style="margin-left: 10px"
                  
                >{{reply.userName}}评论：{{reply.replyContent}}</span>
              </template>
              <template v-else>
                <img :src="reply.avatar" width="30" alt style="margin-left: 20px">
                <span
                style="margin-left: 10px"
                >{{reply.userName}}回复{{replyer(item.children, reply.parentReplyId)}}：{{reply.replyContent}}</span>
              </template>
              
              <span class="reply-btn" @click="replyToggle(item.children, reply)">{{reply.repInput === true ? '收起' : '回复'}}</span>
            </div>
            <div class="answer-right">
              <span>{{reply.replyTime}}</span>
              <i
                class="el-icon-delete"
                style="color: green;font-size: 20px;margin-left: 10px; cursor: pointer"
              ></i>
            </div>
            </div>
            <div v-if="reply.repInput === true">
            <el-form ref="form" :model="replyForm" label-width="120px" style="margin-top: 20px">
              <el-form-item label="回复内容：">
                <el-input style="width: 1000px" type="textarea" v-model="replyForm.replyContent"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" style="margin-left: 950px" @click="sendComment('lv3')">发送</el-button>
          </div>
          </div>
          
        </div>
      </div>
      <div v-if="disscussInput === true">
        <el-form ref="form" :model="replyForm" label-width="120px" style="margin-top: 20px">
          <el-form-item label="回复内容：">
            <el-input style="width: 1000px" type="textarea" v-model="replyForm.replyContent"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-left: 950px" @click="sendComment('lv1')">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { discussIssue, discussReply, discussPost } from "@/api/course";
import Cookie from 'js-cookie'
export default {
  name: "discussDialog",
  data() {
    return {
      issueObj: {},
      replyList: {},
      temParentLvId: '',
      temParentId: '',
      replyForm: {
        discussionId: this.$route.query.disId,
        isleaf: 0,
        levelonereplyId: 0,
        parentReplyId: this.$route.query.disId,
        replyContent: "",
        replyId: "",
        replyTime: "",
        userId: "",
        userName: Cookie.get('realName')
      },
      disscussInput: false
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
        response.data.pageData.forEach(element => {
          element.repInput = false
          if (element.children) {
            element.children.forEach(ele => {
              ele.repInput = false;
            });
          }
        });
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
    // 点击回复获取对象
    replyToggle(list, params) {
      // console.log(params)
      // let func = data =>{
      //   data.forEach(item=> {
      //     console.log(item.repInput)
      //     if(item.repInput === false) {
      //       if(item.replyId === params.replyId) {
              
      //         item.repInput = !item.repInput
      //       }
      //     }else{
      //       item.repInput = false
      //       if(item.children) {
      //         func(item.children)
      //       }
      //     }
      //   })
      // }
      // func(this.replyList.pageData);
      console.log(params)
      this.temParentId = params.replyId
      this.temParentLvId = params.levelonereplyId
      this.disscussInput = false
      // list.forEach(element=> {
      //   if(element.replyId === params.replyId) {
      //     element.repInput = !element.repInput
      //   }else{
      //     element.repInput = false
      //   }
      // })
      this.replyList.pageData.forEach(element=> {
        if(element.replyId === params.replyId) {
          element.repInput = !element.repInput
        }else{
          element.repInput = false
        }
        if(element.children) {
          element.children.forEach(ele => {
            if(ele.replyId === params.replyId) {
              ele.repInput = !ele.repInput
            }else{
              ele.repInput = false
            }
          });
        }
         
        
      })
    },
    // 发送评论
    sendComment(level) {
      if(level === 'lv2'){
        this.replyForm.parentReplyId = this.temParentId
        this.replyForm.levelonereplyId = this.temParentId
        console.log(this.replyForm)
      }else if(level === 'lv1'){
        this.replyForm.parentReplyId = this.$route.query.disId
        this.replyForm.levelonereplyId = 0
        this.replyForm.discussionId = this.$route.query.disId
      }else{
        this.replyForm.parentReplyId = this.temParentId
        this.replyForm.levelonereplyId = this.temParentLvId
      }
      discussPost(this.replyForm).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "评论成功",
            type: "success"
          });
          this.replyForm.replyContent = ''
          this.getReply();
        }
      });
    },
    inputShow() {
      this.disscussInput = !this.disscussInput;
      this.replyList.pageData.forEach((item)=> {
        console.log(item)
        this.$set(item, 'repInput', false)
        if(item.children) {
          item.children.forEach(element => {
            this.$set(element, 'repInput', false)
          });
        }
        // item.repInput = false
      })
      // console.log(this.disscussInput);
    }
  }
};
</script>

<style scoped lang="stylus" type="text/stylus">
.warp {
  width: 100%;
  height: 800px;
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

    .dis-content {
      height: 500px;overflow-x: auto
      
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
      cursor: pointer;
    }

    .answer:hover {
      background-color: #f3f7ff;
    }

    .answer:hover .reply-btn {
      display: inline-block;
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

    .reply-btn {
      display: none;
      margin-left: 20px;
      color: cadetblue;
      cursor: pointer;
    }
  }
}
.dis-content::-webkit-scrollbar {display:none }
.discuss-warp {
  padding: 15px 0;
  border-bottom: 1px solid rgb(216,216,216)
}
</style>