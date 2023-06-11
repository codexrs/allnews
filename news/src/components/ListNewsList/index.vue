<template>
    <div class="newslist" v-if="newslists != undefined">
        <div v-for="(newslist,index) in newslists" :key="newslist.newsId">
          <div v-if="newslist != undefined"  class="list">
               <img @click="goNewsDeatil(newslist)" class="newsImg" :src="newslist.newsImg.slice(2,newslist.newsImg.length-2)" />
                <div class="newstitle" @click="goNewsDeatil(newslist)">{{newslist.newsTitle}}</div>
                <p class="newscont" v-html="newslist.newsContent"></p>
                <div class="watch-time">
                  <div class="watch-left">
                    <div class="newstype">{{newslist.newsType}}</div>
                    <div v-for="(user,index) in newslist.userinfo" :key="index" class="user">
                      <span>{{user.infoName}}</span>
                    </div>
                    <div><i class="iconfont icon-guankan"></i>
                    <span>{{newslist.newsWatch}}</span>
                    </div>
                    <!-- 评论跳数v-for="(item,index) in pinglun" :key="index" -->
                    <div><i class="iconfont icon-pinglun"></i>
                    <span v-if="pinglun[index] != undefined">{{pinglun[index].count}}</span></div>
                    <!-- 点赞 -->
                    <div><i class="iconfont icon-dianzan"></i>
                    <span>{{newslist.newsLikeNum}}</span></div>
                    <!-- 收藏 -->
                    <div><i class="iconfont icon-shoucangxuanzhong"></i>
                    <span>{{newslist.newsCollection}}</span></div>
                    <div class="watch-right">
                      <span>{{dayjs(newslist.newsTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
                    </div>
                  </div>

                
                
                </div>
          </div>
          <hr class="line"/>
        </div>
    </div>
</template>

<script>
//时间格式化
import dayjs from 'dayjs'
export default {
  name:'NewsList',
  props:{
    newslists:{
      type:Array,
      defualt:[]
    },
    pinglun:{
      type:Array,
      defualt:[]
    }
  },
  data(){
    return {
      //新闻发布的用户信息
      userData:[],
      defaultRul:'~assets/images/back.jpg',  //默认用户头像
      
      title:"",
      newsId:''
    }
  },
  mounted() {
    
  },
  watch: {
    '$route' (to, from) {
        // 路由发生变化页面刷新
        this.$router.go(`userHome/newsdetail?${this.newsId}`);
      }
    },

  methods:{
    dayjs,
    //跳转新闻详情页,请新闻数据传递过去
    //传递页:把传递的对象县转化为字符串,params传递对象，刷新不丢失
    goNewsDeatil(newslist) {
      //每次点击进入详情新闻，浏览次数加1
      //1.newsId
      this.$request.newsWacthAdd(newslist.newsId).then(res => {
        if(res.code == 200) {
          console.log(res.msg);
        } else {
          return ;
        }
      })
      //详情新闻转为字符串进行路由传递
      var newslist = JSON.stringify(newslist)
      
    
      sessionStorage.setItem('newslist',newslist)
      this.newsId = newslist.newsId
      this.$router.push('/userHome/newsdetail')
      this.$router.push({
        path:'/userHome/newsdetail',
        query:{
          newsId:newslist.newsId
        }
      })
      
      
    },




  },
  computed:{
    
  }
}
</script>

<style lang="less" scoped>
  .newslist{
     background:#fff;
    .list {
        height:200px;
        margin:0 0 10 0px;
        position:relative;
        .newsImg{
            float:left;
            margin:20px 0 0 20px;
            width:273px;
            height:154px;
        }
        .newsImg:hover {
            cursor: pointer;
        }
        .newstitle {
            position:absolute;
            top:20px;
            left:300px;
            font-size:25px;
        }
        .newstitle:hover{
            color:red;
            cursor: pointer;
        }
        .newscont {
            position:absolute;
            top:80px;
            left:300px;
            
            overflow: hidden;				//溢出内容隐藏
            text-overflow: ellipsis;		//文本溢出部分用省略号表示
            display: -webkit-box;			//特别显示模式
            -webkit-line-clamp: 3;			//行数
            line-clamp: 3;
            -webkit-box-orient: vertical;	//盒子中内容竖直排列
        }
        .watch-time {
          position:absolute;
          top:150px;
          left:300px;
          margin-left: 10px;
          width:800px;
          height: 40px;
          font-size:10px;
          font-weight:500;
          color:gray;
          display: flex;
          justify-content:space-between;
          .watch-left {
          display:flex;
          line-height:30px;
            div{
                margin: 2px;
            }
            .watch-right{
              line-height:32px;
            }

          }
        
        }
    }

    .line {
        margin-bottom:10px;
    }
    


    
  }


</style>

