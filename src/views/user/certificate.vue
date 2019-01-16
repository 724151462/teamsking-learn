
<template>
    <div style="padding: 30px 50px;">
        <el-table
        :data="data"
        style="width:100%;">
            <el-table-column
            label="证书名">
                <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.certificateNo }}</span>
                <span style="margin-left: 10px">{{ scope.row.issuingAuthority }}</span>
                <span style="margin-left: 10px">{{ scope.row.certificateName }}</span>
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
                    <el-tag v-if="scope.row.status==1">已通过</el-tag>
                    <el-tag v-else-if="scope.row.status==3">审核中</el-tag>
                    <el-tag v-else-if="scope.row.status == 2">未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope" >
                    <div v-show="scope.row.status==1">
                        <el-button type="text">查看</el-button>
                    </div>
                    <div v-show="scope.row.status==2">
                        <el-button type="text">修改</el-button>
                        <el-button type="text" @click="delCre(scope.row.certificateId)">撤销</el-button>
                    </div>
                    <div v-show="scope.row.status==3">
                        <el-button type="text" @click="delCre(scope.row.certificateId)">撤销</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
          title="提示"
          width="500px"
          :visible.sync="imgDialog">
            <el-carousel :interval="0" arrow="always" height="350px">
                <el-carousel-item v-for="creImg in imgSrc" :key="creImg.id">
                    <img :src="creImg.img" alt="证书图片" style="width: inherit;height: inherit;">
                </el-carousel-item>
            </el-carousel>
            <span slot="footer" class="dialog-footer">
            <el-button @click="imgDialog = false">取 消</el-button>
            <el-button type="primary" @click="imgDialog = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>

</template>
<script>
    import {certificateList, delCertificate} from '@/api/user'
    export default {
        name: "certificate",
        mounted (){
            this.initInfo()
        },
        data() {
            return {
                data: [],
                imgDialog:false,
              imgSrc: [
                {img: 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/154726200084466669.jpeg'},
                {img: 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/154726200084466669.jpeg'},
                {img: 'http://tskedu-course.oss-cn-beijing.aliyuncs.com/154726200084466669.jpeg'}
              ]
            }
        },
        methods: {
            initInfo(){
                certificateList().then(res=>{
                    console.log(res)
                    if(Number(res.code) === 200) {
                        this.data = res.data.pageData
                    }else if(Number(res.code) === 440){
                        let msgs = JSON.parse(res.msg)
                        this.$message.error(msgs[0]);
                    }
                })
            },
            delCre(id){
              let loading = this.$loading({
                lock: true,
                text: 'loadingcc',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              console.log(typeof id)
              let data = {certificateId:id}
              console.log(data)
              delCertificate(data).then(res=>{
                console.log(res)
                loading.close()
                if(Number(res.code) === 200) {
                  this.$message.error('撤销成功');
                }else {
                  this.$message.error('撤销失败');
                }
              })
              // delCertificate()
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            }
        }
    }
</script>

<style scoped>

</style>
