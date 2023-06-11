<template>
  <div class="recommend">
		<hr>
    <h1>最新推荐</h1>
    <ListNewsList :newslists="allnewslist" :pinglun="pinglun" ></ListNewsList>
  </div>
</template>

<script>

//长列表
import ListNewsList from '@/components/ListNewsList'
export default {
  name:'Recommend',
  data() {
    return {
      //新闻数据
      allnewslist:[],
      pinglun:[],
      
    }
  },
  components:{
    ListNewsList
  },
  mounted() {
    //获取所有新闻
    this.getusernewslist({page:1,pageSize:5})
  },
  methods:{
    //获取所有新闻参数，page,pageSize
    async getusernewslist(params) {
      let  newsresult= await this.$request.getusernewslist(params)
      //console.log(this.allnewslist);
      this.allnewslist = newsresult.newslist
      if(this.allnewslist) {
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
      }
    },
    async getPinglunNum(newsId) {
      const res = await this.$request.getPinglunNum(newsId)  
      return res  
    },  
  }

}
</script>

<style lang="less" scoped>
.recommend {
	h1{
		font-size:25px;
	}
}
</style>