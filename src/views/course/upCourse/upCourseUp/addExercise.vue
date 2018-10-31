<template>
  <div>
    <div>
      <el-form :model="addExercise" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="难度：" required>
          <el-select v-model="addExercise.difficulty" placeholder="请选择">
            <el-option
                v-for="item in difficultyList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="知识点：" required>
          <el-input v-model="addExercise.skillPoint" style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label="题干：" required>
          <div id="dry"></div>
        </el-form-item>

        <el-form-item label="题型：" required>
          <el-radio v-model="addExercise.quizType" label="10">单选</el-radio>
          <el-radio v-model="addExercise.quizType" label="20">多选</el-radio>
        </el-form-item>

        <el-form-item label="选项：" required>
          <div style="margin-bottom: 20px;" v-for="(list, index) in options">
            {{optionList[index]}}、
            <el-input v-model="list.optionTitle" style="width: 300px;"></el-input>
            <el-checkbox-group v-model="list.correctFlag" style="display:inline-block;vertical-align: middle;">
              <el-checkbox-button :key="list.correctFlag" @change="yesCorrect(index)">设为正确答案</el-checkbox-button>
            </el-checkbox-group>
            <i class="el-icon-circle-close" style="font-size: 30px;margin-left: 10px;vertical-align: middle;cursor:pointer" @click="deleteOption(index)"></i>
          </div>
          <el-button type="primary" style="margin-left: 30px;" @click="addOption">添加选项</el-button>
        </el-form-item>

        <el-form-item label="解析：" required>
          <div id="analysis"></div>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: right;">
      <el-button @click="closes">取消</el-button>
      <el-button type="primary" @click="yesGo">确定</el-button>
    </div>
  </div>
</template>

<script>
  import wangEditors from 'wangeditor'
  import { saveQuiz } from '../../../../api/course'
  export default {
    data(){
      return{
        addExercise:{
          difficulty:'10',  //难度 10:简单 20:中等 30:困难
          skillPoint:'',  //知识点
          quizTitle:'', //题干
          quizType:'10',  //题型 10 单选 20 多选
          quizOption:[],  //这里是正确答案合集
          analysis:'', //解析
          courseId:this.$route.query.courseid
        },
        difficultyList:[
          {
            value:'10',
            label:'简单'
          },
          {
            value:'20',
            label:'中等'
          },
          {
            value:'30',
            label:'困难'
          }
        ],
        optionList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        options:[
          {
            optionTitle:'',
            correctFlag:false
          }
        ],
        dryFun:null,
        analysisFun:null
      }
    },
    methods:{
      closes () {
        this.$emit('yesExrecises','close')
      },
      yesCorrect (index) {
        if (Number(this.addExercise.quizType) === 10){
          for(let i = 0; i < this.options.length; i++){
            if(i === index){
              continue
            }else{
              this.options[i].correctFlag = false
            }
          }
        }
      },
      yesGo () {
        let data = JSON.parse(JSON.stringify(this.addExercise))
        let options = JSON.parse(JSON.stringify(this.options))
        for(let i = 0; i < options.length; i++) {
          if (!options[i].correctFlag) {
            options[i].correctFlag = 2
          }else{
            options[i].correctFlag = 1
          }
        }
        data.quizOption = options
        saveQuiz(data).then(res=>{
          console.log(res)
          if (Number(res.code) === 200) {
            //保存成功
            this.$emit('yesExrecises')
          }else{
            this.$message({
              message:res.msg,
              type:'error'
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      },
      deleteOption (e) {
        this.options.splice(e,1)
      },
      addOption () {
        if(this.options.length >= this.optionList.length){
          this.$message({
            message:'答案创建上限',
            type:'error'
          })
          return false
        }
        this.options.push({optionTitle:'',correctFlag:false})
      }
    },
    mounted(){
      let self = this
      this.dryFun = new wangEditors('#dry')
      this.dryFun.customConfig.onblur = function (html){
        self.addExercise.quizTitle = html
      }
      this.dryFun.create()
      this.analysisFun = new wangEditors('#analysis')
      this.analysisFun.customConfig.onblur = function (html){
        self.addExercise.analysis = html
      }
      this.analysisFun.create()
    }
  }
</script>
