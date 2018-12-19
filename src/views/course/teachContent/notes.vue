<template>
  <div class="note">
    <tableNoHeader :tableData="tableData" :tables="tables" :buttonStylus="sysButton" @showComponentInfo="showComponentInfo"></tableNoHeader>
    <adialog :dialogConfig="dialogConfig"
      :dataObj="dataObj"
      :formData="formData"
      @showComponentInfo="showComponentInfo"
      :show.sync="show">
      </adialog>
  </div>
</template>

<script>
  import wangEditors from 'wangeditor'
  import tableNoHeader from '@/components/table-no-header.vue'
  import adialog from '@/components/dialog'
  import {noteList,noteDelete} from '@/api/course'
  export default {
    components:{
      tableNoHeader,
      adialog
    },
    data(){
      return{
        tables:[
          {
            name:'笔记标题',
            prop:'noteName',
          },
          {
            name:'笔记内容',
            prop:'noteContent',
            popover: true,
            popoverTitle: '笔记内容',
          },
          {
            name:'资源节点',
            prop:'itemTimePoint',
          },
          {
            name:'发布人',
            prop:'realName',
          },
          {
            name:'发布时间',
            prop:'createTime',
          },
        ],
        tableData:[
          {
            zyname:'资源名',
            notesTitle:'笔记标题1',
            notesContent:'<p>笔记内容1</p>',
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
            name:'查看',
            type:'get',
          },
          {
            name:'删除',
            type:'delete',
          }
        ],
        listQuery:{
          courseId: this.$route.query.id,
          pageIndex:1,
          pageSize:10
        },
        delArr:[],
        isInfo:false,
        notesData:null, //笔记的详细数据
        notesEditor:null, //显示笔记数据

        // 对话框
        show: false,
        dialogConfig: {
            btnShow: false,
            title: '查看笔记',
            width: '40',
            labelWidth: '120',
            top: '20',
            inputWidth: '70',
            eventType: ''
        }, 
        dataObj: {
          
        },
        dialogVisible: false,
        formData: [
          {
            key: '笔记标题：',
            inputType: 'info',
            value: 'noteName'
          },
          {
            key: '发布人：',
            inputType: 'info',
            value: 'realName'
          },
          {
            key: '发布日期：',
            inputType: 'info',
            value: 'createTime'
          },
          {
            key: '笔记内容：',
            inputType: 'textarea',
            value: 'noteContent'
          },
          {
            key:'笔记图片',
            inputType:'img',
            value:'imgSrc',
            imgWidth: 50
          },
        ]
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
    mounted() {
      noteList(this.listQuery)
      .then(response=> {
        response.data.pageData.forEach(element => {
          element.popover = element.noteContent
        });
        this.tableData = response.data.pageData
      })
    },
    methods:{
      showComponentInfo (e,data,index) {
        console.log(e,data,index)
        switch (e) {
          case 'get':
            console.log('123',this.tableData)
            this.show = true
            this.dataObj = data
            this.dataObj.imgSrc = this.tableData.imgSrc
            console.log('123',this.dataObj)
            break;
          case 'delete':
            this.delArr.push(data.noteId)
            noteDelete(this.delArr)
            .then(response=> {
              if(response.code === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
            })
          default:
            break;
        }
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
      },
      // upEditor () {
      //   this.notesEditor = new wangEditors('notesNav','#notes')
      //   this.notesEditor.create()
      //   if(this.notesData.notesCenter !== ''){
      //     console.log('执行到了')
      //     this.notesEditor.txt.html(this.notesData.notesCenter)
      //   }
      //   this.notesEditor.$textElem.attr('contenteditable', false)
      // },
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
