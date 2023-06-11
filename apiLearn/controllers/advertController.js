var dbConfig = require('../util/dbconfig')

getAllAdvertList = (req, res) => {
    //当前页码，默认1
    var page = Number(req.query.page) || 1;
    //每一页的数据量，默认是6
    var pageSize = Number(req.query.pageSize) || 5
    // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
    var sql = `SELECT * from advert`;
    dbConfig.sqlConnect(sql,[],(err, data) => {
      if(err) {
        throw err
      } else {
        sql = `select * from advert  ORDER BY advertTime DESC  limit ${(page -1)*pageSize},${pageSize}`
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
delectSingleAdvertList = async (req, res) => {
    //post请求，数据应该是params中获取
    let advertId = req.query.advertId
    let sql = `DELETE from advert WHERE advertId=${advertId}`
    let sqlArr = [advertId]
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
let getAdvertName = async (req, res) => {
    var sql = 'select advertName from advert'
    let data = await dbConfig.SySqlConnect(sql,[])
    let arr = []
    data.forEach(item => {
      arr.push(item.advertName)
    })
    return arr
}
//添加admin数据
addAdvertList = async (req, res) => {
      //如果分类swiperIndex已经存在了，返回已经存在
    //如果输入的swiperIndex存在了
    var {advertName,advertUrl,advertTime,advertImgUrl} = req.query
    let arr = await getAdvertName()
    //console.log((arr));
    if(arr.includes(advertName)) {
        //如果存在
        res.json({
          code:304,
          msg:'用户名已经存在，请重新上传'
        })
    } else {
        var sql = 'insert into advert(advertName,advertUrl,advertTime,advertImgUrl) values(?,?,?,?)';
        var sqlArr = [advertName,advertUrl,advertTime,advertImgUrl]
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
advertImgUpload = async (req, res, next) => {
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

//编辑
updateAdvertList =async (req, res) => {
  var {advertName,advertUrl,advertImgUrl,advertTime,advertId,preName} = req.query

  //判断修改后的typeId是否已经存在
  let arr = await getAdvertName()
  let arrName = arr.filter(item => {
    return item !=preName
  })
  //console.log(arrName);
  if(arrName.includes(advertName) ) {
    
    //存在
    res.json({
      code:304,
      msg:'广告名已经存在，请重新修改'
    })
  } 
  else {
    let sql = 'update advert set advertName=?,advertUrl=?,advertImgUrl=?,advertTime=? where advertId=?'
    let sqlArr = [advertName,advertUrl,advertImgUrl,advertTime,advertId]
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


//2.根据搜索 
getAdvertListByName = (req, res) => {
  var advertName = req.query.advertName
  let sql = `select * from advert where advertName like '%${advertName}%'`
  let sqlArr = [advertName]
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
//批量删除
delectSomeAdvertList = async (req, res) => {
  let advertIds = req.query.advertIds
  //console.log(userIds)
  const sql = `delete from advert where advertId in (${advertIds});`
  const sqlArr = [advertIds]
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

module.exports = {
    //获取advert表数据
    getAllAdvertList,
    //删除单个advert
    delectSingleAdvertList,
    //添加davert
    addAdvertList,
    //广告图
    advertImgUpload,
    //编辑admin
    updateAdvertList,
    //多条件搜索
    getAdvertListByName,
    //批量删除
    delectSomeAdvertList
}