<template>
    <div>
        <div v-clickoutside="hideReplyBtn" @click="inputFocus" class="my-reply">
            <!-- <el-avatar class="header-img" :size="40" :src="userInfo.userUrl.slice(2,userInfo.userUrl.length-2)"></el-avatar> -->
            <div class="reply-info" >
                <!-- <div 
                tabindex="0" 
                contenteditable="true" 
                id="replyInput" 
                spellcheck="false" 
                placeholder="输入评论..." 
                class="reply-input" 
                @focus="showReplyBtn"  
                @input="onDivInput($event)"
                >
                </div> -->
                <el-input id="replyInput" v-model="replyComment1" @focus="showReplyBtn"   placeholder="输入评论..."   class="reply-input reply-comment-input"></el-input>
            </div>
            <div class="reply-btn-box" v-show="btnShow">
                <el-button class="reply-btn" size="medium" :loading="logining" @click="sendComment" type="primary">发表评论</el-button>
            </div>
        </div>
        
        <div v-for="(item,i) in comments" :key="item.id" class="author-title reply-father">
            <el-avatar class="header-img" :size="40" :src="item.userinfo[0].userUrl.slice(2,item.userinfo[0].userUrl.length-2)"></el-avatar>
            <div class="author-info">
                <span class="author-name">{{item.userinfo[0].userName}}</span>
                <span class="author-time">{{dayjs(item.commTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="icon-btn">
                <span @click="showReplyInput(1,i,item)"><i class="iconfont icon-el-icon-s-comment"></i>{{item.reply.length}}</span>
                <!-- <i class="iconfont el-icon-caret-top"></i>{{item.like}} -->
            </div>
            <div class="talk-box">
                <p>
                    <span class="reply">{{item.commContent}}</span>
                </p>
            </div>

            <div class="reply-box">
                <div v-for="(reply,j) in item.reply" :key="j" class="author-title">
                    <el-avatar class="header-img" :size="40" :src="reply.userinfo[0].userUrl.slice(2,reply.userinfo[0].userUrl.length-2)"></el-avatar>
                    <div class="author-info">
                        <span class="author-name">{{reply.userinfo[0].userName}}</span>
                        <span class="author-time">{{dayjs(reply.commTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
                    </div>
                    <div class="icon-btn">
                        <span @click="showReplyInput(2,i,reply)"><i class="iconfont icon-el-icon-s-comment"></i></span>
                        <!-- <i class="iconfont el-icon-caret-top"></i>{{reply.commlike}} -->
                    </div>
                    <div class="talk-box">
                        <p>
                            <span>回复{{reply.userinfo[0].targetName}}:</span>
                            <span class="reply">{{reply.commContent}}</span>
                        </p>
                    </div>
                    
                    
                </div>

                
                <div  v-show="_inputShow(i)" class="my-reply my-comment-reply">
                    <!-- <el-avatar class="header-img" :size="40"  :src="userInfo.userUrl.slice(2,userInfo.userUrl.length-2)"></el-avatar> -->
                    <div class="reply-info">
                        <!-- <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div> -->
                        <el-input v-model="replyComment" :placeholder="'回复'+replyName"  class="reply-input reply-comment-input"></el-input>
                    </div>
                    <div class=" reply-btn-box">
                        <el-button class="reply-btn" :loading="logining" size="medium" @click="sendCommentReply()" type="primary">发表评论</el-button>
                    </div>
                        
                </div>
            
            </div>
        

        </div>
    </div>
</template>
<script>
const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
    function documentHandler(e) {
    // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
            return false;
        }
    // 判断指令中是否绑定了函数
        if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e);
        }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default {
    name:'ArticleComment',
    data(){
        return{
            btnShow: false,
            index:0,
            replyComment:'', //二级评论内容
            replyComment1:'', //一级评论内容
            reply_isShow:{
                id:"",
                isShow:false,
                index:1,
                item:{}
            }, //回复框的显示状态
            logining:false,  //提交评论状态
            comments:[],
            replyName:'' //回复的名字
            
        }
    },
  
    props:{
      newsdetail:{
        type:Object,
        default:{}
      }
    },
    computed:{
      ...mapState({
        userInfo:(state) => state.AdminLogin.userInfo[0]
      })
    },
    created() {
      //获取当前新闻评论信息
      this.getCommData(this.newsdetail.newsId)
    },
    directives: {clickoutside},
    methods: {
      dayjs,
        inputFocus(){
            var replyInput = document.getElementById('replyInput');
            replyInput.style.padding= "8px 8px"
            replyInput.style.border ="2px solid blue"
            replyInput.focus()
        },  
        showReplyBtn(){
            this.btnShow = true
        },
        hideReplyBtn(){
            this.btnShow = false
            replyInput.style.padding= "10px"
            replyInput.style.border ="none"
        },
        showReplyInput(index,id, item){
            console.log(index,id,item)
            if(this.reply_isShow.isShow) {
                this.reply_isShow.id = id
                this.reply_isShow.isShow = false
            } else {
                this.reply_isShow.id = id
                this.reply_isShow.isShow = true
            }
            this.reply_isShow.index = index
            this.reply_isShow.item = item
            //获取回复的名字
            this.replyName = item.userinfo[0].userName
            
        },
        onDivInput: function(e) {
            //console.log(e.target.innerHTML)
            this.replyComment = e.target.innerHTML;
        },
        _inputShow(i){
            if(this.reply_isShow.id == i) {
                return this.reply_isShow.isShow
            } 
            
            
            
        },
        sendComment(){
          console.log(this.userInfo)
          if(this.userInfo) { //用户登陆了
              if(!this.replyComment1){
              this.$message({
                showClose: true,
                type:'warning',
                message:'评论不能为空'
             })
             this.logining = false;
             return ;
           }else{
              this.logining = true;
              let userId = this.userInfo.userId
        
              //当前新闻
              let newsId = this.newsdetail.newsId
            
              let commContent = this.replyComment1
              
              let targetId = 0
              let entityType = 0
              let entityId = newsId
              let commTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
              
             
              this.$request.submitComm(userId,entityType,entityId,targetId,commContent,commTime).then(res => {
                setTimeout(() => {
                  //提交结束
                  this.logining = false;
                  if(res.code == 200) {
                    //提交成功
                    this.$message({
                      message:res.msg,
                      type: 'success'
                    });
                    
                    //清空文本
                    this.replyComment1 ="";

                    //提交成功。更新状态
                    this.getCommData(this.newsdetail.newsId)
                    
                  } else {
                    this.$message.error(res.msg);
                  }  
                },2000)
                
              })
    
            }
          } else {
              this.$message({
                message: '您还没登录，不能评论哦',
                type: 'warning'
              });
          }
        },
          //获取新闻用户评论信息
        getCommData(newsId) {
          this.$request.getComm(newsId).then(res => {
            
            if(res.code == 200) {
              this.comments = res.commData
              console.log(this.comments)
            } else {
              this.comments = ""
            }
            
          })
        },
        sendCommentReply(){
            if(this.userInfo) {
                if(!this.replyComment){
                 this.$message({
                    showClose: true,
                    type:'warning',
                    message:'评论不能为空'
                })
                this.logining = false;
                }else{
                //对用户回复
                this.logining = true;
                //发布者id
                let userId = this.userInfo.userId
                //对目标类型是用户
                let entityType = 1
                

                let entityId = 0
                if(this.reply_isShow.item.entityType == 0) {
                    entityId = this.reply_isShow.item.id
                } else {
                    //被评论的id
                    entityId = this.reply_isShow.item.entityId  
                }
                
                
                //被评论用户的id
                let targetId = 0
                let commContent = this.replyComment
                if(this.reply_isShow.index == 2) {
                    //一级评论
                    targetId = this.reply_isShow.item.userId
                }
                let commTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                console.log(entityId,targetId);
                this.$request.submitComm(userId,entityType,entityId,targetId,commContent,commTime).then(res => {
                    setTimeout(() => {
                    //提交结束
                    this.logining = false;
                    if(res.code == 200) {
                        //提交成功
                        this.$message({
                        message:res.msg,
                        type: 'success'
                        });
                        //清空文本
                        this.replyComment = "";
                        this._inputShow('k')
                        //提交成功。更新状态
                        
                        this.getCommData(this.newsdetail.newsId)
                    } else {
                        this.$message.error(res.msg);
                    }  
                    },2000)
                    
                 })
                }
            }
            else {
                this.$message({
                    message: '您还没登录，不能评论哦',
                    type: 'warning'
                });
            }
        },
        
        dateStr(date){
            //获取js 时间戳
            var time=new Date().getTime();
            //去掉 js 时间戳后三位，与php 时间戳保持一致
            time=parseInt((time-date)/1000);
            //存储转换值 
            var s;
            if(time<60*10){//十分钟内
                return '刚刚';
            }else if((time<60*60)&&(time>=60*10)){
                //超过十分钟少于1小时
                s = Math.floor(time/60);
                return  s+"分钟前";
            }else if((time<60*60*24)&&(time>=60*60)){ 
                //超过1小时少于24小时
                s = Math.floor(time/60/60);
                return  s+"小时前";
            }else if((time<60*60*24*30)&&(time>=60*60*24)){ 
                //超过1天少于30天内
                s = Math.floor(time/60/60/24);
                return s+"天前";
            }else{ 
                //超过30天ddd
                var date= new Date(parseInt(date));
                return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
            }
        }
    },    
}
</script>
<style lang="stylus" scoped>
.my-reply
    padding 10px
    background-color #fafbfc
    .header-img
        display inline-block
        vertical-align top
    .reply-info    
        display inline-block
        margin-left 5px
        width 90%
        @media screen and (max-width:1200px) {
            width 80%
        }
        .reply-input
            min-height 20px
            line-height 22px
            padding 10px 10px
            color #ccc
            background-color #fff
            border-radius 5px
            &:empty:before
                content attr(placeholder)
            &:focus:before
                content none
            &:focus
                padding 8px 8px
                border 2px solid blue
                box-shadow none
                outline none
    .reply-btn-box
        height 25px
        margin 10px 0
        .reply-btn
            position relative
            float right
            margin-right 15px
.my-comment-reply
    margin-left 50px
    .reply-input
        width flex
.author-title:not(:last-child)
    border-bottom: 1px solid rgba(178,186,194,.3)
.author-title
    padding 10px
    .header-img
        display inline-block
        vertical-align top
    .author-info
        display inline-block
        margin-left 5px
        width 60%
        height 40px
        line-height 20px
        >span 
            display block
            cursor pointer
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
        .author-name
            color #000
            font-size 18px
            font-weight bold
        .author-time
            font-size 14px
    .icon-btn
        width 30%
        padding 0 !important 
        float right
        @media screen and (max-width : 1200px){
            width 20%
            padding 7px
        }
        >span 
            cursor pointer
        .iconfont 
            margin 0 5px
    .talk-box
        margin 0 50px
        >p
           margin 0
        .reply
            font-size 16px
            color #000
    .reply-box
        margin 10px 0 0 50px
        background-color #efefef
</style>