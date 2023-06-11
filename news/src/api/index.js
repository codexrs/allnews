import base from './base'
import requests from '@/request/request.js'

//myaxios 无二次封装
import myaxios from 'axios'

/**
* 
 * @returns 后台管理接口
*/
const api = {
  //登录接口
  Login(params) {
    return requests({
      method:'post',
      url:base.Login,
      params:params
    })
  },
  //注册接口
  Register(params) {
    return requests({
      method:'post',
      url:base.Register,
      params:params
    })
  },

  //超级管理员菜单menu
  supermenu() {
    return requests({
      method:'get',
      url:base.Adminsupermenu
    })
  },
  //普通管理员菜单
  vipmenu() {
    return requests({
      method:'get',
      url:base.Adminvipmenu
    })
  },
  /**
   * news表的增删查改
   */
  //获取新闻列表,-代表可不传，*代表一定要传参数
  //参数 -page,-pageSize
  //page：当前页码，pageSize：每一页的数据量
  getAdminNewList(params) {
    //axios.get(url, params: {})
    return requests({
      method:'get', 
      url:base.AdminNewList,
      params:params
    })
  },
  //获取没有分页的news
  getNewsData() {
    return requests({
      method:'get',
      url:base.AdmingetNewsData,

    })
  },
  
  //搜索，根据newsId获取新闻列表
  getNewsListByNewsId(newsId) {
    return requests({
      method:'get',
      url:base.AdminNewsListByNewsId,
      params:{
        newsId:newsId
      }
    })
  },
  //搜索， 根据newsTitle 模糊查询新闻列表数据
  getNewsListByTitle(newsTitle) {
    return requests({
      method:'get',
      url:base.AdminNewsListByNewsTitle,
      params: {
        newsTitle:newsTitle
      }
    })
  },
  //搜索 ， 根据newsType 获取新闻列表数据
  getNewsListByType(newsType) {
    return requests({
      method:'get',
      url:base.AdminNewListByNewsType,
      params: {
        newsType:newsType
      }
    })
  },
  //多条件查询新闻列表
  getMoreNewsListSerch(newsId,newsType,newsTitle) {
    return requests({
      method:'get',
      url:base.AdminNewsListByMore,
      params: {
        newsId,
        newsTitle,
        newsType
      }
    })
  },


  //获取新闻类别
  getNewsType() {
    return requests({
      method:'get',
      url:base.AdminNewsType,

    })
  },

  // 删除单个新闻列表
  deleteSinggleNewsList(newsId) {
    return requests({
      method:'post',
      url:base.AdminDeleteNewsList,
      params:{
        newsId:newsId
      }
    })
  },

  //添加新闻
  AddNewsList(newslist) {
    return requests({
      method:'post',
      url:base.AdminAddNewsList,
      params:{newslist}
    })
  },
  //修改新闻
  UpdateNewsList(newslist) {
    return requests({
      method:'post',
      url:base.AdminUpdateNewsList,
      params:{newslist}
    })
  },
  //批量删除新
  //newsIds="1,2,3"
  delectSomeNewsList(newsIds) {
    return requests({
      method:'post',
      url:base.AdmindelectSomeNewsList,
      params:{
        newsIds:newsIds
      }
    })
  },
  
  //富文本文件上传接口
  batchUpload(params) {
    //console.log(requests.postFormData)
    return myaxios.post(base.batchUpload,params)
  
  },
  //修改新闻审核状态
  updateNewsState(newsState, newsId) {
    return requests({
      method:'post',
      url:base.AdminupdateNewsState,
      params: {
        newsState,
        newsId
      }
    })
  },
  //当日新闻
  getNowDayNews() {
    return requests({
      method:'get',
      url:base.AdmingetNowDayNews
    })
  },
  //获取近七天新闻数据
  getSevenNewsCount(Time,Table) {
    return requests({
      method:'get',
      url:base.AdmingetSevenNewsCount,
      params:{
        Time,Table
      }
    })
  },

  /**
   * type表的增删查改
   */
  //获取type表数据 带有分页
  getTypeData(params) {
    return requests({
      method:'get',
      url:base.AdmingetTypeData,
      params:params
    })
  },
  //搜索 typeName获取type对应数据
  getTypeListByName(typeName) {
    return requests({
      method:'get',
      url:base.AdmingetTypeListByName,
      params:{
        typeName
      }
    })
  },
  //添加新闻分类
  addTypeList(typeId,typeName,typeDate) {
    return requests({
      method:'post',
      url:base.AdminaddTypeList,
      params: {
        typeId,
        typeName,
        typeDate
      }
    })
  },
  //删除单个新闻分类
  delectSingleTypeList(typeId) {
    return requests({
      method:'post',
      url:base.AdmindelectTypeList,
      params:{
        typeId
      }
    })
  },
  //分类批量删除
  delectSomeTypeList(typeIds) {
    return requests({
      method:'post',
      url:base.AdmindelectSomeTypeList,
      params:{
        typeIds
      }
    })
  },
  //修改新闻分类
  updateTypeList(typeId,typeName,typeDate) {
    return requests({
      method:'post',
      url:base.AdminupdateTypeList,
      params:{
        typeId,
        typeName,
        typeDate
      }
    })
  },

  /**
   * swiper操作
   */
  //获取swiper数据
  getSwiperData(params) {
    return requests({
      method:'get',
      url:base.AdmingetSwiperData,
      params:params
    })
  },
  //删除单个swiper数据
  delectSingleSwiperList(swiperIndex) {
    return requests({
      method:'post',
      url:base.AdmindelectSingleSwiperList,
      params: {
        swiperIndex
      }
    })
  },
  //添加swiper
  addSwiperList(swiperIndex,swiperurl,swipertime) {
    return requests({
      method:'post',
      url:base.AdminaddSwiperList,
      params:{
        swiperIndex,
        swiperurl,
        swipertime
      }
    })
  },
  //更新swiper
  updateSwiperList(swiperIndex,swiperurl,swipertime,swiperId) {
    return requests({
      method:'post',
      url:base.AdminupdateSwiperList,
      params:{
        swiperIndex,
        swiperurl,
        swipertime,
        swiperId
      }
    })
  },
  //批量删除
  delectSomeSwiperList(swiperIndexs) {
    return requests({
      method:'post',
      url:base.AdmindelectSomeSwiperList,
      params:{
        swiperIndexs
      }
    })
  },


  /**
   * user表的操作
   */
  //根据userId获取user
  getUserById(userId) {
    return requests({
      method:'get',
      url:base.AdmingetUserById,
      params:{
        userId
      }
    })
   },
  //获取user表
   getAllUserList(params) {
     return requests({
      method:'get',
      url:base.AdmingetAllUserList,
      params:params
     })
   },
   //删除单个user数据
   delectSingleUserList(userId) {
     return requests({
       method:'post',
       url:base.AdmindeleteSingleUserList,
       params:{
        userId
       }
     })
   },
   //添加用户
   addUserList(userName,userPass,userSex,userUrl,userTime) {
     return requests({
       method:'post',
       url:base.AdminaddUserList,
       params:{
        userName,userPass,userSex,userUrl,userTime
       }
     })
   },
   //批量删除用户
   delectSomeUserList(userIds) {
     return requests({
       method:'post',
       url:base.AdmindelectSomeUserList,
       params:{
        userIds
       }
     })
   },
   //多条件搜索
   getMoreUserListSerch(userId,userName,userSex) {
     return requests({
       method:'get',
       url:base.AdmingetMoreUserListSerch,
       params:{
        userId,userName,userSex
       }
     })
   },
   //更新user
   updateUserList(userName,userPass,userSex,userUrl,userTime,userId,preName) {
     return requests({
       method:'post',
       url:base.AdminupdateUserList,
       params:{
        userName,userPass,userSex,userUrl,userTime,userId,preName
       }
     })
   },
   //修改用户审核状态
   updateUserState(userState,userId) {
     return requests({
       method:'post',
       url:base.AdminupdateUserState,
       params:{
        userState,userId
       }
     })
   },

   /**
    * admin表操作
    */
   //获取admin根据id
   getAdminUserById(adminId) {
    return requests({
      method:'get',
      url:base.AdmingetAdminUserById,
      params:{
        adminId
      }
    })
   },
   //获取admin表所有数据
   getAllAdminList(params) {
     return requests({
       method:'get',
       url:base.AdmingetAllAdminList,
       params:params
     })
   },
   //删除单个admin
   delectSingleAdminList(adminId) {
     return requests({
       method:'post',
       url:base.AdmindelectSingleAdminList,
       params:{
         adminId
       }
     })
   },
   //添加管理员
   addAdminList(adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail) {
     return requests({
       method:'post',
       url:base.AdminaddAdminList,
       params:{
        adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail
       }
     })
   },
   //编辑管理员
   updateAdminList(adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail,adminId,preName) {
     return requests({
       method:'post',
       url:base.AdminupdateAdminList,
       params:{
         adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail,adminId,preName
       }
     })
   },
   //多条件搜索
   getMoreAdminListSerch(adminId,adminName,adminSex) {
     return requests({
       method:'get',
       url:base.AdmingetMoreAdminListSerch,
       params:{
        adminId,adminName,adminSex
       }
     })
   },
   //批量删除
   delectSomeAdminList(adminIds) {
     return requests({
       method:'post',
       url:base.AdmindelectSomeAdminList,
       params:{
         adminIds
       }
     })
   },
   //修改头像
   upadminUrl(adminUrl,adminTime,adminId) {
    return requests({
        method:'post',
        url:base.AdminupadminUrl,
        params:{
          adminUrl,adminTime,adminId
        }
    })
    },

    //修改密码
    upadminPass(adminPass,adminTime,adminId) {
        return requests({
            method:'post',
            url:base.AdminupadminPass,
            params:{
              adminPass,adminTime,adminId
            }
        })
    },

   /**
    * advert操作
    */
  getAllAdvertList(params) {
    return requests({
      method:'get',
      url:base.AdmingetAllAdvertList,
      params:params
    })
  },
  
 //删除单个
 delectSingleAdvertList(advertId) {
  return requests({
    method:'post',
    url:base.AdmindelectSingleAdvertList,
    params:{
      advertId
    }
  })
  },
  //添加
  addAdvertList(advertName,advertUrl,advertImgUrl,advertTime) {
    return requests({
      method:'post',
      url:base.AdminaddAdvertList,
      params:{
        advertName,advertUrl,advertImgUrl,advertTime
      }
    })
  },
  //修改
  updateAdvertList(advertName,advertUrl,advertImgUrl,advertTime,advertId,preName) {
    return requests({
      method:'post',
      url:base.AdminupdateAdvertList,
      params:{
        advertName,advertUrl,advertImgUrl,advertTime,advertId,preName
      }
    })
  },
  //搜索
  getAdvertListByName(advertName) {
    return requests({
      method:'post',
      url:base.AdmingetAdvertListByName,
      params:{
        advertName
      }
    })
  },
  //批量删除
  delectSomeAdvertList(advertIds) {
    return requests({
      method:'post',
      url:base.AdmindelectSomeAdvertList,
      params:{
        advertIds
      }
    })
  },

  /**
   * 留言管理
   */
   getAllLeaveWordList(params) {
     return requests({
       method:'get',
       url:base.AdmingetAllLeaveWordList,
       params:params
     })
   },
   //删除单个
   delectSingleLeaveWordList(leavewordId) {
     return requests({
       method:'post',
       url:base.AdmindelectSingleLeaveWordList,
       params:{
        leavewordId
       }
     })
   },
   //批量删除
   delectSomeLeaveWordList(leavewordIds) {
     return requests({
       method:'post',
       url:base.AdmindelectSomeLeaveWordList,
       params:{
        leavewordIds
       }
     })
   },
   //搜索留言内容
   getLeaveWordListByContent(leavewordContent) {
    return requests({
      method:'get',
      url:base.AdmingetLeaveWordListByContent,
      params:{
        leavewordContent
      }
    })
   },

   /**
    * comm评论管理
    * 
    */
  getCommData(params) {
    return requests({
      method:'get',
      url:base.AdmingetCommData,
      params:params
    })
  },
  //删除单个评论
  deleteSingleCommList(id) {
    return requests({
      method:'post',
      url:base.AdmindeleteSingleCommList,
      params:{
        id
      }
    })
  },
  //批量删除

  delectSomeCommList(commIds) {
    return requests({
      method:'post',
      url:base.AdmindelectSomeCommList,
      params:{
        commIds
      }
    })
  },
  //搜索
  getCommBynewsTitle(newsTitle) {
    return requests({
      method:'get',
      url:base.AdmingetCommBynewsTitle,
      params:{
        newsTitle
      }
    })
  }
}

export default api