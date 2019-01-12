<template>
    <div>
        <modelAside @dialogShow="dialogShow" :sourceList="testList"></modelAside>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import modelAside from "@/components/modelAside"
export default {
    data() {
        return{
            testList: []
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
