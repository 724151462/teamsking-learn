<template>
    <div>
        <span style="display:inline-block;margin: 10px 0">
            <router-link :to="{name: '互动'}">互动</router-link> > 发布测试
        </span>
        <div>
            <el-button
            size="small"
            @click="addTab(testContentArrValue)"
            >
                添加题目
            </el-button>
            <div>
                <el-tabs v-model="testContentArrValue" @tab-click="handleClick" type="card" closable @tab-remove="removeTab">
                <el-tab-pane
                    v-for="item in testObj.quizIds"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
                    <el-input type="textarea" v-model="item.examTitle" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
                </el-tab-pane>
                </el-tabs>
            </div>
            <div class="margin-sides">
                    <span>标题</span>
                </div>
                <div>
                    <el-input style="width:600px" v-model="testObj.examTitle"></el-input>
                </div>
                <div class="margin-sides">
                    <span>所属章节</span>
                </div>
                <div>
                    <el-select v-model="testObj.chapterId">
                        <el-option v-for="item in chapterList" :key="item.chapterId" :label="item.chapterName" :value="item.chapterId">{{item.chapterName}}</el-option>
                    </el-select>
                </div>
                <div>
                    <el-checkbox v-model="testObj.disorderOrder" true-label="1" false-label="2">
                        题目乱序
                    </el-checkbox>
                </div>
                <div class="margin-sides">
                    <span>测试时长</span>
                    <el-input class="small-input" size="small" style="margin:10px" v-model="testObj.testHour"></el-input>小时
                    <el-input class="small-input" size="small" style="margin:10px" v-model="testObj.testMinute"></el-input>分钟
                    <span class="tip">测试总时长，学生需在此时间内完成作答。</span>
                </div>
                <div class="margin-sides">
                    <span>重做次数</span>
                    <el-input v-model="testObj.repeatTimes" class="small-input" size="small" style="margin:10px"></el-input>次
                    <span class="tip">学生可重复答题次数，成绩取最高分</span>
                </div>
                <div class="margin-sides">
                    <span style="margin-right:10px">查看时机</span>
                    <el-radio v-model="testObj.showAnswer" label="10">测试活动结束后查看答案</el-radio>
                    <el-radio v-model="testObj.showAnswer" label="20">交卷后查看答案</el-radio>
                </div>
        </div>
        <el-button @click="savetestArr">保存</el-button>
    </div>
</template>

<script>
import {
    testAdd,
    chaptersListSimple
} from '@/api/course'
export default {
    data() {
        return {
            chapterList: [],
            testContentArrValue: '1',
            testObj: {
                courseId: this.$route.query.id,
                belongTitle: '',
                chapterId: '',
                disorderOrder: false,
                repeatTimes: '',
                testHour: '',
                testMinute: '',
                quizIds: [
                    {
                        title: `第1题`,
                        name: '1',
                        examTitle: '',
                        typeCheck: '',
                    },
                ],
                list: '',
                examTitle: '',
                showAnswer: "10"
            },
            tabIndex: 1,
        }
    },
    mounted() {
        chaptersListSimple({courseId: this.testObj.courseId})
        .then(response=> {
            this.chapterList = response.data
        })
    },
    methods: {
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.testObj.quizIds.push({
            title: `第${this.testObj.quizIds.length+1}题`,
            name: newTabName,
            content: 'New Tab content'
            });
            this.testContentArrValue = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.testObj.quizIds;
            let activeName = this.testContentArrValue;
            if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                    activeName = nextTab.name;
                }
                }
            });
            }
            
            this.testContentArrValue = activeName;
            this.testObj.quizIds = tabs.filter(tab => tab.name !== targetName);
            this.testObj.quizIds.forEach((tab, index) => {
                tab.title = `第${index+1}题`
            });
        },
        savetestArr() {
            let minute = Number(this.testObj.testHour) * 60 + Number(this.testObj.testMinute)
            this.testObj.limitTime = minute
            console.log(this.testObj)
            testAdd(this.testObj)
            .then(response=> {
                console.log(response.data)
            })
        },
        handleClick(tab,event) {
            
        },
    },
}
</script>

<style>

</style>
