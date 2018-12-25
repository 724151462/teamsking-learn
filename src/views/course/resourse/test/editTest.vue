<template>
  <div class="editTest">
    <div class="title">
      <div><span style="cursor: pointer" @click="toTest">试题管理</span> > 编辑试题</div>
    </div>
    <div style="padding-right: 35%">
      <el-form :model="quizData" ref="testForm">
        <el-form-item label="题干" required>
          <br>
          <div ref="editor" style="text-align:left"></div>
        </el-form-item>
        <el-form-item label="题型" required>
          <el-radio-group v-model="quizData.quizType" @change="quizTypeChange">
            <el-radio :label="10">单选</el-radio>
            <el-radio :label="20">多选</el-radio>
            <el-radio :label="30">判断题</el-radio>
            <el-radio :label="40">主观</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项" required>
          <br>
          <div v-if="quizData.quizType===40">
            <p style="padding-left: 40px">主观题无固定答案</p>
          </div>
          <div class="option-list"
               v-for="(option, optionIndex) in quizData.quizOption"
               :key="option.id"
               v-else>
            <div>{{optionItem[optionIndex]}}、</div>
            <div style="flex: 1">
              <el-input
                placeholder="请输入内容"
                v-model="quizData.quizOption[optionIndex].optionTitle"
                clearable>
              </el-input>
            </div>
            <div class="option-flag" v-if="quizData.quizOption[optionIndex].correctFlag === 1" @click="setCurrent(optionIndex)" style="user-select: none">设为正确答案</div>
            <div class="option-flag currect-flag" v-else @click="setCurrent(optionIndex)" style="user-select: none">正确答案</div>
            <div style="margin: 0 20px;color: red" @click="deleteOption(optionIndex)"><i class="el-icon-error"></i></div>
          </div>
          <div v-show="quizData.quizType !== 40"><el-button type="text" @click="addOption">+添加选项</el-button></div>
        </el-form-item>
        <el-form-item label="解析" required>
          <br>
          <el-input
            type="textarea"
            :rows="5"
            class="ans-text"
            placeholder="请输入内容"
            v-model="quizData.quizAnalysis">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btn-groud">
        <el-button type="primary" style="margin-right: 40px" @click="goPut">修改</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import editor from '@/views/course/resourse/test/myEditor'
  import {quizInfo, putQuiz} from '@/api/library'
  export default {
    name: "editTest",
    components:{editor},
    created () {
      if(this.$route.query.courseid && this.$route.query.courseid !== ''){
        this.courseid = this.$route.query.courseid
      }
      this.getQuizInfo()
      // setTimeout(this.getQuizInfo,5000)
    },
    data () {
      return {
        title:'',
        quizData:{
          "catalogId": 0,
          "courseId": "string",
          "creatorName": "string",
          "difficulty": 0,
          quizAnalysis: "",
          "quizId": 0,
          quizOption: [
            {
              "correctFlag": 0,
              "optionId": 0,
              "optionTitle": "",
              "quizId": 0
            },

            {
              "correctFlag": 0,
              "optionId": 0,
              "optionTitle": "",
              "quizId": 0
            },
            {
              "correctFlag": 0,
              "optionId": 0,
              "optionTitle": "",
              "quizId": 0
            },
            {
              "correctFlag": 0,
              "optionId": 0,
              "optionTitle": "",
              "quizId": 0
            },
          ],
          // quizTitle: "",
          quizType: 0, // 10 为单选，20为多选，30为判断，40为主观
          "useCount": 0,
          userId: 0
        },
        rules2: '',
        optionItem:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"]
      }
    },
    mounted() {
      this.editor = new E(this.$refs.editor)
      this.editor.customConfig.onchange = (html) =>{
        this.quizData.quizTitle = html
      }
      this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'image',  // 插入图片
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
      ]
      this.editor.create()
      //获取数据
      // this.getQuizInfo()
    },
    methods:{
      //获取试题信息
      getQuizInfo () {
        let quizId = this.$route.params.quizid
        quizInfo(quizId).then(res=>{
          console.log(res)
          this.quizData = res.data
          this.editor.txt.html(this.quizData.quizTitle)
        }).catch(error=>{
          console.log(error)
        })
      },
      // 题目类型改变
      quizTypeChange(e){
        let data1 = [{"correctFlag": 1, "optionId": 0, "optionTitle": "主观题没有正确答案", "quizId": 0}],
            data2 = [
              // 单选和多选
              {"correctFlag": 1, "optionId": 0, "optionTitle": "", "quizId": 0},
              {"correctFlag": 1, "optionId": 0, "optionTitle": "", "quizId": 0},
              {"correctFlag": 1, "optionId": 0, "optionTitle": "", "quizId": 0},
              {"correctFlag": 1, "optionId": 0, "optionTitle": "", "quizId": 0},
            ],
            data3 = [
              // 判断题
              {"correctFlag": 1, "optionId": 0, "optionTitle": "", "quizId": 0},
              {"correctFlag": 1, "optionId": 0, "optionTitle": "", "quizId": 0},
            ];
        //将数据组装为数组，若用push方法，会发生不可描述的错误
        if(e === 40){
          this.quizData.quizOption = []
          this.quizData.quizOption = data1
        } else if (e === 30){
          this.quizData.quizOption = []
          this.quizData.quizOption = data3
        }else{
          this.quizData.quizOption = []
          this.quizData.quizOption = data2
        }
      },
      //设为正确答案
      setCurrent(optionIndex){
        if(this.quizData.quizType === 20){
          this.quizData.quizOption[optionIndex].correctFlag === 1 ? this.quizData.quizOption[optionIndex].correctFlag = 2 :this.quizData.quizOption[optionIndex].correctFlag = 1
        }else{
          //单选和判断自能有一个答案
          this.quizData.quizOption.forEach((item)=>{
            item.correctFlag = 1
          })
          this.quizData.quizOption[optionIndex].correctFlag = 2
        }
      },
      //删除答案选项
      deleteOption (optionIndex){
        if(this.quizData.quizOption.length <= 2){
          this.$notify.error({
            title: '错误',
            message: '最少设置两个选项'
          });
          return false
        }
        this.$delete(this.quizData.quizOption, optionIndex);
      },
      //  添加选项
      addOption(){
        this.quizData.quizOption.push({
          "correctFlag": 0,
          "optionId": 0,
          "optionTitle": "",
          "quizId": 0
        })
      },
      toTest(){
        this.$router.push('/course/resource/test');
      },
      getingo(e){
        console.log(e)
      },
      //修改试题
      goPut(){
        let data = this.quizData
        delete data.updateTime
        console.log(data)
        putQuiz(data).then(res=>{
          if(Number(res.code) === 200){
            console.log(res)
            this.$message.success('修改成功');
          }else{
            this.$message({
              message:'修改失败',
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  $bg-color = #dcdfe6
  $c-blue = #29b5f6
  .editTest
    padding:0 5% 20px 50px
    .title
      border-bottom 2px solid $bg-color
      padding-bottom 10px
    .option-list
      display flex
      margin-bottom 10px
      .option-flag
        border 1px solid $bg-color
        color #999
        text-align center
        cursor pointer
        width 100px
      .currect-flag
        background-color $bg-color
        color $c-blue
    .btn-groud
      display flex
      justify-content center
</style>