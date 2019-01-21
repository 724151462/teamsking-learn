<template>
  <div class="userMessage">
    <el-tabs v-model="activeName" @tab-click="toIndex">
      <el-tab-pane label="个人设置" name="first"></el-tab-pane>
      <el-tab-pane label="消息管理" name="second">
        <el-checkbox v-model="checkAll"
                     :indeterminate="isIndeterminate"
                     @change="checkAllChange"></el-checkbox>
        <el-button type="primary" size="small"  style="margin-left: 20px;" @click="readAll">标记已读</el-button>
        <el-button size="small" @click ="del">删除</el-button>
        <div style="margin: 15px 0;"></div>
        <div>
          <div v-for="(message) in messageData" :key="message.id" class="message-item">
            <div style="padding-right: 20px">
              <el-checkbox v-model="message.selected" @change="checkChange(message.userMessageId, $event)"></el-checkbox>
            </div>
            <div style="padding-right: 20px">
              <el-tag type="success" size="small" v-if="message.messageType  == 10">系统通知</el-tag>
              <el-tag type="success" size="small" v-else-if="message.messageType  == 20 ">学校通知</el-tag>
              <el-tag type="success" size="small" v-else-if="message.messageType  == 30">课程通知</el-tag>
            </div>
            <div style="cursor:pointer" @click="read(message.userMessageId,message)">
              <p :class="{markread: message.status == 10 }">
                <span class="red-c" v-show="message.status != 10"></span>{{message.title}}
              </p>
              <p class="message-time">{{message.publishTime}}</p>
            </div>
          </div>
          <el-pagination
            style="margin-top: 20px"
            background
            layout="prev, pager, next"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :total="totalPage">
          </el-pagination>

          <!--<el-pagination-->
            <!--background-->
            <!--layout="prev, pager, next"-->
            <!--:page-size="tableData.pageSize"-->
            <!--:page-count="tableData.totalPage"-->
            <!--:current-page="tableData.pageIndex"-->
            <!--@current-change="handleCurrentChange">-->
          <!--</el-pagination>-->
        </div>

        <!--查看消息对话框-->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="50%">
          <div>
            <span style="margin-right: 20px">
              <!--<el-tag type="success" size="small">{{messageData[currentMessage].type}}</el-tag>-->
              <el-tag type="success" size="small" v-if="dialogInfo.messageType  == 10">系统通知</el-tag>
              <el-tag type="success" size="small" v-else-if="dialogInfo.messageType  == 20 ">学校通知</el-tag>
              <el-tag type="success" size="small" v-else-if="dialogInfo.messageType  == 30">课程通知</el-tag>
            </span>
            {{dialogInfo.title}}
          </div>
          <div style="margin-top: 20px">
            {{dialogInfo.content}}
          </div>
          <span slot="footer" class="dialog-footer">
            <span class="markread">{{dialogInfo.publishTime}}</span>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="我的证书" name="third"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {getMsg, readMsg, delMsg} from '@/api/user'
export default {
    name: "message",
    data() {
      return {
        activeName: 'second',
        dialogVisible: false, //消息框的显隐
        currentMessage: 0, //当前被点击的消息的Index,用于弹窗的取值
        checkAll: false,
        messageData: [
          {
            content: "特委屈让我去让我去热武器若",
            messageId: 70,
            messageType: 30,
            orderValue: null,
            publishTime: "2019-01-17 18:56:11",
            readCount: 0,
            selected: false,
            status: 20,
            title: "日网签任务特委屈认为其他",
            totalCount: 39,
            userMessageId: 15276,
         }
        ],
        //10 系统通知 20:学校通知 30:课程通知
        message: 3, //所有消息数量
        checkedMessage: [], //被选中的
        isIndeterminate: false,
        totalPage:10,
        dialogInfo:{},//消息弹窗的信息
        currentPage:1,
      };
    },
    created() {
      this.initList(1);
    },
    methods: {
      //全选
      checkAllChange(e) {
        this.checkAll = e
        this.checkedMessage = []
        this.messageData.forEach((item) => {
          item.selected = e
          e ? this.checkedMessage.push(item.userMessageId) : this.checkedMessage = []
        })
      },
      //获取消息列表
      initList(pageIndex){
        let data = {pageIndex}
        let loading = this.$loading(this.loadingCss)
        getMsg(data).then(res => {
          loading.close()
          console.log(res)
          if (Number(res.code) === 200) {
            let data = res.data.pageData.forEach(item=>{
              item.selected = false
            })
            this.messageData = res.data.pageData
            this.totalPage = res.data.totalPage*10
          } else {
            this.$message.error('消息获取失败');
          }
        })
      },
      // 单个消息被选中
      checkChange(messageId, $event) {
        // this.messageData[messageIndex].selected = $event
        //  检查当前项是否在被选数组
        // let cuerrentId = this.messageData[messageIndex].messageId
        let isCheck = this.checkedMessage.find((n) => n === messageId)
        let cuerrentIndex = this.checkedMessage.indexOf(messageId);  //需要被删除的项的index
        isCheck ? this.checkedMessage.splice(cuerrentIndex, 1) : this.checkedMessage.push(messageId)
        //  全选检查
        this.checkAll = this.checkedMessage.length === this.messageData.length
      },
      // 跳往首页
      toIndex() {
        this.activeName === 'first' ? this.$router.push('index') : this.$router.push('certificate')
      },
      //全部标记为已读
      readAll() {
        readMsg(this.checkedMessage).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            this.initList()
          } else {
            this.$message.error('读取消息失败');
          }
        })
      },
      //消息设为已读
      read(messageId,message) {
        let data = [messageId]
        console.log(data)
        this.dialogInfo = message
        readMsg(data).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {

            getMsg().then(res => {
              if (Number(res.code) === 200) {
                let data = res.data.pageData.forEach(item=>{
                  item.selected = false
                })
                this.messageData = res.data.pageData
                this.totalPage = res.data.totalPage*10

                this.dialogVisible = true //打开消息弹窗
              } else {
              }
            })
          } else {
            this.$message.error('读取消息失败');
          }
        })
      },
      //分页页码改变
      handleCurrentChange(number){
        this.initList(number)
      },
      del(){
        delMsg(this.checkedMessage).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            this.$message.success('删除成功');
            this.initList()
          } else {
            this.$message.error('删除失败');
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  $c-gray = #c0c4cc
  .userMessage
    .message-item
      height 50px
      display flex
      align-items center
      padding-bottom 10px;
      padding-top 10px;
      border-bottom 2px solid $c-gray
    .red-c
      display inline-block
      width: 10px
      height 10px
      background-color red
      border-radius 50%
    .message-time
      margin-left: 17px;
      font-size: 13px;
      margin-top: 5px;
      color $c-gray
    .markread
      color $c-gray
</style>