<template>
    <div>
        <span style="display:inline-block;margin: 10px 0">
            <router-link :to="{name: '互动'}">互动</router-link> > 作业/小组任务
        </span>
        <div>
            <el-input type="textarea" v-model="homeWork.subject" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
            <div class="margin-sides">
                <i class="el-icon-picture"></i>
                <span>添加图片</span>
            </div>
            <div>
                <span>标题</span>
                <div>
                    <el-input  class="margin-sides" placeholder="请添加标题" style="width:600px;" v-model="homeWork.title"></el-input>
                </div>
            </div>
            <div>
                <span>所属章节</span>
                <div>
                    <el-select class="margin-sides" v-model="homeWork.belong.chapter">
                    <el-option value="1">第一章</el-option>
                    </el-select>
                    <el-select v-model="homeWork.belong.section">
                        <el-option value="1.1">第一节</el-option>
                    </el-select>
                </div>
                
            </div>
            
            <div>
                <div>
                    <div>任务小组划分方式：学生以小组为单位完成此活动，并按小组提交结果</div>
                </div>
            </div>
            <div>
                <el-select class="margin-sides" v-model="homeWork.group">
                    <el-option v-for="(group,index) in groupList" :key="index" :label="group.name" :value="group.id"></el-option>
                </el-select>
                <span style="margin-left:100px">提交截止</span><el-input type="text" v-model="homeWork.pubTime" size="small" style="width: 60px;"></el-input>天后公布成绩
            </div>
            <div>
                <span>设置评分点（评分标准，助教评分可参考）</span>
                <span v-if="normalScore">已分配{{scoreTotal}}分，还可分配{{leftScore}}分</span>
                <span v-if="overScore" style="color: red">已超出{{leftScore}}分</span>
                <div class="margin-sides" style="margin-left: 0">
                    <el-button @click="addScorePoint">+添加评分点</el-button>
                    <div v-for="(item, index) in homeWork.scorePoint" :key="index" class="margin-sides">
                        <el-input v-model="item.content" style="width: 400px" placeholder="输入评分点内容"></el-input>
                        <el-input v-model="item.score" style="width: 60px;margin-left:20px"></el-input>  分
                        <span>占作业分值 {{item.score+'%'}}</span>
                        <span class="delBtn" @click="delScorePoint(index)">删除</span>
                    </div>
                </div>
                <el-checkbox v-model="homeWork.allowAssistant" class="margin-sides">
                    允许助教评分
                </el-checkbox>
            </div>
        </div>
        <el-button @click="saveHomework">保存</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            normalScore: true,
            overScore: false,
            homeWork: {
                subject: '',
                title: '',
                image: [],
                pubTime: '',
                allowAssistant: false,
                belong: {
                    chapter: '',
                    section: ''
                },
                scorePoint:[],
            },
            groupList: [
                {
                    name: '五月天',
                    id: 'mayday'
                },
                {
                    name: '纵贯线',
                    id: 'zgx'
                },
                {
                    name: '动力火车',
                    id: 'dlhc'
                }
            ]
        }
    },
    methods: {
        // 添加评分点
        addScorePoint() {
            this.homeWork.scorePoint.push({
                content: '',
                score: 0
            })
        },
        // 删除评分点
        delScorePoint(index) {
            this.homeWork.scorePoint.splice(index, 1)
        },
        // 提交数据
        saveHomework() {
            console.log(this.homeWork)
        }
    },
    computed: {
        scoreTotal() {
            let total = 0
            this.homeWork.scorePoint.forEach(element => {
                total += Number(element.score)
            });
            if(total>100) {
                this.overScore = true
                this.normalScore = false
            }else{
                this.overScore = false
                this.normalScore = true
            }
            return total
        },
        leftScore() {
            return Math.abs(100 - this.scoreTotal)
        }
    }
}
</script>

<style>

</style>
