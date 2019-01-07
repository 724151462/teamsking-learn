<template>
    <div>
        <span>
            测验
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
        Cookie.set('modelActive', '2')
    }
}
</script>

<style>

</style>
