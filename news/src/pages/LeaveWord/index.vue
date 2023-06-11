<template>
  <div class="leaveword">
    <el-form :model="leavewordForm" :rules="rules" ref="leavewordForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="手机号码" prop="leavewordPhone">
        <el-input size="small" v-model="leavewordForm.leavewordPhone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="您的邮箱" prop="leavewordEmail">
        <el-input v-model="leavewordForm.leavewordEmail" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item label="留言内容" prop="leavewordContent">
          <el-input type="textarea" v-model="leavewordForm.leavewordContent" placeholder="请输入1-200字留言内容"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('leavewordForm')">保存</el-button>
        <el-button @click="resetForm('leavewordForm')">重置</el-button>
        <el-button  @click="goBack">取消并返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//时间格式化
import dayjs from 'dayjs'
export default {
  data() {
    //验证手机号码
     var checkMobile = (rule, value, callback) => {
            const regMobile = /^1[34578]\d{9}$/
            if (regMobile.test(value)) {
                return callback()
            }
            //返回一个错误提示
            callback(new Error('请输入合法的手机号码'))
        }
      return {

        leavewordForm: {
          leavewordPhone:"",
          leavewordEmail:"",
          leavewordContent: ""
        },
        rules: {
          leavewordPhone: [
            { validator: checkMobile, required: true, trigger: 'blur' },
            { min: 10, max: 20, message: '长度在 10 到 20 个字符', trigger: 'blur' }
          ],
          leavewordEmail: [
            { required: true,type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          leavewordContent: [
            {  required: true, message: '请输入留言内容'},
            { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ],

        }
      };
    },
    methods:{
      //提交 
      submitForm(formName) {
        //console.log('获取表单输入的信息', this.leavewordForm);
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let {leavewordContent,leavewordEmail,leavewordPhone} = this.leavewordForm
            
              let leavewordTime =  dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
              this.$request.upLeaveWord(leavewordContent,leavewordEmail,leavewordPhone,leavewordTime).then(res => {
                if(res.code == 200) {
                    this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'success'
                  })
                  this.$router.push('/userHome/leaveword')
                } else {
                  this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
                }
              })
              
            
            }
          })
      
      },
      //重置
      resetForm(formName) {
          this.$refs[formName].resetFields();
          this.leavewordForm = {};
      },
      goBack() {
        this.$router.push('/userHome/home')
      }
    }
}
</script>

<style lang="less" scroped>
.leaveword {
  width:1000px;

  background:#fff;
  margin:0 auto;
  .el-form{
  height: 550px;
  width: 500px;
  margin: 0 auto;
  

}
.el-form-item{
  margin-bottom: 0;
  padding: 10px;
}
.el-input {
  width:200px;
  
}
}
</style>