<template>
    <div>
        <span style="display:inline-block;margin: 10px 0">
            <router-link :to="{name: '互动'}">互动</router-link> > 发起投票
        </span>
        <div>
            <el-button
            size="small"
            @click="addTab(voteContentArrValue)"
            >
                添加题目
            </el-button>
            <div class="margin-sides">
                <el-tabs v-model="voteContentArrValue" @tab-click="handleClick" type="card" closable @tab-remove="removeTab">
                <el-tab-pane
                    v-for="item in voteObj.voteContentArr"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
                    <el-input type="textarea" v-model="item.voteTitle" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
                <div class="margin-sides">
                    <el-radio v-model="item.typeCheck" label="1">单选</el-radio>
                    <el-radio v-model="item.typeCheck" label="2">多选</el-radio>
                </div>
                <el-button @click="addAnswer(item)">添加答案</el-button>
                <div v-for="(answer, index) in item.answer" :key="index" class="margin-sides">
                    {{index|character}}<el-input v-model="answer.content" style="width:300px"></el-input> <span class="delBtn" @click="delAnswer(item,index)">删除</span>
                </div>
                </el-tab-pane>
                </el-tabs>
            </div>
            <div class="margin-sides">
                <span>标题</span>
            </div>
            <div class="margin-sides">
                <el-input v-model="voteObj.voteContentArr.belongTitle"></el-input>
            </div>
            <div class="margin-sides">
                <span>所属章节</span>
            </div>
            <div>
                
                <el-select v-model="voteObj.voteContentArr.chapter" class="margin-sides">
                    <el-option value="1">第一章</el-option>
                </el-select>
                <el-select v-model="voteObj.voteContentArr.section">
                    <el-option value="1.1">第一节</el-option>
                </el-select>
            </div>
        </div>
        <el-button @click="saveVoteArr">保存</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            voteContentArrValue: '1',
            voteObj: {
                belongTitle: '',
                chapter: '',
                section: '',
                voteContentArr: [
                    {
                        title: `第1题`,
                        name: '1',
                        voteTitle: '',
                        typeCheck: '',
                        answer: [
                            {
                                content: '',
                            },
                            {
                                content: '',
                            },
                            {
                                content: '',
                            },
                            {
                                content: '',
                            },
                        ]
                    },
                ],
            },
            typeCheck: '单选',
            tabIndex: 1,
            voteTitle: '',
            showTitle: '',
            temTitle: ''
        }
    },
    methods: {
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            console.log('newTabName', newTabName)
            this.voteObj.voteContentArr.push({
            title: `第${this.voteObj.voteContentArr.length+1}题`,
            name: newTabName,
            content: 'New Tab content',
            answer: [
                        {
                            content: '',
                            id: ''
                        },
                        {
                            content: '',
                            id: ''
                        },
                        {
                            content: '',
                            id: ''
                        },
                        {
                            content: '',
                            id: ''
                        }
                    ]
            });
            this.voteContentArrValue = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.voteObj.voteContentArr;
            let activeName = this.voteContentArrValue;
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
            
            this.voteContentArrValue = activeName;
            this.voteObj.voteContentArr = tabs.filter(tab => tab.name !== targetName);
            this.voteObj.voteContentArr.forEach((tab, index) => {
                tab.title = `第${index+1}题`
            });
        },
        saveVoteArr() {
            console.log(this.voteObj.voteContentArr)
        },
        handleClick(tab,event) {
            
        },
        // 添加答案
        addAnswer(subject) {
            console.log('答案', subject)
            subject.answer.push(
                {
                    content: '',

                }
            )
        },
        // 删除答案
        delAnswer(item, index) {
            console.log(item, index)
            item.answer.splice(index, 1)
        }
    },
    filters:{
        character(key) {
            // console.log(key)
            // return key
            switch (key) {
                case 0:
                    return 'A'
                    break;
                case 1:
                    return 'B'
                    break;
                case 2:
                    return 'C'
                    break;
                case 3:
                    return 'D'
                case 4:
                    return 'E'
                    break;
            }
        }
    }
}
</script>

<style>

</style>
