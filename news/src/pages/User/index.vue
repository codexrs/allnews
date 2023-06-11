<template>
  <div class="my">
    <div class="menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="vertical"
        router
        @select="handleSelect"
        background-color="#4f2398"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="/userHome/user/myHome">个人中心</el-menu-item>
        <el-menu-item index="/userHome/user/mypublish">我的发布</el-menu-item>
        <el-menu-item index="/userHome/user/mycoll">我的收藏</el-menu-item>
        <el-menu-item index="/userHome/user/mylike">我的点赞</el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <router-view></router-view>  
    </div>
  </div>
</template>

<script>

export default {
data() {
  return {
      //当前激活菜单的 index
      activeIndex: '/userHome/user/myHome'
      
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      //console.log(key, keyPath);
      this.activeIndex = key
    }
  },
  created() {
    console.log(this.$route.path)
    this.activeIndex = this.$route.path
    this.$store.commit('setnavbarIsShow',false)
  }
}
</script>
<style lang='less' scoped>
.my {
  background: url('./1yemlph5jub.jpg');
  min-height: 500px;
  .menu {
    width:1000px;
    margin:0 auto;
    .el-menu {
      display:flex;
      .el-menu-item {
        flex:1;
        text-align:center;

      }
    }
  }

  
} 
</style>