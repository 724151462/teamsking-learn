<template>
    <div>
        <div class="header-container">
            <div>
                <img :src="require('@/assets/images/test.png')" alt="">
                <span style="margin: 0 20px 0 10px">测试</span>
                <span>共1道题 | 7人作答</span>
            </div>
            <div>
                <el-button>导出结果</el-button>
                <el-button>返回</el-button>
            </div>
        </div>
        
        <div class="main">
            <div style="margin-top: 20px">
                <span>题目1：在以下能有效防控欠款产生的措施中，。。。。。。</span>
                <span style="color:rgb(130,178,198)">(单选题)</span>
            </div>
            <div class="answer-container">
                <span>排名</span>
                <span>姓名</span>
                <span>学号</span>
                <span>正确题数</span>
                <span>正确率</span>
                <span>用时</span>
                <span>分数</span>
            </div>
            <div v-for="(item, index) in students" :class="answer-container" :key="item.id" style="margin-top:30px">
                <span>{{item.ranking}}</span>
                <div class="user-avatar">
                    <img :src="item.avatar" width="30" alt="">
                    <span>{{item.name}} </span>
                </div>
                <span>{{item.studentNo}}</span>
                <span>{{item.correctCount}}</span>
                <span>{{item.correctRate}}</span>
                <span>{{item.time}}</span>
                <span>{{item.grade}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            students: [
                {
                    ranking: 1,
                    name: '张三',
                    avatar: require('@/assets/images/vote.png'),
                    studentNo: 3148117108,
                    grade: 98,
                    correctCount: 48,
                    correctRate: 98,
                    time: 800,
                    id: 1001
                },
                {
                    ranking: 2,
                    name: '张四',
                    avatar: require('@/assets/images/test.png'),
                    studentNo: 3148117111,
                    grade: 97,
                    correctCount: 46,
                    correctRate: 97,
                    time: 800,
                    id: 1002
                },
                {
                    ranking: 3,
                    name: '张五',
                    avatar: require('@/assets/images/vote.png'),
                    studentNo: 3148117122,
                    grade: 96,
                    correctCount: 45,
                    correctRate: 96,
                    time: 800,
                    id: 1003
                },
                {
                    ranking: 4,
                    name: '张六',
                    avatar: require('@/assets/images/homeWork.png'),
                    studentNo: 3148117156,
                    grade: 95,
                    correctCount: 44,
                    correctRate: 95,
                    time: 800,
                    id: 1004
                }
            ]
        }
    }
}
</script>

<style lang="stylus" scoped>
.header-container
    display flex
    height 50px
    justify-content space-between
    padding 10px 20px
    div
        display flex
        align-items center
    img 
        width 30px
        height 30px
.main
    width 96%;
    margin 10px auto
    padding 30px
    background rgb(247,248,250)
.answer-container
    display flex
    justify-content space-between
    margin 20px auto
    width 94%
    .user-avatar
        display flex
        align-items center
        span
            width 50px !important
    span
        width 80px
        text-align center

</style>
