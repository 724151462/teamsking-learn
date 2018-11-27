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
                    v-for="item in testObj.testContentArr"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
                    <el-input type="textarea" v-model="item.testTitle" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
                </el-tab-pane>
                </el-tabs>
            </div>
            <div class="margin-sides">
                    <span>标题</span>
                </div>
                <div>
                    <el-input style="width:600px" v-model="testObj.belongTitle"></el-input>
                </div>
                <div class="margin-sides">
                    <span>所属章节</span>
                </div>
                <div>
                    <el-select v-model="testObj.chapter">
                        <el-option value="1">第一章</el-option>
                    </el-select>
                    <el-select v-model="testObj.section">
                        <el-option value="1.1">第一节</el-option>
                    </el-select>
                </div>
                <div>
                    <el-checkbox v-model="testObj.orderDesc">
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
                    <el-input v-model="testObj.retryTimes" class="small-input" size="small" style="margin:10px"></el-input>次
                    <span class="tip">学生可重复答题次数，成绩取最高分</span>
                </div>
                <div class="margin-sides">
                    <span style="margin-right:10px">查看时机</span>
                    <el-radio v-model="testObj.seeAnswer" label="1">测试活动结束后查看答案</el-radio>
                    <el-radio v-model="testObj.seeAnswer" label="2">交卷后查看答案</el-radio>
                </div>
        </div>
        <el-button @click="savetestArr">保存</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            testContentArrValue: '1',
            testObj: {
                belongTitle: '',
                chapter: '',
                section: '',
                orderDesc: false,
                retryTimes: '',
                testHour: '',
                testMinute: '',
                testContentArr: [
                    {
                        title: `第1题`,
                        name: '1',
                        testTitle: '',
                        typeCheck: '',
                    },
                ],
            },
            tabIndex: 1,
            testTitle: '',
            showTitle: '',
        }
    },
    methods: {
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.testObj.testContentArr.push({
            title: `第${this.testObj.testContentArr.length+1}题`,
            name: newTabName,
            content: 'New Tab content'
            });
            this.testContentArrValue = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.testObj.testContentArr;
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
            this.testObj.testContentArr = tabs.filter(tab => tab.name !== targetName);
            this.testObj.testContentArr.forEach((tab, index) => {
                tab.title = `第${index+1}题`
            });
        },
        savetestArr() {
            console.log(this.testObj)
        },
        handleClick(tab,event) {
            
        },
    },
}
</script>

<style>

</style>
