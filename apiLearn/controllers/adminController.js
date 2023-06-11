var dbConfig = require('../util/dbconfig')

//根据adminId 获取对应数据
getAdminUserById = (req, res) => {
  let adminId = req.query.adminId
  let sql = `select * from admin where adminId=?`
  dbConfig.sqlConnect(sql,[adminId], (err, data) => {
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

getAllAdminList = (req, res) => {
    //当前页码，默认1
    var page = Number(req.query.page) || 1;
    //每一页的数据量，默认是6
    var pageSize = Number(req.query.pageSize) || 8
    // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
    var sql = `SELECT * from admin`;
    dbConfig.sqlConnect(sql,[],(err, data) => {
      if(err) {
        throw err
      } else {
        sql = `select * from admin limit ${(page -1)*pageSize},${pageSize}`
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

//删除单个admin列表
delectSingleAdminList = async (req, res) => {
    //post请求，数据应该是params中获取
    let adminId = req.query.adminId
    let sql = `DELETE from admin WHERE adminId=${adminId}`
    let sqlArr = [adminId]
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


//添加管理员
let getAdminName = async (req, res) => {
    var sql = 'select adminName from admin'
    let data = await dbConfig.SySqlConnect(sql,[])
    let arr = []
    data.forEach(item => {
      arr.push(item.adminName)
    })
    return arr
}
//添加admin数据
addAdminList = async (req, res) => {
      //如果分类swiperIndex已经存在了，返回已经存在
    //如果输入的swiperIndex存在了
    var {adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail} = req.query
    let arr = await getAdminName()
    //console.log((arr));
    if(arr.includes(adminName)) {
        //如果存在
        res.json({
          code:304,
          msg:'用户名已经存在，请重新上传'
        })
    } else {
        var sql = 'insert into admin(adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail) values(?,?,?,?,?,?)';
        var sqlArr = [adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail]
        var result = await dbConfig.SySqlConnect(sql, sqlArr)
        if(result.affectedRows == 1) {
          //插入成功
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
    
     }
}
//管理员头像上传
//头像图片上传
adminImgUpload = async (req, res, next) => {
  let url = "";
  console.log(req.file)
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

//编辑管理员
updateAdminList =async (req, res) => {
  var {adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail,adminId,preName} = req.query

  //判断修改后的typeId是否已经存在
  let arr = await getAdminName()
  let arrName = arr.filter(item => {
    return item !=preName
  })
  //console.log(arrName);
  if(arrName.includes(adminName) ) {
    
    //存在
    res.json({
      code:304,
      msg:'用户名已经存在，请重新修改'
    })
  } 
  else {
    let sql = 'update admin set adminName=?,adminPass=?,adminSex=?,adminUrl=?,adminTime=?,adminEmail=? where adminId=?'
    let sqlArr = [adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail,adminId]
    let result = await dbConfig.SySqlConnect(sql, sqlArr)
    if(result.affectedRows >=1) {
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
  
}

//多条件搜索admin
//多条件搜索查询新闻列表
getMoreAdminListSerch = (req, res) => {
  var params =  req.query;
  var sql = 'SELECT * FROM admin';   //查询列表所有的数据
  var content = [];
  console.log(params);
  //console.log(params.newsId);
  if(params.adminId) {
    sql += ' WHERE adminId LIKE ?';
    content.push("%"+params.adminId+"%")
    if(params.adminName) {  
      sql +=' and adminName like ?';
      content.push("%"+params.adminName+"%")
    }
    if(params.adminSex && params.adminSex !='allSex') {
      sql +=' and adminSex like ?';
      content.push("%"+params.adminSex+"%")
    } 

  } else {
    //没有输入newsId
    if(params.adminName) {  
      sql +=' WHERE adminName like ?';
      content.push("%"+params.adminName+"%")
    } else {
      if(params.adminSex && params.adminSex !='allSex') {
        sql +=' WHERE adminSex like ?';
        content.push("%"+params.adminSex+"%")
      } 
    }
    if(params.adminSex && params.adminSex !='allSex') {
      sql +=' and adminSex like ?';
      content.push("%"+params.adminSex+"%")
    } 
  }
  
  //console.log(sql)
  
  dbConfig.sqlConnect(sql, content, (err, data) => {
    if(err) {
      return err.message
    } else {
      res.json({
        code:200,
        newslist:data
      })
    }
  })
}

//批量删除
delectSomeAdminList = async (req, res) => {
  let adminIds = req.query.adminIds
  //console.log(userIds)
  const sql = `delete from admin where adminId in (${adminIds});`
  const sqlArr = [adminIds]
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

//上传头像
upadminUrl = async (req, res) => {
  let adminUrl = req.query.adminUrl
  let adminId = req.query.adminId
  let adminTime = req.query.adminTime
  let sql = `update admin set adminUrl=?,adminTime=? where adminId=?`
  let sqlArr = [adminUrl,adminTime,adminId]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
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
}
//修改密码
upadminPass = async(req, res) => {
  let adminPass = req.query.adminPass
  let adminId = req.query.adminId
  let adminTime = req.query.adminTime
  let sql = `update admin set adminPass=?,adminTime=? where adminId=?`
  let sqlArr = [adminPass,adminTime,adminId]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
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
}



module.exports = {
    getAdminUserById,
    //获取admin表数据
    getAllAdminList,
    //删除单个admin
    delectSingleAdminList,
    //添加管理员
    addAdminList,
    //头像
    adminImgUpload,
    //编辑admin
    updateAdminList,
    //多条件搜索
    getMoreAdminListSerch,
    //批量删除
    delectSomeAdminList,

    //修改管理员头像
    upadminUrl,
    //修改密码
    upadminPass

  
}