var express = require('express');
var router = express.Router();


const dbconfig = require('../util/dbconfig');


//用户获取所有新闻
let newslist = async function(page,pageSize) {
    var sql = `select *  from news where newsState='1' ORDER BY newsTime DESC limit ${(page -1)*pageSize},${pageSize}`
    return await dbconfig.SySqlConnect(sql,[])
     
}
let allnewslist = async function() {
  var sql = `select * from news where newsState='1' ORDER BY newsTime DESC`
  return await dbconfig.SySqlConnect(sql,[])
}
let adminById =async function(adminId) {
  let sql = `select * from admin where adminId=?`
  return await dbconfig.SySqlConnect(sql,[adminId])
}
let userById = async function(userId) {
    let sql = `select * from user where userId=?`
    return await dbconfig.SySqlConnect(sql,[userId])
}
//用户获取所有新闻
router.get('/newslist', async (req, res, next) => {
    //当前页码，默认1
    var page = Number(req.query.page) || 1;
    //每一页的数据量，默认是6
    var pageSize = Number(req.query.pageSize) || 8
    let allnewsData = await allnewslist()
    let  data  = await newslist(page,pageSize);
    
    await new Promise(async (resolve, reject) => {
      let promiseList = data.map((item) => {
        return new Promise(async (res, rej) => {
          if (item.userIdentity == 'admin' && item.newsState =="1") {
            let admininfo = await adminById(item.userId)
            item.userinfo = [{
              infoId:admininfo[0].adminId,
              infoName:admininfo[0].adminName,
              infoUrl:admininfo[0].adminUrl,
              infoTime:admininfo[0].adminTime
            }]
          } 
          if(item.userIdentity == 'user' && item.newsState =="1") {
            let userinfo = await userById(item.userId)
            item.userinfo = [{
              infoId:userinfo[0].userId,
              infoName:userinfo[0].userName,
              infoUrl:userinfo[0].userUrl,
              infoTime:userinfo[0].userTime
            }]
          }
          res()
        })
      })
      await Promise.all(promiseList)
      resolve()
    })
  
    if (data.length) {
      res.json({
        code: 200,
        newslist: data,
        total:allnewsData.length,
        page:page,
        pageSize:pageSize,
      })
    } else {
      res.json({
        code: 0,
        msg: "数据加载完毕",
        total:data.length
      })
    }
  
})



let dfsortnewslist = async function(newsType) {
  var sql = `select * from news where newsState='1' and newsType=? ORDER BY newsTime DESC`
  return await dbconfig.SySqlConnect(sql,[newsType])
}
let sortlist = async function(newsType,page,pageSize) {
  var sql = `select *  from news WHERE newsState='1' and newsType=? ORDER BY newsTime DESC limit ${(page -1)*pageSize},${pageSize}`
  return await dbconfig.SySqlConnect(sql,[newsType,page,pageSize])
   
}
//用户获取不同分类的新闻数据
router.get('/newssort', async (req, res, next) => {
  //当前页码，默认1
  var page = Number(req.query.page) || 1;
  //每一页的数据量，默认是6
  var pageSize = Number(req.query.pageSize) || 8
  var newsType = req.query.newsType
  let allnewsData = await dfsortnewslist(newsType)
  let  data  = await sortlist(newsType,page,pageSize);
  
  await new Promise(async (resolve, reject) => {
    let promiseList = data.map((item) => {
      return new Promise(async (res, rej) => {
        if (item.userIdentity == 'admin') {
          let admininfo = await adminById(item.userId)
          item.userinfo = [{
            infoId:admininfo[0].adminId,
            infoName:admininfo[0].adminName,
            infoUrl:admininfo[0].adminUrl,
            infoTime:admininfo[0].adminTime
          }]
        } else {
          let userinfo = await userById(item.userId)
          item.userinfo = [{
            infoId:userinfo[0].userId,
            infoName:userinfo[0].userName,
            infoUrl:userinfo[0].userUrl,
            infoTime:userinfo[0].userTime
          }]
        }
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  if (data.length) {
    res.json({
      code: 200,
      newslist: data,
      total:allnewsData.length,
      page:page,
      pageSize:pageSize,
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:data.length
    })
  }

})

// 根据评论对象和评论类型查找
let getCommdetail = async function(newsId) {
  let sql = `select * from comment where entityId=? and entityType = 0`
  return await dbconfig.SySqlConnect(sql,[newsId])
}
let getUserComm = async function(Id) {
  let sql = `select * from comment where entityId=? and entityType != 0`
  return await dbconfig.SySqlConnect(sql,[Id])
}

let getUserName = async function(targetId) {
  let sql = `select userName from user where userId = ?`
  return (await dbconfig.SySqlConnect(sql,[targetId]))[0].userName
}

//1.获取评论
router.get('/getComm', async(req, res) => {
  //1.获取新闻id
  let newsId = req.query.newsId
  //对某新闻的评论
  let commData = await getCommdetail(newsId)
  if(commData) {
    for(let i = 0; i < commData.length; i++) {
      //获取评论用户的信息
      commData[i].userinfo = await userById(commData[i].userId)
      //获取评论的内容
      commData[i].reply = await getUserComm(commData[i].id)
      if(commData[i].reply.length != 0) {
        //对评论内容的回复，循环获取
        for (let index = 0; index < commData[i].reply.length; index++) {
          commData[i].reply[index].userinfo = await userById(commData[i].reply[index].userId)
          if(commData[i].reply[index] && commData[i].reply[index].targetId !=0) {      
            const targetName = await getUserName(commData[i].reply[index].targetId)
            commData[i].reply[index].userinfo[0].targetName = targetName
          }
        }
      }
    }
  }
  if (commData.length) {
    res.json({
      code: 200,
      commData: commData,
      total:commData.length
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:commData.length
    })
  }
})


//用户提交评论
router.post('/submitComm',async (req, res) => {
  let userId = req.query.userId
  let entityType = req.query.entityType
  let entityId = req.query.entityId
  let targetId = req.query.targetId
  let commContent = req.query.commContent
  let commTime = req.query.commTime
  var sql = `insert into comment(userId,entityType,entityId,targetId,commContent,commTime) values(?,?,?,?,?,?)`
  var sqlArr = [userId,entityType,entityId,targetId,commContent,commTime]
  let result = await dbconfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows ==1) {
    res.json({
      code:200,
      msg:'提交成功'
    })
  } else {
    res.json({
      code:400,
      msg:'提交失败'
    })
  }
})






//用户获取所有广告
router.get('/getAdvert',async (req, res) => {
  let sql = `select * from advert ORDER BY advertTime DESC limit 0,8`
  dbconfig.sqlConnect(sql,[],(err,data) => {
    if(err) {
      return err
    } else {
      res.json({
        code:200,
        data:data
      })
    }
  })
})

//用户提交留言
router.post('/upLeaveWord', async(req, res) => {
  let sql = `insert into leaveword(leavewordContent,leavewordEmail,leavewordPhone,leavewordTime) values(?,?,?,?)`
  let leavewordContent = req.query.leavewordContent
  let leavewordEmail = req.query.leavewordEmail
  let leavewordPhone = req.query.leavewordPhone
  let leavewordTime = req.query.leavewordTime
  let sqlArr = [leavewordContent,leavewordEmail,leavewordPhone,leavewordTime]
  let result = await dbconfig.SySqlConnect(sql,sqlArr)
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'上传成功'
    })
  } else {
    res.json({
      code:400,
      msg:'上传失败'
    })
  }
})

//新闻浏览次数+1
router.post('/newsWacthAdd', async (req, res) => {
  //1.获取当前新闻id
  let newsId = req.query.newsId
  let sql = `update news set newsWatch=newsWatch+1 where newsId=?`
  let result = await dbconfig.SySqlConnect(sql, [newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'当前新闻浏览次数加1'
    })
  }
})



// //获取新闻评论，根据newsId获取
//获取评论,/需要获取评论id,新闻标题，评论内容，评论人，评论时间
let commlist =async function(newsId) {
  //在评论表里查询
  var sql = `select * from comment where entityId=? and entityType='0'`
  return await dbconfig.SySqlConnect(sql, [newsId])
}

//获取新闻评论条数
router.get('/getPinglunNum', async (req, res) => {
  //1.获取当前新闻id
  //已知newsId,获取对应评论的用户信息和评论信息
  let newsId = req.query.newsId
  let data = await commlist(newsId)
  
  res.json({
    code:200,
    count:data.length
  })
  
})


//判断用户是否已经收藏过了
router.get('/collIshow', async (req, res) => {
  let userId =req.query.userId
  let newsId = req.query.newsId
  var sql = `select * from collection where userId=? and newsId=?`
  let data =await dbconfig.SySqlConnect(sql,[userId,newsId])
  if(data.length) {
    //已经收藏了
    res.json({
      code:2, //收藏了
      collIshow:true,
    })
  } else {
    res.json({
      code:4,
      collIshow:false,
    })
  }
})

//判断用户是否已经点赞过了
router.get('/likeIshow', async (req, res) => {
  let userId =req.query.userId
  let newsId = req.query.newsId
  var sql = `select * from userlike where userId=? and newsId=?`
  let data =await dbconfig.SySqlConnect(sql,[userId,newsId])
  if(data.length) {
    //已经点赞了
    res.json({
      code:2, //点赞了
      likeIshow:true
    })
  } else {
    res.json({
      code:4,
      likeIshow:false
    })
  }
})

//用户收藏新闻，用户的userId,newsId
router.post('/usercoll', async (req, res)=> {
  let userId =req.query.userId
  let newsId = req.query.newsId
  
  let  sql = `insert into collection(userId,newsId) values (?,?)`
  let result = await dbconfig.SySqlConnect(sql, [userId,newsId])
    
  if(result.affectedRows == 1) {
    res.json({
      code:200,
    msg:'收藏成功'
      }) 
  }else {
    res.json({
      code:400,
      msg:'收藏失败'
    })
  }
  
  
})

//用户取消收藏新闻
router.post('/deleteColl', async (req, res) => {
  let userId = req.query.userId
  let newsId = req.query.newsId
  let sql = `delete from collection where userId=? and newsId=?`
  let result =await dbconfig.SySqlConnect(sql, [userId,newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'取消成功'
    }) 
  }else {
    res.json({
      code:400,
      msg:'取消失败'
    })
  }
})

//用户点赞新闻，用户的userId,newsId
router.post('/userlike', async (req, res)=> {
  let userId =req.query.userId
  let newsId = req.query.newsId
  let sql = `insert into userlike(userId,newsId) values (?,?)`
  let result = await dbconfig.SySqlConnect(sql, [userId,newsId])
  
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'点赞成功'
    }) 
  }else {
    res.json({
      code:400,
      msg:'点赞失败'
    })
  }
})

//用户取消收藏新闻
router.post('/deletelike', async (req, res) => {
  let userId = req.query.userId
  let newsId = req.query.newsId
  let sql = `delete from userlike where userId=? and newsId=?`
  let result =await dbconfig.SySqlConnect(sql, [userId,newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'取消成功'
    }) 
  }else {
    res.json({
      code:400,
      msg:'取消失败'
    })
  }
})

//新闻收藏次数+1
router.post('/newsCollectionAdd', async (req, res) => {
  //1.获取当前新闻id
  let newsId = req.query.newsId
  let sql = `update news set newsCollection=newsCollection+1 where newsId=?`
  let result = await dbconfig.SySqlConnect(sql, [newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'当前新闻收藏次数加1'
    })
  }
})
//新闻收藏次数-1
router.post('/deletenewsCollection', async (req, res) => {
  //1.获取当前新闻id
  let newsId = req.query.newsId
  let sql = `update news set newsCollection=newsCollection-1 where newsId=? and newsCollection!=0`
  let result = await dbconfig.SySqlConnect(sql, [newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'当前新闻收藏次数减一'
    })
  }
})

//新闻点赞次数+1
router.post('/newsLikeNumAdd', async (req, res) => {
  //1.获取当前新闻id
  let newsId = req.query.newsId
  let sql = `update news set newsLikeNum=newsLikeNum+1 where newsId=?`
  let result = await dbconfig.SySqlConnect(sql, [newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'当前新闻点赞次数加1'
    })
  }
})
//新闻点赞次数-1
router.post('/deletenewsLikeNum', async (req, res) => {
  //1.获取当前新闻id
  let newsId = req.query.newsId
  let sql = `update news set newsLikeNum=newsLikeNum-1 where newsId=? and newsLikeNum!=0`
  let result = await dbconfig.SySqlConnect(sql, [newsId])
  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'当前新闻点赞次数减一'
    })
  }
})

//删除用户自己的新闻
router.post('/isdeletemynews', async (req,res) => {
  const userId = req.query.userId
  const newsId = req.query.newsId
  const sql = `DELETE from news WHERE userId=? and newsId=?`
  let result = await dbconfig.SySqlConnect(sql,[userId,newsId])

  if(result.affectedRows == 1) {
    res.json({
      code:200,
      msg:'删除成功'
    })
  } else{
    res.json({
      code:400,
      msg:'删除失败'
    })
  }
})
//用户编辑自己的新闻
router.post('/isedit', async (req, res) => {
  const userId = req.query.userId
  const newsId = req.query.newsId
})


//个人中心
//上传头像
router.post('/upuserUrl', async (req,res) =>{
  let userUrl = req.query.userUrl
  let userId = req.query.userId
  let userTime = req.query.userTime
  let sql = `update user set userUrl=?,userTime=? where userId=?`
  let sqlArr = [userUrl,userTime,userId]
  let result = await dbconfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows >=1) {
    return res.json({
      code:200,
      msg:'修改成功'
    })
  } else {
    return res.json({
      code:400,
      msg:'修改失败'
    })
  }
}) 


//修改密码
router.post('/upuserPass', async (req,res) => {
  let userPass = req.query.userPass
  let userId = req.query.userId
  let userTime = req.query.userTime
  let sql = `update user set userPass=?,userTime=? where userId=?`
  let sqlArr = [userPass,userTime,userId]
  let result = await dbconfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows >=1) {
    return res.json({
      code:200,
      msg:'修改成功'
    })
  } else {
    return res.json({
      code:400,
      msg:'修改失败'
    })
  }
})


//我的发布新闻
//用户获取自己发布的新闻
let mynewslist = function(userId) {
  const sql = `select * from news where userId=? and userIdentity='user'  ORDER BY newsTime DESC`
  return dbconfig.SySqlConnect(sql,[userId])
}
router.get('/mypublish', async (req, res, next) => {
  let userId = req.query.userId
  let mynewsData = await mynewslist(userId)

  await new Promise(async (resolve, reject) => {
    let promiseList = mynewsData.map((item) => {
      return new Promise(async (res, rej) => {
        if (item.userIdentity == 'admin') {
          let admininfo = await adminById(item.userId)
          item.userinfo = [{
            infoId:admininfo[0].adminId,
            infoName:admininfo[0].adminName,
            infoUrl:admininfo[0].adminUrl,
            infoTime:admininfo[0].adminTime
          }]
        } 
        if(item.userIdentity == 'user') {
          let userinfo = await userById(item.userId)
          item.userinfo = [{
            infoId:userinfo[0].userId,
            infoName:userinfo[0].userName,
            infoUrl:userinfo[0].userUrl,
            infoTime:userinfo[0].userTime
          }]
        }
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  if (mynewsData.length) {
    res.json({
      code: 200,
      newslist: mynewsData,
      total:mynewsData.length,
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:mynewsData.length
    })
  }
})

//我的收藏
let collectionlist =async function(userId) {
  //在评论表里查询
  var sql = `select * from collection where userId=?`
  return await dbconfig.SySqlConnect(sql, [userId])
}
//用户获取自己收藏的新闻
let mycollnewslist = async function(newsId) {
  const sql = `select * from news where newsId=? and newsState='1' ORDER BY newsTime DESC`
  return await dbconfig.SySqlConnect(sql,[newsId])
}
router.get('/mycoll', async (req, res, next) => {
  let userId = req.query.userId
  let collnewsIds = await collectionlist(userId)

  await new Promise(async (resolve, reject) => {
    let promiseList = collnewsIds.map((item) => {
      return new Promise(async (res, rej) => {
        let mynewsData = await mycollnewslist(item.newsId)
        item.newslist = mynewsData
        await new Promise(async (resolve, reject) => {
          let promiseList = mynewsData.map((item) => {
            return new Promise(async (res, rej) => {
              if (item.userIdentity == 'admin' && item.newsState =="1") {
                let admininfo = await adminById(item.userId)
                item.userinfo = [{
                  infoId:admininfo[0].adminId,
                  infoName:admininfo[0].adminName,
                  infoUrl:admininfo[0].adminUrl,
                  infoTime:admininfo[0].adminTime
                }]
              } 
              if(item.userIdentity == 'user' && item.newsState =="1") {
                let userinfo = await userById(item.userId)
                item.userinfo = [{
                  infoId:userinfo[0].userId,
                  infoName:userinfo[0].userName,
                  infoUrl:userinfo[0].userUrl,
                  infoTime:userinfo[0].userTime
                }]
              }
              res()
            })
          })
          await Promise.all(promiseList)
          resolve()
        })
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })


  if (collnewsIds.length) {
    res.json({
      code: 200,
      newslist: collnewsIds,
      total:collnewsIds.length,
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:collnewsIds.length
    })
  }
})


//用户获取自己点赞的新闻
let mylikenewslist = async function(newsId) {
  const sql = `select * from news where newsId=? and newsState='1' ORDER BY newsTime DESC`
  return await dbconfig.SySqlConnect(sql,[newsId])
}
let mylikelist =async function(userId) {
  //在评论表里查询
  var sql = `select * from userlike where userId=?`
  return await dbconfig.SySqlConnect(sql, [userId])
}
router.get('/mylike', async (req, res, next) => {
  let userId = req.query.userId
  let mylikenewsIds = await mylikelist(userId)
  await new Promise(async (resolve, reject) => {
    let promiseList = mylikenewsIds.map((item) => {
      return new Promise(async (res, rej) => {
        let mynewsData = await mylikenewslist(item.newsId)
        item.newslist = mynewsData
        await new Promise(async (resolve, reject) => {
          let promiseList = mynewsData.map((item) => {
            return new Promise(async (res, rej) => {
              if (item.userIdentity == 'admin' && item.newsState =="1") {
                let admininfo = await adminById(item.userId)
                item.userinfo = [{
                  infoId:admininfo[0].adminId,
                  infoName:admininfo[0].adminName,
                  infoUrl:admininfo[0].adminUrl,
                  infoTime:admininfo[0].adminTime
                }]
              } 
              if(item.userIdentity == 'user' && item.newsState =="1") {
                let userinfo = await userById(item.userId)
                item.userinfo = [{
                  infoId:userinfo[0].userId,
                  infoName:userinfo[0].userName,
                  infoUrl:userinfo[0].userUrl,
                  infoTime:userinfo[0].userTime
                }]
              }
              res()
            })
          })
          await Promise.all(promiseList)
          resolve()
        })
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  if (mylikenewsIds.length) {
    res.json({
      code: 200,
      newslist: mylikenewsIds,
      total:mylikenewsIds.length,
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:mylikenewsIds.length
    })
  }
})

let allsearchnewslist = async function(keyword) {
  var sql = `select * from news where (keyword like '%${keyword}%' or newsTitle like '%${keyword}%' or newsContent like '%${keyword}%')  and newsState='1' ORDER BY newsTime DESC`
  return await dbconfig.SySqlConnect(sql,[keyword,keyword,keyword])
}
let searchlist = async function(keyword,page,pageSize) {
  let sql = `select * from news where (keyword like '%${keyword}%' or newsTitle like '%${keyword}%' or newsContent like '%${keyword}%') and newsState='1' ORDER BY newsTime DESC limit ${(page -1)*pageSize},${pageSize}`
  return dbconfig.SySqlConnect(sql,[keyword,keyword,keyword,page,pageSize])
}
//搜索内核
router.get('/search', async (req, res, next) => {
  //当前页码，默认1
  let page = Number(req.query.page) || 1;
  //每一页的数据量，默认是6
  let pageSize = Number(req.query.pageSize) || 8

  let keyword = req.query.keyword

  let allsearch = await allsearchnewslist(keyword)
  
  let searchData = await searchlist(keyword,page,pageSize)

  await new Promise(async (resolve, reject) => {
    let promiseList = searchData.map((item) => {
      return new Promise(async (res, rej) => {
        if (item.userIdentity == 'admin' && item.newsState =="1") {
          let admininfo = await adminById(item.userId)
          if(admininfo) {
            item.userinfo = [{
              infoId:admininfo[0].adminId,
              infoName:admininfo[0].adminName,
              infoUrl:admininfo[0].adminUrl,
              infoTime:admininfo[0].adminTime
            }]
          }
        } 
        if(item.userIdentity == 'user' && item.newsState =="1") {
          let userinfo = await userById(item.userId)
          if(userinfo) {
            item.userinfo = [{
              infoId:userinfo[0].userId,
              infoName:userinfo[0].userName,
              infoUrl:userinfo[0].userUrl,
              infoTime:userinfo[0].userTime
            }]
          }
        }
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  if (searchData.length) {
    res.json({
      code: 200,
      newslist: searchData,
      total:allsearch.length,
      page:page,
      pageSize:pageSize,
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:allsearch.length
    })
  }

})



module.exports = router;
