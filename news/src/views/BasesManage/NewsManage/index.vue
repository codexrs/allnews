<template>
<div class="newslist">
  <!-- 面包屑 -->
  <Breadcrumb></Breadcrumb>
  <!-- 搜索筛选 -->
  <div class="header-serch">
    <el-form :inline="true" :model="formInline" class="user-serch">
    <el-form-item label="新闻编号">
      <el-input size="small" v-model="formInline.newsId" placeholder="输入新闻编号"></el-input>
    </el-form-item>

    <el-form-item label="新闻标题">
        <el-input size="small" v-model="formInline.newsTitle" placeholder="输入新闻标题"></el-input>
    </el-form-item>

    <el-form-item>新闻类别
      <el-select size="small" v-model="formInline.newsType" placeholder="请选择">
        <el-option label="全部" value="allnewsList"></el-option>
          <el-option
            v-for="type in typeList"
            :label="type.typeName"
            :value="type.typeName"
            :key="type.typeId"
          ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    </el-form-item>
  
    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="AddNewsList">添加新闻</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeNewsList">批量删除</el-button>
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
      prop="newsId"
      label="新闻编号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="userId"
      label="用户编号"
      width="80">
    </el-table-column>
    <el-table-column
      prop="userIdentity"
      label="用户身份"
      width="100">
    </el-table-column>
    <el-table-column
      prop="userName[0].userName"
      label="用户姓名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="newsTitle"
      label="新闻标题"
      >
    </el-table-column>
    <el-table-column
      prop="newsType"
      label="新闻类别"
      width="80">
    </el-table-column>
    <el-table-column
      prop="newsLikeNum"
      label="点赞人数"
      width="80">
    </el-table-column>
    <el-table-column
      prop="newsWatch"
      label="观看人数"
      width="100">
    </el-table-column>
    <el-table-column
      prop="newsCollection"
      label="收藏人数"
      width="100">
    </el-table-column>
    <el-table-column
      prop="newsTime"
      label="创建时间"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{dayjs(scope.row.newsTime).format('YYYY-MM-DD HH:mm:ss')}}
      </template>
    </el-table-column>

    <el-table-column align="center" prop="newsState" label="审核状态" min-width="80">
        <template slot-scope="scope">
          <!-- 当前作用域scope获取当前行的数据  prop="newsState"==scope.row.newsState
            可以获取当前行的数据信息
            -->
          <el-switch
            active-value="1"
            inactive-value="0"
            :value="scope.row.newsState"
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
//面包屑--全局组件
//import Breadcrumb  from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'

//时间格式化
import dayjs from 'dayjs'

export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    Pagination,
    //Breadcrumb
  },
  data() {
    return {
      //搜索框数据
      formInline: {
        newsId:'',
        newsTitle:"",
        newsType:""
      },
      //新闻列表数据
      tableData: [],
      //总条数
      total:100,
      //每页数据量
      pageSize:6,
      //当前页码
      currentPage:1,
      //选择每页数据量
      PageSizes:[10,20,30,40],

      //搜索查询的所有数据
      listTotal:[],
      //搜索状态
      serchStatus: false,

      //新闻分类
      typeList:[],

      //批量删除newsIds
      newsIds:[]
    }
  },
  created() {
    //调用获取新闻列表数据:page:当前页码，pageSize:每页数据量，默认为8，两个参数可不传
    this.getNewList({pageSize:10})

    //获取新闻类别
    this.getNewsType1()
    
  },
  methods: {
    //添加新闻
    AddNewsList() {
      this.$store.commit('getchangeTile','添加')
      this.$router.push('/basesmanage/addnewslist')
    },
    //dayjs本身就是一个方法
    dayjs,
    //当前行的编辑
    /**
     * 1.点击编辑，获取当前row这一行数据信息
     * 2.跳转到编辑组件(和添加新闻组件同一个组件) 数据传递和title
     * 3.vuex存储数据和title
     */
    handleEdit(index, row) {
      console.log(index, row);
      //将当前行新闻数据，存储到vuex仓库中
      //和添加新闻页面共用一个组件
      this.$store.commit('getchangeTile','编辑')
      this.$store.commit('getnewsDate', row)
      this.$router.push('/basesmanage/addnewslist')
    },
    //当前行的删除
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          this.deleteSinggleNewsList(row.newsId)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    // 删除单个新闻列表请求方法
    async deleteSinggleNewsList(newsId) {
      let res = await this.$api.deleteSinggleNewsList(newsId)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        this.getNewList({page:this.currentPage,pageSize:10})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      //console.log('删除单个新闻', res)
    },

    //请求获取新闻列表数据
    async getNewList(params) {
      let res = await this.$api.getAdminNewList(params)
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
    //获取点击页码
    handleCurrentChange(page) {
      //console.log('111',page)
      if(this.serchStatus) {
        //点击了查询按钮--搜索数据-再点击分页
        this.tableData = this.listTotal.slice((page -1)*10, page*10)

        return ;
      }

      //默认新闻列表分页数据
      this.currentPage = page
      this.getNewList({page:page, pageSize:this.pageSize})


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
      
      this.getNewList({page: this.currentPage,pageSize:this.pageSize})
    },
    //搜索数据
    async onSearch() {
      //多条件查询
      //console.log(this.formInline,this.formInline.newsType,this.formInline.newsTitle)
      if(!this.formInline.newsId && !this.formInline.newsTitle && !this.formInline.newsType) {
        //三个输入框输入为空
         this.$message.error('错了哦，请输入内容再查询');
        
      }else {
        let res = await this.$api.getMoreNewsListSerch(this.formInline.newsId,this.formInline.newsType,this.formInline.newsTitle)
        if(res.code == 200) {
            console.log(res.newslist);
            //查询成功
            this.listTotal = res.newslist
          
            //渲染页面的数据大于10条
            if(res.newslist.length > 10) {
              this.tableData = res.newslist.slice(0, 10)
                //修改分页状态
                this.serchStatus = true
            }else {
              //搜索渲染数据不大于10的直接渲染
                this.tableData = res.newslist
              
              }
              this.total =  res.newslist.length
              this.pageSize = 10
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
    
    //获取新闻类别
    getNewsType1() {
      this.$api.getNewsType().then(res => {
        if(res.code == 200) {
          this.typeList = res.typelist
          //console.log(this.typeList)
          //将新闻类别存储在vuex中
          this.$store.commit('getnewstypeList', this.typeList)
        }
      })
      

    },
    async editType(index,row) {
      //编辑审核状态
      //console.log(index, row)
      //修改新闻审核状态
      let newsState = row.newsState
      if(newsState == "0") {
        newsState = "1"
        
      } else {
        newsState = "0"
      
      }
      //修改状态之后需要更新状态
      let res = await this.$api.updateNewsState(newsState, row.newsId)
      if(res.code == 200) {
        this.getNewList({page: this.currentPage,pageSize:this.pageSize})
      }
      //console.log((res));
      
      
      
    },
    // 批量删除新闻
    delectSomeNewsList() {
      //接口delectSomeNewsList
      //1.先获取newsIds
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          this.$api.delectSomeNewsList(this.newsIds.join(',')).then(res => {
            if(res.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //更新视图
              this.getNewList({page: this.currentPage,pageSize:this.pageSize})
              
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

    //选择表格
    changeTable(selection) {
      //选择的数据集合
      //console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.newsId)
      })
      this.newsIds = arr
      console.log('newsIds',this.newsIds);
    }
  }
  
}

</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.newslist {
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
}
</style>