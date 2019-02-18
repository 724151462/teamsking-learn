<template>
  <div class="certificate">

    <header-the-again headerTitle="证书管理"></header-the-again>
    <el-form ref="form" :model="searchForm" :inline="true" label-width="100px" class="form-query">
      <el-form-item label="输入搜索：">
        <el-input v-model="searchForm.searchString" placeholder="证书名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="certificateSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <table-the-again
      :tableTitle="tableTitle"
      :tableOperate="tableOperate"
      :columnNameList="columnNameList"
      :tableData="tableData3"
      :operateList="operateList"
      @showComponentInfo="showComponentInfo">
    </table-the-again>

    <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size="2"
            @current-change="pageChange">
    </el-pagination>

    <el-dialog
      :visible.sync="dialogVisible" :modal="false" :before-close="setVisible"
      width="50%">
      <el-dialog
      width="60%"
      title="请填写拒绝理由"
      
      :visible.sync="innerVisible"
      top="30vh"
      append-to-body>
        <el-input type="textarea" v-model="auditInfo.comment"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="disauditBtn">提交</el-button>
          <el-button @click="innerVisible=false;">取消</el-button>
        </span>
      </el-dialog>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="证书">
          <img v-for="(item,index) in form.picUrl"
            :key="index" :src="item.imgUrl" alt="">
        </el-form-item>
        <el-form-item label="证书时间">
          <el-input v-model="form.issueTime"></el-input>
        </el-form-item>
        <el-form-item label="证书类型">
          <el-input v-model="form.type"></el-input>
        </el-form-item>
        <el-form-item label="证书编号">
          <el-input v-model="form.no"></el-input>
        </el-form-item>
        <el-form-item label="证书单位">
          <el-input v-model="form.partment"></el-input>
        </el-form-item>
        <el-form-item label="证书名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span v-if="audit" slot="footer" class="dialog-footer">
        <el-button @click="auditPass">通过</el-button>
        <el-button type="primary" @click="auditReject">拒绝</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="detailVisible" :modal="false"
      width="50%">
      <template>
        <el-table
          :data="detialData"
          style="width: 100%">
          <el-table-column
            label="审核时间"
            width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.auditDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="审核人员"
            width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.auditUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="审核结果"
            width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="反馈详情"
            width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.comment }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import tableTheAgain from '../../components/table-wjx'
  import headerTheAgain from '../../components/header-theAgain'
  
  import {
    sysCertificatePage,
    sysCertificateId,
    sysCertificateAudit,
    sysCertificateDetail
  } from '../../api/school';

  export default{
    name:'',
    data(){
      return{
        searchForm: {
          pageIndex: 1,
          searchString: '',
          pageSize: 2,
          orderValue: 0
        },
        // 详情数据
        detialData: [],
        // 审核/通过 按钮
        audit: false,
        // 审核详情模态框
        detailVisible: false,
        // 审核按钮模态框
        dialogVisible: false,
        innerVisible: false,
        isRequested: false,
        // 审核提交信息
        auditInfo: {
          certificateId: '',
          comment: "",
          status: ''
        },
        tableOperate:[
          // {
          //   content:'删除',
          //   type:'deleteAll'
          // }
        ],
        tableTitle:'证书管理列表',
        columnNameList:[
          {
            type:"selection"
          },
          {
            name:'学号/工号',
            prop:'userId'
          },
          {
            name:'证书',
            prop: 'imgUrls',
            imgList: {}
          },
          {
            name:'提交时间',
            prop: 'subTime'
          },
          {
            name:'姓名',
            prop:'realName'
          },
          {
            name:'审核状态',
            prop:'status',
            other: {
              name: "审核详情",
              type: "auditDetail"
            }
          }

        ],
        operateList:[
          {
            content:'审核',
            type:'auditing',
          },
        ],
        tableData3: [
          
        ],
        popContentItem:[],
        textarea:'',
        form: {
          id: '',
          realName: '',
          issueTime: '',
          picUrl: [],
          no: '',
          type: '',
          partment: '',
          name: ''
        },
        searchCollegeList: [],
        searchDepartmentList: [],
        departmentRows: [],
        collegeList: [],
        totalCount: 0,
        pageIndex: 1,
      }
    },
    components:{
        tableTheAgain,
        headerTheAgain
    },
    computed:{
    },
    mounted(){
      // 证书列表
      this.getAuditList()
    },
    methods:{
      setVisible() {
        this.dialogVisible = false
        console.log(this.dialogVisible)
      },
      typeFilter(val) {
        if(val === 2){
          return '管理端'
        }else{
          return '学生端'
        }
      },
      certificateSearch() {
        this.searchForm.pageIndex = 1
        this.getAuditList()
      },
      // 审核通过
      auditPass() {
        console.log(this.form.id)
        this.auditInfo = {
          "certificateId": this.form.id,
          "comment": "",
          "status": 1
        },
        sysCertificateAudit(this.auditInfo)
        .then((response)=>{
          console.log(response)
        })
      },
      // 审核不通过
      auditReject() {
        this.innerVisible = true
      },
      // 提交未通过理由
      disauditBtn() {
        this.auditInfo.certificateId = this.form.id,
        this.auditInfo.status = 2
        console.log(this.auditInfo)
        sysCertificateAudit(this.auditInfo)
        .then((response)=> {
          if (response.code === 200) {
            this.$message({
                type: 'success',
                message: '提交成功!'
            });
            this.innerVisible = false
          }else{
            this.$message({
                type: 'error',
                message: response.msg
            });
          }
        })
      },
      pageChange(pageNum) {
        this.searchForm.pageIndex = pageNum
        this.getAuditList()
      },
      showComponentInfo:function(type,info){
        console.log( '父组件接收到的类型：' + type + '父组件接收到的信息：' + info );
        switch (type) {
          case 'auditing': 
            this.audit = true
            this.showAuditForm(info)
            break;
          // case 'addcertificate':
          //   this.$router.push('addcertificate')
          //   break;
          // case 'resetPassword':
          //   this.resetPassword(info)
          //   break;
          case 'delete':
            this.delCertificate(info)
            break;
          case 'deleteAll':
            this.delCertificate(info)
            break;
          case 'auditDetail':
            this.detailVisible = true
            this.getAuditDetail(info)
            break;
        }
      },
      // 列表获取
      getAuditList() {
        sysCertificatePage(this.searchForm).then((response)=>{
            console.log(response)
            response.data.pageData.forEach((item)=>{
              console.log(item)
              item.status = '审核中'
            })
            this.totalCount = Number(response.data.totalCount)
            this.tableData3 = response.data.pageData
        })
      },
      getAuditDetail(info) {
        console.log('detail', info)
        sysCertificateDetail(info.certificateId).then((response)=> {
          if(response.code === 200) {
            console.log(response.data)
            this.detialData = response.data
          }
        })
      },
      showAuditForm(info) {
        sysCertificateId({"id": info.certificateId})
          .then((response)=>{
            console.log(response)
            let certificateData = response.data
            this.form = {
              id: certificateData.certificateId,
              realName: certificateData.realName,
              picUrl: certificateData.imgUrls,
              issueTime: certificateData.issuingDate,
              no: certificateData.no,
              type: this.typeFilter(certificateData.certificateUploadType),
              partment: certificateData.issuingAuthority,
              name: certificateData.certificateName
            }
            this.dialogVisible = true
          })
      },
      onSubmit:function(){
        console.log('onSubmit!!');
      },
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .certificate
    .pop-user-info
      margin:0px 0 20px 0
      box-sizing border-box
      display:flex
      justify-content:space-around
      flex-direction:column
      align-items:center
      width:150px
      height:150px

      div
        width:100px
        height:100px
        background:cyan
        border-radius:50% 50%

      span
        margin:5px 0
        box-sizing:border-box
        display:inline

    .pop-content-item
      span:first-child
        font-weight:800
    .pop-content-item:last-child
      margin-top:20px

    .el-pagination
      margin:20px 2.5% 0 0
      display:flex
      justify-content flex-end
      width:95%
</style>

