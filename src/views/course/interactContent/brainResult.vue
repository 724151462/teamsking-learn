<template>
    <div>
        <div class="header-container">
            <div>
                <img :src="require('@/assets/images/vote.png')" alt="">
                <span style="margin: 0 20px 0 10px">头脑风暴</span>
                <span>{{stormList.length}}人参与</span>
            </div>
            <div>
                <!-- <el-button>导出结果</el-button> -->
                <router-link :to="{path: '/course/list/interact', query: {id: $route.query.id}}"><el-button>返回</el-button></router-link>
            </div>
        </div>
        
        <div class="main">
            <!-- <div>
                <span>题目1：金属货币制度下是不是就不会出现通货膨胀，。。。。。。</span>
                <span style="color:rgb(130,178,198)">(单选题)</span>
            </div> -->
            <div v-if="stormList.length === 0">
                <span>这道题还没有人回答</span>
            </div>
            <div class="answer-container" v-else>
                <div class="answer-item" v-for="(item,index) in stormList" :key="index">
                    <div style="display:flex; justify-content: space-between">
                        <div>
                            <img width="40" :src="require('@/assets/images/user.png')" alt="">
                            <div style="display: inline-block;margin-left:10px">
                                <span style="display: block;margin-bottom: 5px">{{item.realName}}</span>
                                <span>{{item.createTime}}</span>
                            </div>
                        </div>
                    </div>
                    <div  class="answer">
                        <span>{{item.stormContent}}</span>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import {
    interactBS
} from '@/api/course'
export default {
    data() {
        return {
            brainParams: {
                stormId: this.$route.query.interactId
            },
            stormList: []
        }
    },
    mounted() {
        interactBS(this.brainParams)
        .then(response=> {
            this.stormList = response.data
        })
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
        width 90%
        margin 0 auto
    .answer
        margin 10px 20px
        padding 10px 20px
        background rgb(240, 241, 243)
</style>
