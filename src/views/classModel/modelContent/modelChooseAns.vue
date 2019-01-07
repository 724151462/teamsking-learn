<template>
    <div>
        <span>
            选答
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
        Cookie.set('modelActive', '5')
    }
}
</script>

<style>

</style>
