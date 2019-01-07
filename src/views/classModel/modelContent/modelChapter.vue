<template>
    <div>
        <span>
            章节
        </span>
        <el-button @click="connect">
            连接
        </el-button>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
    created() {
        Cookie.set('modelActive', '1')
    },
    sockets: {
        connect: function () {
            console.log('socket connected')
        },
        customEmit: function (data) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
}
</script>

<style>

</style>
