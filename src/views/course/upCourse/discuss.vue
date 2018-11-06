<template>
    <div class="discuss">
      <el-table
          :data="tableData"
          border
          style="width: 90%">
        <el-table-column
            v-for="list in tables"
            :key="list"
            :prop="list.prop"
            :label="list.name"
            :width="list.width">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <a style="margin-right: 20px;" @click="goReply(scope.row)">查看</a>
            <a>删除</a>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
          layout="prev, pager, next"
          @current-change="getList"
          :total="100">
      </el-pagination>

      <!--查看评论-->
      <el-dialog
        :visible.sync="isDiscuss"
        width="60%">
        <div class="discuss-dialog">
          <div class="title">{{dialogData.title}}</div>
          <div class="info">
            <span>发布者：{{dialogData.fbr}}</span>
            <span>阅读：90</span>
            <span>发布日期：{{dialogData.time}}</span>
          </div>
        </div>
        <div class="center">
          <div v-for="list in dialogInfo">
            <reply-lists :replyData="list"></reply-lists>
          </div>
        </div>
        <div>
          <el-input v-model="comments" placeholder="请输入内容" style="width: calc(100% - 100px);"></el-input>
          <el-button type="primary" style="width: 100px;">评论</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import replyLists from './upDiscuss/replyList.vue'
  export default {
    components:{
      replyLists
    },
    data(){
      return{
        tables:[
          {
            name:'序号',
            prop:'id',
            width:100
          },
          {
            name:'讨论标题',
            prop:'title',
            width:200
          },
          {
            name:'发布人',
            prop:'fbr',
            width:150
          },
          {
            name:'发布时间',
            prop:'time',
            width:200
          },
        ],
        tableData: [
          {
            id:'1',
            title:'套路1',
            fbr:'xxx谁',
            time:'2018-1-1'
          },
          {
            id:'1',
            title:'套路2',
            fbr:'xxx谁',
            time:'2018-1-1'
          },
          {
            id:'1',
            title:'套路3',
            fbr:'xxx谁',
            time:'2018-1-1'
          },
        ],
        isDiscuss:false,
        dialogData:{},
        dialogInfo:[
          {
            id:2,
            img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
            name:'A',
            center:'水水水水水水水',
            time:'2019-1-2',
            replyList:[
              {
                img:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2198746125,2255961738&fm=27&gp=0.jpg',
                name:'B',
                center:'233232323',
                time:'2019-2-2'
              }
            ]
          }
        ],
        comments:''
      }
    },
    created(){
      this.$emit('upCoursesNav','discuss')
    },
    methods:{
      getList(val) {
        console.log(`每页 ${val} 条`);
      },
      goReply(e){
        this.dialogData = e
        //这里进行一次请求后台数据，拿到回复的内容
        //回复内容数据 dialogInfo
        this.isDiscuss = true
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .discuss
    padding-top:20px

    .discuss-dialog
      .title
        font-size:18px
        padding-bottom:10px

      .info
        span
          font-size:14px
          color:#bbb2b2
          margin-right:30px

    .center
      height:500px
      margin-bottom: 10px
      overflow:auto
</style>