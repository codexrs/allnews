<template>
  <div class="sortnews">
      <div class="sortname">{{newsType}}</div>
      <div class="btn">
					<span class="btn_left" :class="{'active': isActive}" @click="change">列表浏览</span>
					<span class="btn_right" :class="{'active': !isActive}"   @click="change">卡片浏览</span>
			</div>
      <div v-if="isActive"><ListNewsList :newslists="sortnewslist" :pinglun="pinglun" ></ListNewsList></div>
      <div v-else><NewsList :newslists="sortnewslist" :pinglun="pinglun" ></NewsList></div>
    
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
//长列表
import ListNewsList from '@/components/ListNewsList'
import Pagination from '@/components/Pagination'
import {mapState} from 'vuex'
export default {
  name:'NewsSort',
  data() {
    return {
      //新闻数据
      sortnewslist:[],
      //总条数
      total:100,
      //每页数据量
      pageSize:8,
      //当前页码
      currentPage:1,
      //选择每页数据量
      PageSizes:[8,12,16,20],
      serchStatus:'',
      listTotal:"",
      pinglun:[],
      //浏览模式
      isActive:true, 
    
    }
  },
  watch:{
    //监听newsType的变化，调用接口获取不同数据
    newsType:{
      handler(n,o) {
        console.log(n,o);
        this.GetNewssortList({page:1,pageSize:8,newsType:n})
      },
      immediate: true//立即执行
    }
  },

  components:{
    NewsList,
    ListNewsList,
    Pagination
  },
  computed:{
    //获取当前新闻分类
    ...mapState({
      newsType:(state) => state.news.newsType
    }),
    
  },
  mounted() {
    //this.GetNewssortList({page:1,pageSize:8,newsType:this.newsType})
    //console.log(this.newsType)
  },
  methods:{
    //获取点击页码
    handleCurrentChange(page) {
      //console.log('111',page)
      if(this.serchStatus) {
        //点击了查询按钮--搜索数据-再点击分页
        this.sortnewslist = this.listTotal.slice((page -1)*10, page*10)

        return ;
      }

      //默认新闻列表分页数据
      this.currentPage = page
      this.GetNewssortList({page:page, pageSize:this.pageSize,newsType:this.newsType})
    },
    //每页数据量
    handleSizeChange(pageSize) {
      if(this.serchStatus) {
        //console.log(pageSize)
        //点击了查询按钮--搜索数据--在点击每页数据量
        this.pageSize = pageSize
        if(pageSize > this.listTotal.length) {
          //如歌每页数量大于搜索的数量，直接渲染
          this.sortnewslist = this.listTotal
        } else {
          //如每页数量小于搜索数量，需要分页渲染
          this.sortnewslist = this.listTotal.slice((pageSize -10)*10, pageSize)
        }
        return ;
      }
      //console.log('222',pageSize)
      
      this.GetNewssortList({page:this.currentPage, pageSize:pageSize,newsType:this.newsType})
    },
    //获取不同分类新闻数据
    async GetNewssortList(params) {
      let result = await this.$request.GetNewssortList(params)
      this.sortnewslist = result.newslist
      this.total = result.total
      this.currentPage = result.page
      this.pageSize = result.pageSize

      //获取评论条数
      //并发查询所有新闻评论数量
      //准备一个队列存放请求
      if(this.sortnewslist) {
        let queue = []
        this.sortnewslist.forEach(newslist => {
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
.sortnews {
  width:1000px;
  margin:0 auto;
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
  .sortname {
    font-size:28px;
    color: #F56C6C;
  }
}
</style>