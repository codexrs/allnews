<template>
  <el-menu
    :default-active="activeMenu()"
    :collapse="isCollapse"
    collapse-transition
    router
    unique-opened
    class="el-menu-vertical-demo"
    background-color="#112f50"
    text-color="#fff"
    active-text-color="#1e78bf"
  >
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont icon" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="chmenu.url" :key="chmenu.menuid">
          <template v-if="chmenu.icontype">
            <i class="icon" :class="chmenu.icon"></i>
          </template>
          <template v-else>
            <i class="iconfont icon" :class="chmenu.icon"></i>
          </template>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: "leftnav",
  data() {
    return {
      collapsed: false,
      allmenu: []
    };
  },
  props:['isCollapse'],
  // 创建完毕状态(里面是操作)
  computed:{
    ...mapState({
      adminIdentity:(state) => state.AdminLogin.adminIdentity
    })
  },
  created() {
    //超级管理员菜单
    if(this.adminIdentity == 'superAdmin') {
      this.$api.supermenu().then(res => {
        if (res.code == 1) {
          this.allmenu = res.supermenu;
        } else {
          this.$message.error(res.msg);
          return false;
        }
      })
      .catch(err => {
        this.$message.error("菜单加载失败，请稍后再试！");
      });
      } else {
        //普通管理员
        this.$api.vipmenu().then(res => {
          console.log(res)
          if (res.code == 2) {
            this.allmenu = res.vipmenu;
          } else {
              this.$message.error(res.msg);
              return false;
            }
          })
          .catch(err => {
            this.$message.error("菜单加载失败，请稍后再试！");
        });
    }
  
    
  },
  methods:{
    activeMenu() {
      //当前路由
      let route = this.$route;
      //console.log(route)
      let {path, meta} = route;
      if(meta.activeMenu) {
        //如果有这个元信息，返回
        return meta.activeMenu
      }
      return path
    }
  }
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
.icon {
  margin-right: 6px;
  font-size: 20px;
  font-style: normal;
}
</style>