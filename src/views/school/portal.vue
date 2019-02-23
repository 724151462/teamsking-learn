<template>
  <div>
    
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">选择模板</el-menu-item>
      <el-menu-item index="2">平台信息</el-menu-item>
      <el-menu-item index="3">轮播图</el-menu-item>
      <el-menu-item index="4">课程推荐</el-menu-item>
      <el-menu-item index="5">名师风采</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
      };
    },
    watch: {
      '$route'(){
        console.log('fdas',this.$route)
        switch(this.$route.path) {
          case '/school/portal/mould':
            this.activeIndex = '1'
            break;
          case '/school/portal/platform':
            this.activeIndex = '2'
            break;
          case '/school/portal/banner':
            this.activeIndex = '3'
            break;
          case '/school/portal/recommend':
            this.activeIndex = '4'
            break;
          case '/school/portal/teacher':
            this.activeIndex = '5'
            break;
        }
      }
      
        
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(123,key, keyPath);
        this.fetchNavData()
        switch(key) {
          case '1':
            this.$router.push('mould')
            break;
          case '2':
            this.$router.push('platform')
            break;
          case '3':
            this.$router.push('banner')
            break;
          case '4':
            this.$router.push('recommend')
            break;
          case '5':
            this.$router.push('teacher')
            break;
        }
      },
      fetchNavData () { // 初始化菜单激活项
          var cur_path = this.$route.path; //获取当前路由
          console.log('curpath',cur_path)
          var routers = this.$router.options.routes; // 获取路由对象
          var nav_type = "courseCenter", nav_name = "课程列表";
          console.log('routers', routers)
          for (var i = 0; i < routers.length; i++) {
          var children = routers[i].children;
          if(children){
            for (var j = 0; j < children.length; j++) {
            var grand_children = children[j].children;
            
            if(grand_children){
              for (var k = 0; k < grand_children.length; k++) {
              console.log('grand_children',grand_children[k].path)
              if (grand_children[k].path === cur_path) {
                nav_type = routers[i].type;
                nav_name = routers[i].name;
                break;
              }
              }
            }
            }
          }
          }
          this.$store.state.leftNavState = nav_name;  // 改变leftNavState状态的值
          console.log('nav_type',nav_type,'nav_name', nav_name)
          if(nav_type == "courseCenter"){
          this.defaultActiveIndex = "/course/list";
          } else {
          this.defaultActiveIndex = "/" + nav_name;
          }
        },
      }
  }
</script>