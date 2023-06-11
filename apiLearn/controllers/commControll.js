const e = require('express');
var dbConfig = require('../util/dbconfig')



//获取评论,/需要获取评论id,新闻标题，评论内容，评论人，评论时间
getCommData = (req, res) => {
  var newsTitleArr = [];
  var userNameArr = [];
  var commDataArr = []
  //当前页码，默认1
  var page = Number(req.query.page) || 1;
 //每一页的数据量，默认是3
  var pageSize = Number(req.query.pageSize) || 3
  console.log(page,pageSize);
  var sql = 'select * from comment where entityType=0'
  dbConfig.sqlConnect(sql,[],async (err, data) => {
    sql = `select * from comment where entityType=0  ORDER BY commTime DESC limit ${(page -1)*pageSize},${pageSize}`

    var commData = await dbConfig.SySqlConnect(sql,[page,pageSize])
    for(let i = 0; i < commData.length; i++) {
      sql = `select newsTitle from news where newsId=${commData[i].entityId}`
      newsTitleArr.push(await dbConfig.SySqlConnect(sql,[]))

    }
    for(let i = 0; i < commData.length; i++) {
      sql = `select userName from user where userId=${commData[i].userId}`
      userNameArr.push(await dbConfig.SySqlConnect(sql,[]))
      
    }

    res.json({
      code:200,
      page:page,
      pageSize:pageSize,
      newsTitleArr:newsTitleArr,
      userNameArr:userNameArr,
      commDataArr:commData,
      total:data.length,
      //totalPages当前页码没有数据0，有数据1
      totalPages:Math.ceil(commDataArr.length/pageSize)
    })

  }) 
}




//删除单个评论

deleteSingleCommList =async (req, res) => {
  let id = req.query.id
  let sql = `delete from comment where id=?`
  let sqlArr = [id]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows == 1) {
    res.send({
      'code':200,
      'msg':'删除成功'
    })
  } else {
    res.send({
      'code':400,
      'msg':'删除失败'
    })
  }
  
}


//批量删除
delectSomeCommList = async (req, res) => {
  let commIds = req.query.commIds
  console.log(commIds)
  const sql = `delete from comment where id in (${commIds});`
  const sqlArr = [commIds]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
  console.log(result);
  if(result.affectedRows >= 1) {
     //修改成功
     res.send({
       'code':200,
       'msg':'删除成功'
     })
   } else {
     res.send({
       'code':400,
       'msg':'删除失败'
     })
   } 
}
//搜索
//搜索-
getCommBynewsTitle= async (req, res) => {
  var newsTitle = req.query.newsTitle
  //获取newsId
  var sql = `select * from news where newsTitle like '%${newsTitle}%'`
  var newsData = await dbConfig.SySqlConnect(sql,[newsTitle])

  
  let newsIds = []
  for(let i = 0; i < newsData.length; i++) {
    newsIds.push(newsData[i].newsId)
  }
  let newsIdsStr = newsIds.join(',')
  //根据newsIds获取评论内容
  sql = `select * from comment where entityId in (${newsIdsStr}) and entityType=0`
  var sqlArr = [newsIdsStr]
  let CommData = await dbConfig.SySqlConnect(sql, sqlArr)


  let userIds = []  //用户的评论

  for(let j = 0; j < CommData.length; j ++) {
    userIds.push(CommData[j].userId)
    
  }
  console.log(userIds);
  
  let userData = []
  if(userIds.length) {
    for(let i = 0; i < userIds.length; i++) {
      sql = `select * from user where userId=?`
      userData.push(await dbConfig.SySqlConnect(sql,[userIds[i]]))
    }
    
  }


  res.json({
    code:200,
    newsData,
    CommData,
    userData,

  })

}

module.exports = {
    getCommData,
    deleteSingleCommList,
    delectSomeCommList,
    getCommBynewsTitle
}