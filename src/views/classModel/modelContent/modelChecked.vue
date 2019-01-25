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
            <el-button icon="el-icon-search" class="search-btn" size="small" @click="getResource(0,0,search)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="gary-mask">
      <span>未签到(1人)</span>
      <span style="float: right;">点击可变更状态</span>
    </div>
    <div class="user-box">
      <div class="user-item" style="display: flex;justify-items: center;align-items: center">
        <div><img :src="require('@/assets/images/pdf.png')" alt="" class="user-avatar"></div>
        <div><span style="margin-left: 20px">李某人</span></div>
      </div>
      <div class="user-item">898989898</div>
      <div class="user-item">
        <!--<el-popover-->
          <!--placement="bottom"-->
          <!--width="100"-->
          <!--trigger="click">-->
          <!--<el-table :data="gridData">-->
            <!--<el-table-column width="150" property="date" label="日期"></el-table-column>-->
            <!--<el-table-column width="100" property="name" label="姓名"></el-table-column>-->
            <!--<el-table-column width="300" property="address" label="地址"></el-table-column>-->
          <!--</el-table>-->
          <!--<el-button size="small" slot="reference">click 激活</el-button>-->
        <!--</el-popover>-->
        <el-button size="small" slot="reference">缺勤</el-button>
      </div>
    </div>

    <div class="gary-mask">
      <div>已签到(37人)</div>
    </div>
  </div>
</template>

<script>
  import {signList} from '@/api/course'
  export default {
    name: "modelChecked",
    data(){
      return {
        search:''
      }
    },
    created(){
      this.init()
    },
    methods:{
      init(pageNum){
        let page = pageNum || 1
        let data = {
          signId : 154,
          data:{
            pageParam: {
              pageIndex: page,
              pageSize: 10
            }
          }
        }
        let loading = this.$loading(this.loadingCss)
        signList(data).then(res=>{
          loading.close()
          if(Number(res.code) === 200){
            console.log(res)
          }else{
            this.$message.error('获取签到数据失败')
          }
        }).catch(error=>{
          console.log(error)
        })
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