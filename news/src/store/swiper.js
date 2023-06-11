export default {
    state: {
        
    
      //当前行新闻数据
      swiperData:{},
      //导航栏是否显示
      navbarIsShow:true
    
    },
    //里面定义方法，操作state方发
  mutations: {
    getswiperData(state, swiperData) {
      state.swiperData = swiperData
    },
    setnavbarIsShow(state,navbarIsShow) { 
      state.navbarIsShow = navbarIsShow
    }
    



  },

}