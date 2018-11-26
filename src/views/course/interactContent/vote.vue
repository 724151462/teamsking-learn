<template>
    <div>
        <span style="display:inline-block;margin: 10px 0">
            互动 > 发起投票
        </span>
        <div>
            <el-button
            size="small"
            @click="addTab(voteContentArrValue)"
            >
                添加题目
            </el-button>
            <div>
                <el-tabs v-model="voteContentArrValue" @tab-click="handleClick" type="card" closable @tab-remove="removeTab">
                <el-tab-pane
                    v-for="item in voteContentArr"
                    :key="item.name"
                    :label="item.title"

                >
                    <el-input type="textarea" v-model="item.voteTitle" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
                <div>
                    <el-radio v-model="item.typeCheck" label="1">单选</el-radio>
                    <el-radio v-model="item.typeCheck" label="2">多选</el-radio>
                </div>
                <el-button @click="addAnswer(item)">添加答案</el-button>
                <div v-for="(answer, index) in item.answer" :key="index">
                    {{index|character}}<el-input v-model="answer.content" style="width:300px"></el-input>
                </div>
                <div>
                    <span>标题</span>
                    <el-input v-model="item.belongTitle"></el-input>
                </div>
                <div>
                    <span>所属章节</span>
                    <el-select v-model="item.chapter">
                        <el-option value="1">第一章</el-option>
                    </el-select>
                    <el-select v-model="item.section">
                        <el-option value="1.1">第一节</el-option>
                    </el-select>
                </div>
                </el-tab-pane>
                </el-tabs>
            </div>
            
        </div>
        <el-button @click="saveVoteArr">保存</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            voteContentArrValue: '',
            voteContentArr: [
                {
                    title: `第1题`,
                    name: '1',
                    voteTitle: '',
                    typeCheck: '',
                    answer: [
                        {
                            content: '123',
                        },
                        {
                            content: 'bbb',
                        }
                    ]
                },
                // {
                //     title: `第2题`,
                //     name: '2',
                //     voteTitle: '',
                //     answer: [
                //         {
                //             content: '444',
                //             id: '2.1'
                //         },
                //         {
                //             content: '555',
                //             id: '2.2'
                //         }
                //     ]
                // }
            ],
            typeCheck: '单选',
            tabIndex: 2,
            voteTitle: '',
            showTitle: '',
            temTitle: ''
        }
    },
    methods: {
        addTab(targetName) {
            let newTabName = ++this.tabIndex + '';
            this.voteContentArr.push({
            title: `第${this.voteContentArr.length+1}题`,
            name: newTabName,
            content: 'New Tab content'
            });
            this.voteContentArrValue = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.voteContentArr;
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
            this.voteContentArr = tabs.filter(tab => tab.name !== targetName);
            this.voteContentArr.forEach((tab, index) => {
                tab.title = `第${index+1}题`
            });
        },
        saveVoteArr() {
            console.log(this.voteContentArr)
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
        }
    },
    filters:{
        character(key) {
            console.log(key)
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
