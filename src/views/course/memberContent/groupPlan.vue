<template>
  <div class="groupPlan">
    <span style="display:inline-block;margin: 10px 0">
      <router-link :to="{name: '成员'}">成员</router-link>> 成员小组方案
    </span>
    <div class="nav">
      <el-button type="primary" @click="addPlan = true">+ 手动分组</el-button>
      <el-button type="primary" @click="isAddFa = true">+ 随机分组</el-button>
    </div>
    <div class="center">
      <div class="list" v-for="item in schemeList" :key="item.schemeId">
        <div class="title">{{item.schemeName}}</div>
        <div class="bottom">
          <span
            class="left"
          >{{item.userCount | coutFilter}}人已被划分为小组，划分为{{item.teamCount | coutFilter}}个小组</span>
          <span class="right">
            <i class="el-icon-tickets">详情</i>
            <i class="el-icon-document" @click="sechemeCopy(item)">复制</i>
            <i class="el-icon-edit" @click="editPlan(item)">编辑</i>
            <i class="el-icon-delete" @click="sechemeDelete(item)">删除</i>
          </span>
        </div>
      </div>
    </div>
    <el-dialog width="40%" title="添加方案" :visible.sync="addPlan">
      <el-form>
        <el-form-item label="小组方案名称" required>
          <el-input v-model="groupPlan.schemeName"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <el-button @click="addPlan = false">取消</el-button>
        <el-button type="primary" @click="ensureAddPlan">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="60%" title="添加成员小组方案" :visible.sync="isAddFa" append-to-body>
      <el-form :model="groupInfo" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="小组方案名称" required>
          <el-input v-model="groupInfo.schemeName" style="width: 220px;"></el-input>
        </el-form-item>

        <!-- <el-form-item label="分组上限" required>
          <el-input v-model="addGroup.sx" style="width: 220px;"></el-input>
        </el-form-item>-->
        <div class="groupPlanLint" v-for="(item, index) in addGroup" :key="index">
          <div>{{item.userCount}}人为1小组</div>
          <div class="list">
            <div class="title">
              <!-- <span class="left">{{item.teamName}}</span> -->
              <input class="left" v-if="item.isNew === true" v-model="item.teamName" :autofocus="true"/>
              <span class="left" v-else>{{item.teamName}}</span>
              <span class="right" v-if="item.isNew === false">
                <i class="el-icon-edit" @click="teamEvent('modify', item)">改名</i>
                <i class="el-icon-delete" @click="delTeam(item)">删除</i>
              </span>
              <span class="right" v-else>
                <i class="el-icon-edit" @click="modifyTeamName(item)">确认</i>
                <i class="el-icon-delete" @click="item.isNew = false">取消</i>
              </span>
            </div>
            <div class="all-img-list">
              <template v-for="(member,i) in item.userList">
                <div class="img-list" :key="i">
                  <img style="width:112px" :src="member.avatar" class="img">
                </div>
                <span :key="member.userId" class="delMember" @click="delMember(member,item.teamId)">×</span>
              </template>
              <div class="add-img" @click="addMember(item)">+</div>
            </div>
          </div>
        </div>
        <div class="add">
          <el-button type="primary" @click="newGroup">添加组</el-button>
        </div>
        <div style="text-align: right;">
          <el-button @click="isAddFa = false">取消</el-button>
          <el-button type="primary" @click="groupNameModify">确定</el-button>
        </div>
      </el-form>

      <!--修改组名-->
      <el-dialog title="修改组名" :visible.sync="isUpGrouplan" width="40%" append-to-body>
        <el-form>
          <el-form-item label="修改组名">
            <el-input style="width: 220px;" v-model="groupInfo.teamName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isUpGrouplan = false">取 消</el-button>
          <el-button type="primary" @click="ensureTN()">确 定</el-button>
        </span>
      </el-dialog>

      <!--添加成员-->
      <el-dialog
        title="选择成员"
        :visible.sync="isAddGrouplan"
        width="50%"
        custom-class="select-member"
        append-to-body
      >
        <div class="search">
          <el-radio v-model="matchType" label="1" @change="memberType">全部成员</el-radio>
          <el-radio v-model="matchType" label="2" class="right" @change="memberType">未分配小组成员</el-radio>
          <el-input placeholder="请输入成员名称" style="width:220px"></el-input>
          <el-button type="primary">搜索</el-button>
        </div>
        <div class="all-member">
          <div class="member-list" v-for="(list, index) in showData" :key="index">
            <el-checkbox
              v-model="list.isCheck"
              :disabled="list.teamName === null ? false : true"
              @change="check(list)"
            >{{list.teamName}}</el-checkbox>
            <div class="imgs">
              <img :src="list.img">
            </div>
            <div class="right">
              <div>
                <span class="name">{{list.realName}}</span>
                <span class="sys" v-if="Number(list.assistantStatus) === 1">助教</span>
              </div>
              <div class="student">{{list.studentNo}}</div>
            </div>
          </div>
        </div>
        <div style="text-align: right">
          <el-button type="primary" @click="ensureMatch">已选择{{matchedList.length}}人，确认选择</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  memberList, 
  schemeAdd, 
  schemeList, 
  memberEditList,
  memberMatchList,
  memberMatch,
  teamNameAdd,
  teamNameModify,
  teamDelete,
  planNameModify,
  delGroupMember,
  groupDelete,
  groupCopy
} from '@/api/course'
export default {
  data(){
    return{
      courseId: '0608367675f54267aa6960fd0557cc1b',
      pageParmas: {
        pageSize:100
      },
      data:[
        {
          title:'小组方案1',
          folk:12, //人数
          group:1,  //组数
        },
        {
          title:'小组方案1',
          folk:12, //人数
          group:1,  //组数
        },
      ],
      teamNameOperaType: '',
      groupInfo:{
        courseId: '0608367675f54267aa6960fd0557cc1b',
        name:'',  //小组方案名称
        sx:'',    //分组上限
        
      },
      addGroup: [],
      schemeList: [],
      addPlan: false,
      groupPlan: {
        courseId: '0608367675f54267aa6960fd0557cc1b',
        schemeName: "",
        schemeType: 10,
      },
      // 匹配分配类型参数
      matchForm: {
        searchType: 1,
        searchName: '',
        schemeId: '',
        courseId: '0608367675f54267aa6960fd0557cc1b',
      },
      matchType:'1',  // 1 全部成员 2 未分配小组的成员
      isAddFa:false,
      isUpGrouplan:false,
      isAddGrouplan:false,
      sourceData: [
      ],
      showData: [],
      matchedList: []
    }
  },
  created() {
    schemeList(this.courseId)
    .then((response)=> {
      this.schemeList = response.data
    })
  },
  methods: {
    check(e){
      this.matchedList = this.showData.filter(element=> {
        return element.isCheck === true && element.teamName === null
      })
      console.log('mlist', this.matchedList)
    },
    // 添加方案名称
    ensureAddPlan() {
      schemeAdd(this.groupPlan)
      .then((response)=> {
        alert('添加成功')
      })
      this.addPlan = false
    },
    groupNameModify() {
      let data = {
        schemeId: this.groupInfo.schemeId,
        nameForm: {
          id: this.groupInfo.schemeId,
          name: this.groupInfo.schemeName
        }
      }
      planNameModify(data)
      .then(response=> {
        console.log(response.data)
      })
    },
    // 添加新小组
    newGroup() {
      this.addGroup.push({isNew: true, teamName: `小组${this.addGroup.length+1}`, userList: []})
    },
    // 点击编辑弹窗
    editPlan(item) {
      console.log(item)
      this.groupInfo.schemeId = item.schemeId
      this.groupInfo.schemeName = item.schemeName
      this.matchForm.schemeId = item.schemeId
      memberEditList(this.groupInfo)
      .then((response)=> {
        response.data.forEach(element => {
          element.isNew = false
        });
        this.addGroup = response.data
      })
      this.isAddFa = true
    },
    // 点击 +图片 按钮
    addMember(item) {
      console.log(this.matchType)
      console.log(item)
      this.groupInfo.teamId = item.teamId
      this.groupInfo.teamName = item.teamName
      this.matchForm.pageSize = 100
      memberMatchList(this.matchForm).then((response) =>{
        response.data.pageData.forEach(element => {
          element.isCheck = element.teamName === null ? false : true
        });
        this.sourceData = response.data.pageData
        this.showData = this.sourceData
      })
      this.isAddGrouplan = true
    },
    // radio选择改变
    memberType(val) {
      console.log(val)
      this.matchForm.searchType = val
      if(val === '2') {
        this.showData = this.sourceData.filter(element=> {
          return element.teamName === null
        })
      }else{
        this.showData = this.sourceData
      }
    },
    // 选完后确认
    ensureMatch() {
      console.log(this.matchedList)
      this.groupInfo.userList = this.matchedList
      this.groupInfo.courseId = '0608367675f54267aa6960fd0557cc1b'
      this.matchedList.forEach(element=> {
        element.teamName = this.groupInfo.teamName
      }) 
      this.groupInfo.userCount = this.matchedList.length

      memberMatch(this.groupInfo)
      .then(response=> {
        console.log(response.data)
      })
      // {
      //   "courseId": "string",
      //   "schemeId": 0,
      //   "teamId": 0,
      //   "teamName": "string",
      //   "userCount": 0,
      //   "userList": [
      //     {
      //       "assistantStatus": 0,
      //       "avatar": "string",
      //       "mobile": "string",
      //       "realName": "string",
      //       "studentNo": "string",
      //       "teamName": "string",
      //       "userId": 0
      //     }
      //   ]
      // }
      // memberMatch
    },
    // 修改组名
    teamEvent(...parmas) {
      
      this.teamNameOperaType = parmas[0]
      if(parmas.length>1) {
        this.groupInfo.teamId = parmas[1].teamId
      }else{
      }
      parmas[1].isNew = true
      this.groupInfo.teamName = parmas[1].teamName
      // console.log(this.groupInfo)
    },
    // 删除组
    delTeam(item) {
      this.groupInfo.teamId = item.teamId
      console.log(this.groupInfo)
      teamDelete(this.groupInfo)
      .then(response=> {
        console.log(response.data)
      })
    },
    // 删除成员
    delMember(item,teamId) {
      console.log(item)
      let data = {
        teamId: teamId,
        userId: item.userId
      }
      console.log(data)
      delGroupMember(data)
      .then(response=> {
        console.log(response.data)
      })
    },
    // 删除方案
    sechemeDelete(item) {
      groupDelete(item)
      .then(response=> {
        console.log(response)
      })
    },
    // 复制方案
    sechemeCopy(item) {
      groupCopy(item)
      .then(response=> {
        console.log(response)
      })
    },
    modifyTeamName(item) {
      this.groupInfo.teamName = item.teamName
      teamNameModify(this.groupInfo)
      .then(response=> {
        console.log(response.data)
        item.isNew = false
      })
    },
    ensureTN() {
      console.log(this.teamNameOperaType)
       if(this.teamNameOperaType === 'add'){
        this.groupInfo.courseTeam = 542
        console.log(this.groupInfo)
        teamNameAdd(this.groupInfo)
      }else(
        teamNameModify(this.groupInfo)
        .then(response=> {
          console.log(response.data)
        })
      )
    }
  },
  filters: {
    coutFilter(value) {
      if(value === null) {
        return 0
      } else {
        return value
      }
    }
  }
}
</script>

<style scoped lang="stylus" type="text/stylus">
.groupPlan {
  .nav {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .center {
    padding-top: 10px;

    .list {
      width: 50%;
      display: inline-block;
      background: #F8F8F8;
      padding: 10px 5px;

      .title {
        padding-bottom: 10px;
        border-bottom: 1px solid #E6E6E6;
        margin-bottom: 10px;
      }

      .bottom {
        overflow: hidden;

        .right {
          float: right;

          i {
            margin-right: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.groupPlanLint {
  margin-left: 50px;

  .list {
    background: #F8F8F8;
    padding: 5px 10px;

    .title {
      border-bottom: 1px solid #D8D8D8;
      padding-bottom: 5px;
      overflow: hidden;

      .right {
        float: right;

        i {
          margin-left: 20px;
        }
      }
    }

    .all-img-list {
      padding-top: 10px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .img-list {
        width: 50px;
        height: 50px;
        overflow: hidden;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;

        .img {
          width: auto;
        }
      }
      .delMember {
        height: 20px;
        line-height:18px;
        width:20px;
        font-size:20px;
        position:relative;
        top:-25px;
        cursor:pointer;
        background: rgb(99,99,99);
        color: #fff;
        text-align: center;
        border: 1px solid rgb(99,99,99)
        border-radius: 50%
      }

      .add-img {
        font-size: 50px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 40px;
        border: 1px solid #D8D8D8;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        margin-left: 10px;
      }
    }
  }

  .add {
    margin-top: 10px;
  }
}

.select-member {
  .search {
    .right {
      margin-right: 20px;
    }
  }

  .all-member {
    padding-bottom: 10px;
    height: 600px;
    overflow: scroll;

    .member-list {
      border-bottom: 1px solid #CCCCCC;
      padding-top: 5px;
      padding-bottom: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .imgs {
        width: 50px;
        height: 50px;
        overflow: hidden;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        margin-left: 20px;
        margin-right: 20px;

        img {
          width: auto;
        }
      }

      .right {
        .name {
          font-size: 18px;
        }

        .sys {
          font-size: 14px;
          display: inline-block;
          background: #FF7D44;
          padding-left: 3px;
          padding-right: 3px;
          color: #ffffff;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
