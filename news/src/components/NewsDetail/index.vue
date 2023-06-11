<template>
  <div class="newsdetail">
      <div class="newsleft">
        <div class="newsTitle">
          <h1>{{newsdetail.newsTitle}}</h1>
          
          </div>
          <div class="usernews" v-if="newsdetail.userinfo">
              <div class="username">来源:{{newsdetail.userinfo[0].infoName}}</div>
              <div class="newstime">发布于 {{dayjs(newsdetail.userinfo[0].infoTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
              <i class="iconfont icon-guankan">浏览{{newsdetail.newsWatch}}</i>
              <i v-show="myNewsShow" @click="iseditmynews" class="iconfont icon-bianji">编辑</i>
              <i v-show="myNewsShow" @click="isdeletemynews" class="iconfont icon-shanchu">删除</i>
          </div>
          <div class="newscontent" v-html="newsdetail.newsContent"></div>
          <div class="like_colle">
            <div class="colle" @click="userColl">
              <i class="iconfont icon-shoucang1" v-if="collIshow"></i>
              <i class="iconfont icon-shoucangxuanzhong" v-else></i>
              
              <span>收藏</span>
            </div>
            <div class="like" @click="userLike">
              <i class="iconfont icon-dianzan2" v-if="likeIshow" ></i>
              <i class="iconfont icon-dianzan" v-else></i>
              <span>点赞</span>
            </div>
          </div>
      
         <Comm :newsdetail="newsdetail" ></Comm>

         <Recommend></Recommend>
      </div>
    
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {mapState} from 'vuex'
import Comm from '../Comm'
import Recommend from '../Recommend'
export default {
    name:'NewsDetail',
    data() {
        return {
          //新闻详情
          newsdetail:{},

          //是否收藏
          collIshow:false,
          //是否点赞
          likeIshow:false,

          //是否是自己发布的新闻，显示删除按钮
          myNewsShow:false
        }
    },
    components:{
      Comm,
      Recommend
    },
    created(){
        
        //获取当前新闻数据
        this.getNewsDetail()
        this.mynewsShow()
        //console.log(this.userInfo.userId,this.newsdetail.newsId)
        //获取当前新闻收藏信息
        this.usercollIshow(this.userInfo.userId,this.newsdetail.newsId)
        //获取当前新闻点赞信息
        this.userlikeIshow(this.userInfo.userId,this.newsdetail.newsId)
        
    },
    computed:{
      ...mapState({
        userInfo:(state) => state.AdminLogin.userInfo[0]
      })
    },
    methods:{
        dayjs,
        //是否显示删除按钮
        mynewsShow() {
          if(this.userInfo.userId ==this.newsdetail.userId) {
            this.myNewsShow = true
          }
        },
        //是否编辑自己发布的新闻
        iseditmynews() {
          this.$confirm('此操作编辑该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //跳转编辑新闻页面
          this.$router.push({
            name:'editornews',
            params:{
              userId:this.userInfo.userId,
              newsId:this.newsdetail.newsId
            }
          })
          
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        //是否删除自己发布的新闻
        isdeletemynews() {
          this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          
          this.$request.isdeletemynews(this.userInfo.userId,this.newsdetail.newsId).then(res => {
            if(res.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$router.push('/userHome/user/mypublish')
            //更新视图      
            } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                }); 
              }
              
            })
                  
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });

        },
        //用户是否已经收藏了
        async usercollIshow(userId,newsId) {
          let res =  await this.$request.collIshow(userId,newsId)
          console.log(res)
          if(res.code == 2) {
              //已经收藏过了
              this.collIshow = true
          } else {
              this.collIshow = false
          }
        },

        //用户是否已经点赞了
        userlikeIshow(userId,newsId) {
          this.$request.likeIshow(userId,newsId).then(res=> {
            if(res.code == 2) {
              //已经点赞过了
              this.likeIshow = true
            } else {
              this.likeIshow = false
            }
          })
        },
        //用户点击收藏
        userColl() {
          //判断用户是否登陆了
          //当前用户,如果用户还没登录，请登录
          if(!this.userInfo) {
            //还没登录
            this.$message({
              message: '您还没登录哦，不能收藏',
              type: 'warning'
            });
          
            return ;
          }
          this.collIshow = !this.collIshow
          //收藏，当collIshow=true的时候上传收藏，为false的时候，取消收藏
          if(this.collIshow) {
            //收藏
            this.$request.usercoll(this.userInfo.userId,this.newsdetail.newsId).then(res => {
              if(res.code == 200) {
                this.$message({
                    message: res.msg,
                    type: 'success'
                  });
              }
              if(res.code == 4) {
                //收藏过了
                this.collIshow = res.collIshow
              }
            })
            //该新闻收藏次数加1
            this.$request.newsCollectionAdd(this.newsdetail.newsId)
          }else {
            //取消收藏
            this.$request.deleteColl(this.userInfo.userId,this.newsdetail.newsId).then(res => {
                if(res.code == 200) {
                  this.$message({
                      message: res.msg,
                      type: 'success'
                   });
                }
            })
            //该新闻收藏次数减1
            this.$request.deletenewsCollection(this.newsdetail.newsId)
          }
        },
        //用户点击点赞
        userLike() {
          //当前用户,如果用户还没登录，请登录
          if(!this.userInfo) {
            //还没登录
            this.$message({
              message: '您还没登录哦，不能点赞',
              type: 'warning'
            });
            
            return ;
          }
          this.likeIshow = !this.likeIshow
            if(this.likeIshow) {
            //收藏
            this.$request.userlike(this.userInfo.userId,this.newsdetail.newsId).then(res => {
              if(res.code == 200) {
                this.$message({
                    message: res.msg,
                    type: 'success'
                  });
              }
            })
            //该新闻点赞次数加1
            this.$request.newsLikeNumAdd(this.newsdetail.newsId)
          }else {
            //取消收藏
            this.$request.deletelike(this.userInfo.userId,this.newsdetail.newsId).then(res => {
                if(res.code == 200) {
                  this.$message({
                      message: res.msg,
                      type: 'success'
                   });
                }
            })
            //该新闻点赞次数-1
            this.$request.deletenewsLikeNum(this.newsdetail.newsId)
          }
        },
        //新闻详情通过路由传递参数管理
        getNewsDetail() {
            //this.newsdetail= JSON.parse(this.$route.params.newslist)
            this.newsdetail = JSON.parse(sessionStorage.getItem('newslist'))
        },
      
      

    }
}
</script>

<style lang="less" scroped>
.newsdetail {
    width:1000px;
    margin:0 auto;
    height:100%;
  
    .icon-shoucangxuanzhong , .icon-dianzan{
        color:#ccc;
        cursor:pointer;
    }
    .icon-shoucang1, .icon-dianzan2 {
        color:red;
        cursor:pointer;
    }
    
    .newsleft{
      background:#fff;
      width: 100%px;
      .newsTitle {
        h1{
          font-size:30px;
          margin-left:30px;
        }
        
      }
      .usernews {
        margin-left:30px;
        margin-top:20px;
        height:40px;
        position: relative;
        line-height:40px;
      
        
        font-size: 14px;
        color:#ccc;
        font-weight: 600;
        .username {
          left: 0px;
          position:absolute;
        }
        .newstime {
          left: 150px;
          position:absolute;
          margin-left:5px;
          display:inline-block;
        }
        .icon-guankan {
          right:120px;
          position:absolute;
          font-size: 12px;
          margin-left:380px;
        }
        .icon-shanchu {
          color:red;
          position:absolute;
          right:70px;
          float:right;
          cursor:pointer;
          font-size:12px;
        }
        .icon-bianji {
          color:red;
          position:absolute;
          right:20px;
          float:right;
          cursor:pointer;
          font-size:12px;
        }
      }
      .newscontent {
        width: 100%;
        p{
          width:900px;
          margin-left: 30px;
          margin-right: 30px;
        }
        div{
          width:900px;
          margin-left: 30px;
          margin-right: 30px;
        }
        img{
          margin: 0 auto;
        }
      }
      .like_colle {
        display:flex;
        width:200px;
        height:50px;
        line-height:50px;
        

        margin-left:400px;
        .like{
          margin-left:100px;
        }
      }
      .comm {
        margin-left: 75px;
        width:80%;
        height:50px;
      }
      .submit {
        margin:0 auto;
        width: 100px;;
        margin-top:20px;
        margin-left:425px;
      }
      .commdetail {
        margin-left: 50px;
        margin-top:20px;
        min-height: 300px;
        width: 800px;
        
        .commform {
          margin-left:30px;
          margin-bottom:20px;
          width:100%;
          
          
          
        
          .commUrl {
            width:40px;
            height:40px;
          
          
            border-radius:50%;
          }
          .commusername {
            
            font-size:14px;
            font-weight:800;
          }
          .commCont {
          
            float:left;
            font-size:14px;
          
          }
          .commTime {
          
            
            font-size: 14px;
            color: #ccc;
          }
          .reply {
            
            
            font-weight:400;
            
          }

        }
      }
    }

}
</style>