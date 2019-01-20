<template></template>

<script>
export default {
  data() {
    return {
      id: ""
    };
  },
  mounted() {
    this.$socket.emit("connect", connectMsg); //触发connect事件
  },
  sockets: {
    connect() {
      this.id = this.$socket.id;
      this.$socket.emit("connect", emitData); //监听connect事件
    },
    message(data) {
      //监听message事件，方法是后台定义和提供的
      console.log(data);
    }
  },

  methods: {
    clickButton: function(val) {
      //添加按钮事件向服务端发送数据
      this.$socket.emit("emit_method", val);
    }
  }
};
</script>

<style>
</style>
