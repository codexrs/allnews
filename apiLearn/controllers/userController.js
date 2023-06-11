var dbConfig = require('../util/dbconfig')

//根据adminId 获取对应数据
getUserById = (req, res) => {
  let userId = req.query.userId
  let sql = `select * from user where userId=?`
  dbConfig.sqlConnect(sql,[userId], (err, data) => {
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

//获取user用户表数据
getAllUserList = (req, res) => {
    //当前页码，默认1
    var page = Number(req.query.page) || 1;
    //每一页的数据量，默认是6
    var pageSize = Number(req.query.pageSize) || 10
    // 分页需要两次请求，第一次不带分页条件，查到总数据条数；第二次带分页条件，查到分页数据
    var sql = `SELECT * from user`;
    dbConfig.sqlConnect(sql,[],(err, data) => {
      if(err) {
        throw err
      } else {
        sql = `select * from user limit ${(page -1)*pageSize},${pageSize}`
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

//删除单个user列表
delectSingleUserList = async (req, res) => {
  //post请求，数据应该是params中获取
  let userId = req.query.userId
  let sql = `DELETE from user WHERE userId=${userId}`
  let sqlArr = [userId]
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

//添加用户

let getUserName = async (req, res) => {
  var sql = 'select userName from user'
  let data = await dbConfig.SySqlConnect(sql,[])
  let arr = []
  data.forEach(item => {
    arr.push(item.userName)
  })
  return arr
}
//添加用户数据
addUserList = async (req, res) => {
    //如果分类swiperIndex已经存在了，返回已经存在
  //如果输入的swiperIndex存在了
  var {userName,userPass,userSex,userUrl,userTime} = req.query

  let arr = await getUserName();

  if(arr.includes(userName)) {
      //如果存在
      res.json({
        code:304,
        msg:'用户名已经存在，请重新上传'
      })
  } else {
      var sql = 'insert into user(userName,userPass,userSex,userUrl,userTime) values(?,?,?,?,?)';
      var sqlArr = [userName,userPass,userSex,userUrl,userTime]
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
//批量删除用户

//批量删除
delectSomeUserList = async (req, res) => {
  let userIds = req.query.userIds
  //console.log(userIds)
  const sql = `delete from user where userId in (${userIds});`
  const sqlArr = [userIds]
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

//头像图片上传
userImgUpload = async (req, res, next) => {
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
//多条件查询 userId, userName,userSex

//多条件搜索查询新闻列表
getMoreUserListSerch = (req, res) => {
  var params =  req.query;
  var sql = 'SELECT * FROM user';   //查询列表所有的数据
  var content = [];
  console.log(params);
  //console.log(params.newsId);
  if(params.userId) {
    sql += ' WHERE userId LIKE ?';
    content.push("%"+params.userId+"%")
    if(params.userName) {  
      sql +=' and userName like ?';
      content.push("%"+params.userName+"%")
    }
    if(params.userSex && params.userSex !='allSex') {
      sql +=' and userSex like ?';
      content.push("%"+params.userSex+"%")
    } 

  } else {
    //没有输入newsId
    if(params.userName) {  
      sql +=' WHERE userName like ?';
      content.push("%"+params.userName+"%")
    } else {
      if(params.userSex && params.userSex !='allSex') {
        sql +=' WHERE userSex like ?';
        content.push("%"+params.userSex+"%")
      } 
    }
    if(params.userSex && params.userSex !='allSex') {
      sql +=' and userSex like ?';
      content.push("%"+params.userSex+"%")
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




//编辑更新user数据
let getuserData = async function(userId) {
  let sql = `select * from user where userId=?`
  return await dbConfig.SySqlConnect(sql, [userId])
}
updateUserList =async (req, res) => {

  var {userName,userPass,userSex,userUrl,userTime,userId,preName} = req.query
  userId = Number(userId)
  //获取原始的用户数据
  var userData = await getuserData(userId)
  
  //修改用户名
  if(userName != userData[0].userName) {
    //用户名修改了
    //判断修改后的typeId是否已经存在
    let arr = await getUserName()
    //console.log(arr,preName,userName);
    if(arr.includes(userName)) {
      //存在
      res.json({
        code:304,
        msg:'用户名已经存在，请重新修改'
      })
    }else {
        let sql = `update user set userName=?,userTime=? where userId=?`
        let sqlArr = [userName,userTime,userId]
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
  }
  //修改密码
  else if(userPass != userData[0].userPass) {
    let sql = `update user set userPass=?,userTime=? where userId=?`
    let sqlArr = [userPass,userTime,userId]
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
  //修改性别
  else if(userSex != userData[0].userSex) {
    let sql = `update user set userSex=?,userTime=? where userId=?`
    let sqlArr = [userSex,userTime,userId]
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
  //修改头像
  else if(userUrl != userData[0].userUrl) {
    console.log(4);
    let sql = `update user set userUrl=?,userTime=? where userId=?`
    let sqlArr = [userUrl,userTime,userId]
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
 


 else {
  return res.json({
    code:304,
    msg:'未有修改，请重新修改'
  })
 }


}
//编辑用户状态
/*
  修改新闻审核状态 newsTatus
*/
updateUserState = async (req, res) => {
  var userState = req.query.userState
  var userId = req.query.userId
  
  var sql = 'update user set userState=? where userId=?'

  //console.log(userState,userId);
  var sqlArr = [userState,userId]
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

module.exports = {
    getUserById,
    //获取用户数据
    getAllUserList,
    //删除单个用户
    delectSingleUserList,
    //添加用户
    addUserList,
    //头像删除
    userImgUpload,
    //批量删除
    delectSomeUserList,
    //多条件查询
    getMoreUserListSerch,
    //更新user
    updateUserList,
    //修改用户审核状态
    updateUserState
}