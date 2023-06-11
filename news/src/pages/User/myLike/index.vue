<template>
  <div class="mylike">
    我的点赞
    <ListNewsList :newslists="allnewslist" :pinglun="pinglun"></ListNewsList>
    <div v-if="allnewslist.length == 0">
        <h1>暂无点赞数据</h1>
    </div>
  </div>
</template>

<script>
import ListNewsList from '@/components/ListNewsList'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      //新闻数据
      allnewslist:[],
      pinglun:[]
    }
  },
  components:{
    ListNewsList
  },
  mounted() {
    //获取所有新闻
    this.getmylike(this.userInfo.userId)
  
  },
  computed:{
      ...mapState({
        userInfo:(state) => state.AdminLogin.userInfo[0]
    })
  },
  
  methods:{
    //获取所有新闻参数，page,pageSize
    async getmylike(userId) {
      let newsresult= await this.$request.getmylike(userId)
      //返回我的收藏，格式和我的发布返回数据 略有不同
      for(let i = 0; i < newsresult.total; i++) {
        if(newsresult.newslist[i].newslist[0]) {
          this.allnewslist.push(newsresult.newslist[i].newslist[0])
        }
      }
      //this.allnewslist = newsresult.newslist
      if(this.allnewslist) {
        //获取评论条数
        //并发查询所有新闻评论数量
        //准备一个队列存放请求
        let queue = []
        this.allnewslist.forEach(newslist => {
          if(newslist) {

            queue.push(this.getPinglunNum(newslist.newsId))
          }
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
.mylike {
  width:1000px;
  margin:0 auto;
  min-height: 200px;
  h1 {
    text-align:center;
    margin-top:20px;
    font-size:20px;
  }
}
</style>