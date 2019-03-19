<template>
  <ol class="breadcrumb">
    <router-link v-for="list in pathList" :key="list.id" :to="list.path">{{list.name}}</router-link>
    <span style="color: rgb(119,119,119)">/</span>
    <li class="active">{{nowName}}</li>
  </ol>
</template>

<script>
  export default {
    name: "breadcrumb",
    props:[
      'pathList',
      'nowName'
    ]
  }
</script>

<style scoped>
  .breadcrumb {
    padding: 8px 15px;
    margin-bottom: 20px;
    list-style: none;
    /*background-color: #f5f5f5;*/
    border-radius: 4px;
  }
  .breadcrumb>li {
    display: inline-block;
  }
  a {
    color: #337ab7;
    text-decoration: none;
  }
  .breadcrumb>.active {
    color: #777;
  }
  .breadcrumb>li+li:before {
    padding: 0 5px;
    color: #ccc;
    content: "/\00a0";
  }
</style>