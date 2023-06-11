var dbConfig = require('../util/dbconfig')

getAllLeaveWordList = (req, res) => {
    //当前页码，默认1
    var page = Number(req.query.page) || 1;
    //每一页的数据量，默认是6
    var pageSize = Number(req.query.pageSize) || 3
    // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
    var sql = `SELECT * from leaveword`;
    dbConfig.sqlConnect(sql,[],(err, data) => {
      if(err) {
        throw err
      } else {
        sql = `select * from leaveword  ORDER BY leavewordTime DESC limit ${(page -1)*pageSize},${pageSize} `
        let sqlArr = [page, pageSize];
        dbConfig.sqlConnect(sql,sqlArr, (err, newslist) => {
          if(err) {
            return err
          } else {
            res.json({
              code:200,
              page:page,
              pageSize:pageSize,
              total:data.length,
              newslist:newslist,
              //totalPages当前页码没有数据0，有数据1
              totalPages:Math.ceil(newslist.length/pageSize)
            })
          }
  
        })
      }
    })
}

//删除单个
delectSingleLeaveWordList = async (req, res) => {
  //post请求，数据应该是params中获取
  let leavewordId = req.query.leavewordId
  
  let sql = `DELETE from leaveword WHERE leavewordId=${leavewordId}`
  let sqlArr = [leavewordId]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows == 1) {
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

//批量删除
delectSomeLeaveWordList = async (req, res) => {
  let leavewordIds = req.query.leavewordIds
  //console.log(userIds)
  const sql = `delete from leaveword where leavewordId in (${leavewordIds});`
  const sqlArr = [leavewordIds]
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
//搜索留言内容
getLeaveWordListByContent= (req, res) => {
  var leavewordContent = req.query.leavewordContent
  console.log(leavewordContent)
  let sql = `select * from leaveword where leavewordContent like '%${leavewordContent}%'`
  let sqlArr = [leavewordContent]
  dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
    if(err) {
      throw err
    } else {
      res.json({
        code:200,
        newslist:data
      })
    }
  })

}
  

module.exports = {
    //查询所有
    getAllLeaveWordList,
    //删除单个
    delectSingleLeaveWordList,
    //批量删除
    delectSomeLeaveWordList,
    //搜索留言内容
    getLeaveWordListByContent
}