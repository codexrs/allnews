<template>
  <div class="home"> 
   <!-- 轮播图 -->
    <Swiper :bannerlist="bannerlist"></Swiper>
    <div class="content">
      <div class="main">
        <AllNewsList></AllNewsList>
      </div>
    </div>
    <div class="Advert">
      <Advert></Advert>
    </div>
  </div>

  
</template>

<script>
import Swiper from '@/components/Swiper'
import AllNewsList from './AllNewList'
import Advert from './Advert'
export default {
  name:'Home',
  data() {
    return {
      //轮播图数据
      bannerlist:[]
    }
  },
  components:{
    Swiper,
    AllNewsList,
    Advert
  },
  created() {
    this.getSwiperData()
    this.$store.commit('setnavbarIsShow',true)
  },
  methods:{
    //获取轮播图数据,参数{page:当前页码,pageSize:每页数量}
    getSwiperData() {
      this.$api.getSwiperData().then(res => {
        if(res.code == 200) {
          this.bannerlist = res.newslist
        }
        console.log(this.bannerlist);
        
      })
    }
  }
}
</script>

<style lang="less" scroped>
.home {  
  .content {
    width:1000px;
    margin:0 auto;

  }
  .Advert {
    width:1000px;
    margin:0 auto;
  }
}
</style>