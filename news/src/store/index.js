import Vue from 'vue'
import Vuex from 'vuex'
import news from './news.js'
import swiper from './swiper.js'
import AdminLogin from './AdminLogin'
import createPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)
 
export default new Vuex.Store({
  
  state: {
  

  },
  getters: {
    
  },
  //里面定义方法，操作state方发
  mutations: {
  

  },
  // 操作异步操作mutation
  actions: {
    
  },
  modules: {
    news,
    swiper,
    AdminLogin
  },

  plugins:[
    createPersistedstate({
      key:'news',
      paths:['news','swiper','AdminLogin']
    })
  ]
})