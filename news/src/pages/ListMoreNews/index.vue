<template>
  <div class="listmorenews">
          <!-- 新闻列表 -->
      <ListNewsList :newslists="allnewslist" :pinglun="pinglun"></ListNewsList>
      <!-- 分页器 -->
        <!-- 分页器 -->
      <Pagination :total="total" :pageSize="pageSize" 
        :currentPage="currentPage" 
        :PageSizes="PageSizes"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        ></Pagination>
  </div>
</template>

<script>
import ListNewsList from '@/components/ListNewsList'
import Pagination from '@/components/Pagination'
export default {
  name:'ListMoreNews',
  data() {
    return {
      //新闻数据
      allnewslist:[],
      //总条数
      total:100,
      //每页数据量
      pageSize:8,
      //当前页码
      currentPage:1,
      //选择每页数据量
      PageSizes:[12,16,20,40],
      pinglun:[]
    }
  },
  components:{
    ListNewsList,
    Pagination
  },
  mounted() {
    this.getusernewslist({page:1,pageSize:12})
  },
  methods:{
    //获取点击页码
    handleCurrentChange(page) {
      //默认新闻列表分页数据
      this.currentPage = page
      this.getusernewslist({page:page, pageSize:this.pageSize})
    
    },
    //每页数据量
    handleSizeChange(pageSize) {
      
      this.getusernewslist({page: this.currentPage,pageSize:pageSize})
    },
    //获取所有新闻
    //获取所有新闻参数，page,pageSize
    async getusernewslist(params) {
      let result = await this.$request.getusernewslist(params)
      this.allnewslist = result.newslist
      this.total = result.total
      this.currentPage = result.page
      this.pageSize = result.pageSize
      //获取评论条数
      //并发查询所有新闻评论数量
      //准备一个队列存放请求
      let queue = []
      this.allnewslist.forEach(newslist => {
        queue.push(this.getPinglunNum(newslist.newsId))
      });
      const res = await Promise.all(queue)
      //到此：所有请求都已经完成
      this.pinglun = res
    },
    async getPinglunNum(newsId) {
      const res = await this.$request.getPinglunNum(newsId)  
      return res  
    },
  }
}
</script>

<style scoped>
.listmorenews {
  width:1000px;
  margin:0 auto;
  margin-top: 20px;
}
</style>