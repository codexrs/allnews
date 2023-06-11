<template>
  <div class="navbar" v-if="navbarIsShow">
    <el-menu
      :default-active="newsType"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#ffffff"
      text-color="black"
      :router="true"
      active-text-color="#ffd04b">
      <img src="~assets/images/campus.png" class="logo" alt="logo">
      <el-menu-item index="首页" route="/userHome/home">首页</el-menu-item>
      <el-submenu index="新闻分类">
        <template slot="title"><span class="type">新闻分类</span></template>
        <el-menu-item 
            :index="type.typeName"
            v-for="(type) in typeList"
            :key="type.typeId"
            @click="goType(type.typeName)">
         {{type.typeName}}
         </el-menu-item>
      </el-submenu>
      <el-menu-item index="发布新闻" route="/userHome/pubishnews">发布新闻</el-menu-item>
      <el-menu-item index="发布留言" route="/userHome/leaveword" >发布留言</el-menu-item>
      <el-menu-item index="后台管理" route="/AdminLogin">后台管理</el-menu-item>

    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      //activeIndex: this.newsType,
      //新闻分类
      typeList:[],
      //不同新闻分类路由
      typeUrl:""
    
    };
  },
  computed: {
    //获取新闻分类
    ...mapState({
      navbarIsShow:(state)=>state.swiper.navbarIsShow
    }),
    ...mapState({
      newsType:(state)=>state.news.newsType
    }),
    


  },
  created() {
    this.getNewsType()
  },
  methods: {

    handleSelect(key, keyPath) {
      //每次选择分类都会触发该方法
      //console.log(key);//1 娱乐新闻
      //将newsType存储在vuex中
      //console.log(key,keyPath)
      this.activeIndex = key
      this.$store.commit('getnewsType',key)

    },
    //获取新闻分类
    getNewsType() {
      this.$api.getNewsType().then(res => {
        if(res.code == 200) {
          //其中typelist 有typeId,typeDate, typeName
          this.typeList = res.typelist
          this.$store.commit('getnewstypeList',res.typelist)
        }
      })
    },
    goType(newsType) {  
      //将当前新闻分类存储在vuex中
      this.$store.commit('getnewsType',newsType)
      //跳转重复路由，会刷新的
      setTimeout(() => {
        this.$router.push(`/userHome/newssort?newsType=${newsType}`)
      })
      
    }
  },
}
</script>

<style lang="less" scroped>
.navbar {
  width:1000px;
  margin: 0 auto;
  .el-menu {
    display: flex;
    .type {
      font-size: 18px;
      font-weight:400px;
    }
    img {
      width:200px;
      height:60px;
    }
    .el-menu-item {
      flex: 1;
      font-weight:400px;
      font-size: 18px;
      flex:1;
      text-align: center;
    }
    .el-submenu{  
      flex: 1;

    }
  }

  
}


</style>