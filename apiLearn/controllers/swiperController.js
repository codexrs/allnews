var dbConfig = require('../util/dbconfig')

/**
 * swiper轮播图表
 */

 getSwiperData = (req, res) => {
    //当前页码，默认1
    var page = Number(req.query.page) || 1;
    //每一页的数据量，默认是6
    var pageSize = Number(req.query.pageSize) || 3
    // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
    var sql = `SELECT * from swiper`;
    dbConfig.sqlConnect(sql,[],(err, data) => {
      if(err) {
        throw err
      } else {
        sql = `select * from swiper limit ${(page -1)*pageSize},${pageSize}`
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

//删除单个swiper列表
delectSingleSwiperList =async (req, res) => {
    //post请求，数据应该是params中获取
    let swiperIndex = req.query.swiperIndex
    
    let sql = `DELETE from swiper WHERE swiperIndex=${swiperIndex}`
    let sqlArr = [swiperIndex]
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

let getSwiperIndex = async (req, res) => {
  var sql = 'select swiperIndex from swiper'
  let data = await dbConfig.SySqlConnect(sql,[])
  let arr = []
  data.forEach(item => {
    arr.push(item.swiperIndex)
  })
  return arr
}

//添加swiper数据
addSwiperList = async (req, res) => {
    //如果分类swiperIndex已经存在了，返回已经存在
  //如果输入的swiperIndex存在了
  var {swiperIndex,swiperurl,swipertime} = req.query
  let arr = await getSwiperIndex()
  
  if(arr.includes(Number(swiperIndex))) {
      //如果存在
      res.json({
        code:304,
        msg:'新闻排序编号已经存在，请重新上传'
      })
  } else {
      var sql = 'insert into swiper(swiperIndex,swiperurl,swipertime) values(?,?,?)';
      var sqlArr = [swiperIndex,swiperurl,swipertime]
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
//编辑更新swiper数据
updateSwiperList =async (req, res) => {
  var {swiperIndex,swiperurl,swipertime,swiperId} = req.query

  //判断修改后的typeId是否已经存在
  let arr = await getSwiperIndex()
  console.log(arr);
  if(arr.includes(Number(swiperIndex))) {
    //存在
    res.json({
      code:304,
      msg:'新闻分类编号已经存在，请重新修改'
    })
  } else {
    let sql = 'update swiper set swiperIndex=?,swiperurl=?,swipertime=? where swiperId=?'
    let sqlArr = [swiperIndex,swiperurl,swipertime,swiperId]
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

//批量删除
delectSomeSwiperList = async (req, res) => {
  let swiperIndexs = req.query.swiperIndexs
  console.log(swiperIndexs)
  const sql = `delete from swiper where swiperIndex in (${swiperIndexs});`
  const sqlArr = [swiperIndexs]
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

//轮播图图片上传
swiperImgUpload =async (req, res, next) => {
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

module.exports = {
  //获取swiper数据  
  getSwiperData,
  //删除单个swiper数据
  delectSingleSwiperList,
  //添加swiper
  addSwiperList,
  //更新swiper
  updateSwiperList,
  //批量删除
  delectSomeSwiperList,
  //图片上传
  swiperImgUpload
}