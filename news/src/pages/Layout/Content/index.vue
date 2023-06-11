<template>
  <div>
    <!-- 顶部区域 -->
    <Header></Header>
    <!-- 导航栏 -->
    <div class="navbar"><NavBar></NavBar></div>
    <!-- 内容区域 -->
    <router-view></router-view>
    <!-- footer区域 -->
    <PageFooter></PageFooter>
    <!-- 回到顶部按钮 -->
    <el-tooltip placement="top" content="返回顶部">
    <!-- 组件使用 -->
      <BackToTop 
        transitionName="fade"
        :customStyle="myBackToTopStyle" 
        :visibilityHeight="300" 
        :backPosition="0">
      </BackToTop>
    </el-tooltip>

  </div>
</template>

<script>
import Header from '@/components/Header'
import NavBar from '@/components/NavBar'
import PageFooter from '@/components/PageFooter'
import BackToTop from '@/components/BackToTop'

export default {
  name:'Content',
  data() {
    return {
      //滚回顶部
      myBackToTopStyle: {
        'right': '100px',
        'bottom': '150px',
        'width': '40px',
        'height': '40px',
        'border-radius': '20px',
        'line-height': '40px', 
        'background': '#fff'
      },


      
    }
  },
  components:{
    Header,
    NavBar,
    PageFooter,
    BackToTop
  },

  
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
    width:200px;
    font-size:30px;
    margin-left:100px;
    line-height:60px;
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