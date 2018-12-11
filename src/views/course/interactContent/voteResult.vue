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
            </div>
        </div>
        
        
    </div>
</template>

<script>
export default {

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
</style>
