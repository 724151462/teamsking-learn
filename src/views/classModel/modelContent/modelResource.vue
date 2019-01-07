<template>
    <div>
        <span>
            资源库
        </span>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
    data() {
        return{

        }
    },
    created() {
        Cookie.set('modelActive', '6')
    }
}
</script>

<style>

</style>
