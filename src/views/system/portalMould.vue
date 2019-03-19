<template>
  <div class="container">
    <div class="mould-container" v-for="(item, index) in mouldList" :key="index">
      <div class="item-container">
        <el-radio v-model="item.value" :label="item.name">
        </el-radio>
        <img :src="item.img" style="width:500px" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mouldList: [
          {
            name: '标准',
            img: require('../../assets/images/mould.png'),
            value: '标准'
          }
        ]
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style scoped lang="stylus" type="text/stylus">
.container
  display: flex;
  justify-content: space-around;
  margin-top: 50px
  .mould-container
    display: flex
    align-items: center
    justify-content: center
    .item-container
      display: flex
      flex-direction: column
      img
        margin-top: 20px
</style>
