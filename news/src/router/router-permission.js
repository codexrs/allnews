import router from './index.js'
import store from '@/store'
//导航守卫
/** 
 * 导航全局守卫
 * to去往的路由
 * from
*/
router.beforeEach((to, from,next)=> {
    
    //判断是否需要登录
    //console.log(to.matched.length,!to.matched.some(item => item.meta.isAdminLogin));
    if(to.path == '/') {
        console.log(1111);
        next('/userHome')
    }
    else if(to.matched.length && !to.matched.some(item => item.meta.isAdminLogin)) {
        //不需要登录
        next()
    } else {
        //需要登录
        //判断是否需要登录:是否已经登陆了，根据token
        //console.log(store.state.AdminLogin.AdminLogin.token);
        let token = store.state.AdminLogin.token
        if(token) {
           next()
        } else {
           next('/AdminLogin')
        }
    }
})