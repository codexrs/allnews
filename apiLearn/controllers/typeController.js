var dbConfig = require('../util/dbconfig')



/*
  type表，获取新闻类别

*/
getTypeData = (req, res) => {
  //当前页码，默认1
  var page = Number(req.query.page) || 1;
  //每一页的数据量，默认是6
  var pageSize = Number(req.query.pageSize) || 5
  // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
  var sql = `SELECT * from type`;
  dbConfig.sqlConnect(sql,[],(err, data) => {
    if(err) {
      throw err
    } else {
      sql = `select * from type limit ${(page -1)*pageSize},${pageSize}`
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
//2.根据搜索 新闻分类每次，模糊查询新闻分类列表
getTypeListByName = (req, res) => {
  var typeName = req.query.typeName
  let sql = `select * from type where typeName like '%${typeName}%'`
  let sqlArr = [typeName]
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

// let getTypeId = async (req, res) => {
//   var sql = 'select typeId from type'
//   let data = await dbConfig.SySqlConnect(sql,[])
//   let arr = []
//   data.forEach(item => {
//     arr.push(item.typeId)
//   })
//   return arr
// }
let getTypeName = async (req, res) => {
  var sql = 'select typeName from type'
  let data = await dbConfig.SySqlConnect(sql,[])
  let arr = []
  data.forEach(item => {
    arr.push(item.typeName)
  })
  return arr
}

//3.添加新闻分类 post typeId, typeName, typeDate
addTypeList = async (req, res) => {
  //如果分类typeId已经存在了，返回已经存在
  //如果输入的typeId存在了
  var {typeName,typeDate} = req.query
  //let arr = await getTypeId()
  let nameArr = await getTypeName()
  
  if(nameArr.includes(typeName)) {
      //如果存在
      res.json({
        code:304,
        msg:'新闻分类名称已经存在，请重新上传'
      })
  }
  else {
      var sql = 'insert into type(typeName,typeDate) values(?,?)';
      var sqlArr = [typeName,typeDate]
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

//查询新闻分类名
let getTypeNameById = async function(typeId){
  var sql = 'select typeName from type where typeId=?'
  return await dbConfig.SySqlConnect(sql,[typeId])
}
//删除一行分类 根据typeId,删除分类，news里面的分类新闻状态改为0，不可以显示
delectTypeList = async (req, res) => {

  //post请求，数据应该是params中获取
  let typeId = req.query.typeId

  //修改news新闻分类的状态
  let typeName = await getTypeNameById(typeId)
  let sql = `update news set newsState='0' where newsType=?`
  let result = await dbConfig.SySqlConnect(sql,[typeName[0].typeName])

  sql = `DELETE from type WHERE typeId=${typeId}`
  result = await dbConfig.SySqlConnect(sql, [typeId])
  
  
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


/**
 * 分类批量删除
 * delete from news where newsId in (1,2,3)
 */
delectSomeTypeList = async (req, res) => {
  let typeIds = req.query.typeIds
  console.log(typeIds)

  //修改news新闻分类的状态
  // let typeName = await getTypeNameById(typeId)
  // let sql = `update news set newsState='0' where newsType=?`
  // let result = await dbConfig.SySqlConnect(sql,[typeName[0].typeName])
  let sql = `update news set newsState='0' where newsType=?`
  for(let i = 0; i < typeIds.length; i++) {
    let typeName = await getTypeNameById(typeIds[i])
    if(typeName[0]) {
      await dbConfig.SySqlConnect(sql,[typeName[0].typeName])
    }
  }



  sql = `delete from type where typeId in (${typeIds});`
  const sqlArr = [typeIds]
  let result = await dbConfig.SySqlConnect(sql, sqlArr)
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

//编辑新闻分类
updateTypeList =async (req, res) => {
  let {typeId,typeName,typeDate} = req.query

  //判断修改后的typeName是否已经存在
  let nameArr = await getTypeName()
  //console.log(nameArr,typeName);
  if(nameArr.includes(typeName)) {
    //存在
    res.json({
      code:304,
      msg:'新闻分类名称已经存在，请重新修改'
    })
  } else {
    let sql = 'update type set typeName=?,typeDate=? where typeId=?'
    let sqlArr = [typeName,typeDate,typeId]
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

module.exports = {
  //获取分类列表数据
  getTypeData,
  //通过分类名称获取对应数据
  getTypeListByName,
  //添加新闻分类
  addTypeList,
  //删除新闻分类
  delectTypeList,
  //批量删除
  delectSomeTypeList,
  //修改新闻分类
  updateTypeList
}