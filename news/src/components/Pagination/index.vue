<!-- 封装分页器 -->
<template>

<div class="pagination">
  <!-- 
    size-change当page-size改变会触发该事件,
    currentPage当前页码
    page-sizes控制一页能显示多少数据量
    current-change当currentPage改变会触发该事件，获取当前页
    layout布局 上页，下页，数量大小
    total总页码
   -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="PageSizes"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
</div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
// import引入的组件需要注入到对象中才能使用
  name:'Pagination',
  components: {},
  data  () {
// 这里存放数据
    return {
    }
  },
  //获取父组件传递的数据
  props:{
    //每页数量
    pageSize: {
      type:Number,
      default:10
    },
    //总的数量
    total: {
      type:Number,
      default:100
    },
    //当前页码
    currentPage: {
      type:Number,
      default:1
    },
    //选择一页多少数据量
    PageSizes:{
      type:Array,
      default:[10,20,30,40],
    }
  },
  methods: {
    //控制当前页码
    handleCurrentChange(currentpage) {
      //将当前页传递给父组件，父组件请求数据
      //console.log(currentpage);
      //自定义事件
      this.$emit('handleCurrentChange',currentpage)
      
    },
    //控制每页数量
    handleSizeChange(pageSize) {
      this.$emit('handleSizeChange',pageSize)
    }
  },
// 生命周期 - 创建完成（可以访问当前this实例）
  created  () {

  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.pagination {
  padding:10px;
  background:#fff;
  text-align:right;
}
</style>