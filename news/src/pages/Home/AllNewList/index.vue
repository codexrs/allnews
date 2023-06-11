<template>
  <div class="allnewslist">
     <div>
       <div class="all">全部内容</div>
       <span class="more" @click="morenewslist">查看更多</span>
     </div>
     <div class="btn">
					<span class="btn_left" :class="{'active': isActive}" @click="change">列表浏览</span>
					<span class="btn_right" :class="{'active': !isActive}"   @click="change">卡片浏览</span>
			</div>
    <div v-if="isActive"><ListNewsList :newslists="allnewslist" :pinglun="pinglun" ></ListNewsList></div>
    <div v-else><NewsList :newslists="allnewslist" :pinglun="pinglun" ></NewsList></div>
    
  </div>
</template>

<script>
//卡片列表
import NewsList from '@/components/NewsList'
//长列表
import ListNewsList from '@/components/ListNewsList'
export default {
  name:'AllNewList',
  data() {
    return {
      //新闻数据
      allnewslist:[],
      pinglun:[],
      isActive:true,
    }
  },
  components:{
    NewsList,
    ListNewsList
  },
  mounted() {
    //获取所有新闻
    this.getusernewslist({page:1,pageSize:12})
  
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
    //点击更多
    morenewslist() {
      if(!this.isActive) {
        //卡片模式的更多
        this.$router.push('/userHome/morenews')
      } else {
        this.$router.push('/userHome/listmorenews')
        
      }
      
    },
    //浏览模式
    change() {
      if(this.isActive) {
        this.isActive = false
      } else {
        this.isActive = true
      }
    }
    
    
    
  }

}
</script>

<style lang="less" scroped>

.allnewslist {
  .btn {
    
    .active {
      background-color:#ff4d00;
    }
    .btn_left {
      cursor: pointer;
    }
    .btn_right {
      cursor: pointer;
    }
  }
  .all {
    font-size:28px;
    color: #F56C6C;
    margin-top: 10px;
  }
  .more {
    font-size:14px;
    float:right;
    position: relative;
    top: -20px;
    cursor: pointer;
    color:black;
  }
  .more:hover {
    color:#F56C6C;
  }

}
</style>