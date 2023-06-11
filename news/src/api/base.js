//请求接口配置
const base = {
  host:'http://localhost:3000',
  //首页数据接口统计
  //homeCount:'/api/home/dataCount',
  //获取超级管理员menu
  Adminsupermenu:'/api/admin/supermenu',
  //普通管理员菜单
  Adminvipmenu:'/api/admin/vipmenu',
  /**
   * news表操作
   */
  //获取新闻列表分页数据
  AdminNewList:'/api/admin/getAllnewlist',
  AdmingetNewsData:'/api/admin/getNewsData',
  //搜索，根据newsId获取新闻列表数据
  AdminNewsListByNewsId:'/api/admin/getNewsListByNewsId',
  //搜索， 根据newsTitle 模糊获取新闻列表数据
  AdminNewsListByNewsTitle:'/api/admin/getNewsListByTitle',
  //搜索， 根据newsType 获取新闻列表数据
  AdminNewListByNewsType:'/api/admin/getNewsListByType',
  //多条件查询新闻列表
  AdminNewsListByMore:'/api/admin/getMoreNewsListSerch',
  
  //获取新闻类别
  AdminNewsType:'/api/admin/getNewsType',

  //删除单个新闻
  AdminDeleteNewsList:'/api/admin/delectNewsList',
 
  //新闻添加
  AdminAddNewsList:'/api/admin/addNewsList',

  //修改新闻
  AdminUpdateNewsList:'/api/admin/updateNewsList',

  //批量删除新闻
  AdmindelectSomeNewsList:'/api/admin/delectSomeNewsList',
  
  //富文本上传文件接口
  batchUpload:'/api/admin/batchUpload',

  //修改新闻审核状态
  AdminupdateNewsState:'/api/admin/updateNewsState',

  //当日新闻
  AdmingetNowDayNews:'/api/admin/getNowDayNews',
  //获取近七天新闻数据
  AdmingetSevenNewsCount:'/api/admin/getSevenNewsCount',
  /**
   * type表操作
   */
  //获取type表数据
  AdmingetTypeData:'/api/admin/getTypeData',

  //搜索， 根据typeName获取对应type列表数据
  AdmingetTypeListByName:'/api/admin/getTypeListByName',
  //添加新闻分类
  AdminaddTypeList:'/api/admin/addTypeList',
  //删除单个新闻分类
  AdmindelectTypeList:'/api/admin/delectTypeList',
  //分类批量删除
  AdmindelectSomeTypeList:'/api/admin/delectSomeTypeList',
  //修改新闻分类
  AdminupdateTypeList:'/api/admin/updateTypeList',

  /**
   * swiper表的操作
   */
  //获取swiper表数据 
  AdmingetSwiperData:'/api/admin/getSwiperData',
  //删除单个swiper数据
  AdmindelectSingleSwiperList:'/api/admin/delectSingleSwiperList',
  //添加swiper
  AdminaddSwiperList:'/api/admin/addSwiperList',
  //更新swiper
  AdminupdateSwiperList:'/api/admin/updateSwiperList',
  //批量删除
  AdmindelectSomeSwiperList:'/api/admin/delectSomeSwiperList',
  
  /**
   * user表的操作
   */
  //查询user所有数据
  //根据userId获取用户
  AdmingetUserById:'/api/admin/getUserById',
  AdmingetAllUserList:'/api/admin/getAllUserList',
  //删除单个user数据
  AdmindeleteSingleUserList:'/api/admin/delectSingleUserList',
  //添加用户
  AdminaddUserList:'/api/admin/addUserList',
  //批量删除用户
  AdmindelectSomeUserList:'/api/admin/delectSomeUserList',
  //多条件搜索用户
  AdmingetMoreUserListSerch:'/api/admin/getMoreUserListSerch',
  //更新user
  AdminupdateUserList:'/api/admin/updateUserList',
  //修改用户审核状态
  AdminupdateUserState:'/api/admin/updateUserState',


  /**
   * admin表操作
   */
  AdmingetAdminUserById:'/api/admin/getAdminUserById',
  //获取所有admin
  AdmingetAllAdminList:'/api/admin/getAllAdminList',
  //删除单个admin
  AdmindelectSingleAdminList:'/api/admin/delectSingleAdminList',
  //添加管理员
  AdminaddAdminList:'/api/admin/addAdminList',
  //更新管理员
  AdminupdateAdminList:'/api/admin/updateAdminList',
  //多条件搜索
  AdmingetMoreAdminListSerch:'/api/admin/getMoreAdminListSerch',
  //批量删除admin
  AdmindelectSomeAdminList:'/api/admin/delectSomeAdminList',
  //修改管理员头像
  AdminupadminUrl:'/api/admin/upadminUrl',
  //修改管理员密码
  AdminupadminPass:'/api/admin/upadminPass',
  /**
   * advert操作
   */
    //获取所有广告
  AdmingetAllAdvertList:'/api/admin/getAllAdvertList',
  //删除单个
  AdmindelectSingleAdvertList:'/api/admin/delectSingleAdvertList',
  //添加
  AdminaddAdvertList:'/api/admin/addAdvertList',
  //修改
  AdminupdateAdvertList:'/api/admin/updateAdvertList',
  //搜索
  AdmingetAdvertListByName:'/api/admin/getAdvertListByName',
  //批量删除
  AdmindelectSomeAdvertList:'/api/admin/delectSomeAdvertList',

  /**
   * 留言管理leaveword
   */
  //获取留言信息
  AdmingetAllLeaveWordList:'/api/admin/getAllLeaveWordList',
  //删除
  AdmindelectSingleLeaveWordList:'/api/admin/delectSingleLeaveWordList',
  //批量删除
  AdmindelectSomeLeaveWordList:'/api/admin/delectSomeLeaveWordList',
  //搜索
  AdmingetLeaveWordListByContent:'/api/admin/getLeaveWordListByContent',

  /**
   * 评论管理
   */
  AdmingetCommData:'/api/admin/getCommData',
  //删除评论
  AdmindeleteSingleCommList:'/api/admin/deleteSingleCommList',
  //批量删除
  AdmindelectSomeCommList:'/api/admin/delectSomeCommList',
  //搜索
  AdmingetCommBynewsTitle:'/api/admin/getCommBynewsTitle',


  //权限接口
  adminpermission:'/api/admin/adminpermission',


  //登录接口
  Login:'/api/login/Login',
  //注册接口
  Register:'/api/login/Register',

}

//导出新闻图片的地址
export const newImgUpload = '/api/admin/uploadImg';
//导出轮播图地址
export const swiperImgUpload='/api/admin/swiperImgUpload';
//用户头像地址
export const userImgUpload = '/api/admin/userImgUpload'
//管理员头像地址
export const adminImgUpload ='/api/admin/adminImgUpload'
//广告图
export const advertImgUpload = '/api/admin/advertImgUpload'
export default base