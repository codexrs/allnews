<template>
    <div class="newslist" v-if="newslists != undefined">
        <div class="list" v-for="(newslist,index) in newslists" :key="newslist.newsId">
          <div v-if="newslist != undefined">
            <div class="img_div" @click="goNewsDeatil(newslist)">
                  <img class="newsImg" :src="newslist.newsImg.slice(2,newslist.newsImg.length-2)" />
                    <!-- <a href="#">
                      <div class="mask">
                        <h4 v-html="newslist.newsContent"></h4>
                      </div>
                    </a> -->
            </div>
          
            <div class="newstitle" @click="goNewsDeatil(newslist)">{{newslist.newsTitle}}</div>
            <div class="newstype">{{newslist.newsType}}</div>
            <div class="watch-time">
              <div class="watch-left">
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
              </div>
              <div class="watch-right">
                <span>{{dayjs(newslist.newsTime).format('YYYY-MM-DD')}}</span>
              </div>
            
            </div>
            <hr class="line" />
            <div v-for="(user,index) in newslist.userinfo" :key="index" class="user">
                <img :src="user.infoUrl.slice(2,user.infoUrl.length-2) || defaultRul" />
                <span>{{user.infoName}}</span>
            </div>
          </div>
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
      
      title:""
    }
  },
  mounted() {
    
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
      // this.$router.push({
      //   name:'newsdetail',
      //   params:{
      //     newslist
      //   }
  
      // })
      this.$router.push('/userHome/newsdetail')
      
    },




  },
  computed:{
    
  }
}
</script>

<style lang="less" scoped>
  .newslist{
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .list {
      background:#fff;
      width:240px;
      height:380px;
      margin:5px;
      margin-bottom: 20px;    
    }
    .newsImg{
      width:240px;
      height:160px;
      cursor: pointer;
    }
    .newstitle {
      margin:10px;
      height:80px;
      overflow: hidden;				//溢出内容隐藏
      text-overflow: ellipsis;		//文本溢出部分用省略号表示
      display: -webkit-box;			//特别显示模式
      -webkit-line-clamp: 2;			//行数
      line-clamp: 2;					
      -webkit-box-orient: vertical;	//盒子中内容竖直排列

    }
    .newstitle:hover{
      color:red;
      cursor: pointer;
    }
    .newstype {
      margin-left: 10px;
      color: #ffffff;
      text-align: center;
      width:70px;
      height:20px;
      background:green;
    }
    .watch-time {
      margin-left: 10px;
      width:240px;
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
      }
      .watch-right{
        line-height: 38px;
        margin-right: 20px;
      }
    }
    .line{
      border: 0;
      height: 1px;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    }
    .user{
      height:40px;
      margin-left:10px;
      margin-top:10px;
      img{
        width:30px;
        height:30px;
        
        border-radius:50%;
      }
      span{
        display:inline-block;
        margin-left:5px;
        font-size:14px;
        width:100px;
        height:20px;
        position:relative;
        top:-10px;
      }
    }
    
  }

// 图片动态显示文字和遮罩层
.img_div {
  
    position: relative;
    width:240px;
    height:160px;
}
.mask {
    position: absolute;
    top: 0;
    left: 0;
    width:240px;
    height:198px;
    background: rgba(101, 101, 101, 0.6);
    color: #ffffff;
    opacity: 0;
  

}
.mask h4 {
  text-align: center;
  overflow: hidden;				//溢出内容隐藏
  text-overflow: ellipsis;		//文本溢出部分用省略号表示
  display: -webkit-box;			//特别显示模式
  -webkit-line-clamp: 3;			//行数
  line-clamp: 3;
  color: #ffffff;					
  -webkit-box-orient: vertical;	//盒子中内容竖直排列
}
.img_div a:hover .mask {
    opacity: 1; 
      
}
</style>