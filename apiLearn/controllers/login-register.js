var dbConfig = require('../util/dbconfig')


// token 验证
var Ctoken = require('../util/token/token.js');

//验证码登录
//第1：用户填写账号和密码，进行登录，以及用户身份 
Login = async (req, res) => {
    //从请求参数获取账号和密码，用户身份
    let {username, userpassword,identity} = req.query;
    //如果身份是admin，管理员登录
    if(identity == 'admin') {
        //验证登录是否是第一次登录
        var sql = `select * from admin where adminName=?`
        var sqlArr = [username]
        var result = await dbConfig.SySqlConnect(sql, sqlArr)
        if(result.length) {
            //该管理员已经注册了，验证密码是否正确
            //console.log(result[0].adminPass);
            if(result[0].adminPass == userpassword) { //密码正确
                //生成token，根据username和userpassword
                Ctoken.setToken(username,userpassword).then((token) => {
                    //登录成功,返回该用户信息
                    res.json({
                        code:200,
                        msg:'登录成功',
                        data:result,
                        token:token
                    })
                    
                })
            } else {
                //密码不正确
                res.json({
                    code:400,
                    msg:'密码错误，请重新验证'
                })
                return ;
            }
            
        } else {
            //该管理员还没注册
            res.json({
                code:4,
                msg:'抱歉，您不是我们的管理员'
            })
            return ;
        }
    } else {
        //普通用户登录
        //验证登录是否是第一次登录
        var sql = `select * from user where userName=?`
        var sqlArr = [username]
        var result = await dbConfig.SySqlConnect(sql, sqlArr)
        if(result.length) {
            //该用户已经注册了，验证密码是否正确
            if(result[0].userState == 0) { 
                //用户被锁定的
                return res.json({
                    code:400,
                    msg:'该用户已经被锁定，请联系管理员解锁'
                })
            }
            if(result[0].userPass == userpassword) { //密码正确
                Ctoken.setToken(username,userpassword).then((token) => {
                    //登录成功,返回该用户信息
                    res.json({
                        code:200,
                        msg:'登录成功',
                        data:result,
                        token:token
                    })
                })
            } else {
                //密码不正确
                res.json({
                    code:400,
                    msg:'密码错误，请重新验证'
                })
            }
        } else {
            //该用户还没注册
            res.json({
                code:4,
                msg:'抱歉，您还未注册'
            })
            return ;
        }
    }
}

//用户注册
//用户注册方法
Register = async (req, res) => {
    //检查用户是否是第一次注册
    var {userName,userPass,userUrl} = req.query
    var sql = `select * from user where userName=?`
    var sqlArr = [userName]
    var result = await dbConfig.SySqlConnect(sql, sqlArr)
    //判断,用户已经注册过了
    if(result.length) {
        res.json({
            code:400,
            msg:'用户已经注册过了'
        })
    } else {
        //用户第一次注册
        sql = `insert into user(userName,userPass,userTime,userUrl) values(?,?,NOW(),?)`
        sqlArr = [userName,userPass,userUrl]
        result = await dbConfig.SySqlConnect(sql,sqlArr,userUrl)
        if(result.affectedRows == 1) {
            //注册成功    
            res.json({
                code:200,
                msg:'注册成功',
            })
        }
    }
}


module.exports = {
    Login,
    Register
}