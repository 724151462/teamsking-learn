<template>
  <div class="model-checked">
    <div class="header">
      成员
      <div class="nav-search">
        <div style="display: flex">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="search">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn" size="small" @click="init(1,1,search)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="gary-mask">
      <span>未签到(1人)</span>
      <span style="float: right;">点击可变更状态</span>
    </div>
    <div>
      <div class="user-box" v-for="item in noCheck" :key="item.id">
        <div class="user-item" style="display: flex;justify-items: center;align-items: center">
          <div><img :src="item.avatar" alt="" class="user-avatar"></div>
          <div><span style="margin-left: 20px">{{item.realName}}</span></div>
        </div>
        <div class="user-item">{{item.studentNo}}</div>
        <div class="user-item">
          <el-tooltip class="item" effect="dark" content="" placement="bottom">
            <el-button slot="reference" size="small" type="warning" plain>缺勤</el-button>
          </el-tooltip>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px;text-align: right;margin-right: 40px;"
        background
        layout="prev, pager, next"
        :current-page="noCheckPage.currentPage"
        @current-change="noCheckChange"
        :total="noCheckPage.totalPage">
      </el-pagination>
    </div>
    <div class="gary-mask">
      <div>已签到(37人)</div>
    </div>
    <div>
      <div class="user-box" v-for="item in noCheck" :key="item.id">
        <div class="user-item" style="display: flex;justify-items: center;align-items: center">
          <div><img :src="item.avatar" alt="" class="user-avatar"></div>
          <div><span style="margin-left: 20px">{{item.realName}}</span></div>
        </div>
        <div class="user-item">{{item.studentNo}}</div>
        <div class="user-item">
          <!--<el-tooltip class="item" effect="dark" content="点面更换状态为‘’" placement="bottom">-->
            <!--<el-button slot="reference" size="small" type="warning" plain>正常</el-button>-->
          <!--</el-tooltip>-->
          <el-button size="small" type="info" plain>正常</el-button>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px;text-align: right;margin-right: 40px;"
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
  import {signList} from '@/api/course'
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
          signId : 154,
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
          }else{
            this.$message.error('获取签到数据失败')
          }
        })
      },
      noInit(pageNum,searchKey){
        let key = searchKey || ''
        let data = {
          signId : 154,
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
            this.noCheckPage.totalPage =res.data.pageIndex
            this.noCheckPage.currentPage = res.data.totalPage * 10
          }else{
            this.$message.error('获取签到数据失败')
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
        width 250px
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