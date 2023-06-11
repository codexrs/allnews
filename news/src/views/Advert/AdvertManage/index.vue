<template>
  <div class="advertlist">
    <Breadcrumb></Breadcrumb>
    <div class="header-serch">
      <el-form :inline="true" :model="formInline" class="user-serch">

      <el-form-item label="">
          <el-input size="small" v-model="formInline.advertName" placeholder="输入广告名称"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="AddAdvertList">添加广告</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeAdvertList">批量删除</el-button>
      </el-form-item>
      </el-form>
    </div>

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
        prop="advertId"
        label="广告编号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="advertName"
        label="广告名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="advertUrl"
        label="广告地址"
        width="234">
      </el-table-column>

    
      <el-table-column
        prop="advertImgUrl"
        label="广告图"
        width="220">
        <template slot-scope="scope">
            <!-- 当前作用域scope获取当前行的数据  prop="swiperurl"==scope.row.newsState
              可以获取当前行的数据信息
              -->
          <img class="img" :src="scope.row.advertImgUrl.slice(2,scope.row.advertImgUrl.length-2)"></img>
        </template>
      </el-table-column>

      <el-table-column
        width="105"
        prop="advertTime"
        label="创建时间"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{dayjs(scope.row.advertTime).format('YYYY-MM-DD HH:mm:ss')}}
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
    <el-dialog :title="title +'广告'" :visible.sync="dialogFormVisible" :destroy-on-close="isClosedialog">
      <el-form :model="form" :rules="rules" ref="advertForm">
        
        <el-form-item label="广告名" :label-width="formLabelWidth" prop="advertName">
          <el-input v-model="form.advertName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告地址" :label-width="formLabelWidth" prop="advertUrl">
          <el-input v-model="form.advertUrl" autocomplete="off"></el-input>
        </el-form-item>    

        <el-form-item label="广告图" prop="advertImgUrl"  :label-width="formLabelWidth">
          <UploadImg @sendImage="sendImage" :fileList="fileList" :url="url"></UploadImg>
        </el-form-item>

        <el-form-item label="创建时间" :label-width="formLabelWidth" prop="advertTime">
          <el-date-picker
            v-model="form.advertTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CanceldialogForm">取 消</el-button>
        <el-button type="primary" @click="dialogAddType('advertForm')" >确 定</el-button>
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
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）

//时间格式化
import dayjs from 'dayjs'
import Pagination from '@/components/Pagination'
//上传图像
import {advertImgUpload} from '@/api/base'
import { mapState } from "vuex";
export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    Pagination
  },
  data  () {
// 这里存放数据
    return {
      url:advertImgUpload,
      formInline:{
        advertName:'',

      },
      //添加/编辑对话框数据
      form:{
        advertName:"",
        advertTime:'',
        advertUrl:'',
        advertImgUrl:''
      },
      rules:{
        advertName: [
            { required: true, message: '请输入广告名', trigger: 'blur' },
            
        ],

        advertImgUrl:[
          { required: true, message: '请上传广告图', trigger: 'blur' },
        ],

        advertTime:[
           { required: true, message: '请选择时间', trigger: 'blur' },
        ],
        advertUrl:[
          { required: true, message: '请上输入广告地址', trigger: 'blur' },
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

      //批量删除advertIds
      advertIds:[],

      dialogFormVisible: false, //对话框是否显示
      formLabelWidth: '120px', //对话框文字宽度
      isClosedialog:false, //关闭对话框时，销毁对话框元素
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
      this.form.advertImgUrl = imgUrl;
    },
      //表格选中
    changeTable(selection) {
      //选择的数据集合
      console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.advertId)
      })
      this.advertIds = arr
      console.log('advertIds',this.advertIds);
    },
    //点击当前页码
    handleCurrentChange(page) {
      //默认新闻列表分页数据
      this.currentPage = page
      this.getAdvertList({page:page, pageSize:this.pageSize})
    },
    //点击每页数量
    handleSizeChange(pageSize) {
      this.getAdvertList({page:this.currentPage, pageSize:pageSize})
    },

    //点击当前行编辑
    handleEdit(index, row) {
      console.log('编辑当前行数据',row);
      this.$store.commit('getchangeTile','编辑')
      //获取当前行数据
      this.dialogFormVisible = true;
      if(this.title == '编辑') {
        this.preName = row.advertName
        this.form = row
        let imgs = JSON.parse(row.advertImgUrl)
        this.form.advertImgUrl = imgs
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
    //删除单个advert
    handleDelete(index,row) {
      this.$confirm('此操作将永久删除该广告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          this.delectSingleAdvertList(row.advertId)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除单个新闻列表请求方法
    async delectSingleAdvertList(advertId) {
      let res = await this.$api.delectSingleAdvertList(advertId)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        //上传成功，更新状态
        this.getAdvertList({page:this.currentPage,pageSize:this.PageSize})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      //console.log('删除单个新闻', res)
    },
    //搜索
    onSearch() {
      // 筛选新闻标题
      //console.log(this.formInline.typeName)
      if(this.formInline.advertName) {
        this.$api.getAdvertListByName(this.formInline.advertName).then(res => {
          if(res.code == 200) {
            console.log(res.newslist);
            //查询成功
            this.listTotal = res.newslist
            if(res.newslist.length > 10) {
              this.tableData = res.newslist.slice(0, 10)
              //修改分页状态
              this.serchStatus = true
            } else {
              this.tableData = res.newslist
            }
          
            this.total =  res.newslist.length
            this.pageSize = 10
            this.$message({
            message: '查询成功',
            type: 'success'
           });
          } else {
           //查询的新闻标签不存在，无数据
            this.tableData = []
            this.total = 0
          }
           
        })
        
      }
    },

    //点击添加管理员
    AddAdvertList() {
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
      this.getAdvertList({page: this.currentPage,pageSize:this.pageSize})
    },
      //添加添加/编辑方法
    dialogAddType(formName) {
      this.$refs[formName].validate(async (valid) => {
       if (valid) {
          //添加功能
          //console.log(this.form);
          var {advertName,advertUrl,advertImgUrl,advertTime,advertId} = this.form
          var advertTime =dayjs(this.form.advertTime).format('YYYY-MM-DD HH:mm:ss')
          var advertImgUrl = JSON.stringify(this.form.advertImgUrl)
          if(this.title=="添加") {
            //添加添加用户
            
            
            let res =  await this.$api.addAdvertList(advertName,advertUrl,advertImgUrl,advertTime)
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
            let res =  await this.$api.updateAdvertList(advertName,advertUrl,advertImgUrl,advertTime,advertId,this.preName)
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
          this.getAdvertList({page:this.currentPage,pageSize:this.pageSize})
          //关闭对话框
          this.dialogFormVisible = false
          this.isClosedialog = true
       } else {
           console.log('error submit!!');
          return false;
       }

      })
    },
    //批量删除管理员

    delectSomeAdvertList() {
      //接口delectSomeUserList
      //1.先获取userIds
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //执行删除操作
        //console.log(this.typeIds);
        this.$api.delectSomeAdvertList(this.advertIds.join(',')).then(res => {
          if(res.code == 200) {
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //更新视图
          this.getAdvertList({page: this.currentPage,pageSize:this.pageSize})
                
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

    //请求获取广告列表数据
    async getAdvertList(params) {
      let res = await this.$api.getAllAdvertList(params)
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
    this.getAdvertList({pageSize:3})
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.advertlist {
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