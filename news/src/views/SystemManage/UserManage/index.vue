<!--  -->
<template>
  <div class='userlist'>
    <!-- 面包屑 -->
    <Breadcrumb></Breadcrumb>
    <div class="header-serch">
    <el-form :inline="true" :model="formInline" class="user-serch">
    <el-form-item label="">
      <el-input size="small" v-model="formInline.userId" placeholder="输入用户编号"></el-input>
    </el-form-item>

    <el-form-item label="">
        <el-input size="small" v-model="formInline.userName" placeholder="输入用户名"></el-input>
    </el-form-item>

    <el-form-item>性别
      <el-select size="small" v-model="formInline.userSex" placeholder="请选择">
        <el-option label="全部" value="allSex"></el-option>
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form-item>
  
    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="AddUserList">添加用户</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeUserList">批量删除</el-button>
    </el-form-item>
    </el-form>

  </div>

    <!-- 列表
  selection-change	当选择项发生变化时会触发该事件
   -->
  <div class="list-table">
    <el-table
    :data="tableData"
    border
    max-height="475"
    @selection-change="changeTable"
    style="width: 100%;">
    
    <el-table-column
      type="selection"
      width="40"
      >
    </el-table-column>
    
    <el-table-column
      prop="userId"
      label="用户编号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="用户名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="userSex"
      label="用户性别"
      width="100">
    </el-table-column>

    <el-table-column
      prop="userPass"
      label="用户密码"
      width="100">
    </el-table-column>

    <el-table-column
      prop="userUrl"
      label="用户头像"
      width="220">
      <template slot-scope="scope">
          <!-- 当前作用域scope获取当前行的数据  prop="swiperurl"==scope.row.newsState
            可以获取当前行的数据信息
            -->
        <img class="img" :src="scope.row.userUrl.slice(2,scope.row.userUrl.length-2)"  alt="">
      </template>
    </el-table-column>

    <el-table-column
      width="125"
      prop="userTime"
      label="创建时间"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{dayjs(scope.row.userTime).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
    </el-table-column>

    <el-table-column align="center" prop="userState" label="用户状态" min-width="80">
        <template slot-scope="scope">
          <!-- 当前作用域scope获取当前行的数据  prop="newsState"==scope.row.newsState
            可以获取当前行的数据信息
            -->
          <el-switch
            active-value="1"
            inactive-value="0"
            :value="scope.row.userState"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="editType(scope.$index, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

    <el-table-column label="操作" width="200">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit"
          type="primary"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  </div>

  <!-- 增加/编辑对话框 -->
    <el-dialog :title="title +'用户'" :visible.sync="dialogFormVisible" :destroy-on-close="isClosedialog" >
      <el-form :model="form" :rules="rules" ref="userForm">
        
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="form.userName" autocomplete="off" :disabled="title == '编辑'"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="userPass">
          <el-input v-model="form.userPass" autocomplete="off"></el-input>
        </el-form-item>
    
        <el-form-item label="用户性别" :label-width="formLabelWidth"  prop="userSex">
          <el-select v-model="form.userSex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>      

        <el-form-item label="用户头像" prop="userUrl"  :label-width="formLabelWidth" >
          <UploadImg @sendImage="sendImage" :fileList="fileList" :url="url"></UploadImg>
        </el-form-item>

        <el-form-item label="创建时间" :label-width="formLabelWidth"  prop="userTime">
          <el-date-picker
            v-model="form.userTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CanceldialogForm">取 消</el-button>
        <el-button type="primary" @click="dialogAddType('userForm')" >确 定</el-button>
      </div>
    </el-dialog>

  <!-- 分页器 -->
  <Pagination :total="total" :pageSize="pageSize" 
    :currentPage="currentPage" 
    :PageSizes="PageSizes"
    @handleCurrentChange="handleCurrentChange"
    @handleSizeChange="handleSizeChange"
    ></Pagination>


  </div>
</template>

<script>
//时间格式化
import dayjs from 'dayjs'
//上传图像
import {userImgUpload} from '@/api/base'
import Pagination from '@/components/Pagination'
import { mapState } from "vuex";
export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    Pagination,
    
  },
  data  () {
// 这里存放数据
    return {
      url:userImgUpload,
      //输入框数据
      formInline: {
        userId:'',
        userName:"",
        userSex:""
      },
      //添加/编辑对话框数据
      form:{
        userName:"",
        userSex:"",
        userPass:'',
      
        userTime:'',
        userUrl:''
      },
      rules:{
        userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            
        ],
        userSex:[
           { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        userPass:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],

        userTime:[
           { required: true, message: '请选择时间', trigger: 'blur' },
        ],
        userUrl:[
          { required: true, message: '请上传头像', trigger: 'blur' },
        ]
      },
      //新闻列表数据
      tableData: [],
      //总条数
      total:100,
      //每页数据量
      pageSize:3,
      //当前页码
      currentPage:1,
      //选择每页数据量
      PageSizes:[10,20,30,40],

      //搜索查询的所有数据
      listTotal:[],
      //搜索状态
      serchStatus: false,

      //name用来判断用户 是否已经存在
      preName:"",


      //批量删除userIds
      userIds:[],

      dialogFormVisible: false, //对话框是否显示
      formLabelWidth: '120px', //对话框文字宽度
      isClosedialog:false,//关闭时销毁 Dialog 中的元素
    }
  },
// 监听属性 类似于data概念
  computed: {
    //添加/编辑
    ...mapState({
      title:(state) => state.news.title
    }),
  },

// 方法集合
  methods: {
    dayjs,
    //获取Upload传递的图片数据
    sendImage(imgUrl) {
      this.form.userUrl = imgUrl;
    },
    //表格选中
    changeTable(selection) {
      //选择的数据集合
      console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.userId)
      })
      this.userIds = arr
      console.log('userIds',this.userIds);
    },
    //对话框点击取消
    CanceldialogForm() {
      this.dialogFormVisible = false;
      //更新数据
      this.getUserList({page: this.currentPage,pageSize:this.pageSize})
    },
    //点击页码
    handleCurrentChange(page) {
      //默认新闻列表分页数据
      this.currentPage = page
      this.getUserList({page:page, pageSize:this.pageSize})
    },
    //点击每页数量
    handleSizeChange(pageSize) {
      //console.log(this.currentPage,pageSize)
      this.getUserList({page: this.currentPage,pageSize:pageSize})
    },
    //用户状态修改
    async editType(index,row) {
      //编辑审核状态
      //console.log(index, row)
      //修改新闻审核状态
      let userState = row.userState
      if(userState == "0") {
        userState = "1"
        
      } else {
        userState = "0"
      
      }
      //修改状态之后需要更新状态
      let res = await this.$api.updateUserState(userState, row.userId)
      if(res.code == 200) {
        //状态修改成功，更新状态
        //console.log((res));
        this.getUserList({page: this.currentPage,pageSize:this.pageSize})
      }
      
      
      
    },
    //点击当前行编辑
    handleEdit(index, row) {
      console.log('编辑当前行数据',row);
      this.$store.commit('getchangeTile','编辑')
      //获取当前行数据
      this.dialogFormVisible = true;
      if(this.title == '编辑') {
        this.preName = row.userName
        this.prePass = row.userPass

        this.form = row
        let imgs = JSON.parse(row.userUrl)
        this.form.userUrl = imgs
        let arr = []
        //[{url:''},{ur:''l}]
        imgs.forEach(ele => {
          let obj = {}
          obj.url = ele
          arr.push(obj)
        })
        this.fileList = arr
      }

      //this.form = row  //赋值给对话框
      ////将当前行新闻数据，存储到vuex仓库中
      
      this.$store.commit('getswiperData', row)
    },
    //点击单个删除
    handleDelete(index,row) {
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          this.delectSingleUserList(row.userId)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        //删除完成，更新数据
      this.getUserList({page:this.currentPage,pageSize:this.pageSize})
    },
    // 删除单个新闻列表请求方法
    async delectSingleUserList(userId) {
      let res = await this.$api.delectSingleUserList(userId)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        //上传成功，更新状态
        this.getUserList({page:this.currentPage,pageSize:3})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      //console.log('删除单个新闻', res)
    },
    //添加添加/编辑方法
    dialogAddType(formName) {
      this.$refs[formName].validate(async (valid) => {
      if (valid) {
        //添加功能
        var {userId,userName,userPass,userSex} = this.form
        var userTime =dayjs(this.form.userTime).format('YYYY-MM-DD HH:mm:ss')
        var userUrl = JSON.stringify(this.form.userUrl)
        if(this.title=="添加") {
          //添加添加用户
          
          //console.log(time);
          let res =  await this.$api.addUserList(userName,userPass,userSex,userUrl,userTime)
          if(res.code == 304) {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
          }
          else if(res.code == 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            });
            //上传成功，更新状态
            this.getUserList({page:this.currentPage,pageSize:this.pageSize})
            

          } else {

            this.$message.error('上传失败');
          }
        
          
        } else {
          //编辑功能
          //console.log(this.preName);  name为编辑之前的名称
          
          let res =  await this.$api.updateUserList(userName,userPass,userSex,userUrl,userTime,userId,this.preName)
            if(res.code == 304) {
              this.$message({
                message: res.msg,
                type: 'warning'
              });

            }
            else if(res.code == 200) {
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              
      
            } else {

              this.$message.error('上传失败');
            }
          this.isClosedialog = true //关闭时销毁 Dialog 中的元素
          //上传成功，更新状态
          this.getUserList({page:this.currentPage,pageSize:this.pageSize})
        }
        
        //关闭对话框
        this.dialogFormVisible = false
        //关闭对话框时，销毁对话框元素
        this.isClosedialog = true
      } else {
        console.log('error submit!!');
        return false;
       }
      })
    },

    //多条件搜索
    async onSearch() {
        if(!this.formInline.userId && !this.formInline.userName && !this.formInline.userSex) {
        //三个输入框输入为空
         this.$message.error('错了哦，请输入内容再查询');
        
      }else {
        let res = await this.$api.getMoreUserListSerch(this.formInline.userId,this.formInline.userName,this.formInline.userSex)
        if(res.code == 200) {
            console.log(res.newslist);
            //查询成功
            this.listTotal = res.newslist
            //渲染页面的数据大于5条
            if(res.newslist.length > 5) {
              this.tableData = res.newslist.slice(0, 5)
                //修改分页状态
                this.serchStatus = true
            }else {
              //搜索渲染数据不大于5的直接渲染
                this.tableData = res.newslist
              }
              this.total =  res.newslist.length
              this.pageSize = 5
              this.$message({
                message: '查询成功',
                type: 'success'
              });
            } else {
             //查询的不存在，无数据
              this.tableData = []
              this.total = 0
            }
            
          }

    },
    //点击添加用户
    AddUserList() {
      this.$store.commit('getchangeTile','添加')
      this.form= {}
      this.fileList = []
      //添加页面
      //this.dialogName="添加"
      //打开对话框
      this.dialogFormVisible = true
    },
    //批量删除用户
    delectSomeUserList() {
      //接口delectSomeUserList
      //1.先获取userIds
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //执行删除操作
        //console.log(this.typeIds);
        this.$api.delectSomeUserList(this.userIds.join(',')).then(res => {
          if(res.code == 200) {
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //更新视图
          this.getUserList({page: this.currentPage,pageSize:this.pageSize})
                
          } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              }); 
            }
          })
            
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //请求获取用户列表数据
    async getUserList(params) {
      let res = await this.$api.getAllUserList(params)
      if(res.code == 200) {
        this.tableData = res.newslist;
        this.total = res.total;
        this.pageSize = res.pageSize;
        this.currentPage = res.page
        //console.log(res)
      } else {
        console.log('请求新闻列表数据出错')
      }
      
    },

  },
// 生命周期 - 创建完成（可以访问当前this实例）
  created  () {
    this.getUserList({pageSize:10})
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.userlist {
  padding:10px;
  .header-serch {
    background:#fff;
    border-radius:10px;
    padding:20px;
    margin-top:10px;
    .el-form-item{
      margin-bottom: 0;
    }
  }
  .list-table{
    margin-top: 10px;
  }
  .img{
    width:200px;
    height:100px;
  }
}
</style>