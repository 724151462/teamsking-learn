<template>
    <div>
        <modelAside></modelAside>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import modelAside from "@/components/modelAside"
export default {
    data() {
        return{

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
