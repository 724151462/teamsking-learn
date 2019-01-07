<template>
    <el-main>
        <div class="inner-container">
            <div style="font-size: 1.5em">课堂模式已开启，课程资源及课程活动将自动投至大屏幕。</div>
            <div style="font-size: 3em">国际贸易服务</div>
            <div style="font-size: 2em">陈老师</div>
            <div style="font-size: 2.5em;cursor: pointer" @click="enterClass">进入课堂</div>
            <div style="display:flex; align-items: flex-start; width: 100%; font-size: 2em"><span style="margin-left:1em">课程号:56734</span></div>
        </div>
    </el-main>
</template>

<script>
export default {
    methods: {
        enterClass() {
            this.$router.push({path: "/course/classchapter",query: {id: this.$route.query.id}})
        }
    }
};
</script>

<style lang="stylus" scoped>
@media screen and (min-width:400px) and (max-width:700px) { 
.el-main{
font-size: 20px!important;
} 
}
@media screen and (min-width:1500px) and (max-width:2000px) { 
.el-main{
font-size: 15px!important;
}
} 
    .el-main
        display flex
        align-items center
        justify-content center
        font-size 62.5%
        background-color: rgb(63,159,255)
        color: #333
        text-align: center
        width: 100%
        height: 100%
        .inner-container
            display flex
            align-items center
            justify-content space-around
            flex-direction column
            color #fff
            width 90%
            height 90%
            border 10px solid #fff
            
</style>

