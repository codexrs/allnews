var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter = require('./routes/users');

var adminRouter = require('./routes/admin')
var Login = require('./routes/login')

var app = express();

//改写
var http = require('http');
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源public

app.use(express.static(path.join(__dirname, 'public')));
//post请求
app.use(bodyParser.urlencoded({extended:true}))


app.use('/users', usersRouter);

app.use('/admin',adminRouter)
app.use('/login',Login)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//token
var vertoken = require('./util/token/token.js');
var expressJWT = require('express-jwt');
app.use(function (req, res, next) {
  // x-access-token  前端传过来的token
    var token = req.headers['x-access-token'];
    if (token == undefined) {
      return next();
    } else {
      vertoken.verToken(token).then((data) => {
        req.data = data;
        return next();
      }).catch((error) => {
        return next();
      })
    }
    next(createError(404));
  });
  
  //验证token
  app.use(expressJWT({
    secret: 'zxcvbnmpoiuy', // signkey 自定义秘钥 需跟上方保持一致
    algorithms: ["HS256"]
  }).unless({
    path: ['/users/addUsers', "/users/login"]//除了这些地址，其他的URL都需要验证
  }));
  
  
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    if (err.status == 401) {
      return res.status(401).send({
        code: 401,
        msg: "token失效",
        success: false,
      });
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    // res.status(err.status || 500);
    // res.render('error');
  });


//module.exports = app;
//监听端口3000
//跨域解决
//跨域问题解决方面
const cors = require('cors'); 
app.use(cors({ 
  origin:['http://localhost:8080'],
  methods:['GET','POST'],
}));
//跨域问题解决方面
app.all('*',function (req, res, next) {
 res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
 res.header('Access-Control-Allow-Headers', 'Content-Type');
 res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
 res.setContentType("text/text;charset=utf-8");
 res.setCharacterEncoding("UTF-8");
　next();　
});

server.listen(3000,() => {
  console.log(3000);
})