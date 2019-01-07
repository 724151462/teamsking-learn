<template>
    <div>
        <span>
            头脑风暴
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
        Cookie.set('modelActive', '3')
    }
}
</script>

<style>

</style>
