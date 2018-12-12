<template>
    <div>
        <div class="header-container">
            <div>
                <img :src="require('@/assets/images/vote.png')" alt="">
                <span style="margin: 0 20px 0 10px">投票进度</span>
                <span>共1道题 | 50人作答</span>
            </div>
            <div>
                <el-button>导出结果</el-button>
                <el-button>返回</el-button>
            </div>
        </div>
        
        <div class="main">
            <span style="color:rgb(130,178,198);float: right;margin-right:100px">提示：按照提交顺序排序</span>
            <div style="margin-top: 20px">
                <span>题目1：在以下能有效防控欠款产生的措施中，。。。。。。</span>
                <span style="color:rgb(130,178,198)">(单选题)</span>
            </div>
            <div class="answer-container">
                <div class="answer-item">
                    <span>A.啊啊啊啊啊啊啊啊啊啊啊</span>
                    <div>
                        <el-progress :text-inside="true" class="progress" :stroke-width="18" :percentage="20"></el-progress>
                        <span style="margin-left: 5px;color:rgb(130,178,198)">25人</span>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
    margin 20px auto
    .progress
        width: 300px; display: inline-block
    .answer-item
        display flex
        justify-content space-between
        width 90%
        margin 0 auto
</style>
