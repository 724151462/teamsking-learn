<template>
    <el-aside style="width:280px; border: 1px solid gray; position: fixed;height:85%">
        <div style="margin: 20px 50px">
          <el-button type="primary" style="width: 150px;font-size: 1.2em" @click="addTest">添加测验</el-button>
          <p style="margin-top: 5px">点击题目查看详细情况</p>
        </div>
        <div
          :class="['test-container',item.examId===activeIndex?'test-active':'']"
          v-for="item in testList"
          @click="activeTest(item)"
          :key="item.examId"
        >
          <p
            style="width: 200px; display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden; font-size: 1.2em"
          >{{item.examTitle}}</p>
          <el-button
            v-if="item.interactionStatus === 10"
            type="primary"
            @click="beginTest(item)"
          >开始测试</el-button>
          <el-button v-else-if="item.interactionStatus === 20" type>进行中...</el-button>
          <el-button v-else :disabled="true" style="background: rgb(158,167,180);color: #fff">已结束</el-button>
        </div>
      </el-aside>
</template>

<script>
export default {

}
</script>

<style>

</style>
