/**
 * 前台请求接口
 */
import user from './user'
import requests from '@/request/request.js'

const request = {
    //用户获取新闻信息
    getusernewslist(params) {
        return requests({
            method:'get',
            url:user.usernewslist,
            params:params
        })
    },

    //用户获取评论信息
    getComm(newsId) {
        return requests({
            method:'get',
            url:user.getComm,
            params:{
                newsId
            }
        })
    },

    submitComm(userId,entityType,entityId,targetId,commContent,commTime) {
        return requests({
            method:'post',
            url:user.submitComm,
            params:{
                userId,entityType,entityId,targetId,commContent,commTime
            }
        })
    },
    //获取广告
    getAdvert() {
        return requests({
            method:'get',
            url:user.GetAdvert
        })
    },
    //获取不同分类的新闻数据
    GetNewssortList(params) {
        return requests({
            method:"get",
            url:user.GetNewssortList,
            params:params
        })
    },
    //用户发布留言
    upLeaveWord(leavewordContent,leavewordEmail,leavewordPhone,leavewordTime) {
        return requests({
            method:'post',
            url:user.upLeaveWord,
            params:{
                leavewordContent,leavewordEmail,leavewordPhone,leavewordTime
            }
        })
    },
    //用户浏览新闻，新闻浏览次数+1
    newsWacthAdd(newsId) {
        return requests({
            method:'post',
            url:user.newsWacthAdd,
            params:{
                newsId
            }
        })
    },
    //获取新闻评论条数
    getPinglunNum(newsId) {
        return requests({
            method:'get',
            url:user.getPinglunNum,
            params:{
                newsId
            }
        })
    },
    //用户收藏新闻
    usercoll(userId,newsId) {
        return requests({
            method:'post',
            url:user.usercoll,
            params:{
                userId,newsId
            }
        })
    },
    //用户取消收藏
    deleteColl(userId,newsId) {
        return requests({
            method:'post',
            url:user.deleteColl,
            params:{
                userId,newsId
            }
        })
    },
    //用户点赞新闻
    userlike(userId,newsId) {
        return requests({
            method:'post',
            url:user.userlike,
            params:{
                userId,newsId
            }
        })
    },
    //用户取消点赞
    deletelike(userId,newsId) {
        return requests({
            method:'post',
            url:user.deletelike,
            params:{
                userId,newsId
            }
        })
    },
    //新闻收藏数量+1
    newsCollectionAdd(newsId) {
        return requests({
            method:'post',
            url:user.newsCollectionAdd,
            params:{
                newsId
            }
        })
    },
    //新闻收藏数量-1
    deletenewsCollection(newsId) {
        return requests({
            method:'post',
            url:user.deletenewsCollection,
            params:{
                newsId
            }
        })
    },
    //新闻点赞数量+1
    newsLikeNumAdd(newsId) {
        return requests({
            method:'post',
            url:user.newsLikeNumAdd,
            params:{
                newsId
            }
        })
    },
    //新闻点赞数量-1
    deletenewsLikeNum(newsId) {
        return requests({
            method:'post',
            url:user.deletenewsLikeNum,
            params:{
                newsId
            }
        })
    },
    //用户是否已经收藏
    collIshow(userId,newsId) {
        return requests({
            method:'get',
            url:user.collIshow,
            params:{
                userId,newsId
            }
        })
    },
    //用户是否已经点赞
    likeIshow(userId,newsId) {
        return requests({
            method:'get',
            url:user.likeIshow,
            params:{
                userId,newsId
            }
        })
    },
    //用户删除自己新闻
    isdeletemynews(userId,newsId) {
        return requests({
            method:'post',
            url:user.isdeletemynews,
            params:{
                userId,newsId
            }
        })
    },
    //个人中心
    //修改头像
    upuserUrl(userUrl,userTime,userId) {
        return requests({
            method:'post',
            url:user.upuserUrl,
            params:{
                userUrl,userTime,userId
            }
        })
    },

    //修改密码
    upuserPass(userPass,userTime,userId) {
        return requests({
            method:'post',
            url:user.upuserPass,
            params:{
                userPass,userTime,userId
            }
        })
    },
    //我的发布
    getmypublish(userId) {
        return requests({
            method:'get',
            url:user.mypublish,
            params:{
                userId
            }
        })
    },
    //我的收藏
    getmycoll(userId) {
        return requests({
            method:'get',
            url:user.mycoll,
            params:{
                userId
            }
        })
    },
    //我的点赞
    getmylike(userId) {
        return requests({
            method:'get',
            url:user.mylike,
            params:{
                userId
            }
        })
    },
    //用户搜索
    getsearch(params) {
        return requests({
            method:'get',
            url:user.search,
            params:params
        })
    }
}

export default request