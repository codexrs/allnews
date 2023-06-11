import Vue from 'vue'
import VueRouter from 'vue-router'



/**
 * 后台管理页面路由
 */
const Layout =()=> import('@/views/Layout')
//登录/注册
const AdminLogin =()=> import('@/views/AdminLogin/Login.vue')
const Register =()=> import('@/views/AdminLogin/Register.vue')
const Home =()=> import('@/views/Home')
//基础管理
const BasesManage =()=> import('@/views/BasesManage')
const NewsManage =()=> import('@/views/BasesManage/NewsManage') //新闻管理
const AddNewsList =()=> import('@/views/BasesManage/NewsManage/AddNewsList.vue')
const NewsSortManage =()=> import('@/views/BasesManage/NewsSortManage')  //分类管理
const LeaveWordManage =()=> import('@/views/BasesManage/LeaveWordManage')  //留言管理
const SwiperManage =()=> import('@/views/BasesManage/SwiperManage')   //轮播图管理
const CommentManage =()=> import('@/views/BasesManage/CommentManage')  //评论管理
//系统管理
const SystemManage =()=> import('@/views/SystemManage')
const UserManage =()=> import('@/views/SystemManage/UserManage')  //用户管理
const AdminManage =()=> import('@/views/SystemManage/AdminManage')  //管理员管理

//广告管理
const Advert =()=> import('@/views/Advert')
const AdvertManage =()=> import('@/views/Advert/AdvertManage')  //广告管理

//管理员主页
const AdminHomePage =()=>import('@/views/AdminHomePage')


/**
 * 前台管理页面
 */
const pagesLayout = ()=>import('@/pages/Layout')
//首页
const userHome = ()=>import('@/pages/Home')

//用户主页面
const UserHomePage = ()=> import('@/pages/User/index.vue')
//我的信息页面
const myHome = ( )=> import('@/pages/User/myHome')
//我的发布
const myPublish = ()=> import('@/pages/User/myPublish')
//我的收藏
const myColl = () => import('@/pages/User/myColl')
//我的点赞
const myLike = () => import('@/pages/User/myLike')

//编辑我的新闻
const editMyNews = () => import('@/pages/User/editMyNews')

//新闻分类列表
const NewsSort = () => import('@/pages/NewsSort')
//发布新闻
const PubishNews = () => import('@/pages/PublishNews')
//发布留言
const LeaveWord = () => import('@/pages/LeaveWord')
//新闻详情页
const NewsDetail = () => import('@/components/NewsDetail')
//点击更多 --卡片模式
const MoreNews = () => import('@/pages/MoreNews')
//更多--列表模式
const ListMoreNews = () => import('@/pages/ListMoreNews')
//搜索内容
const SearchContent = () => import('@/pages/searchContent')
//1.安装插件
Vue.use(VueRouter)

//路由对象
const routes = [
  /**
   * 前台管理页
   */
  {
    path:'/userHome',
    component:pagesLayout,
    redirect:'/userHome/home',

    children:[
      //用户首页
      {
        path:'home',
        name:'home',
        component:userHome
      },
      //新闻分类
      {
        path:'newssort',
        name:'newssort',
        component:NewsSort

      },
      //发布新闻
      {
        path:'pubishnews',
        name:'pubishnews',
        component:PubishNews

      },
      //发布留言
      {
        path:'leaveword',
        name:'leaveword',
        component:LeaveWord

      },
      //新闻详情页
      {
        path:'newsdetail',
        name:'newsdetail',
        component:NewsDetail,
      },
      //点击更多--卡片模式
      {
        path:'morenews',
        name:'morenews',
        component:MoreNews
      },
      //点击更多，列表模式
      { 
        path:'listmorenews',
        name:"listmorenews",
        component:ListMoreNews

      },
      //搜索内容
      {
        path:'search',
        name:'search',
        component:SearchContent
      },
      //编辑我的新闻
      {
        path:'editornews',
        name:'editornews',
        component:editMyNews
      },
        //个人主页
      {
        path:'user',
        name:'user',
        component:UserHomePage,
        redirect:'/userHome/user/myHome',
        children:[
            {
              path:'myHome',
              name:'myHome',
              component:myHome
            },
            {
              path:'mypublish',
              name:'mypublish',
              component:myPublish
            },
            {
              path:'mycoll',
              name:'mycoll',
              component:myColl
            },
            {
              path:'mylike',
              name:'mylike',
              component:myLike
            }
          ]
        },
  
      
    ]

  },

  


  


  /**
   * 后台管理页
   */
  {
    path:'/adminHome',
    component:Layout,
    meta:{
      isAdminLogin:true
    },
    
    children:[
      {
        path:'/adminHome',
        name:'home',
        component:Home,
        meta:{
          title:"首页",
          isAdminLogin:true
        },

      },
      //新闻管理
      {
        path:'/basesmanage',
        name:'basesmanage',
        component:BasesManage,
        meta:{
          title:"基础管理"
        },
        redirect:'/basesmanage/newsmanage',
        children: [
          {
            path:'newsmanage',
            name:'newsmanage',
            component:NewsManage,
            meta:{
              title:"新闻管理"
            },
          },
          {
            path:'sortmanage',
            name:'sortmanage',
            component:NewsSortManage,
            meta:{
              title:"新闻分类"
            },
          },
          {
            path:'leavewordemanage',
            name:'leavewordemanage',
            component:LeaveWordManage,
            meta:{
              title:"留言管理"
            },
          },
          {
            path:'commentmanage',
            name:'commentmanage',
            component:CommentManage,
            meta:{
              title:"评论管理"
            },

          },
          {
            path:'swipermanage',
            name:'swipermanage',
            component:SwiperManage,
            meta:{
              title:"轮播图"
            },
          },
          {
            //添加新闻
            path:'addnewslist',
            name:'addnewslist',
            component:AddNewsList,
            //路由元信息
            //高亮设置
            meta: {
              activeMenu:'/basesmanage/newsmanage'
            }
          },
        
        ]
        
      },
      //系统管理
      {
        path:'/system',
        name:'system',
        component:SystemManage,
        redirect:'/system/usermanage',
        meta:{
          title:"系统管理"
        },
        children: [
          {
            path:'usermanage',
            name:'usermanage',
            component:UserManage,
            meta:{
              title:"用户管理"
            },
          },
          {
            path:'adminmanage',
            name:'adminmanage',
            component:AdminManage,
            meta:{
              title:"管理员"
            },
          },
        
        ]
      },
      //广告管理
      {
        path:'/advert',
        name:'advert',
        redirect:'/advert/advertmanage',
        component:Advert,
        children:[

          {
            path:'advertmanage',
            name:'advertmanage',
            component:AdvertManage,
            meta:{
              title:"广告管理"
            },
          }
        ]
      }
    ]
  }, 
  //登录用户和管理员通用
  {
    path:'/AdminLogin',
    name:'AdminLogin',
    component:AdminLogin
  },
  //用户注册
  {
    path:"/Register",
    name:'Register',
    component:Register
  },
  //管理员主页
  {
    path:'/adminhomepage',
    name:'adminhomepage',
    component:AdminHomePage
  },

]

const router = new VueRouter({
    routes,
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
})

//导出
export default router