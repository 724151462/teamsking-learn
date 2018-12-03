<template>
  <div class="userMessage">
    <el-tabs v-model="activeName" @tab-click="toIndex">
      <el-tab-pane label="个人设置" name="first"></el-tab-pane>
      <el-tab-pane label="消息管理" name="second">
        <el-checkbox v-model="checkAll" @change="checkAllChange"></el-checkbox>
        <el-button type="primary" size="small" style="margin-left: 20px;">标记已读</el-button>
        <el-button size="small">删除</el-button>
        <div style="margin: 15px 0;"></div>
        <div>
          <div v-for="(message, messageIndex) in messageData" :key="message.id" class="message-item">
            <div style="padding-right: 20px">
              <el-checkbox v-model="message.selected" @change="checkChange(messageIndex, $event)"></el-checkbox>
            </div>
            <div style="padding-right: 20px">
              <el-tag type="success" size="small">{{message.type}}</el-tag>
            </div>
            <div style="cursor:pointer" @click="read(messageIndex)">
              <p :class="{markread: message.isReady}"><span class="red-c" v-show="!message.isReady"></span>{{message.title}}
              </p>
              <p class="message-time">{{message.time}}</p>
            </div>
          </div>
        </div>

        <!--查看消息对话框-->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="50%">
          <div>
            <span style="margin-right: 20px"><el-tag type="success" size="small">{{messageData[currentMessage].type}}</el-tag></span>
            {{messageData[currentMessage].title}}
          </div>
          <div style="margin-top: 20px">
            《计算机科学1》成绩已公布,请同学们查看，如有疑问，联系老师。
          </div>
          <span slot="footer" class="dialog-footer">
            <span class="markread">{{messageData[currentMessage].time}}</span>
          </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
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
            type: '课程公告',
            title: '《计算机科学1》成绩已公布',
            isReady: false,
            time: '2016.12.15 10.05.56',
            selected: false,
            messageId: 1
          },
          {
            type: '课程公告',
            title: '《计算机科学2》成绩已公布',
            isReady: false,
            time: '2016.12.15 10.05.56',
            selected: false,
            messageId: 2
          },
          {
            type: '课程公告',
            title: '《城市交通轨道规划》开课啦',
            isReady: true,
            time: '2016.12.15 10.05.56',
            selected: false,
            messageId: 3
          }
        ],
        message: 3, //所有消息数量
        checkedMessage: [], //被选中的
        isIndeterminate: false
      };
    },
    methods: {
      //全选
      checkAllChange(e) {
        this.checkAll = e
        this.checkedMessage = []
        this.messageData.forEach((item) => {
          item.selected = e
          e ? this.checkedMessage.push(item.messageId) : this.checkedMessage = []
        })
      },
      // 单个消息被选中
      checkChange(messageIndex, $event) {
        this.messageData[messageIndex].selected = $event
        //检查当前项是否在被选数组
        let cuerrentId = this.messageData[messageIndex].messageId
        let isCheck = this.checkedMessage.find((n) => n === cuerrentId)
        let cuerrentIndex = this.checkedMessage.indexOf(cuerrentId);  //需要被删除的项的index
        isCheck ? this.checkedMessage.splice(cuerrentIndex, 1) : this.checkedMessage.push(cuerrentId)
        //  全选检查
        this.checkAll = this.checkedMessage.length === this.messageData.length
      },
      // 跳往首页
      toIndex() {
        this.activeName === 'first' ? this.$router.push('index') : false
      },
      //消息设为已读
      read(messageIndex) {
        this.dialogVisible = true
        this.currentMessage = messageIndex
        this.messageData[messageIndex].isReady = true
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
      padding-bottom 20px;
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