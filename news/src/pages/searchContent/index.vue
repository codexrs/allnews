<!-- 添加新闻 -->
<template>
<div class='searchContent'>
    <div class="title">查询结果----《按关键词内容》共有（<span class="searchtitle">{{this.total}}</span>）篇文章内容符合关键词：<span  class="searchtitle">{{$route.query.keyword}}</span> </div>            
    <NewsList :newslists="searchnewslist" :pinglun="pinglun"></NewsList>
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
import NewsList from '@/components/NewsList'
import Pagination from '@/components/Pagination'
import {mapState} from 'vuex'
export default {
  name:'Search',

  data() {
    return {
      searchnewslist:[],
      pinglun:[],
        //总条数
      total:100,
      //每页数据量
      pageSize:4,
      //当前页码
      currentPage:1,
      //选择每页数据量
      PageSizes:[4,8,12,16],
    }
  },
  computed:{
    //获取当前搜索关键词
    ...mapState({
      keyword:(state) => state.news.keyword
    }),
    
  },
  watch:{
    //监听newsType的变化，调用接口获取不同数据
    keyword:{
      handler(n,o) {
        console.log(n,o);
        this.getsearch({page:this.currentPage,pageSize:this.pageSize,keyword:n})
      },
      immediate: true//立即执行
    }
  },
  components:{
    NewsList,
    Pagination
  },
  mounted(){
    this.getsearch({page:1,pageSize:4,keyword:this.keyword})
  },
  methods:{
      //获取点击页码
    handleCurrentChange(page) {
      //默认新闻列表分页数据
      this.currentPage = page
      this.getsearch({page:page, pageSize:this.pageSize,keyword:this.keyword})
    },
    //每页数据量
    handleSizeChange(pageSize) {
      
      this.getsearch({page:this.currentPage, pageSize:pageSize,keyword:this.keyword})
    },
    async getsearch(params) {
      let newsresult = await this.$request.getsearch(params)
      this.searchnewslist = newsresult.newslist
      this.total = newsresult.total
      this.currentPage = newsresult.page
      this.pageSize = newsresult.pageSize
      if(this.searchnewslist) {
        //获取评论条数
        //并发查询所有新闻评论数量
        //准备一个队列存放请求
        let queue = []
        this.searchnewslist.forEach(newslist => {
          queue.push(this.getPinglunNum(newslist.newsId))
        });
        const res = await Promise.all(queue)
        //到此：所有请求都已经完成
        this.pinglun = res
      }
    },
    async getPinglunNum(newsId) {
      const res = await this.$request.getPinglunNum(newsId)  
      return res  
    },
  }
  
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.searchContent {
  width:1000px;

  margin:0 auto;
  .title {
    text-align:center;
    font-size:20px;
    margin-bottom:20px;
  }
  .searchtitle {
    color:red;
  }
}
</style>