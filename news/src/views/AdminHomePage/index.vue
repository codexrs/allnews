<template>
	<div class="myhome">
		<h5>修改头像</h5>
		<UploadImg @sendImage="sendImage" class="put"  :fileList="fileList" :url="url"></UploadImg>
        <el-button class="put" type="primary" @click="upAdminUrl" :loading="logining1">点击上传</el-button>
		<h5>管理员名</h5>
		<el-input v-model="adminName" class="put" disabled></el-input>
		<h5>修改密码</h5>
		<span class="pass">原密码:</span><el-input v-model="adminPass" show-password></el-input> <br>
		<span class="pass">新密码:</span><el-input v-model="adminNewsPass" show-password></el-input>  <br>
		<span class="pass">确认密码:</span><el-input v-model="adminRePass" show-password></el-input>  
		<el-button type="primary" @click="upPass" :loading="logining3">点击修改</el-button><br/>
  	<el-button  class="put" @click="goback">返回首页</el-button>
	</div>
  

</template>

<script>
//时间格式化
import dayjs from 'dayjs'
//上传图像
import {adminImgUpload} from '@/api/base'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      url:adminImgUpload, //传递图片路径
      fileList:[], //图片容器
      adminId:'',
      adminUrl:'',
      adminName:'',
      adminPass:'',
	  adminNewsPass:"",
      adminRePass:'',
    
      
      //正在修改
      logining1:false,
      logining3:false,
    }
  },
  computed:{
    ...mapState({
      adminToken:(state) => state.AdminLogin.token
        
    }),
    ...mapState({
      admininfo:(state) => state.AdminLogin.adminUserInfo.admininfo[0]
    })
  },
  created() {
    this.adminName = this.admininfo.adminName
	  this.adminPass = this.admininfo.adminPass
	  this.adminId = this.admininfo.adminId
    if(this.admininfo.adminUrl) {  
      //用户头像存在了
      //解析图片字段,转为数组[]
      let imgs = [this.admininfo.adminUrl.slice(2,this.admininfo.adminUrl.length-2)]
     
      //修改上传图片，图片为数组格式
      this.adminUrl = imgs//获取vuex里面数组 
      
      let arr = []
      //[{url:''},{ur:''l}]
      //console.log(imgs)
      imgs.forEach(ele => {
        let obj = {}
        obj.url = ele
        arr.push(obj)
      })
      //console.log(arr)
      //将图片容器传给uploadImg
      this.fileList = arr;
    } else {
      //头像还没上传
      //默认头像
    
      this.fileList = []
    }
    
    
  

  },

  methods: {
    dayjs,
    //获取Upload传递的图片数据
    sendImage(imgUrl) {
      //数组['http//']
      this.adminUrl = imgUrl;
    },
    //上传头像
    async upAdminUrl() {
      this.logining1 = true
      var adminId = this.adminId
      var adminTime =dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      var adminUrl = JSON.stringify(this.adminUrl)
      const res = await this.$api.upadminUrl(adminUrl,adminTime,adminId)
      if(res.code == 200) {
        //返回首页，刷新新数据
        this.$api.getAdminUserById(this.adminId).then(res => {
          if(res.code == 200) {
            //就修改之后的数据存储在vuex中
            this.$store.commit("setadminUserInfo", res);
          }
                
        })
        
        setTimeout(() => {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.logining1 = false
          //修改成功返回首页，进行刷新
          this.$router.replace('/AdminHome')
        },2000)
      }
    },
  
    //修改密码
    async upPass() {
      //  userPass:'',  userNewsPass:"",userRePass:'',
      //原密码和新密码一样，没有修改
      this.logining3 = true
      var adminId = this.adminId
      var adminTime =dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
	    if(this.adminPass == this.adminNewsPass) {
        this.$message({
          message: '原密码和新密码一样，请重新修改',
          type: 'warning'
        });
        this.logining3 = false
        return ;
      }
      if(this.adminNewsPass == this.adminRePass && this.adminNewsPass.length !=0) {
        //修改密码upuserPass
        const res = await this.$api.upadminPass(this.adminNewsPass,adminTime,adminId)
        if(res.code == 200) {
          //返回首页，刷新新数据
          this.$api.getAdminUserById(this.adminId).then(res => {
            if(res.code == 200) {
              //就修改之后的数据存储在vuex中
              this.$store.commit("setadminUserInfo", res);
            }
              
          })
          setTimeout(() => {
            this.$message({
              message: '上传成功',
              type: 'success'
            });
            this.logining3 = false
            //修改成功返回登录页，重新登录
            this.$store.commit('deleteAdmin')
            this.$store.commit('deleteToken')
            this.$store.commit('deleteadminIdentity')
            //跳转到登录页，重新登录
            this.$router.push('/AdminLogin')
          },2000)

        }
      } else {
        this.$message({
          message: '新密码和确认密码不一致/没有输入新密码',
          type: 'warning'
        });
        this.logining3 = false
        return ;
      }
      
    },
    //返回首页
    goback() {
      this.$router.push('/adminHome')
    }
  
    
    
  }
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.myhome {
	
  width:1000px;
  margin:0 auto;
  min-height: 200px;
	.pass {
		margin-left:100px;
	}
	.put {
		margin-left: 100px;
	}
}
.el-input {
  
  width:200px;
  margin-bottom: 20px;
}
</style>