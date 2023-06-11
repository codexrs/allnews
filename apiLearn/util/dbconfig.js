
//引用数据库
const mysql = require('mysql')
module.exports = {
    //数据库配置
    config: {
        host:'localhost',
        port:'3306',
        user:'root',
        password:'123456',
        database:'mynews'
    },
    //连接数据库，连接池方式
    //连接池对象
    //同步
    sqlConnect: function(sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err,conn) => {
            if(err) {
                console.log('连接识别')
                return
            }
            //事件驱动回调
            conn.query(sql, sqlArr,callBack);
            //释放链接
            conn.release()
        })
    },
    //promise回调
    SySqlConnect: function(sql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config)
            pool.getConnection((err,conn) => {
                if(err) {
                    reject(err)
                } else {
                    //事件驱动回调
                    conn.query(sql, sqlArr,(err, data) => {
                        if(err) {
                            reject(err)
                        } else {
                            resolve(data)
                        }
                    });
                    //释放链接
                    conn.release()
                }
            })
            
            })
        }

}