<template>
  <div class='layout'>
    <!-- 左侧导航 -->
    <div class="menu"> 
      <Menu :isCollapse="isCollapse"></Menu>
    </div>
    <!-- 右侧内容 -->
    <div class="content" :class="{active:isCollapse}"> 
      <Content @changeMane="changeMane" :isCollapse="isCollapse"></Content>
    </div>
  </div>
</template>

<script>
import Menu from './Menu'
import Content from './Content'
export default {
  name:'layout',
  components: {
    Menu,
    Content
  },
  data() {
    return {
      isCollapse:false
    }
  },
  methods: {
    changeMane() {
      this.isCollapse = !this.isCollapse 
    }
  }
  
}
</script>

<style lang='less' scoped>
.layout{
  background-color: #f5f5f5;
  .menu{
    position:fixed;
    left:0;
    top:0;
    bottom:0;
    background:#112f50;
  }
  .content {
    padding-left:200px;
    // 折叠动态效果
    transition:all .5s;
  }
  .active{
    padding-left:64px;
  }
}
</style>