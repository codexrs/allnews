<template>
<div>
  <!-- 顶部区域 -->
  <div class='header'>
    <div class="icon">
      <i class="iconfont icon-zhediecaidan" @click="changemenu" v-if="!isCollapse"></i>
      <i class="iconfont icon-zhediemianban" @click="changemenu" v-else></i>
    </div>
    <div class="title">校园新闻发布系统</div>
    <div class="header-right">
      <span class="L">欢迎：{{adminName}}</span>
      <el-dropdown placement="bottom-start" @command="handleCommand">
      <span class="el-dropdown-link">
          <!-- 管理员头像 -->
          <img :src="adminUrl"/>
      </span>
      <el-dropdown-menu slot="dropdown" class="PageMenu">
        <el-dropdown-item icon="iconfont icon-zhuye1" command="go">管理员{{adminName}}的主页</el-dropdown-item>
        <el-dropdown-item icon="iconfont icon-tuichu" command="back">退出登录</el-dropdown-item>
      </el-dropdown-menu>
      </el-dropdown>
    

      <span class="L">{{nowTime}}</span>
      
    </div>
  </div>
  <!-- 面包屑 -->

  <!-- 内容区域 -->
  <router-view></router-view>
</div>
</template>

<script>
//导入dayjs
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default {
  name:'Content',
// import引入的组件需要注入到对象中才能使用
  components: {
    
  },
  data  () {
   // 这里存放数据
    return {
      //定时器
      timer:'',
      nowTime:'',
      //管理员头像
      adminUrl:'',
      adminName:''
    
    }
  },
  props:['isCollapse'],
// 监听属性 类似于data概念
  computed: {
   //管理员头像返回形式["https://"]
    ...mapState({
      //
      admininfo:(state) => state.AdminLogin.adminUserInfo.admininfo[0]
    })
    
  },
// 监控data中的数据变化
  watch: {},
// 方法集合
  methods: {
    //是否收缩
    changemenu() {
      //修改父元素的事件
      this.$emit('changeMane');
    },
    //跳转到管理员用户界面
    handleCommand(command) {
      //if command==go 进入主页
      if(command == 'go') {
        this.$router.push('/adminhomepage')
      }

      //ifcommmand == back 退出登录
      if(command == 'back'){
        //清空存储数据管理员数据和身份和token
        this.$store.commit('deleteAdmin')
        this.$store.commit('deleteadminIdentity')
        this.$store.commit('deleteToken')
        this.$router.push('/AdminLogin')
      }
    }


  },
 // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    //获取当前时间
    // 每秒定时刷新
    this.timer = setInterval(() => {
      this.nowTime = dayjs(new Date()).format('YYYY年MM月DD日 HH:mm:ss')
    },1000)
    
    //管理员头像
    //this.adminUrl = JSON.stringify(this.admininfo.adminUrl)
    this.adminUrl = this.admininfo.adminUrl.slice(2,this.admininfo.adminUrl.length-2)
    console.log('管理员头像',this.adminUrl)
    //管理员名
    this.adminName = this.admininfo.adminName
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },
  beforeDestroy() {
    /* 离开页面前销毁定时器 */
    if(this.timer){
      clearInterval(this.timer);
    }
  }
  
}
</script>
<style lang="less" scoped>
  .el-dropdown-menu{
    
  
  }
  .header{
  
    background:#1e78bf;
    height:50px;
    line-height:50px;
    color:#fff;
    width:100%;
    display: flex;
    .icon {
      i{
        font-size:24px;
      }
    }
    .title {
      text-align:center;
      font-size:25px;
      flex:1;
      margin-left:200px ;
    }
    .header-right{
      
      padding-right: 30px;
      font-size: 12px;
      text-align: right;
    
      .L {
        position:relative;
        top:0px;
        margin-left:20px;
        margin-right: 20px;
      }
      img{
          position:relative;
          width:30px;
          height:30px;
          border-radius:50%;
          top:10px;
          
      }

      
      .el-dropdown-link {
        cursor: pointer;
        color: #fff;
      }

      .el-icon-arrow-down {
          font-size: 12px;
      }

      .exit {
        float:right;
        position:relative;
        height:50px;
        width:30px;
        i{
          font-size:18px;
          top:50%;
          transform:translateY(-50%);
          position:absolute;
          right:0px;
        }
      }
    }
  }

</style>