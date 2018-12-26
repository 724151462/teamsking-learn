<template>
  <div>
    <div>
      <li class="tree-items"
          :class="{'active':model.path === this.$route.params.filePath}">
        <a class="item-title"
           @click="toggle(model)"
           :class="{'item-hover': model.type === 'file'}">
          {{ model.name }}
          <span
            class="item-icon"
            :class="{'openmenu': open}"
            v-if="model.type !== 'file'">
          </span>
        </a>
        <ul v-show="open" v-if="model.type === 'directory'" class="child-list-box">
          <m-tree v-for="item in model.files" :model="item" :key="item.name"></m-tree>
        </ul>
      </li>
    </div>
  </div>
</template>

<script>
  export default {
    name: "treeTest.vue",
    props: ['model', 'index'],
    data() {
      return {
        open: true
      }
    },
    methods: {
      toggle: function (model) {
        let self = this;
        if (model.type === "directory") {
          this.open = !this.open;
        } else {
          console.log('file');
        }
      }
    }
  }
</script>

<style lang="less">
  .tree-items {
    margin: 8px 0 0 0;
    padding: 3px;
    color: #575d6f;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
    &.active {
      .item-title {
        color: #1357ba;
      }
    }
    &.onHitClass {
      background-color: #dbdce0;
    }
    .item-title {
      line-height: 1px;
      font-size: 16px;
      font-weight: bold;
      color: #575d6f;
      &.item-hover {
        &:hover {
          color: #1357ba;
        }
      }
    }
    .item-icon {
      display: inline-block;
      transform: rotate(-180deg);
      margin-left: 12px;
      width: 7px;
      height: 7px;
      /*background: url('三角形的图片.png') no-repeat center;*/
      transition: all .3s;
      &.openmenu {
        transform: rotate(0deg);
      }
    }
    .child-list-box {
      padding-left: 17px;
      .tree-items {
        margin: 5px 0;
        color: #666;
        text-decoration: none;
        display: block;
        font-weight: 300;
        padding: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .item-title {
          font-size: 14px;
          margin-bottom: 12px;
          font-weight: normal;
        }
      }
    }
  }
</style>