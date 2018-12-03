<template>
  <div>
    <p>名师风采</p>
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