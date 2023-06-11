<template>
  <LeftNav :isCollapse="isCollapse"></LeftNav>
</template>

<script>

import LeftNav from '@/components/LeftNav/leftnav.vue'
export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    LeftNav
  },
  data  () {
  // 这里存放数据
    return {

    }
  },
  props:['isCollapse'],
// 监听属性 类似于data概念
  computed: {},
// 监控data中的数据变化
  watch: {},
// 方法集合
  methods: {

  },
// 生命周期 - 创建完成（可以访问当前this实例）
  created  () {

  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },

}
</script>
<style scoped>
/* .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  border-right: none;
}
.el-menu .is-active{
  /* 高亮 */
  /* background:#1e78bf !important;
  color:#fff;
} */ 

</style>