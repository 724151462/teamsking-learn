<template>
    <div>
        <modelAside 
        @dialogShow="dialogShow" 
        :sourceList="testList" 
        :textObj="textObj"></modelAside>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import modelAside from "@/components/modelAside"
export default {
    data() {
        return{
            testList: [],
            textObj: {
                addBtn: "添加头脑风暴",
                interactItemBtn: "开始活动"
            }
        }
    },
    methods: {
        dialogShow(value) {
            alert(value)
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

<style>

</style>
