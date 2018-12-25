<template>
  <div class="test">
    <div class="title">
      <div>试题管理</div>
    </div>

    <div style="display: flex;margin: 25px 0;">
      <div style="display: flex">
        <div style="width: 300px">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="input">
          </el-input>
        </div>
        <div>
          <el-button icon="el-icon-search" class="search-btn"></el-button>
        </div>
      </div>
      <div style="" class="btn-warp">
        <div>
          <el-button type="success">下载模板</el-button>
        </div>
        <div>
          <!--<el-button @click="uploadDialog = true">导入模板</el-button>-->
          <el-upload
            :http-request="upTestFile"
            action="string"
            :show-file-list="false">
            <el-button >导入</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="test-warp">
      <div class="test-title">
        <!--全选-->
        <div>
          <el-checkbox v-model="isCheckAll">全选</el-checkbox>
        </div>
        <div>
          <el-button type="primary" size="small">创建目录</el-button>
          <el-button type="primary" size="small">移动到</el-button>
          <el-button type="primary" size="small">删除</el-button>
        </div>
      </div>
      <div class="test-body">
        <el-tree
          :data="catalogData"
          :props="{
            label: treeProp.name,
            children: treeProp.child
          }"
          @node-click="shownode"
          show-checkbox
          accordion
          node-key="id">
            <span class="test-tree-node" slot-scope="{ node, data }">
              <span>
                <img :src="imgSrc.folder" alt="" class="folder-img"><span>{{ node.label }}</span>
              </span>
              <!--<span>{{node.data}}</span>-->
              <!--<span>{{ node.label }}</span>-->
              <!--<span>12354646 <span>asds</span> </span>-->
              <span>
                <el-button size="mini" @click="() => append(data)"> 编辑 </el-button>
                <el-button size="mini" @click="() => remove(node, data)">删除</el-button>
              </span>
            </span>
        </el-tree>
      </div>
    </div>

    <!--试题查看弹窗-->
    <el-dialog
      title="试题查看"
      :visible.sync="testView"
      width="50%">
       <div class="test-body">
         <p><span style="margin-right: 20px"><b>(单选题)</b></span>1、在下列设备中，不能作为危机输入设备的是?</p>
         <br>
         <div class="options">
           <span>A、扫描仪</span>
           <span>B、扫描仪</span>
           <span>C、扫描仪</span>
           <span>D、扫描仪</span>
         </div>
       </div>
      <span slot="footer" class="dialog-footer" style="text-align: left">
        <p>正确答案:<span>C</span></p>
        <p>解析:<span>鼠标是一种常用的输入设备</span></p>
      </span>
    </el-dialog>
    <!--删除确认框-->
    <el-dialog
      title="删除试题"
      :visible.sync="testDelete"
      width="40%">
      <span style="font-size: 16px">确认删除该试题？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="testDelete = false">取 消</el-button>
    <el-button type="primary">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  // import uposs from '@/components/up-oss.vue'
  import {getTestFileFold, newTestFileFold , deleteTestFileFold} from "../../../../api/library";

  export default {
    // components:{uposs},
    created (){
      // this.getTestList({quizType: 0})
    },
    data() {
      return {
        imgSrc: {
          folder: require("../../../../assets/images/folder.png"),
        },
        catalogData: [{
          catalogId: 0,
          parentId: 0,
          catalogName: "默认文件夹",
          catalogList: [
            {
              id: 1,
              catalogName: "子文件夹",
              parentId: 0,
              catalogLevel: 1
            }
          ],
          quizList: [{
            quizTitle: '试题名称',
          }]
        }],
        catalogData2:[
          {
            "catalogId": 0,
            "catalogLevel": 0,
            "catalogList": [
              {}
            ],
            "catalogName": "string",
            "count": 0,
            "parentId": 0,
            "quizList": [
              {
                "catalogId": 0,
                "difficulty": 0,
                "displayOrder": 0,
                "quizAnalysis": "string",
                "quizId": 0,
                "quizOption": [
                  {
                    "correctFlag": 0,
                    "optionId": 0,
                    "optionTitle": "string",
                    "quizId": 0
                  }
                ],
                "quizTitle": "string",
                "quizType": 0,
                "skillPoint": 0,
                "updateTime": "2018-12-19 12:00:00",
                "useCount": 0
              }
            ]
          }
        ],
        //节点树的结构配置
        treeProp:{
          name: 'catalogName' ? 'catalogName' : 'quizTitle',
          child:'catalogList' ?'catalogList' : 'quizList',
        },
        isCheckAll: false,
        value:'',
        uploadDialog: false, //文件上传弹窗
        testView: false , //试题查看弹窗
        testDelete: false, //删除试题
        //courseId: '0608367675f54267aa6960fd0557cc1b',//如果指定课程的话，课程ID
        courseId: '',//如果指定课程的话，课程ID
        catalogPros:{
          label:'catalogName'
        }
      }
    },
    methods: {
      shownode(data){
        console.log('被点击')
        console.log(data)
      },
      // 获取所有试题列表数据
      getTestList(data){
        console.log(data)
        getTestFileFold(data).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            //如果试题库为空，则初始化新建一个默认的文件夹
            if(res.data.length === 0){
              console.log('新建默认文件夹')
              this.newFileFold(0,'默认文件夹')
            }
            this.catalogData = res.data
            console.log('现在的试题数据为')
            console.log(this.catalogData)
          } else {
            this.$message({
              message: "试题列表数据获取失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      },
      //新建文件夹
      newFileFold(parentId, catalogName){
        let data = {
          catalogId: parentId,
          catalogName
        }

        newTestFileFold(data).then(res => {
          console.log(res)
          if (Number(res.code) === 200) {
            //如果试题库为空，则初始化新建一个默认的文件夹
            this.$message.success('文件夹新建成功');
          } else {
            this.$message.error('文件夹新建失败');
          }
        })
          .catch(error => {
            console.log(error);
          });

      },
      toEditTest() {
        this.$router.push('/course/resource/edittest/1');
      },
      toAddTest() {
        this.$router.push('/course/resource/addtest');
      },
      // 导入试题模板
      upTestFile(item) {
        this.beforTestUpload()
        console.log(item)
        let fileFormData = new FormData();
        fileFormData.append('file', item.file);
        console.log(fileFormData)
        upQuiz(this.courseId, fileFormData).then(res => {
          this.$notify({
            title: '试题导入成功',
            message: '新增' + res.data.totalCount + '个试题',
            type: 'success',
            duration: 0
          });
        }).catch(error => {
          console.log(error)
        })
      },
      //文件上传验证
      beforTestUpload(file) {

        if (!this.courseId) {
          this.$notify.error({
            title: '错误',
            message: '请先搜索相关课程，再导入该课程的试题模板'
          });
          return false
        }

        console.log(file, '文件');
        this.files = file;
        const extension = file.name.split('.')[1] === 'xls'
        const extension2 = file.name.split('.')[1] === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!extension && !extension2) {
          this.$message.warning('上传模板只能是 xls、xlsx格式!')
          return
        }
        if (!isLt2M) {
          this.$message.warning('上传模板大小不能超过 5MB!')
          return
        }
        this.fileName = file.name;
        return false // 返回false不会自动上传
      },
      //选择试题章节查询
      getChapterQuiz() {
        alert("按章节查询")
      },
      // 删除该课程全部试题
      delAllQuiz() {

      },
      // renderContent(h, { node, data, store }) {
      //   return (
      //     <span class="custom-tree-node">
      //       <span> {node.label} </span>
      //       <span>
      //         <el-button size="mini"  on-click={ () => alert('append') }>Append</el-button>
      //         <el-button size="mini"  on-click={ () => alert('delete') }>Delete</el-button>
      //       </span>
      //       <span>{quizList.title}</span>
      //   </span>
      // );
      // }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .el-table .cell
    overflow: hidden
    white-space: nowrap
    text-overflow:ellipsis
  .test
    padding:0 5% 20px 50px
    .search-btn
      border-left 0
      background-color #f4f4f4
      border-radius 4px
    .title
      width 100%
      display flex
      align-items center
      border-bottom 2px solid gray
      padding-bottom 10px
      & div:first-chilf
        height 45px;
        width 100px;
    .btn-warp
      flex 1
      display flex
      justify-content flex-end
      & div
        margin 0 10px
      & div:last-child
        margin-right 0
  .test-warp
    .img-span
      display inline-block
      .img-icon
        width 48px
        height 48px
        margin 0 10px
    .test-title
      display flex
      height 50px
      align-items center
      background-color #f4f4f4
      & div:first-child
        flex 1
        padding-left 25px
      & div:last-child
        padding-right 40px
    .test-body
      .folder-img
        width: 20px;margin: -5px 10px;
      .test-tree-node
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
</style>

