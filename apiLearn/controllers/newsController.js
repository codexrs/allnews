var dbConfig = require('../util/dbconfig')

/*
  新闻列表：获取分页(page,pageSize,total,newlist)
*/

let getUserNameById =async function(tableName,userName,IdName,Id) {
  let sql = `select ${userName} as userName from ${tableName} where ${IdName}=?`
  return await dbConfig.SySqlConnect(sql,[Id])
}

let allnews = async function(page,pageSize) {
  var sql = `select * from news ORDER BY newsTime DESC limit ${(page -1)*pageSize},${pageSize}`
  return await dbConfig.SySqlConnect(sql,[])
}
let newsLength = async function() {
  let sql = `select * from news`
  return await dbConfig.SySqlConnect(sql,[])
}
getAllNewsList =async (req, res) => {
  //当前页码，默认1
  var page = Number(req.query.page) || 1;
  //每一页的数据量，默认是6
  var pageSize = Number(req.query.pageSize) || 10
  // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
  //page页码，pageSize每页数量多少。
  let allnewslist = await allnews(page,pageSize)
  let data = await newsLength()
  await new Promise(async (resolve, reject) => {
    let promiseList = allnewslist.map((item) => {
      return new Promise(async (res, rej) => {
        //普通用户发布的新闻
        if(item.userIdentity == 'user') {
          let userName = await getUserNameById('user','userName','userId',item.userId)
          item.userName = userName
        } 
        //管理员发布的新闻
        if(item.userIdentity == 'admin') {
          let adminName = await getUserNameById('admin','adminName','adminId',item.userId)
          item.userName = adminName
        } 
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  if (allnewslist.length) {
    res.json({
      code:200,
      page:page,
      pageSize:pageSize,
      total:data.length,
      newslist:allnewslist,
          
      //totalPages当前页码没有数据0，有数据1
      totalPages:Math.ceil(allnewslist.length/pageSize)
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:data.length
    })
  }
}


/**
 *搜索功能
 */
//1.根据newsId获取新闻列表,
getNewsListByNewsId = (req, res) => {
  //先获取newsId最大最小值
  var sql = `select Max(newsId) as MaxnewsId, Min(newsId) as MinnewsId from news`
  dbConfig.sqlConnect(sql, [], (err, result) => {
    if(err) {
      res.send(err)
    } else {
      //如果输入的newsId在最大和最小之间符合
      //console.log(result[0].MinnewsId);
      var newsId = req.query.newsId
      if(result[0].MinnewsId <= newsId && newsId <=result[0].MaxnewsId) {
        sql = `select *, count(*) as count from news where newsId=?`
        var sqlArr = [newsId]
        dbConfig.sqlConnect(sql, sqlArr,(err, data) => {
          if(err) {
            res.send('错误：' + err.message)
          }
          res.json({
            code:200,
            newsId:newsId,
            newslist:data,

          })
        })
      } else {
        //否则输入的newsId不存在
        res.json({
          newslist:'输入的新闻编号不存在'
        })
      }
      
    }

  })
  
}
//2.根据搜索 新闻标题，模糊查询新闻列表
getNewsListByTitle = (req, res) => {
  var newsTitle = req.query.newsTitle
  let sql = `select * from news where newsTitle like '%${newsTitle}%'`
  let sqlArr = [newsTitle]
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
//3.根据新闻分类，查询新闻列表
getNewsListByType = (req, res) => {
  let newsType = req.query.newsType
  if(newsType == "allnewsList") {
    //如果是查询全部新闻列表
    let sql = `select * from news`
    dbConfig.sqlConnect(sql, [], (err, data) => {
      if(err) {
        throw err
      } else {
        res.json({
          code:200,
          newslist:data
        })
      }
    })
  } else {
    let sql = `select * from news where newsType like '%${newsType}%'`;
    let sqlArr = [newsType]
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
  
}



//多条件搜索查询新闻列表
let NewsListSerch = async function(params) {
  var content = [];
  var sql = 'SELECT * FROM news';   //查询列表所有的数据
  //console.log(params.newsId);
  if(params.newsId) {
    sql += ' WHERE newsId LIKE ?';
    content.push("%"+params.newsId+"%")
    if(params.newsTitle) {  
      sql +=' and newsTitle like ?';
      content.push("%"+params.newsTitle+"%")
    }
    if(params.newsType && params.newsType !='allnewsList') {
      sql +=' and newsType like ?';
      content.push("%"+params.newsType+"%")
    } 

  } else {
    //没有输入newsId
    if(params.newsTitle) {  
      sql +=' WHERE newsTitle like ?';
      content.push("%"+params.newsTitle+"%")
    } else {
      if(params.newsType && params.newsType !='allnewsList') {
        sql +=' WHERE newsType like ?';
        content.push("%"+params.newsType+"%")
      } 
    }
    if(params.newsType && params.newsType !='allnewsList') {
      sql +=' and newsType like ?';
      content.push("%"+params.newsType+"%")
    } 
  }
  
  
  return await dbConfig.SySqlConnect(sql, content)
}


getMoreNewsListSerch =async (req, res) => {
  var params =  req.query;
  let morenewslist = await NewsListSerch(params)
  //console.log(morenewslist);
  await new Promise(async (resolve, reject) => {
    let promiseList = morenewslist.map((item) => {
      return new Promise(async (res, rej) => {
        if(item.userIdentity == 'user') {
          let userName = await getUserNameById('user','userName','userId',item.userId)
          item.userName = userName
        } 
        if(item.userIdentity == 'admin') {
          let adminName = await getUserNameById('admin','adminName','adminId',item.userId)
          item.userName = adminName
        } 
        
        res()
      })
    })
    await Promise.all(promiseList)
    resolve()
  })

  if (morenewslist.length) {
    res.json({
      code:200,
      total:morenewslist.length,
      newslist:morenewslist,
    
    })
  } else {
    res.json({
      code: 0,
      msg: "数据加载完毕",
      total:morenewslist.length
    })
  }

}

// getMoreNewsListSerch = (req, res) => {
//   var params =  req.query;
//   var sql = 'SELECT * FROM news';   //查询列表所有的数据
//   var content = [];
//   console.log(params);
//   //console.log(params.newsId);
//   if(params.newsId) {
//     sql += ' WHERE newsId LIKE ?';
//     content.push("%"+params.newsId+"%")
//     if(params.newsTitle) {  
//       sql +=' and newsTitle like ?';
//       content.push("%"+params.newsTitle+"%")
//     }
//     if(params.newsType && params.newsType !='allnewsList') {
//       sql +=' and newsType like ?';
//       content.push("%"+params.newsType+"%")
//     } 

//   } else {
//     //没有输入newsId
//     if(params.newsTitle) {  
//       sql +=' WHERE newsTitle like ?';
//       content.push("%"+params.newsTitle+"%")
//     } else {
//       if(params.newsType && params.newsType !='allnewsList') {
//         sql +=' WHERE newsType like ?';
//         content.push("%"+params.newsType+"%")
//       } 
//     }
//     if(params.newsType && params.newsType !='allnewsList') {
//       sql +=' and newsType like ?';
//       content.push("%"+params.newsType+"%")
//     } 
//   }
  
  
//   dbConfig.sqlConnect(sql, content, (err, data) => {
//     if(err) {
//       return err.message
//     } else {
//       res.json({
//         code:200,
//         newslist:data
//       })
//     }
//   })



// }


/*
  type表，获取新闻类别

*/
getNewsType = (req, res) => {
  var sql = `select * from type`
  dbConfig.sqlConnect(sql, [], (err, data) => {
    if(err) {
      throw err
    } else {
      res.json({
        code:200,
        typelist:data
      })
    }
  })

}

/**
 * 删除一行新闻
 */
delectNewsList = async (req, res) => {
  //post请求，数据应该是params中获取
  let newsId = req.query.newsId
  let sql = `DELETE from news WHERE newsId=${newsId}`
  let sqlArr = [newsId]
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


//新闻图片上传
newsImgUpload = async (req, res, next) => {
  let url = "";
  //console.log(req.file.path)
  //静态资源public,所以去掉/public可以直接访问public目录下得全部资源
  let filePath = req.file.path.replace(/^public/,"")
  url = req.file ? `${req.protocol}://${req.headers.host}/${filePath}`.replace(/\\/ig, '/') : '22';
  //console.log(url);
  res.json({
      code: 200,
      data: { url: url },
      url: url,
      msg: "success"
  })
}

//提交添加一条新闻
addNewsList = async (req, res) => {
  // 获取参数
  let userId = req.query.newslist.userId || ""
  let userIdentity =  req.query.newslist.userIdentity || ""
  let newsTitle = req.query.newslist.newsTitle || "";
  let newsType = req.query.newslist.newsType || '';
  let newsTime = req.query.newslist.newsTime || '';
  let newsImg = req.query.newslist.newsImg || ('['+']');
  let keyword = req.query.newslist.keyword || '';
  let newsContent = req.query.newslist.newsContent || '';
  let newsLikeNum = req.query.newslist.newsLikeNum || 0
  let newsWatch = req.query.newslist.newsWatch || 0
  let newsCollection = req.query.newslist.newsCollection || 0
  const sql = "insert into news(userId,userIdentity,newsTitle,newsType,newsTime,newsLikeNum,newsWatch,newsCollection,newsImg,keyword,newsContent) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
  const sqlArr = [userId,userIdentity,newsTitle,newsType,newsTime,newsLikeNum,newsWatch,newsCollection,newsImg,keyword,newsContent]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows == 1) {
    //修改成功
    res.send({
      'code':200,
      'msg':'上传成功'
    })
  } else {
    res.send({
      'code':400,
      'msg':'上传失败'
    })
  } 
}

/**
 * 修改新闻
 * 根据newsId
 */
updateNewsList = async (req, res) => {
    // 获取参数
    let userId = req.query.newslist.userId || ""
    let newsState = req.query.newslist.newsState || '1'
    let newsId = req.query.newslist.newsId;
    let newsTitle = req.query.newslist.newsTitle || "";
    let newsType = req.query.newslist.newsType || '';
    let newsTime = req.query.newslist.newsTime || '';
    let newsImg = req.query.newslist.newsImg || ('['+']');
    let keyword = req.query.newslist.keyword || '';
    let newsContent = req.query.newslist.newsContent || '';
    let newsLikeNum = req.query.newslist.newsLikeNum || 0
    let newsWatch = req.query.newslist.newsWatch || 0
    let newsCollection = req.query.newslist.newsCollection || 0
    let sql = "update news set newsState=?,userId=?,newsTitle=?,newsType=?,newsTime=?,newsImg=?,keyword=?,newsContent=?,newsLikeNum=?,newsWatch=?,newsCollection=? where newsId=?";
    let sqlArr = [newsState,userId,newsTitle,newsType,newsTime,newsImg,keyword,newsContent,newsLikeNum,newsWatch,newsCollection,newsId]
    let result = await dbConfig.SySqlConnect(sql, sqlArr)
    if(result.affectedRows == 1) {
      //修改成功
      res.send({
        'code':200,
        'msg':'修改成功'
      })
    } else {
      res.send({
        'code':400,
        'msg':'修改失败'
      })
    } 
}

/**
 * 新闻批量删除
 * delete from news where newsId in (1,2,3)
 */
delectSomeNewsList = async (req, res) => {
   let newsIds = req.query.newsIds
   const sql = `delete from news where newsId in (${newsIds})`
   const sqlArr = [newsIds]
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

//富文本上传的地址 wangeditor 上传文件获取
batchUpload = (req, res, next) => {
  var file = req.file
  console.log(file);
  console.log('文件类型，%s', file.mimetype);
  console.log('原始文件名', file.originalname);
  console.log('文件大小', file.size);
  console.log('文件保存路径', file.path);
  let filePath = req.file.path.replace(/^public/,"")
  url = req.file ? `${req.protocol}://${req.headers.host}/${filePath}`.replace(/\\/ig, '/') : '22';
  res.json({
    res_code:'0',
    name:file.originalname,
    href:filePath,
    url:url,
    alt:file.name
  })
}

/*
  修改新闻审核状态 newsTatus
*/
updateNewsState = async (req, res) => {
  var newsState = req.query.newsState
  var newsId = req.query.newsId
  
  var sql = 'update news set newsState=? where newsId=?'

  console.log(newsState,newsId);
  var sqlArr = [newsState,newsId]
  let result =await dbConfig.SySqlConnect(sql, sqlArr)
  if(result.affectedRows == 1) {
    //修改成功
    res.json({
      code:200,
      msg:'修改成功'
    })
  } else {
    res.json({
      code:400,
      msg:'修改失败'
    })
  }
}

//获取列表所有数据
getNewsData = (req, res) => {
  let sql = `select * from news`
  dbConfig.sqlConnect(sql,[],(err, data)=> {
    if(err) {
      return err;
    } else {
      res.json({
        code:200,
        newslist:data
      })
    }
  })
}

//获取今日新闻数量
getNowDayNews = (req, res) => {
  let sql = `SELECT * FROM news WHERE DATEDIFF(newsTime,NOW())=0`
  dbConfig.sqlConnect(sql,[],(err, data)=> {
    if(err) {
      return err;
    } else {
      res.json({
        code:200,
        newslist:data
      })
    }
  })
}

//获取近七天新闻的数量和日期
getSevenNewsCount = (req, res) => {
  let Time = req.query.Time;
  let Table = req.query.Table
  const sql = `select a.click_date,ifnull(b.count,0) as count
  from (
      SELECT curdate() as click_date
      union all
      SELECT date_sub(curdate(), interval 1 day) as click_date
      union all
      SELECT date_sub(curdate(), interval 2 day) as click_date
      union all
      SELECT date_sub(curdate(), interval 3 day) as click_date
      union all
      SELECT date_sub(curdate(), interval 4 day) as click_date
      union all
      SELECT date_sub(curdate(), interval 5 day) as click_date
      union all
      SELECT date_sub(curdate(), interval 6 day) as click_date
  ) a left join (
    select date(${Time}) as datetime, count(*) as count
    from ${Table}
    group by date(${Time})
  ) b on a.click_date = b.datetime;
  `
  dbConfig.sqlConnect(sql,[Time,Table,Time],(err, data)=> {
    if(err) {
      return err;
    } else {
      res.json({
        code:200,
        data:data
      })
    }
  })
}

module.exports = {
  getAllNewsList,
  getNewsListByNewsId,
  getNewsListByTitle,
  getNewsListByType,
  //新闻类别
  getNewsType,
  //多条件查询
  getMoreNewsListSerch,

  //新闻图片上传
  newsImgUpload,
  //删除新闻
  delectNewsList,
  //添加新闻
  addNewsList,
  //修改新闻
  updateNewsList,
  //批量删除新闻
  delectSomeNewsList,

  //wangeditor上传文件/图片
  batchUpload,

  //修改新闻审核状态
  updateNewsState,

  //获取news
  getNewsData,
  
  //获取当日新闻
  getNowDayNews,

  //获取近七天的新闻数量
  getSevenNewsCount

}