var express = require('express');
var router = express.Router();
var Login_Register =require('../controllers/login-register')

//登录接口
router.post('/Login', Login_Register.Login);

router.post('/Register', Login_Register.Register)
module.exports = router;