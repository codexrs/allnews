<!--  -->
<template>
  <div class='adminlist'>
  <!-- 面包屑 -->
  <Breadcrumb></Breadcrumb>
  <div class="header-serch">
    <el-form :inline="true" :model="formInline" class="user-serch">
    <el-form-item label="">
      <el-input size="small" v-model="formInline.adminId" placeholder="输入管理员编号"></el-input>
    </el-form-item>

    <el-form-item label="">
        <el-input size="small" v-model="formInline.adminName" placeholder="输入管理员名"></el-input>
    </el-form-item>

    <el-form-item>性别
      <el-select size="small" v-model="formInline.adminSex" placeholder="请选择">
        <el-option label="全部" value="allSex"></el-option>
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form-item>
  
    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="AddAdminList">添加管理员</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeAdminList">批量删除</el-button>
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
      prop="adminId"
      label="管理员编号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="adminName"
      label="管理员名"
      width="80">
    </el-table-column>
    <el-table-column
      prop="adminSex"
      label="管理员性别"
      width="100">
    </el-table-column>

    <el-table-column
      prop="adminPass"
      label="管理员密码"
      width="100">
    </el-table-column>

    <el-table-column
      prop="adminEmail"
      label="管理员邮箱"
      width="100">
    </el-table-column>
    <el-table-column
      prop="adminUrl"
      label="管理员头像"
      width="220">
      <template slot-scope="scope">
          <!-- 当前作用域scope获取当前行的数据  prop="swiperurl"==scope.row.newsState
            可以获取当前行的数据信息
            -->
        <img class="img" :src="scope.row.adminUrl.slice(2,scope.row.adminUrl.length-2)"></img>
      </template>
    </el-table-column>

    <el-table-column
      width="105"
      prop="adminTime"
      label="创建时间"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{dayjs(scope.row.adminTime).format('YYYY-MM-DD HH:mm:ss')}}
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

  <!-- 对话框 -->
    <el-dialog :title="title +'管理员'" :visible.sync="dialogFormVisible" :destroy-on-close="isClosedialog">
      <el-form :model="form" :rules="rules" ref="adminForm">
        
        <el-form-item label="管理员名字" :label-width="formLabelWidth" prop="adminName">
          <el-input v-model="form.adminName" autocomplete="off" :disabled="title == '编辑'"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" :label-width="formLabelWidth" prop="adminPass">
          <el-input v-model="form.adminPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员邮箱" :label-width="formLabelWidth" prop="adminEmail">
          <el-input v-model="form.adminEmail" autocomplete="off"></el-input>
        
        </el-form-item>
        
        <el-form-item label="管理员性别" :label-width="formLabelWidth" prop="adminSex">
          <el-select v-model="form.adminSex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>      

        <el-form-item label="管理员头像" prop="adminUrl"  :label-width="formLabelWidth" >
          <UploadImg @sendImage="sendImage" :fileList="fileList" :url="url"></UploadImg>
        </el-form-item>

        <el-form-item label="创建时间" :label-width="formLabelWidth" prop="adminTime">
          <el-date-picker
            v-model="form.adminTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CanceldialogForm">取 消</el-button>
        <el-button type="primary" @click="dialogAddType('adminForm')" >确 定</el-button>
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
import {adminImgUpload} from '@/api/base'
import Pagination from '@/components/Pagination'
import { mapState } from "vuex";
export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    Pagination
  },
  data  () {
// 这里存放数据
    return {
      url:adminImgUpload,
      formInline:{
        adminId:'',
        adminName:'',
        adminSex:''
      },
      //添加/编辑对话框数据
      form:{
        adminName:"",
        adminSex:"",
        adminPass:'',
        adminEmail:'',
        adminTime:'',
        adminUrl:''
      },
      rules:{
        adminName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            
        ],
        adminSex:[
           { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        adminPass:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        adminEmail: [
          { required: true,type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        adminTime:[
           { required: true, message: '请选择时间', trigger: 'blur' },
        ],
        adminUrl:[
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
      PageSizes:[3,5,7,10],

      //搜索查询的所有数据
      listTotal:[],
      //搜索状态
      serchStatus: false,

      //编辑之前的管理员名称
      preName:'',

      //批量删除userIds
      adminIds:[],

      dialogFormVisible: false, //对话框是否显示
      formLabelWidth: '120px', //对话框文字宽度

      isClosedialog:false
    }
  },
// 监听属性 类似于data概念
  computed: {
      //添加/编辑
    ...mapState({
      title:(state) => state.news.title
    }),
  },
// 监控data中的数据变化
  watch: {},
// 方法集合
  methods: {
    dayjs,
    //获取Upload传递的图片数据
    sendImage(imgUrl) {
      this.form.adminUrl = imgUrl;
    },
    //表格选中
    changeTable(selection) {
      //选择的数据集合
      console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.adminId)
      })
      this.adminIds = arr
      console.log('userIds',this.adminIds);
    },
    //点击当前页码
    handleCurrentChange(page) {
      //默认新闻列表分页数据
      this.currentPage = page
      this.getAdminList({page:page, pageSize:this.pageSize})
    },
    //点击每页数量
    handleSizeChange(pageSize) {
      this.getAdminList({page:this.currentPage, pageSize:pageSize})
    },

    //点击当前行编辑
    handleEdit(index, row) {
      console.log('编辑当前行数据',row);
      this.$store.commit('getchangeTile','编辑')
      //获取当前行数据
      this.dialogFormVisible = true;
      if(this.title == '编辑') {
        this.preName = row.adminName
        this.form = row
        let imgs = JSON.parse(row.adminUrl)
        this.form.adminUrl = imgs
        let arr = []
        //[{url:''},{ur:''l}]
        imgs.forEach(ele => {
          let obj = {}
          obj.url = ele
          arr.push(obj)
        })
        this.fileList = arr
      }

    
    },
  



    //多条件搜索
    async onSearch() {
        if(!this.formInline.adminId && !this.formInline.adminName && !this.formInline.adminSex) {
        //三个输入框输入为空
         this.$message.error('错了哦，请输入内容再查询');
        
      }else {
        let res = await this.$api.getMoreAdminListSerch(this.formInline.adminId,this.formInline.adminName,this.formInline.adminSex)
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
              //搜索渲染数据不大于10的直接渲染
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
    //点击添加管理员
    AddAdminList() {
      this.$store.commit('getchangeTile','添加')
      this.form= {}
      this.fileList = []
      //添加页面
      //this.dialogName="添加"
      //打开对话框
      this.dialogFormVisible = true
    },
    CanceldialogForm() {
      this.dialogFormVisible = false
      //更新数据
      this.getAdminList({page: this.currentPage,pageSize:this.pageSize})
    },
    //添加添加/编辑方法
    dialogAddType(formName) {
      this.$refs[formName].validate(async (valid) => {
      if (valid) {
        //添加功能
        //console.log(this.form);
        var {adminName,adminPass,adminSex,adminEmail,adminId} = this.form
        var adminTime =dayjs(this.form.adminTime).format('YYYY-MM-DD HH:mm:ss')
        var adminUrl = JSON.stringify(this.form.adminUrl)
        if(this.title=="添加") {
          //添加添加用户
          
          let res =  await this.$api.addAdminList(adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail)
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
        
          
        } else {
          //编辑功能
          let res =  await this.$api.updateAdminList(adminName,adminPass,adminSex,adminUrl,adminTime,adminEmail,adminId,this.preName)
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
        }
        //上传成功，更新状态
        this.getAdminList({page:this.currentPage,pageSize:this.pageSize})
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
    //批量删除管理员

    delectSomeAdminList() {
      //接口delectSomeUserList
      //1.先获取userIds
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //执行删除操作
        //console.log(this.typeIds);
        this.$api.delectSomeAdminList(this.adminIds.join(',')).then(res => {
          if(res.code == 200) {
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //更新视图
          this.getAdminList({page: this.currentPage,pageSize:this.pageSize})
                
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
    //删除单个admin
    handleDelete(index,row) {
      this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          this.delectSingleAdminList(row.adminId)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除单个新闻列表请求方法
    async delectSingleAdminList(adminId) {
      let res = await this.$api.delectSingleAdminList(adminId)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        //上传成功，更新状态
        this.getAdminList({page:this.currentPage,pageSize:this.PageSize})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      //console.log('删除单个新闻', res)
    },

    //获取管理员列表数据
    
    async getAdminList(params) {
      let res = await this.$api.getAllAdminList(params)
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
  created () {
    this.getAdminList({pageSize:3})
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.adminlist {
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