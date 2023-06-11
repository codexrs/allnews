<template>
<div class='sort'>
  <Breadcrumb></Breadcrumb>
  <!-- 新闻分类 -->
  <!-- 搜索筛选 -->
  <div class="header-serch">
    <el-form :inline="true" :model="formInline" class="user-serch" >
    <el-form-item label="新闻分类">
      <el-input size="small" v-model="formInline.typeName" placeholder="输入新闻分类"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form-item>
  
    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="AddNewsType">添加分类</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeTypeList">批量删除</el-button>
    </el-form-item>
    </el-form>
  </div>

  <!-- 类型列表 -->
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
      prop="typeId"
      label="新闻分类编号"
      width="150">
    </el-table-column>
    <el-table-column
      prop="typeName"
      label="新闻分类名称"
      width="250">
    </el-table-column>
  
    <el-table-column
      prop="newsDate"
      label="创建时间"
      width="250"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{dayjs(scope.row.newsDate).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="320">
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
    <el-dialog :title="dialogName +'新闻分类'" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="sortForm">
        <!-- <el-form-item label="新闻分类编号" :label-width="formLabelWidth" prop="typeId">
          <el-input v-model="form.typeId" autocomplete="off" :disabled="dialogName=='编辑'"></el-input>
        </el-form-item> -->
        <el-form-item label="新闻分类名称" :label-width="formLabelWidth" prop="typeName">
          <el-input v-model="form.typeName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新闻分类时间" :label-width="formLabelWidth" prop="typeDate">
          <el-date-picker
            v-model="form.typeDate"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddType('sortForm')" >确 定</el-button>
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
//分页器
import Pagination from '@/components/Pagination'
//时间格式化
import dayjs from 'dayjs'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    Pagination
  },
  data() {
    return {
      //总条数
      total:10,
      //每页数据量
      pageSize:10,
      //当前页码
      currentPage:1,
      //选择每页数据量
    
      PageSizes:[10,20,30,40],
      serchStatus:false,  //搜索状态
      //搜索查询的所有数据
      listTotal:[],
      //输入搜索数据
      formInline: {
        typeName: '',
      },
      //列表数据
      tableData: [],

      //对话框
      form: {
          //typeId:'',
          typeName:'',
          typeDate:''
      },
      dialogFormVisible: false, //对话框是否显示
      formLabelWidth: '120px', //对话框文字宽度
      //批量删除的typeIds 集合
      typeIds:[],

      //判断对话框是在 添加 还是 在编辑
      dialogName:'',

      rules:{
        // typeId: [
        //     { required: true, message: '请输入新闻分类编号', trigger: 'blur' },
        //     { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        // ],
        typeName:[
           { required: true, message: '请输入新闻分类名称', trigger: 'blur' },
        ],
        typeDate:[
          { required: true, message: '请选择时间', trigger: 'blur' },
        ]
      }


        
    }
  },
  methods: {
    dayjs,
      //选择表格
    changeTable(selection) {
      //选择的数据集合
      //console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.typeId)
      })
      this.typeIds = arr
      //console.log('newsIds',this.typeIds);
    },
    //
    handleCurrentChange(page) {
      //console.log('111',page)
      if(this.serchStatus) {
        //点击了查询按钮--搜索数据-再点击分页
        this.tableData = this.listTotal.slice((page -1)*10, page*10)

        return ;
      }
      console.log(page);
      //默认新闻列表分页数据
      this.currentPage = page
      this.getTypeData({page:page, pageSize:this.pageSize})


    },
    //每页数据量
    handleSizeChange(pageSize) {
      if(this.serchStatus) {
        //console.log(pageSize)
        //点击了查询按钮--搜索数据--在点击每页数据量
        this.pageSize = pageSize
        if(pageSize > this.listTotal.length) {
          //如歌每页数量大于搜索的数量，直接渲染
          this.tableData = this.listTotal
        } else {
          //如每页数量小于搜索数量，需要分页渲染
          this.tableData = this.listTotal.slice((pageSize -10)*10, pageSize)
        }
        return ;
      }
      console.log('222',pageSize)
      
      this.getTypeData({page: this.currentPage,pageSize:this.pageSize})
    },
    //搜索功能
    onSearch() {
      // 筛选新闻标题
      //console.log(this.formInline.typeName)
      if(this.formInline.typeName) {
        this.$api.getTypeListByName(this.formInline.typeName).then(res => {
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
    //编辑新闻分类
    handleEdit(index, row) {
      //console.log('submit!');
      //获取当前行数据
      this.dialogFormVisible = true;
      this.form = row  //赋值给对话框
      this.dialogName="编辑"
    },
    //删除单个分类
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该新闻分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          console.log(row.typeId);
          this.delectSingleTypeList(row.typeId)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除单个新闻分类列表请求方法
    async delectSingleTypeList(typeId) {
      let res = await this.$api.delectSingleTypeList(typeId)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        this.getTypeData({page:this.currentPage,pageSize:this.pageSize})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      
    },


    //获取新闻类别数据
    getTypeData(params) {
      this.$api.getTypeData(params).then(res => {
        if(res.code == 200) {
          this.tableData = res.newslist;
          this.total = res.total;
          this.pageSize = res.pageSize;
          this.currentPage = res.page
          console.log(res)
      } else {
          console.log('请求新闻列表数据出错')
        }  
      })
    },
    //点击添加按钮
    AddNewsType() {
      //清除之前的对话框内容
      this.form= {},
      //添加页面
      this.dialogName="添加"
      //打开对话框
      this.dialogFormVisible = true
    },
    //添加添加/编辑分类方法
    dialogAddType(formName) {
      //添加功能 sortForm
      this.$refs[formName].validate(async (valid) => {
      if (valid) {
        if(this.dialogName=="添加") {
          //添加新闻分类
          let time =dayjs(this.form.typeDate).format('YYYY-MM-DD HH:mm:ss')
          //console.log(time);
          let res =  await this.$api.addTypeList(this.form.typeId,this.form.typeName,time)
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
            this.getTypeData({page:this.currentPage,pageSize:this.pageSize})

          } else {

            this.$message.error('上传失败');
          }
          
        } else {
          //编辑功能
          //清空删除对话框内容
          
            let time =dayjs(this.form.typeDate).format('YYYY-MM-DD HH:mm:ss')
            //console.log(time);
            let res =  await this.$api.updateTypeList(this.form.typeId,this.form.typeName,time)
            if(res.code == 304) {
              this.$message({
                message: res.msg,
                type: 'warning'
              });
              //上传成功，更新状态
              
            }
            else if(res.code == 200) {
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              //上传成功，更新状态
              this.getTypeData({page:this.currentPage,pageSize:this.pageSize})

            } else {

              this.$message.error('上传失败');
            }
          
        }
        //关闭对话框
        this.dialogFormVisible = false
      } else {
      
          console.log('error submit!!');
          return false;
      
       }
      });
  },
  
  //批量删除
  // 批量删除新闻
  delectSomeTypeList() {
    //接口delectSomeNewsList
    //1.先获取typeIds
    this.$confirm('此操作将永久删除该新闻分类, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      //执行删除操作
      //console.log(this.typeIds);
      this.$api.delectSomeTypeList(this.typeIds.join(',')).then(res => {
        if(res.code == 200) {
          this.$message({
          type: 'success',
          message: '删除成功!'
        });
        //更新视图
        this.getTypeData({page: this.currentPage,pageSize:this.pageSize})
              
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
    }
  },
// 监听属性 类似于data概念
  computed: {},
// 监控data中的数据变化
  watch: {},


// 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    //获取新闻类别数据
    this.getTypeData({page: 1,pageSize:10})
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {
    //获取新闻分类数据

  },

}
</script>
<style lang='less' scoped >
// @import url(); 引入公共css类
// @import url(); 引入公共css类
.sort {
  padding:10px;
  
  .header-serch {
    
    width:100%;
    background:#fff;
    border-radius:10px;
    padding:20px;
    margin-top:10px;
    .el-form-item{
      margin-bottom: 0;
    }
  }.list-table {
    margin-top: 10px;
  }
  .img{
    width:200px;
    height:100px;
  }
}

</style>