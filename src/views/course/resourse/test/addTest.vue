<template>
  <div class="addTest">
    <mb-nav :pathList="[{path:'/course/resource/test',name:'试题管理'}]" nowName = '添加试题'></mb-nav>
    <div style="padding-right: 35%">
      <el-form :model="testData" ref="testData" >
        <el-form-item label="题干" required>
          <br>
          <div ref="editor" style="text-align:left"></div>
        </el-form-item>
        <el-form-item label="题型" required>
          <el-radio-group v-model="testData.quizType" @change="quizTypeChange">
            <el-radio :label="10">单选</el-radio>
            <el-radio :label="20">多选</el-radio>
            <!-- 目前没有判断和主观题型-->
            <!--<el-radio :label="30">判断题</el-radio>-->
            <el-radio :label="30">主观</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项" required>
          <br>
          <div v-if="testData.quizType===30">
            <p style="padding-left: 40px">主观题无固定答案</p>
          </div>
          <div class="option-list"
               v-for="(option, optionIndex) in testData.quizOption"
               :key="option.id"
               v-else>
            <div>{{optionItem[optionIndex]}}、</div>
            <div style="flex: 1">
              <el-input
                placeholder="请输入内容"
                v-model="testData.quizOption[optionIndex].optionTitle"
                clearable>
              </el-input>
            </div>
            <div class="option-flag" v-if="testData.quizOption[optionIndex].correctFlag === 0" @click="setCurrent(optionIndex)">设为正确答案</div>
            <div class="option-flag currect-flag" v-else @click="setCurrent(optionIndex)">正确答案</div>
            <div style="margin: 0 20px;color: red" @click="deleteOption(optionIndex)"><i class="el-icon-error"></i></div>
          </div>
          <div v-show="testData.quizType !== 40"><el-button type="text" @click="addOption">+添加选项</el-button></div>
        </el-form-item>
        <el-form-item label="难度" required>
          <el-radio-group v-model="testData.difficulty">
            <el-radio :label="10">简单</el-radio>
            <el-radio :label="20">中等</el-radio>
            <el-radio :label="30">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="解析">
          <br>
          <el-input
            type="textarea"
            :rows="5"
            class="ans-text"
            placeholder="请输入题目解析"
            v-model="testData.quizAnalysis">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btn-groud">
        <el-button type="primary" style="margin-right: 40px" @click="saveQuiz">保存</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  import mbNav from '@/components/breadcrumb'
  import {saveQuiz} from '@/api/library'

  export default {
    name: "addTest",
    components:{
      mbNav
    },
    created () {
      this.testData.catalogId = Number(this.$route.params.catalog)
    },
    data () {
      return {
        testData:{
          catalogId: 0,
          // creatorName: "",
          difficulty: 10, //难度 10:简单 20:中等 30:困难
          quizAnalysis: "",
          quizOption: [
            {
              "correctFlag": 0,
              "optionTitle": "",
            },

            {
              "correctFlag": 0,
              "optionTitle": "",
            },
            {
              "correctFlag": 0,
              "optionTitle": "",
            },
            {
              "correctFlag": 0,
              "optionTitle": "",
            },
          ],
          quizTitle: "",
          quizType: 10, // 10 为单选，20为多选，30为主观
        },
        optionItem:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"]
      }
    },
    mounted() {
      var editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.testData.quizTitle = html
      }
      editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        // 'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
      ]
      editor.customConfig.zIndex = 10
      editor.create()
    },
    methods:{
      // 题目类型改变
      quizTypeChange(e){
        let data1 = [{"correctFlag": 1, "optionTitle": "主观题没有正确答案"}],
          data2 = [
            // 单选和多选
            {"correctFlag": 0, "optionTitle": ""},
            {"correctFlag": 0, "optionTitle": ""},
            {"correctFlag": 0, "optionTitle": ""},
            {"correctFlag": 0, "optionTitle": ""},
          ],
          data3 = [
            // 判断题
            {"correctFlag": 0, "optionId": 0, "optionTitle": "", "quizId": 0},
            {"correctFlag": 0, "optionId": 0, "optionTitle": "", "quizId": 0},
          ];
        //将数据组装为数组，若用push方法，会发生不可描述的错误
        if(e === 30){
          this.testData.quizOption = []
          this.testData.quizOption = data1
        } else if (e === 40){
          this.testData.quizOption = []
          this.testData.quizOption = data3
        }else{
          this.testData.quizOption = []
          this.testData.quizOption = data2
        }
      },
      //设为正确答案
      setCurrent(optionIndex){
        if(this.testData.quizType === 20){
          this.testData.quizOption[optionIndex].correctFlag === 0 ? this.testData.quizOption[optionIndex].correctFlag = 1 :this.testData.quizOption[optionIndex].correctFlag = 0
        }else{
          //单选和判断自能有一个答案
          this.testData.quizOption.forEach((item)=>{
            item.correctFlag = 0
          })
          this.testData.quizOption[optionIndex].correctFlag = 1
        }
      },
      //删除答案选项
      deleteOption (optionIndex){
        if(this.testData.quizOption.length <= 2){
          this.$notify.error({
            title: '错误',
            message: '最少设置两个选项'
          });
          return false
        }
        this.$delete(this.testData.quizOption, optionIndex);
      },
      //  添加选项
      addOption(){
        this.testData.quizOption.push({
          "correctFlag": 0,
          "optionTitle": "",
        })
      },
      toTest(){
        this.$router.push('/course/resource/test');
      },
      //保存试题前的验证
      filterQuiz(){
        let isEmpty = false, //是否存在标题为空的试题选项
            flagArr = []  // 存放答案的数组

        if(this.testData.quizTitle.length === 0){
          this.$notify({
            message: '请输入题干',
            type: 'warning',
          });
          return false
        }
        if(this.testData.quizType!==30){
          this.testData.quizOption.forEach((item)=>{
            flagArr.push(item.correctFlag)
            if(item.optionTitle == ''){
              isEmpty = true
            }
          })
          if(isEmpty){
            this.$notify({
              message: '请将为空的试题选项删除',
              type: 'warning',
            });
            return false
          }

          if(this.testData.quizType !== 3){
            if(flagArr.indexOf(1) === -1){
              this.$notify({
                message: '请至少设置一个正确选项',
                type: 'warning',
              });
              return false
            }
          }
        }

      },
      // 保存试题
      saveQuiz () {
        this.filterQuiz() //保存试题前的数据验证

        let data = this.testData
        let loading = this.$loading(this.loadingCss)
        saveQuiz(data).then(res=>{
          loading.close()
          console.log(res)
          if(Number(res.code) === 200) {
            this.$message.success('试题添加成功')
            this.$router.push('/course/resource/test');
          }else{
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
  $bg-color = #dcdfe6
  $c-blue = #29b5f6
  .addTest
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