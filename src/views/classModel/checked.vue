<template>
  <div>
    <div>
      <div>成员</div>
      <div class="nav-search">
        <div style="display: flex">
          <el-input
            placeholder="输入课程名称查询资源"
            v-model="search">
          </el-input>
          <div>
            <el-button icon="el-icon-search" class="search-btn" @click="getResource(0,0,search)"></el-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div>未签到</div>
      <div>点击更改状态</div>
    </div>
    <div>某人</div>
    <div>
      <div>已经签到</div>
      <div>点击更改状态</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "checked"
  }
</script>

<style scoped>

</style>