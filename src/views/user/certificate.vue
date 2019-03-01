
<template>
  <div>
    <user-header :active="3"></user-header>
    <div  style="width: 80%;margin: 0 auto;">
      <el-table
        :data="data"
        style="width:100%;">
        <el-table-column
          label="证书编号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.certificateNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="证书名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.certificateName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发证单位">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.issuingAuthority }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="提交时间"
          width="180">
          <template slot-scope="scope">
            <!--<i class="el-icon-time"></i>-->
            <span style="margin-left: 10px">{{ scope.row.subTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==1" type="success">已通过</el-tag>
            <el-tag v-else-if="scope.row.status==3">审核中</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="danger">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope" >
            <div v-show="scope.row.status==1">
              <el-button type="text" @click="checkCre(scope.row.certificateId)">查看</el-button>
            </div>
            <div v-show="scope.row.status==2">
              <el-button type="text" @click="changeCre(scope.row.certificateId)">修改</el-button>
              <el-button type="text" @click="delCre(scope.row.certificateId)">撤销</el-button>
            </div>
            <div v-show="scope.row.status==3">
              <el-button type="text" @click="delCre(scope.row.certificateId)">撤销</el-button>
              <el-button type="text" @click="checkCre(scope.row.certificateId)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
0
    </div>
    <!--修改证书-->
    <el-dialog
      title="修改证书"
      :visible.sync="uploadDialog"
      width="30%">
        <el-form :model="cerForm" label-width="100px">
          <el-form-item label="编号">
              <el-input type="text" class="input-width" v-model="cerForm.certificateNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="名称">
              <el-input type="text" class="input-width" v-model="cerForm.certificateName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="发证时间">
              <el-date-picker
                v-model="cerForm.issuingDate"
                type="datetime"
                prefix-icon="el-icon-date"
                placeholder="选择发证时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="12:00:00">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="发证件单位">
              <el-input type="text" class="input-width" v-model="cerForm.issuingAuthority" placeholder="请输入"></el-input>
          </el-form-item>
          <span style="margin-left: 30px;">证书图片</span>
          <span v-for="(img,index) in cerForm.imgUrls" :key="img.id" class="" style="display: inline-block;position: relative;margin-left: 10px">
              <span class="close" @click="delImg(index)"><i class="el-icon-error"></i></span>
              <img :src="img.imgUrl" alt="" class="cre-img has-close" style="position: relative">
          </span>
          <!--<span><i class="el-icon-picture cre-uploader-icon"></i></span>-->
          <up-oss @ossUp="upCre" :inputs="'creImg'"></up-oss>
        </el-form>
        <div style="color: red">
            <span>审核意见</span>
            {{this.cerComment}}
        </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="()=>{uploadDialog = false}">取 消</el-button>
      <el-button type="primary" @click="goChangeCre">提交</el-button>
      </span>
    </el-dialog>
    <!--查看证书-->
    <el-dialog
      title="证书预览"
      width="500px"
      :before-close="()=>{imgSrc = [],imgDialog = false}"
      :visible.sync="imgDialog">
        <el-carousel :interval="0" arrow="always" height="350px" @change="imgChange">
            <el-carousel-item v-for="creImg in imgSrc" :key="creImg.id">
                <img :src="creImg.imgUrl" alt="证书图片" style="width: inherit;height: inherit;">
            </el-carousel-item>
        </el-carousel>
        <span slot="footer" class="dialog-footer">
          <el-button icon="el-icon-download" type="info" circle @click="downImg(imgSrc[imgIndex].imgUrl,'1')"></el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import UpOss from "@/components/up-oss";
  import userHeader from './userHeader'
  import {certificateList, delCertificate, cerInfo, changeCer, statusCre} from '@/api/user'
  import {getErrorMsg} from "../../utils/utils";

  export default {
      name: "certificate",
      components:{
        UpOss,
        userHeader
      },
      mounted (){
        this.initInfo()
      },
      data() {
        return {
          data: [],
          imgDialog:false,
          uploadDialog:false, //上传证书弹窗
          imgSrc: [
            {imgUrl: ''}
          ],
          imgIndex:0,
          //证书表单
          cerForm:{
            certificateName: "",//证书名称
            certificateNo: "", //证书编号
            imgUrls: [],
            issuingAuthority: "", //发证机关
            issuingDate: "" //发证日期
          },
          totalPage:10,
          currentPage:1,
          //证书的修改建议
          cerComment:''
        }
      },
      methods: {
        initInfo(page){
          let loading = this.$loading(this.loadingCss)
          let data = {
            pageIndex:page
          }
          certificateList(data).then(res=>{
            loading.close()
            // console.log(res)
            if(Number(res.code) === 200) {
              this.data = res.data.pageData
              this.totalPage = res.data.totalPage * 10
            }else {
              this.$message.error(getErrorMsg(res.msg))
            }
          })
        },
        //查看证书
        checkCre(data){
          let loading = this.$loading(this.loadingCss)
          cerInfo(data).then(res=>{
            loading.close()
            if(Number(res.code) === 200) {
              this.imgSrc = res.data.imgUrls
              this.imgDialog = true
            }else {
              this.$message.error(getErrorMsg(res.msg))
            }
          })
        },
        //查看证书图片时，证书图片切换
        imgChange(index){
          this.imgIndex = index
        },
        //证书图片下载
        downImg(url,filename){
          var FileSaver = require("file-saver");
          url = 'https' + url.substring(4)
          FileSaver.saveAs(url);
        },
        //修改证书
        changeCre(id){
          let loading = this.$loading(this.loadingCss)

          cerInfo(id)
            .then(res=>{
            console.log('证书信息',res)
            if(Number(res.code) === 200) {
              this.cerForm = res.data
              this.uploadDialog = true
            }else {
              this.$message.error(getErrorMsg(res.msg))
            }
          }).then(()=>{
            statusCre(id).then(res=>{
              if(Number(res.code) === 200) {
                console.log(res)
                this.cerComment = res.data[0].comment
              }else {
                this.$message.error(getErrorMsg(res.msg))
              }
            })
          })
        },
        //修改证书
        goChangeCre(id){
          let loading = this.$loading(this.loadingCss)

          changeCer(this.cerForm).then(res=>{
            loading.close()
            if(Number(res.code) === 200) {
              console.log(res.data)
            }else {
              this.$message.error(getErrorMsg(res.msg))
            }
          })
        },
        //证书图片上传
        upCre (url) {
          let data = {imgUrl : url,orderValue : 1}
          this.cerForm.imgUrls.push(data)
        },
        //撤销证书
        delCre(id){
            let loading = this.$loading(this.loadingCss)
            let data = {certificateId:id}
            console.log(data)
            delCertificate(data).then(res=>{
              console.log(res)
              loading.close()
              if(Number(res.code) === 200) {
                this.$message.success('撤销成功');
                this.initInfo()
              }else {
                this.$message.error(getErrorMsg(res.msg))
              }
            })
            // delCertificate()
          },
        delImg(index){
          console.log(index)
          this.cerForm.imgUrls.splice(index, 1)
        },
        //分页页码改变
        handleCurrentChange(number){
          this.initInfo(number)
        },
      }
    }
</script>

<style scoped lang="stylus" type="text/stylus">
    .close
        z-index 20
        cursor pointer
        position absolute
        top 0
        right 0
    .cre-img
      width: 120px;
      height: 100px;
</style>
