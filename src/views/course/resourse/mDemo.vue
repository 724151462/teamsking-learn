<template>
  <div class="doc-center-wrap">
    <div class="doc-center-slide">
      <div class="doc-center-searbox">
        <span class="doc-center-searimg"></span>
        <Input size="large" placeholder="请输入关键字" @on-keyup="searchKeywords" v-model="keywords"/>
      </div>
      <div class="doc-center-tree" id="tree-slide">
        <ul class="tree-menu-ul" v-for="(menuItem, index) in treeModel" :key="index">
          <m-tree :model="menuItem" :index="index"></m-tree>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import MTree from "./treeTest.vue";
  let data =  [{
    "type": "file",
    "name": "前端框架",
    "path": "about"
  }, {
    "type": "file",
    "name": "前端框架",
    "path": "guide"
  }, {
    "type": "file",
    "name": "前端框架",
    "path": "zip-guide"
  }, {
    "type": "file",
    "name": "UI模块引擎",
    "path": "remote-debugging"
  },
    {
      "type": "directory",
      "name": "云API",
      "files": [{
        "type": "file",
        "name": "数据云API",
        "path": "component-album"
      }, {
        "type": "file",
        "name": "数据云API",
        "path": "component-app"
      }]
    }
  ]

  let fileFrist = [];
  function showFristFile(data) {
    for (let i in data) {
      let fileModel = data[i];
      if (fileModel.type === "file") {
        fileFrist.push(fileModel);
      } else {
        showFristFile(fileModel.files);
      }
    }
    return fileFrist;
  }

  export default {
    data(){
      return {
        treeModel:   data,
        retrievalWords: showFristFile(data),
        keywords:''
      }
    },
    components: {
      MTree
    },
    methods:{
      searchKeywords() {
        let self = this;
        let retrievalWords = self.retrievalWords;
        let keywords = self.keywords;
        if (!keywords) {
          self.treeModel= self.treeModel;
        } else {
          let arrKeywords = [];
          for (let i = 0; i < retrievalWords.length; i++) {
            if (retrievalWords[i].name.toLowerCase().indexOf(keywords.toLowerCase()) !== -1) {
              arrKeywords.push(retrievalWords[i]);
            }
          }
          self.treeModel = arrKeywords;
        }
      }
    }
  }
</script>