<template>
    <div>
        <span>
            章节
        </span>
        <el-button @click="clickButton">
            连接
        </el-button>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import {
    connect
} from '@/utils/socket'
export default {
    created() {
        Cookie.set('modelActive', '1')
    },
    methods: {
        clickButton: function (data) {
            connect()

        }
    }
}
</script>

<style>

</style>
