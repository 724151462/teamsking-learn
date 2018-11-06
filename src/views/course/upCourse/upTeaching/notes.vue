<template>
  <div>
    <tableNoHeader :tableData="tableData" :tables="tables" :buttonStylus="sysButton" @returnFun="notesSys"></tableNoHeader>
    <el-dialog
        v-if="notesData !== null"
        :visible.sync="isInfo"
        custom-class="notesDialog"
        width="70%">
      <div class="list">
        <span class="left">笔记标题：</span>
        <span>{{notesData.notesTitle}}</span>
      </div>
      <div class="list">
        <span class="left">发布人：</span>
        <span>{{notesData.fbr}}</span>
      </div>
      <div class="list">
        <span class="left">发布日期：</span>
        <span>{{notesData.fbsj}}</span>
      </div>
      <div class="list">
        <span class="left">笔记内容：</span>
        <span class="right">
          <div id="notesNav"></div>
          <div id="notes"></div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import wangEditors from 'wangeditor'
  import tableNoHeader from '../../../../components/table-no-header.vue'
  export default {
    components:{
      tableNoHeader
    },
    data(){
      return{
        tables:[
          {
            name:'课程名',
            prop:'courseName',
            width:'120'
          },
          {
            name:'资源名',
            prop:'zyname',
            width:'120'
          },
          {
            name:'笔记标题',
            prop:'notesTitle',
            width:'120'
          },
          {
            name:'笔记内容',
            prop:'notesCenter',
            // width:'120'
          },
          {
            name:'发布人',
            prop:'fbr',
            width:'120'
          },
          {
            name:'发布时间',
            prop:'fbsj',
            width:'120'
          },
        ],
        tableData:[
          {
            courseName:'我是课程名',
            zyname:'资源名',
            notesTitle:'笔记标题',
            notesCenter:'<p>笔记内容</p>',
            fbr:'发布人',
            fbsj:'2018-1-1'
          },
          {
            courseName:'我是课程名',
            zyname:'资源名',
            notesTitle:'笔记标题',
            notesCenter:'笔记内容',
            fbr:'发布人',
            fbsj:'2018-1-1'
          },
        ],
        sysButton:[
          {
            name:'查看',
            type:'get'
          },
          {
            name:'删除',
            type:'delete'
          }
        ],
        listQuery:{
          pageIndex:1,
          pageSize:10
        },
        isInfo:false,
        notesData:null, //笔记的详细数据
        notesEditor:null, //显示笔记数据
      }
    },
    watch:{
      isInfo (val) {
        if (JSON.stringify(val) === 'false') {
          this.notesData = null
          this.notesEditor = null
        }
      }
    },
    created(){
      this.$emit('teachingNav','notes')
    },
    methods:{
      notesSys (e) {
        console.log(e)
        if (e.sys === 'get') {
          //这里需要拿到笔记id
          this.notesData = e.date
          this.isInfo = true
          let self = this
          setTimeout(function(){
            self.upEditor()
          },0)
        }
        if (e.sys === 'delete') {
          //拿到id删除
          // let id = e.date.id
          //这里写删除方法
/*
          xxx(id).then(res=>{
            console.log(res)
            if(Number(res.code) === 200) {
              this.$message({
                message:'删除成功',
                type:'success'
              })
            }else{
              this.$message({
                message:'删除失败',
                type:'error'
              })
            }
          }).catch(error=>{
            console.log(error)
          })
*/
        }
      },
      upEditor () {
        this.notesEditor = new wangEditors('notesNav','#notes')
        this.notesEditor.create()
        if(this.notesData.notesCenter !== ''){
          console.log('执行到了')
          this.notesEditor.txt.html(this.notesData.notesCenter)
        }
        this.notesEditor.$textElem.attr('contenteditable', false)
      },
      getList () {
        console.log('搜索笔记列表')
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  .notesDialog
    .list
      padding-top:10px
      padding-bottom:10px

      .left
        display:inline-block
        width:80px
        padding-right:20px
        text-align: right

      .right
        padding-left:70px
        display:block
</style>
