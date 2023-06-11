var express = require('express');
var router = express.Router();

var News = require('../controllers/newsController')

var Type = require('../controllers/typeController')

var Swiper = require('../controllers/swiperController')

var User = require('../controllers/userController')

var Admin = require('../controllers/adminController')

var Advert = require('../controllers/advertController')

var LeaveWord = require('../controllers/leavewordController')

var Comm = require('../controllers/commControll')


//超级管理员菜单栏
let supermenu = require('../supermenu')
router.get('/supermenu', async (req, res, next) => {
    res.json({
        code: 1,
        supermenu:supermenu
    })
});

//普通管理员菜单栏
let vipmenu = require('../vipmenu')
router.get('/vipmenu', async (req, res, next) => {
    res.json({
        code:2,
        vipmenu:vipmenu
    })
})
// /admin/getAllnewlist   获取新闻列表信息/分页
router.get('/getAllnewlist', News.getAllNewsList);

router.get('/getNewsData',News.getNewsData)
/**
 * 新闻管理页
 */
//搜索，根据newsId获取新闻列表数据
router.get('/getNewsListByNewsId',News.getNewsListByNewsId)
//搜索，根据newsTitle模糊查询新闻列表
router.get('/getNewsListByTitle', News.getNewsListByTitle)
//搜索，根据新闻分类，获取新闻列表数据
router.get('/getNewsListByType', News.getNewsListByType)
//搜索，多条件查询
router.get('/getMoreNewsListSerch', News.getMoreNewsListSerch)

//获取新闻类别
router.get('/getNewsType', News.getNewsType)

//删除 单个新闻 newsId新闻
router.post('/delectNewsList', News.delectNewsList)

//添加新闻
router.post('/addNewsList', News.addNewsList)

//修改新闻
router.post('/updateNewsList', News.updateNewsList)

//批量删除新闻
router.post('/delectSomeNewsList',News.delectSomeNewsList)
//修改新闻状态
router.post('/updateNewsState', News.updateNewsState)
//获取当日新闻
router.get('/getNowDayNews',News.getNowDayNews)
//获取近七天的新闻数据
router.get('/getSevenNewsCount',News.getSevenNewsCount)

//图片上传
let upload = require('../util/multer/index')
router.post('/uploadImg', upload.single('file'), News.newsImgUpload)
//富文本图片上传
router.post('/batchUpload', upload.single('file'), News.batchUpload)
//轮播图上传
router.post("/swiperImgUpload", upload.single('file'), Swiper.swiperImgUpload)
//用户头像上传
router.post('/userImgUpload', upload.single('file'),User.userImgUpload)
//管理员头像
router.post('/adminImgUpload',upload.single('file'), Admin.adminImgUpload)
//广告图
router.post('/advertImgUpload',upload.single('file'), Advert.advertImgUpload)



/**
 * 新闻分类页
 */

//获取新闻分类表数据
router.get('/getTypeData',Type.getTypeData)
//搜索 通过typeName获取type列表数据
router.get('/getTypeListByName',Type.getTypeListByName)
//添加新闻分类
router.post('/addTypeList', Type.addTypeList)
//删除新闻分类
router.post('/delectTypeList', Type.delectTypeList)
//批量删除分类
router.post('/delectSomeTypeList', Type.delectSomeTypeList)
//修改新闻分类
router.post('/updateTypeList',Type.updateTypeList)

/**
 * 轮播图页
 */
//获取轮播图数据
router.get('/getSwiperData', Swiper.getSwiperData)
//删除单个轮播图
router.post('/delectSingleSwiperList',Swiper.delectSingleSwiperList)
//添加swiper
router.post('/addSwiperList',Swiper.addSwiperList)
//更新swiper
router.post('/updateSwiperList',Swiper.updateSwiperList)
//批量删除
router.post('/delectSomeSwiperList', Swiper.delectSomeSwiperList)

/*
    user用户表操作
*/
//根据userId获取用户
router.get('/getUserById',User.getUserById)
//查询user数据
router.get('/getAllUserList', User.getAllUserList)
//删除单个user列表
router.post('/delectSingleUserList',User.delectSingleUserList)
//添加用户
router.post('/addUserList', User.addUserList)
//批量删除用户
router.post('/delectSomeUserList', User.delectSomeUserList)
//多条件搜索
router.get('/getMoreUserListSerch', User.getMoreUserListSerch)
//更新修改user
router.post('/updateUserList', User.updateUserList)
//修改用户审核状态
router.post('/updateUserState', User.updateUserState)

/**
 * admin表操作
 */

router.get('/getAdminUserById',Admin.getAdminUserById)

//获取admin表数据
router.get('/getAllAdminList', Admin.getAllAdminList)
//删除单个admin
router.post('/delectSingleAdminList',Admin.delectSingleAdminList)
//添加管理员
router.post('/addAdminList',Admin.addAdminList)
//编辑管理员
router.post('/updateAdminList',Admin.updateAdminList)
//多条件搜索
router.get('/getMoreAdminListSerch',Admin.getMoreAdminListSerch)
//批量删除
router.post('/delectSomeAdminList', Admin.delectSomeAdminList)
//修改管理员头像
router.post('/upadminUrl', Admin.upadminUrl)
//修改管理员密码
router.post('/upadminPass',Admin.upadminPass)
/**
 * advert操作
 */
//获取admin表数据
router.get('/getAllAdvertList', Advert.getAllAdvertList)
//删除单个
router.post('/delectSingleAdvertList', Advert.delectSingleAdvertList)
//添加
router.post('/addAdvertList', Advert.addAdvertList)
//修改
router.post('/updateAdvertList', Advert.updateAdvertList)
//搜索
router.post('/getAdvertListByName',Advert.getAdvertListByName)
//批量删除
router.post('/delectSomeAdvertList',Advert.delectSomeAdvertList)


/**
 * 留言管理 leaveword
 */
router.get('/getAllLeaveWordList',LeaveWord.getAllLeaveWordList)
//删除单个
router.post('/delectSingleLeaveWordList',LeaveWord.delectSingleLeaveWordList)
//批量删除
router.post('/delectSomeLeaveWordList', LeaveWord.delectSomeLeaveWordList)
//搜索留言内容
router.get('/getLeaveWordListByContent',LeaveWord.getLeaveWordListByContent)

/**
 * 评论管理
 */
router.get('/getCommData',Comm.getCommData)
//删除单个评论
router.post('/deleteSingleCommList',Comm.deleteSingleCommList)
//批量删除
router.post('/delectSomeCommList',Comm.delectSomeCommList)
//搜索获取评论
router.get('/getCommBynewsTitle',Comm.getCommBynewsTitle)



module.exports = router;