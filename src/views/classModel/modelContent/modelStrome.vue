<template>
    <div>
        <el-container>
            <modelAside 
            @dialogShow="dialogShow" 
            :sourceList="stormList" 
            :textObj="stormObj"
            :dataKey="dataKey"
            @activeEvent="activeStrome"
            @beginEvent="beginStrome"></modelAside>
            <el-main>
                <span>头脑风暴</span>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import modelAside from "@/components/modelAside"
export default {
    data() {
        return{
            stormList: [{
                stormId: 1,
                stromTitle: '测试头脑风暴'
            }],
            stormObj: {
                addBtn: "添加头脑风暴",
                interactItemBtn: "开始活动"
            },
            dataKey: {
                itemId: 'stromeId',
                itemTitle: 'stromTitle' 
            },
        }
    },
    methods: {
        dialogShow(value) {
            alert(value)
        },
        activeStrome(value) {
            
        },
        beginStrome() {

        }
    },
    created() {
        Cookie.set('modelActive', '3')
    },
    components: {
        modelAside
    }
}
</script>

<style lang="stylus" scoped>
    .el-main 
        padding-left: 300px;

</style>

