<template>
  <div class="header">
      <div class="header-info"> 
      <div class="title" @click="goUserHome">校园新闻发布系统</div>   
      <div class="header-serch">
        <input type="text" placeholder="请输入关键词"  v-model="inputVal" @keyup.enter="search">
        <div @click="search" class="serch-btn"><i class="iconfont icon-sousuo"></i></div>
      </div>
      <div class="user" v-if="isShow">
        <span class="name">欢迎:{{userInfo.userName}}</span>
        <el-dropdown class="avatar-container">
          <span class="el-dropdown-link">
              <!-- 用户头像 -->
              <img  :src="userUrl" alt="头像" >
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="iconfont icon-zhuye1" @click.native="go">用户{{userInfo.userName}}的主页</el-dropdown-item>
            <el-dropdown-item icon="iconfont icon-tuichu" @click.native="back">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="header-user" v-else>
        <a class="login" @click="Login">登录</a>
        <a class="register" @click="Regsiter">注册</a>
      </div>
      
    </div>
  </div>
</template>

<script>

//登录成功显现用户头像
import {mapState} from 'vuex'
export default {
  name:'Content',
  data() {
    return {
      //默认头像不显示
      isShow:false,
      //默认用户头像
      defaultUrl:require('@/assets/images/back.jpg'),
      userUrl:'', //用户头像
    
      //输入框 内容
      inputVal:''


      
    }
  },
 
  computed:{
    ...mapState({
      userInfo:(state) => state.AdminLogin.userInfo[0]
    })
  },
  methods:{
    //前往首页
    goUserHome() {
      this.$router.replace('/userHome/home')
    },
    backClick() {
      //this.$refs.scroll.scrollTo(0,0)
    },
    //跳转登录
    Login() {
      this.$router.push('/AdminLogin')
    },
    Regsiter() {
      this.$router.push('/Register')
    },
    go() {
      this.$router.push('/userHome/user')
    },
    back() {
      //退出登录
      this.$store.commit('deleteuserInfo')
      this.$store.commit('deleteuserToken')
      this.isShow=false
      //跳转到首页
      this.$router.push('/userHome/home')
    },
    search() {
      //判断输入是否有内容
      if(this.inputVal) {
        //点击搜索
        //console.log(this.inputVal)
        //跳转搜索页,请搜索内容传递到搜索页
        this.$store.commit('getkeyword',this.inputVal)
        this.$router.push({
          path:'/userHome/search',
          query:{
            keyword:this.inputVal
          }
        })
        //清空搜索内容
        this.inputVal = ''
      } else {
        this.$message({
          message: '您还没输入内容哦',
          type: 'warning'
        });
      }
      
    }
  
    
  },
  created(){
    console.log(this.userInfo);
    if(this.userInfo) {
      //登录了
      this.isShow = true
      //用户还没上传图像
      if(this.userInfo.userUrl) {
        this.userUrl = this.userInfo.userUrl.slice(2,this.userInfo.userUrl.length-2)
      } else {
        this.userUrl = this.defaultUrl
      }
    }
  }
}

</script>

<style lang="less" scoped>
.header-info {
  position: relative;
  width:100%;
  height:60px;
  background-color:#545c64;
  display: flex;
  
  .title {
    position:absolute;
    height:60px;
    width:400px;
    font-size:30px;
    margin-left:100px;
    line-height:60px;
    cursor: pointer;
  }
  .header-serch {
    flex: 1;
    height:60px;
    line-height:60px;
    margin-left:700px;
    min-width: 300px;
    
    input{
      width: 200px;
      height: 30px;
      line-height:60px;
      border: 1px solid  white;;
      border-radius: 5px;
      padding-left: 5px;
      outline: none;
      font-size:15px;
    }
    .serch-btn {
      display:inline-block;
      width: 30px;
      line-height: 60px;
      text-align: center;
      margin-left: -25px;
      cursor: pointer;
    }
    .icon-sousuo{
      font-size: 20px;
      font-weight: 700;
      line-height: 60px;
    }
    .icon-sousuo:hover{
      color:#ff0000
    }
    

  }
  .user {
     flex: 0.1;
     position: relative;
     .name{
      top: 20px;
      left: -120px;
      position:absolute;
      color:#FFF;
      
    }
    img{
      position:relative;
      top:10px;
      width: 40px;
      height: 40px;
      line-height:60px;
      border-radius: 50%;
      margin-right: 50px;
    }
    .jiantou {
      position: absolute;
      top: 54px;
      left:15px;
      width: 10px;
      height: 10px;
      background-color: transparent; /* 模块背景为透明 */
      border-color: #ccc;
      border-style: solid;
      border-width: 2px 2px 0 0;
      transform: rotate(-45deg); /*箭头方向可以自由切换角度*/
    }
    .PageMenu {
      position: absolute;
      z-index: 111;
      background:#fff;
      border: 1px solid #ccc;
      height:50px;
      top: 60px;
      left: -30px;
      text-align: center;
      padding: 5px;
      
    }

  }
  .header-user {
    flex:1;
    line-height:60px;
    text-align: left;
    margin-left: 0px;
    a{
      cursor: pointer;
      color: #ffffff;
      padding: 5px;
    }
  }
}

</style>