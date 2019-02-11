<template>
  <div class="model-checked">
    <div class="header">
      成员
      <div class="nav-search">
        <div style="display: flex">
          <el-input
            placeholder="输入学号/名字查询"
            v-model="search">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn" size="small" @click="init(1,1,search)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="gary-mask">
      <span>未签到({{this.noCheck.length}}人)</span>
      <!--<span style="float: right;">点击可变更状态</span>-->
    </div>
    <div>
      <div v-show="noCheck.length == 0" style="text-align: center">暂无数据</div>
      <div class="user-box" v-for="item in noCheck" :key="item.id">
        <div class="user-item" style="display: flex;justify-items: center;align-items: center">
          <div><img :src="item.avatar" alt="" class="user-avatar"></div>
          <div><span style="margin-left: 20px">{{item.realName}}</span></div>
        </div>
        <div class="user-item">{{item.studentNo}}</div>
        <div class="user-item">
          <el-tooltip class="item" effect="dark" content="点击可变更状态为正常" placement="bottom">
            <el-button size="small" type="warning" plain @click="signChange(item)">缺勤</el-button>
          </el-tooltip>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px;text-align: center;margin-right: 40px;"
        background
        layout="prev, pager, next"
        :current-page="noCheckPage.currentPage"
        @current-change="noCheckChange"
        :total="noCheckPage.totalPage">
      </el-pagination>
    </div>
    <div class="gary-mask">
      <div>已签到({{this.yesCheck.length}}人)</div>
    </div>
    <div>
      <div v-show="yesCheck.length == 0" style="text-align: center">暂无数据</div>
      <div class="user-box" v-for="item in yesCheck" :key="item.id">
        <div class="user-item" style="display: flex;justify-items: center;align-items: center">
          <div><img :src="item.avatar" alt="" class="user-avatar"></div>
          <div><span style="margin-left: 20px">{{item.realName}}</span></div>
        </div>
        <div class="user-item">{{item.studentNo}}</div>
        <div class="user-item">
          <el-button size="small" type="info" plain>正常</el-button>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px;text-align: center;margin-right: 40px;"
        background
        layout="prev, pager, next"
        :current-page="checkPage.currentPage"
        @current-change="checkChange"
        :total="checkPage.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {signList,changeSign} from '@/api/course'
  export default {
    name: "modelChecked",
    data(){
      return {
        search:'',
        yesCheck:[],
        noCheck:[],
        noCheckPage:{
          totalPage:1,
          currentPage:1,
        },
        checkPage:{
          totalPage:1,
          currentPage:1,
        }
      }
    },
    created(){
      this.init(1)
      this.noInit(1)
    },
    methods:{
      init(pageNum,searchKey){
        let key = searchKey || ''
        let data = {
          signId : sessionStorage.getItem('signId'),
          data:{
            pageParam: {
              pageIndex: pageNum,
              pageSize: 10
            },
            searchKey:key,
            type:1,
          }
        }
        signList(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200){
            this.yesCheck = res.data.pageData
            this.noCheckPage.currentPage =res.data.pageIndex
            this.noCheckPage.totalPage = res.data.totalPage * 10
          }else{
            this.$message.error('获取签到数据失败')
          }
        })
      },
      noInit(pageNum,searchKey){
        let key = searchKey || ''
        let data = {
          signId : sessionStorage.getItem('signId'),
          data:{
            pageParam: {
              pageIndex: pageNum,
              pageSize: 5
            },
            searchKey:key,
            type:2,
          }
        }
        signList(data).then(res=>{
          console.log(res)
          if(Number(res.code) === 200){
            this.noCheck = res.data.pageData
            this.noCheckPage.currentPage =res.data.pageIndex
            this.noCheckPage.totalPage = res.data.totalPage * 10
          }else{
            this.$message.error('获取签到数据失败')
          }
        })
      },
      signChange(item){
        console.log(item)
        let data = {
          "signId": item.signId,
          "signStatus": 1,
          "userId": item.userId
        }
        changeSign(data).then((res)=>{
          console.log(res)
          if(Number(res.code) === 200){
            this.init(1)
            this.noInit(1)
          }else{
            this.$message({
              message:'更改状态失败',
              type:'error'
            })
          }
        })
      },
      noCheckChange(page){
        this.noInit(page)
      },
      checkChange(page){
        this.init(page)
      },
    },
  }
</script>

<style scoped lang="stylus" type="text/stylus" >
  .model-checked
    .gary-mask
      background #ccc
      padding 10px 20px
    .header
      padding 10px 0
      padding-left 20px;
      overflow hidden
      .nav-search
        float right
        width 300px
        padding-right 20px;
        .search-btn
          border-left 0
          background-color #fff
          border-radius 4px
    .user-box
      margin 10px 0;
      /*border-bottom 1px solid #ccc*/
      display flex
      justify-items center
      align-items center
      .user-item
        flex 1
        padding-left 10%
        .user-avatar
          width: 40px;
          height 40px
          border-radius 50%
</style>