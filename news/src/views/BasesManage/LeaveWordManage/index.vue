<template>
<div class='leaveword'>
  <Breadcrumb></Breadcrumb>

  <div class="header-serch">
    <el-form :inline="true" :model="formInline" class="user-serch">
    <el-form-item label="留言内容">
      <el-input size="small" v-model="formInline.leavewordContent" placeholder="输入留言内容"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form-item>
  
    <el-form-item>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeLeaveWordList">批量删除</el-button>
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
      prop="leavewordId"
      label="id"
      width="50">
    </el-table-column>
    <el-table-column
      prop="leavewordContent"
      label="内容"
      width="250">
    </el-table-column>
    <el-table-column
      prop="leavewordEmail"
      label="邮箱"
      width="150">
    </el-table-column>

    <el-table-column
      prop="leavewordPhone"
      label="联系方式"
      width="150">
    </el-table-column>

    <el-table-column
      prop="leavewordTime"
      label="时间"
      width="250"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{dayjs(scope.row.leavewordTime).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="169">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>


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
  data  () {
// 这里存放数据
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
        leavewordContent: '',
      },
      //列表数据
      tableData: [],

      //批量删除的typeIds 集合
      leavewordIds:[],


        
    }
    
  },
// 监听属性 类似于data概念
  computed: {},
// 监控data中的数据变化
  watch: {},
// 方法集合
  methods: {
    dayjs,

    changeTable(selection) {
      //选择的数据集合
      //console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.leavewordId)
      })
      this.leavewordIds = arr
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
      this.getAllLeaveWordList({page:page, pageSize:this.pageSize})


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
      //console.log('222',pageSize)
      
      this.getAllLeaveWordList({page: this.currentPage,pageSize:pageSize})
    },


    //删除单个留言
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          //console.log(row.leavewordId)
          this.delectSingleLeaveWordList(row.leavewordId)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除单个新闻分类列表请求方法
    async delectSingleLeaveWordList(leavewordId) {
      let res = await this.$api.delectSingleLeaveWordList(leavewordId)
      console.log(res)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        this.getAllLeaveWordList({page:this.currentPage,pageSize:this.pageSize})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      
    },
    //批量删除
    delectSomeLeaveWordList() {
      //接口delectSomeNewsList
      //1.先获取typeIds
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //执行删除操作
        //console.log(this.typeIds);
        if(this.leavewordIds.length == 0) {
          this.$message({
            type: 'warning',
            message: '请选择!'
          });
          return ;
        }
        this.$api.delectSomeLeaveWordList(this.leavewordIds.join(',')).then(res => {
          if(res.code == 200) {
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //更新视图
          this.getAllLeaveWordList({page: this.currentPage,pageSize:this.pageSize})
                
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

    //搜索留言内容getLeaveWordListByContent
    //获取留言信息
    onSearch() {
      //console.log(this.formInline.leavewordContent)
      if(this.formInline.leavewordContent) {
        this.$api.getLeaveWordListByContent(this.formInline.leavewordContent).then(res => {
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
        
      } else {
        //没有输入搜索内容，默认请求全部数据
        this.getAllLeaveWordList()
      }
    },
    getAllLeaveWordList(params) {
      this.$api.getAllLeaveWordList(params).then(res => {
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
  },
// 生命周期 - 创建完成（可以访问当前this实例）
  created  () {
    this.getAllLeaveWordList({page:1,pageSize:10})
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {

  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.leaveword {
  padding:10px;
  
  .header-serch {
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
}
</style>