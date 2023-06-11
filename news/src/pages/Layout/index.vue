<template>
  <div class="layout">
    <!-- 下面内容-->
    <div class="content">
      <Content></Content>
    </div>
    
  </div>
</template>

<script>
import Content from './Content'

export default {
  name:'Layout',
  components: {
    Content,

  },
  created() {
    
  }
}
</script>

<style lang="less" scroped>
.layout {
  // 典雅灰色
  background:#eef0f3;
  width: 100%;
  height: 100%;
}
</style>