<template>
    <div>
        <div class="header-container">
            <div>
                <img :src="require('@/assets/images/homeWork.png')" alt="">
                <span style="margin: 0 20px 0 10px">作业</span>
                <span>共1道题 | 7人作答</span>
            </div>
            <div>
                <el-button>导出结果</el-button>
                <el-button>返回</el-button>
            </div>
        </div>
        <div>
            <div>
                <span>|</span><span>任务详情</span>
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item title="评分点" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
            </el-collapse>
            <span style="display:inline-block;margin-top: 20px">本次作业分值 10 分</span>
            <div class="sb-container">
                <span>总体评分</span>
                <div>
                    <span>10分 </span>
                    |
                    <span> 占作业分值 100%</span>
                </div>
            </div>
            <div>
                <span>|</span><span>参考答案</span>
                <div class="margin">
                    <span>没有参考答案</span>
                </div>
            </div>
            <div class="margin">
                <span>|</span><span>作业结果</span>
                <div class="sb-container">
                    <div class="margin">
                        <el-radio v-model="workType" label="1">全部(6)</el-radio>
                        <el-radio v-model="workType" label="2">只看未评作业(1)</el-radio>
                    </div>
                    <div>
                        <span style="color: rgb()">按照提交时间排序</span>
                    </div>
                </div>
                <div class="answer-item">
                    <div style="display:flex; justify-content: space-between">
                        <div>
                            <img width="40" :src="require('@/assets/images/brainStorme.png')" alt="">
                            <div style="display: inline-block;margin-left:10px">
                                <span style="display: block;margin-bottom: 5px">陈圣舒</span>
                                <span>2018-10-13 16:03:33</span>
                            </div>
                        </div>
                    </div>
                    <div  class="answer">
                        <span style="display:block; border-bottom: 1px solid rgb(240,240,240)">作业任务回答：即使是在本金位置的货币制度下。。。。。。。。</span>
                        <span>xx月xx日 00:00:00 提交</span>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import {
    homeWorkList
}from '@/api/course'
export default {
    data() {
        return {
            activeNames: ['1'],
            workType: '1'
        }
    },
    mounted() {
        
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
.sb-container
    display flex
    justify-content space-between
    margin 20px auto
.margin
    margin-top 20px
    .answer-item
        margin 0 auto
    .answer
        margin 10px 20px
        padding 10px 20px
        background rgb(250, 250, 250)
</style>
