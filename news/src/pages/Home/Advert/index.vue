<template>
  <div class="useradvert">
    <div class="newsadvert">最新广告</div>
    <div class="advertlist">
      <div class="advert" v-for="(advert,index) in advertlist" :key="index">
        <div class="advertname">{{advert.advertName}}</div>
        <a :href="advert.advertUrl"><img :src="advert.advertImgUrl.slice(2,advert.advertImgUrl.length-2)" /></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'Advert',
  data() {
    return {  
      advertlist:[]
    }
  },
  mounted() {
    this.getAdvert()
  },
  methods:{
    //获取广告
    getAdvert() {
      this.$request.getAdvert().then(res => {
        if(res.code == 200) {
          this.advertlist = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scroped>
.useradvert {
  .newsadvert {
    font-size:28px;
    color: #F56C6C;
    margin-top: 10px;
  }
.advertlist {
  position:relative;
  width:1000px;
  margin:0 auto;
  display:flex;
  flex-wrap:wrap;
  background-color:#fff;

  .advert {
    
    padding:10px 7.5px;
    .advertname {
      position:absolute;
      color:#cc0033;
    }
    margin-right:5px;

    img{
      width:230px;
      height:120px;
      transition: all 0.4s;
    }

  }
  .advert:hover{
    box-shadow: 0 8px 8px 0 grey;  // 设置盒子阴影
    transform: translate(0, -10px); // 鼠标悬浮时box向上浮动的距离
  }
}
}
</style>