<template>
  <div>
    <p>课程推荐</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '2',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>