<template>
  <div class="Loginregister">
    <div class="login-container">
      <el-form
        :model="ruleForm2"
        :rules="rules2"
        ref="ruleForm2"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-page"
      >
        <h3 class="title">用户注册</h3>

        <el-form-item prop="userName">
          <el-input
            type="text"
            v-model="ruleForm2.userName"
            auto-complete="off"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPass">
          <el-input type="password" v-model="ruleForm2.userPass" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="confirmpassword">
          <el-input
            type="confirmpassword"
            v-model="ruleForm2.confirmpassword"
            placeholder="请确认密码"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item class="button-item">
  
          
        <router-link to="/AdminLogin" class="Tologin">立即登录</router-link>
    

          
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    var validatePasscon = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.userPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.confirmpassword !== "") {
          this.$refs.ruleForm2.validateField("confirmpassword");
        }
        callback();
      }
    };
    return {
      logining: false,
      ruleForm2: {
        userName: "",
        userPass: "",
        confirmpassword: "",
        userUrl:"['http://localhost:3000//images/user/1678712188596-back.jpg']"
      },
  
      rules2: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        userPass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        confirmpassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePasscon, trigger: "blur" }
        ],
      
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm2.validate((valid, err) => {
        if (valid) {
          //this.ruleForm2.userPass = this.$md5(this.ruleForm2.userPass)
          this.$api.Register(this.ruleForm2).then(res => {
            if (res.code == 200) {
              this.$message(res.msg);
              //跳转到登录页面
              this.$router.push({ path: "/AdminLogin" });
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        } else {
          this.$message({
            message: "请认真填写信息",
            type: "error"
          });
          return false;
        }
      });
    },
  
  }
};
</script>
<style lang="less" scoped>
.Loginregister {
  
  .login-container {

    margin-top: 100px;;
    margin: auto;
  }
  .Tologin{
    margin-left:250px;
  }
  .login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 100px auto;
    width: 350px;
    padding: 20px 35px 15px;
    border: 1px solid #ccc;
    // box-shadow: 0 0 25px #cac6c6;
  }
  label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    margin-left: 10px;
    text-align: left;
    color: #ccc;
  }
  .title {
    text-align: center;
    margin-bottom: 10px;
    color: #ccc;
    font-size: 30px;
  }
  .el-button--info.is-plain {
    background-color: rgba(255, 255, 255, 0.3);
    a {
      color: #fff;
    }
  }
  .el-button + .el-button {
    border: 1px solid #ccc;
    margin-left: 100px;
    a {
      color: #cccccc;
    }
  }
  .button-item {
    display: flex;
    
    .el-button a {
      color: #fff;
      &.router-link-active {
        color: #cccccc;
      }
    }
  }
  .radio-item {
    .el-form-item__content {
      display: flex;
      justify-content: space-around;
      .el-radio {
        color: #fff;
      }
    }
  }
  .avatar-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>