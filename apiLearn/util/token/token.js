//用于生成和解析token
var jwt = require('jsonwebtoken');
var signkey = 'zxcvbnmpoiuy';//自定义秘钥

exports.setToken = function (username, userpassword) {
    return new Promise((resolve, reject) => {
        const rule = {
            username: username,
            userpassword: userpassword
        }
        // rule 账号密码 expiresIn 失效时间
        const token = jwt.sign(rule, signkey, { expiresIn: '1h' });
        resolve(token);
    })
}

exports.verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token.split(' ')[1], signkey);
        resolve(info);
    })
}