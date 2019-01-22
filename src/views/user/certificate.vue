
<template>
    <div style="padding: 30px 50px;">
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
                    </div>
                </template>
            </el-table-column>
        </el-table>

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
                <el-form-item label="发证时间" required>
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
                <span>证书图片</span>
                <span v-for="(img,index) in cerForm.imgUrls" :key="img.id" class="" style="display: inline-block;position: relative">
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
        <el-button type="primary" @click="changeCre">提交</el-button>
      </span>
        </el-dialog>
        <!--查看证书-->
        <el-dialog
          title="提示"
          width="500px"
          :visible.sync="imgDialog">
            <el-carousel :interval="0" arrow="always" height="350px">
                <el-carousel-item v-for="creImg in imgSrc" :key="creImg.id">
                    <img :src="creImg.imgUrl" alt="证书图片" style="width: inherit;height: inherit;">
                </el-carousel-item>
            </el-carousel>
            <span slot="footer" class="dialog-footer">
            <!--<el-button @click="imgDialog = false">取 消</el-button>-->
            <el-button type="primary" @click="imgDialog = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>

</template>
<script>
  import UpOss from "../../components/up-oss";
  import {certificateList, delCertificate, cerInfo, changeCer, statusCre} from '@/api/user'
    export default {
        name: "certificate",
        components:{
          UpOss
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
                {imgUrl: 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/154726200084466669.jpeg'}
              ],
              //证书表单
              cerForm:{
                certificateName: "",//证书名称
                certificateNo: "", //证书编号
                imgUrls: [],
                issuingAuthority: "", //发证机关
                issuingDate: "" //发证日期
              },
              //证书的修改建议
              cerComment:''
            }
        },
        methods: {
            initInfo(){
              let loading = this.$loading(this.loadingCss)
              certificateList().then(res=>{
                    loading.close()
                    console.log(res)
                    if(Number(res.code) === 200) {
                        this.data = res.data.pageData
                    }else {
                       this.$message.error(res.msg)
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
                  this.$message.error(res.msg)
                }
              })
            },
          //修改证书
            changeCre(id){
              let loading = this.$loading(this.loadingCss)

              changeCer(this.cerForm).then(res=>{
                loading.close()
                if(Number(res.code) === 200) {
                  console.log(res.data)
                }else {
                  this.$message.error(res.data.msg)
                }
              })
              cerInfo(id).then(res=>{
                loading.close()
                console.log('证书信息',res)
                if(Number(res.code) === 200) {
                  this.cerForm = res.data
                  this.uploadDialog = true
                }else {
                  this.$message.error(res.data.msg)
                }
              })
            },
          //证书图片上传
          upCre (url) {
            console.log('证书上传')
            let data = {imgUrl : url,order: 1}
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
                  this.$message.error('撤销失败');
                }
              })
              // delCertificate()
            },
          delImg(index){
            console.log(index)
            this.cerForm.imgUrls.splice(index, 1)
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
