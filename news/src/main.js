import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import store from '@/store'
//点击跳转同一个路径,不会发生警告
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function(location) {
  return routerPush.call(this, location).catch(err => {})
};

//导入element-ui
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
//导入echarts
// 引入echarts
import * as echarts from 'echarts'
//全局使用echarts
Vue.prototype.$echarts = echarts


//路由
import router from './router'
Vue.config.productionTip = false;

//css初始化 reset.css
import './assets/css/reset.css'

//图标iconfont
import './assets/css/iconfont.css'

//后台请求接口api
import api from '@/api/index.js'
//前台请求接口request
import request from '@/api/userIndex.js'
Vue.prototype.$api = api
Vue.prototype.$request = request

//全局组件--面包屑
import Breadcrumb from '@/components/Breadcrumb'
Vue.component('Breadcrumb',Breadcrumb)

//全局组件--上传图片
import UploadImg from '@/components/UploadImg'
Vue.component('UploadImg',UploadImg)
//全局组件--wangeditor
import WangEdior from '@/components/WangEditor'
Vue.component('wangeditor',WangEdior)

//全局导航守卫
import './router/router-permission.js'

//md5加密
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

new Vue({
  render: h => h(App),
  router,
  store,
  //i18n
}).$mount('#app')
