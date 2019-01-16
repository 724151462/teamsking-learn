<template>
  <div class="courseCategory" id="courseCategory">

    <div class="tab">
      <div class="tabBar" :class="{ active:showTab1}" @click="switchTab('first')">创建课程分类</div>
      <div class="tabBar" :class="{ active:!showTab1}" @click="switchTab('second')">课程分类列表</div>

      <div class="tabContent" v-show="showTab1">

        <div class="item">
          <span class="red">*</span><span>分类名称</span>
          <el-input style="width: 200px;" v-model="input" placeholder="请输入内容"></el-input>
        </div>

        <div class="item">
          <span>上级分类</span>
          <el-input style="width: 200px;" v-model="input" placeholder="请选择分类"></el-input>
          <div style="color:gray;font-size: 12px;">不选择分类默认为顶级分类</div>
        </div>

        <div class="item">
          <span>排序</span>
          <el-input style="width: 200px;" v-model="input" placeholder=""></el-input>
        </div>

        <div class="item">
          <span class="red">*</span><span>是否显示：</span>
          <template>
            <el-radio v-model="radio" label="1">备选项</el-radio>
            <el-radio v-model="radio" label="2">备选项</el-radio>
          </template>
        </div>

        <div class="item">
          <span class="red"></span><span>关键词：</span>
          <el-input style="width: 200px;" v-model="input" placeholder="请输入内容"></el-input>
        </div>

        <div class="item">
          <span class="red">*</span><span>分类描述：</span>
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="textarea3">
          </el-input>
        </div>

        <el-button type="primary">保存</el-button>


      </div>

      <div class="tabContent" v-show="!showTab1">
        <tableNoHeader
        :tableData="tableData" 
        :tables="tables" 
        :buttonStylus="sysButton" 
        @showComponentInfo="showComponentInfo"
      ></tableNoHeader>
      <!-- 展示二级分类弹窗 -->
      <el-dialog :visible.sync="dialogVisible">
        <tableNoHeader
        :tableData="level2" 
        :tables="tables" 
        :buttonStylus="sysButton1" 
        @showComponentInfo="showComponentInfo"
      ></tableNoHeader>
      </el-dialog>
      </div>
      <!-- 保存分类弹窗 -->
      <el-dialog
        :title="addForm.title"
        :visible.sync="saveDialog"
        width="60%"
        style="min-width: 800px">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="分类名称" required>
            <el-input v-model="form.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类描述" required>
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveDialog = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </span>
      </el-dialog>
    </div>




  </div>
</template>

<script>
  import {courseCatalogList} from '@/api/system'
  import tableNoHeader from '@/components/table-no-header'
  export default {
    name: "courseCategory",
    data(){
      return{
        showTab1:false,
        dialogVisible: false,
        saveDialog: false,
        input:'',
        radio: '1',
        textarea3:'',
        showHeader:false,
        tableTitle:'角色管理列表',
        addForm: {
          title: ''
        },
        form:{},
        tables:[
          {
            name:'分类名称',
            prop:'categoryName',
          },
          {
            name:'级别',
            prop:'level',
          },
          {
            name:'描述',
            prop:'description',
          },
          
        ],
        tableData:[
          {
            zyname:'资源名',
            notesTitle:'笔记标题1',
            notesContent:'<p>笔记内容</p>',
            fbr:'发布人',
            fbsj:'2018-1-1',
            popover: 'dsawf'
          },
          {
            zyname:'资源名',
            notesTitle:'笔记标题',
            notesContent:'笔记内容',
            fbr:'发布人',
            fbsj:'2018-1-1',
            popover: 'twqfwq'
          },
        ],
        sysButton:[
          {
            name:'查看二级分类',
            type:'detail',
          },
          {
            name:'添加二级分类',
            type:'addCatalog',
          },
          {
            name:'删除',
            type:'delete',
          },
        ],
        sysButton1:[
          {
            name:'编辑',
            type:'edit',
          },
          {
            name:'删除',
            type:'delete',
          },
        ],
        tableData: [],
        level2: []
      }
    },
    created() {
      courseCatalogList()
      .then(response=> {
        response.data.forEach(element => {
          element.level = '一级'
        });
        this.tableData = response.data
      })
    },
    methods:{
      switchTab:function(rank){
        switch(rank){
          case 'first':
            this.showTab1 = true;
            break;
          case 'second':
            this.showTab1 = false;
            break;
        }
        //this.showTab1 = !this.showTab1;
        console.log(this.showTab1)
      },
      showComponentInfo:function(type,info){
        console.log('type',type,'info',info);
         switch(type){
           case 'addCatalog':
             this.form = {}
             this.addForm.title = "添加分类"
             this.saveDialog = true
             break;
           case 'detail':
             this.level2 = info.children
             this.dialogVisible = true
             break;
           case 'edit':
             console.log(info)
             this.form = info
             this.addForm.title = "编辑分类"
             this.saveDialog = true
             break;
        }
      }

    },
    components: {
      tableNoHeader
    }
  }
</script>

<!--<style scoped lang="stylus" type="text/stylus">-->
<style scoped>
  .tab{
    position: relative;
    display: flex;
    justify-content: flex-start;

    /*background: orange;*/
    font-size: 16px;
    line-height: 50px;
  }
  .tab .tabBar{
    width: 200px;
    height: 100%;
    /*background: cyan;*/
    flex-shrink: 0;
    border: 1px solid rgb(230,230,230);
    border-bottom: none;
    text-align: center;
    background: rgb(240,240,240);
  }
  .tab div:first-child{
    border-right: none;
  }
  .tab .active{
    background: white;
    color:#409eff;
  }
  .tab .tabContent{
    position: absolute;
    margin-bottom:20px;
    left:0;
    top: 50px;
    width: 90%;
    min-height: 0;
    /*background: orange;*/
    border: 1px solid rgb(230,230,230);
  }
  .red{
    color:red;
  }



  .demo-table-expand {
    font-size: 0;
    padding:0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table__expanded-cell[class*=cell]{
    padding:0 !important;
  }
  #courseCategory{
    height: 600px;
  }
  .courseCategory .el-table__expanded-cell{
    padding:0 !important;
  }
</style>
