<template>
<div class="login">
  <div class="admin-login">
    <el-form
      label-position="left"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <h3 class="title">校园新闻发布系统登录页面</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="userpassword">
        <el-input
          type="password"
          v-model="ruleForm.userpassword"
          auto-complete="off"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="17">

        <el-form-item prop="pictureCode">
          <el-input v-model="ruleForm.pictureCode"  placeholder="请输入验证码" auto-complete="off" class="pictureCode"
          >
          <template slot="append">
              <div style="border: none" @click="refreshCode">
                <!-- 3. 使用 identify 组件 -->
                <picture-identify :identifyCode="ruleForm.identifyCode"></picture-identify>
              </div>
          </template>
          </el-input>
        </el-form-item>

        </el-col>

      </el-row>
      <el-radio-group v-model="ruleForm.identity" class="radio">
        <el-radio label="user" class="radio-left">普通用户</el-radio>
        <el-radio label="admin" class="radio-right">管理员</el-radio>
      </el-radio-group>

      <el-form-item class="button-item" v-if="ruleForm.identity == 'user'">
    
            <router-link to="/Register" class="Toregister">立即注册</router-link>
        
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button
          type="primary"
          style="width:100%;"
          @click="submitForm('ruleForm')"
          :loading="logining"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
//验证码
import PictureIdentify from '@/components/Identify/identify.vue'
export default {
  name: "login",
  components:{
    PictureIdentify
  },
  data() {
    // 验证输入的图片验证码是否和存储的验证码相同
    var checkPictureCode = (rules, value, callback) => {
      if (value == this.ruleForm.identifyCode) {
        return callback();
      } else {
        callback(new Error("验证码错误"));
      }
    };

    return {


      logining: false,
      
      ruleForm: {
        pictureCode: "",//输入input框的验证码
        identifyCode: "", //存储的图片验证码
        username: "",  //账号
        userpassword: "", //密码
        identity:'user',  //用户身份
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        userpassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        pictureCode: [
          { required: true, message: "请输入图片验证码", trigger: "blur" },
          { validator: checkPictureCode,trigger:'blur' }
        ],
      },
      
    };
  },
  created() {
  
     // 获取随机图片验证码
    this.refreshCode()
  },
  methods: {
     // 获取随机图片验证码
    refreshCode() {
      var numCode = "";
      for (var i = 0; i < 4; i++) {
        numCode += Math.floor(Math.random() * 10);
      }
      this.ruleForm.identifyCode = numCode;
    },

    //获取info列表
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.logining = true;
          //console.log(this.ruleForm)
          //this.ruleForm.userpassword = this.$md5(this.ruleForm.userpassword)
          this.$api.Login(this.ruleForm).then(res => {
            console.log(res)
            //用户管理登录
            if(res.code == 200 && this.ruleForm.identity == 'admin') {
              this.$store.commit('setadminIdentity',this.ruleForm.username)
              //将用户数据和token存储在vuex中,
              this.$store.commit("setadminUserInfo", res);
              this.$store.commit('setToken', res.token)
              //一的登录,如果请求成功就让他2秒跳转路由
              setTimeout(() => {
                //跳转管理员首页
                this.$message({
                  message: '登录成功',
                  type: 'success'
                });
                this.$router.push('/adminHome');  
              },2000)
              
            }

            if(res.code == 4 && this.ruleForm.identity == 'admin') {
                //账号名还没注册
                this.$message.error('该账号不是管理员账号');
                this.logining = false;
            }

            //用户登录
            if(res.code == 200 && this.ruleForm.identity == 'user') {
              //如果是用户
              //将用户数据和token存储在vuex中,
              this.$store.commit("setuserInfo", res);
              console.log(res.data)
              this.$store.commit('setuserToken', res.token)
              //管理员的登录,如果请求成功就让他2秒跳转路由
              setTimeout(() => {
                //跳转管理员首页
                this.$message({
                  message: '登录成功',
                  type: 'success'
                });
                this.$router.push('/userHome');  
              },2000)
              
            }
            if(res.code == 400) {
                //密码错误
                this.$message.error(res.msg);
                this.logining = false;
            }
            if(res.code == 4 && this.ruleForm.identity == 'user') {
                //账号名还没注册
                this.$message.error('该账号未注册,请注册再登录');
                this.logining = false;
            }

          })
         }
        
      });
    }
  }
};
</script>

<style lang="less" scoped>

.el-form {
  width: 600px;
  margin: 0 auto;
  
}
.Toregister {
  margin-left:250px;
}
.identifyDiv{
  width:100%;
  height: 100%;
}
.pictureCode {
  width:350px;
}
.pictureCode  .el-input-group__append{
  padding: 0;
}
.pictureCode  .s-canvas canvas{
  margin-top: 0;
}

.admin-login {
  
    margin-top: 100px;
  
  .login-container {
    border-radius: 10px;
    margin: 0px auto;
    width: 350px;
    padding: 30px 35px 15px 35px;
    background: #fff;
    border: 1px solid #ccc;
    text-align: left;
  
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .radio {
    margin: 0px 0px 35px 0px;
    .radio-left {
      
    }
    .radio-right {
      margin-left:100px;
    }
  }
  .code-box {
    text-align: right;
  }
}
</style>