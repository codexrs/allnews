<template>
<div class='swiper'>
  <Breadcrumb></Breadcrumb>
  <!-- 新闻分类 -->
  <!-- 搜索筛选 -->
  <div class="header-serch">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="AddNewsType">添加</el-button>
      <el-button size="small" type="danger" icon="el-icon-delete" @click="delectSomeSwiperList">批量删除</el-button>  
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
      prop="swiperId"
      label="轮播图编号"
      width="150">
    </el-table-column>

    <el-table-column
      prop="swiperIndex"
      label="轮播图排序编号"
      width="150">
    </el-table-column>
    
    <el-table-column
      prop="swiperurl"
      label="轮播图"
      width="320">
      <template slot-scope="scope">
          <!-- 当前作用域scope获取当前行的数据  prop="swiperurl"==scope.row.newsState
            可以获取当前行的数据信息
            -->
        <img class="img" :src="scope.row.swiperurl.slice(2,scope.row.swiperurl.length-2)"></img>
      </template>
    </el-table-column>



    <el-table-column
      prop="swipertime"
      label="创建时间"
      width="220"
      show-overflow-tooltip>
      <template slot-scope="scope">
        {{dayjs(scope.row.swipertime).format('YYYY-MM-DD HH:mm:ss')}}
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
    <el-dialog :title="title +'轮播图'" :visible.sync="dialogFormVisible" :destroy-on-close="isClosedialog">
      <el-form :model="form" :rules="rules" ref="swiperForm">
        <el-form-item label="轮播图排序编号" :label-width="formLabelWidth" prop="swiperIndex">
          <el-input v-model="form.swiperIndex" autocomplete="off"></el-input>
        </el-form-item>
      

        <el-form-item label="轮播图" prop="swiperurl"  :label-width="formLabelWidth" >
          <UploadImg @sendImage="sendImage" :fileList="fileList" :url="url"></UploadImg>
        </el-form-item>

        <el-form-item label="创建时间" :label-width="formLabelWidth" prop="swipertime">
          <el-date-picker
            v-model="form.swipertime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CanceldialogForm">取 消</el-button>
        <el-button type="primary" @click="dialogAddType('swiperForm')" >确 定</el-button>
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
//上传图片
import {swiperImgUpload} from '@/api/base'
//分页器
import Pagination from '@/components/Pagination'
//时间格式化
import dayjs from 'dayjs'
import { mapState } from "vuex";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    Pagination,
  
  },
  data() {
    return {
      url:swiperImgUpload,
      //总条数
      total:3,
      //每页数据量
      pageSize:3,
      //当前页码
      currentPage:1,
      //选择每页数据量
    
      PageSizes:[3,5,7,10],
      
      //搜索查询的所有数据
      listTotal:[],
    
      //列表数据
      tableData: [],

      //对话框
      form: {
          swiperIndex:'',
          swiperurl:'',
          swipertime:''
      },
      rules:{
        swiperIndex: [
            { required: true, message: '请输入轮播图排序编号', trigger: 'blur' },
            
        ],
        swiperurl:[
           { required: true, message: '请上传轮播图', trigger: 'blur' },
        ],
        swipertime:[
          { required: true, message: '请选择时间', trigger: 'blur' },
        ]
      },
      dialogFormVisible: false, //对话框是否显示
      formLabelWidth: '140px', //对话框文字宽度
      //批量删除的typeIds 集合
      swiperIndexs:[],

      //判断对话框是在 添加 还是 在编辑
      //dialogName:'',

      fileList:[], //上传图片容器

      isClosedialog:false //关闭时销毁 Dialog 中的元素
    }
  },
  computed:{
    //当前行新闻数据
    ...mapState({
      swiperData:(state) => state.swiper.swiperData
    }),
    //添加/编辑
    ...mapState({
      title:(state) => state.news.title
    }),
  },
  methods: {
    //对话框点击取消
    CanceldialogForm() {
      this.dialogFormVisible = false;
      //更新数据
      this.getSwiperData({page: this.currentPage,pageSize:this.pageSize})
    },
    sendImage(imgUrl) {
      this.form.swiperurl = imgUrl;
    },
    dayjs,
      //选择表格
    changeTable(selection) {
      //选择的数据集合
      //console.log('selection',selection);
      let arr = []
      selection.forEach(ele => {
        arr.push(ele.swiperIndex)
      })
      this.swiperIndexs = arr
      //console.log('newsIds',this.typeIds);
    },
    //点击页码
    handleCurrentChange(page) {
      //console.log('111',page)

      //默认新闻列表分页数据
      this.currentPage = page
      this.getSwiperData({page:page, pageSize:this.pageSize})


    },
    //每页数据量
    handleSizeChange(pageSize) {
      
      this.getSwiperData({page: this.currentPage,pageSize:pageSize})
    },
    //点击添加按钮
    AddNewsType() {
      //清除之前的对话框内容
      this.$store.commit('getchangeTile','添加')
      this.form= {}
      this.fileList = []
      //添加页面
      //this.dialogName="添加"
      //打开对话框
      this.dialogFormVisible = true
      
    },
    //点击编辑轮播图
    handleEdit(index, row) {
      //console.log('编辑当前行数据',row);
      this.$store.commit('getchangeTile','编辑')
      //获取当前行数据
      this.dialogFormVisible = true;
      if(this.title == '编辑') {
        this.form = row
        let imgs = JSON.parse(row.swiperurl)
        this.form.swiperurl = imgs
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
      //this.form.swiperurl = JSON.stringify(row.swiperurl)
      //this.dialogName="编辑"
    },
    //删除单个分类
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //执行删除操作
          console.log(row.swiperIndex);
          this.delectSingleSwiperList(row.swiperIndex)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除单个新闻分类列表请求方法
    async delectSingleSwiperList(swiperIndex) {
      
      let res = await this.$api.delectSingleSwiperList(swiperIndex)
      if(res.code == 200) {
        //删除成功
        this.$message({
            type: 'success',
            message: '删除成功!'
        });
        //更新数据
        this.getSwiperData({page:this.currentPage,pageSize:this.pageSize})
      } else {
        //删除失败
        this.$message.error('删除失败');
      }
      
    },


    //获取新闻类别数据
    async getSwiperData(params) {
      let res = await this.$api.getSwiperData(params)
      if(res.code == 200) {
          this.tableData = res.newslist;
          //图片显示
          this.total = res.total;
          this.pageSize = res.pageSize;
          this.currentPage = res.page
          //console.log(res)
      } else {
        console.log('请求新闻列表数据出错')
      }  
      
    },

    //添加添加/编辑方法
    dialogAddType(formName) {
      this.$refs[formName].validate(async (valid) => {
      if (valid) {
        //添加功能 
        var swiperurl = JSON.stringify(this.form.swiperurl)
        console.log('添加的轮播图url',swiperurl)
        var time =dayjs(this.form.swipertime).format('YYYY-MM-DD HH:mm:ss')
        var swiperIndex = this.form.swiperIndex
        var swiperId = this.form.swiperId
        if(this.title=="添加") {
          //添加新闻分类
          
          //console.log(time);
          let res =  await this.$api.addSwiperList(swiperIndex,swiperurl,time)
          if(res.code == 304) {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
            this.getSwiperData({page: this.currentPage,pageSize:this.pageSize})
        }
        else if(res.code == 200) {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          //上传成功，更新状态
          this.getSwiperData({page:this.currentPage,pageSize:this.pageSize})
          
          this.fileList = []
        } else {

          this.$message.error('上传失败');
        }
        
        
      } else {
        //编辑功能
         //
          //let time =dayjs(this.form.swipertime).format('YYYY-MM-DD HH:mm:ss')
          //console.log(time);
          //swiperurl = this.form.swiperurl

          let res =  await this.$api.updateSwiperList(swiperIndex,swiperurl,time,swiperId)
          if(res.code == 304) {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
            this.getSwiperData({page: this.currentPage,pageSize:this.pageSize})
          }
          else if(res.code == 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            });
            //上传成功，更新状态
            this.getSwiperData({page:this.currentPage,pageSize:this.pageSize})
            this.form = {}
            this.form.swiperurl = ""
            this.fileList = []
          } else {

            this.$message.error('上传失败');
          }
         
        
      }
      
      //关闭对话框
      this.dialogFormVisible = false
      //关闭时销毁 Dialog 中的元素
      this.isClosedialog = true
    }else {
        console.log('error submit!!');
        return false;
       }
    })
  },
  
  //批量删除
  // 批量删除新闻
  delectSomeSwiperList() {
    //接口delectSomeNewsList
    //1.先获取typeIds
    this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      //执行删除操作
      //console.log(this.typeIds);
      this.$api.delectSomeSwiperList(this.swiperIndexs.join(',')).then(res => {
        if(res.code == 200) {
          this.$message({
          type: 'success',
          message: '删除成功!'
        });
        //更新视图
        this.getSwiperData({page: this.currentPage,pageSize:this.pageSize})
              
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

// 监控data中的数据变化
  watch: {},


// 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    //获取新闻类别数据
    this.getSwiperData({page: 1,pageSize:3})
    
    
  },
// 生命周期 - 挂载完成（可以访问DOM元素）
  mounted  () {
  
    // //获取分swiper数据
    // if(this.title == '编辑') {
    //   //获取仓库newsData数据回显
    //   this.form = this.swiperData

    //   //解析图片字段,转为数组[]
    //   let imgs = JSON.parse(this.swiperData.swiperurl); //[] [""] ["",""]
    //   //修改上传图片，图片为数组格式
    //   this.form.swiperurl = imgs //获取vuex里面数组 转成数组语法
    //   console.log('解析图片字段',imgs)
    //   let arr = []
    //   //[{url:''},{ur:''l}]
    //   imgs.forEach(ele => {
    //     let obj = {}
    //     obj.url = ele
    //     arr.push(obj)
    //   })
    //   //将图片容器传给uploadImg
    //   this.fileList = arr;
    // }

    
  },

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.swiper {
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
  .img{
    width:200px;
    height:100px;
  }
}

</style>