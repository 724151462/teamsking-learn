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
                    :name="item.name"
                >
                    <el-input type="textarea" v-model="item.voteTitle" placeholder="请输入题目" style="width:600px;" autofocus="autofocus"/>
                <div>
                    <el-radio v-model="typeCheck" label="单选"></el-radio>
                    <el-radio v-model="typeCheck" label="多选"></el-radio>
                </div>
                <el-button @click="addAnswer(item)">添加答案</el-button>
                <div v-for="(item, index) in item.answer" :key="index">
                    A<el-input v-model="item.content" style="width:300px"></el-input>
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
                    name: '',
                    voteTitle: '',
                    answer: [
                        {
                            content: '123'
                        },
                        {
                            content: 'bbb'
                        }
                    ]
                }
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
        addAnswer(value) {
            console.log('答案', value)
        }
    }
}
</script>

<style>

</style>
