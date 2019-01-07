<template>
    <div>
        <span>
            投票
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
        Cookie.set('modelActive', '4')
    }
}
</script>

<style>

</style>
