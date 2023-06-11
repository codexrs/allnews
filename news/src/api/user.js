//配置前台请求接口
const user = {
    //用户获取新闻
    usernewslist:'/api/users/newslist',
    //用户获取评论信息
    getComm:'/api/users/getComm',
    //用户提交评论
    submitComm:'/api/users/submitComm',
    //获取广告
    GetAdvert:'/api/users/getAdvert',
    //用户获取不同分类新闻
    GetNewssortList:'/api/users/newssort',
    //用户发布留言
    upLeaveWord:'/api/users/upLeaveWord',
    //用户浏览，新闻浏览次数+1
    newsWacthAdd:'/api/users/newsWacthAdd',
    //获取新闻评论条数
    getPinglunNum:'/api/users/getPinglunNum',
    //用户收藏新闻
    usercoll:'/api/users/usercoll',
    //用户取消收藏
    deleteColl:'/api/users/deleteColl',
    //用户点赞新闻
    userlike:'/api/users/userlike',
    //用户取消点赞
    deletelike:'/api/users/deletelike',
    //新闻收藏数量+1
    newsCollectionAdd:'/api/users/newsCollectionAdd',
    //新闻收藏数量-1
    deletenewsCollection:'/api/users/deletenewsCollection',
    //新闻点赞数量+1
    newsLikeNumAdd:'/api/users/newsLikeNumAdd',
    //新闻点赞数量-1
    deletenewsLikeNum:'/api/users/deletenewsLikeNum',
    //用户是否已经收藏
    collIshow:'/api/users/collIshow',
    //用户是否已经点赞
    likeIshow:'/api/users/likeIshow',
    
    //删除用户新闻
    isdeletemynews:'/api/users/isdeletemynews',
    
    //个人中心
    //修改头像
    upuserUrl:'/api/users/upuserUrl',
    
    //修改密码
    upuserPass:'/api/users/upuserPass',
    //我的发布
    mypublish:'/api/users/mypublish',
    //我的收藏
    mycoll:'/api/users/mycoll',
    //我的点赞
    mylike:'/api/users/mylike',

    //用户搜索
    search:'/api/users/search'
}
export default user