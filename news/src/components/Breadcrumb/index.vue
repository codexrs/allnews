<template>
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/adminHome'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item :to="{ path: navData.path}">{{navData.meta.title}}</el-breadcrumb-item>
</el-breadcrumb>
</template>

<script>
export default {
 name:'Breadcrumb',
 data() {
   return {

   }
 },
 created() {
   console.log(this.$route);
 },
 computed: {
   navData() {
     let matched = this.$route
     
     return matched
   }
 }
}
</script>

<style>

</style>