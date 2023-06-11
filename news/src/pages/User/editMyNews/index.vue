<!-- 添加新闻 -->
<template>
<div class='addnews'>
  <!-- 
    :model="ruleForm 表单数据 object
    :rules="rules" 校验规则
    ref="ruleForm" 获取组件form组件DOM
    label-width="100px" 标题所占据宽度
    prop="name"字段标识  -ui内置方法

   -->
  <h2>编辑我的新闻</h2>
  <el-form :model="newsForm" :rules="rules" ref="newsForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="新闻标题" prop="newsTitle">
    <el-input v-model="newsForm.newsTitle" ></el-input>
  </el-form-item>
  <el-form-item label="新闻类别">
    <el-select v-model="newsForm.newsType" placeholder="请选择新闻类别" prop="newsType">
      <el-option v-for="type in typeList" :label="type.typeName" :value="type.typeName" :key="type.typeId"
      ></el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="关键词" prop="keyword">
      <el-input v-model="newsForm.keyword"></el-input>
  </el-form-item>
  
  <el-form-item label="图片上传" prop="newsImg">
    <UploadImg @sendImage="sendImage" :fileList="fileList" :url="url"></UploadImg>
  </el-form-item>
   
   <el-form-item label="新闻内容" prop="newsContent">
    <!-- 富文本编译器 -->
        <wangeditor ref="myeditor" :editorData="editor" v-model="newsForm.newsContent" @sendEditor="sendEditor" :isClear='isClear' ></wangeditor>
  </el-form-item>
   
  <el-form-item>
    <el-button type="primary" @click="submitForm('newsForm')">保存</el-button>
  
    <el-button v-if="isShow" @click="goBack">取消并返回</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
//时间格式化
import dayjs from 'dayjs'
//获取上传新闻图片路径
import {newImgUpload} from '@/api/base'
import { mapState } from "vuex";
//import UploadImg from './UploadImg.vue'
//富文本
//import wangeditor from './wangeditor.vue'
export default {
// import引入的组件需要注入到对象中才能使用
  components: {
    //UploadImg,全局引入
    //wangeditor
  },
  data  () {
// 这里存放数据
    return {
      url:newImgUpload, //传递图片路径
      isClear: false,
      isShow:true,
      fileList:[], //图片容器
      editor:'', //富文本内容
      //新闻详情
      newsdetail:{},

      newsForm: {
          newsId:'',
          newsTitle: '',
          newsType: '',
          newsTime: '',
          newsImg: [],
          keyword: '',
          newsContent: '',
          newsCollection:'0',
          newsLikeNum:'0',
          newsWatch:'0'
        },
        rules: {
          newsTitle: [
            { required: true, message: '请输入新闻标题', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          newsType: [
            { required: true, message: '请输入新闻类别', trigger: 'change' }
          ],
          newsTime: [
            {  required: true, message: '请选择日期', trigger: 'change' }
          ],
          keyword: [
            {  required: true, message: '请选输入关键词', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          newsCollection: [
            { required: true, message: '请选输入收藏人数', trigger: 'blur' },
            
          ],
          newsLikeNum: [
            { required: true, message: '请选输入点赞人数', trigger: 'blur' },
          
          ],
          newsWatch: [
            { required: true, message: '请选输入观看人数', trigger: 'blur' },
          
          ],
          
          newsImg: [
            { required: true, message: '请选择新闻图片', trigger: 'change' }
          ],
          newsContent: [
            { required: true, message: '请填写新闻内容', trigger: 'blur' }
          ]
        }
    }
  },
// 监听属性 类似于data概念
  computed: {
    //获取新闻分类
    ...mapState({
      typeList:(state)=>state.news.newstypeList
    }),
  },

// 方法集合
  methods: {
    //获取wangeditor输入的内容文本
    sendEditor(val) {
      //console.log(val)
      this.newsForm.newsContent = val
      
    },
    //回显新闻
    getNewsDetail() {
      //this.newsdetail= JSON.parse(this.$route.params.newslist)
      this.newsdetail = JSON.parse(sessionStorage.getItem('newslist'))
    },
    
    sendImage(imgUrl) {
      this.newsForm.newsImg = imgUrl
    },
    //提交 添加新闻/编辑新闻----两个功能
    submitForm(formName) {
      //console.log('获取表单输入的信息', this.newsForm);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //获取表单输入的信息
            //console.log('获取表单输入的信息', this.newsForm);
            //添加新闻  dayjs(scope.row.newsTime).format('YYYY-MM-DD HH:mm:ss')
            let newsTime = dayjs(this.newsForm.newsTime).format('YYYY-MM-DD HH:mm:ss');
            let userId = this.$route.params.userId
            
            //console.log(this.newsForm.newsImg);
            let {newsId,newsTitle,newsType,keyword,newsContent,newsCollection,newsWatch,newsLikeNum} =  this.newsForm
            //图片转为字符串格式
            let newsImg = JSON.stringify(this.newsForm.newsImg)
            //console.log('字符串格式',newsImg); {
            //编辑新闻
            let newsState = '0'  //需要重新审核
            this.$api.UpdateNewsList({
              newsState,userId,newsId,newsTitle,newsType,newsImg,newsTime,keyword,newsContent,newsCollection,newsWatch,newsLikeNum
            }).then(res=> {
              //添加成功，跳转新闻列表页面
              //提示
              if(res.code ==200) {
                this.$message({
                showClose: true,
                message: '修改成功,审核当中',
                type: 'success'
              })

              this.$router.push('/userHome')
              } else {
                this.$message({
                  showClose: true,
                  message: '新闻修改失败',
                  type: 'error'
                });
              }
              //console.log(res)
            })
            
            

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    
      goBack() {
        this.$router.back()
      }
  },
// 生命周期 - 创建完成（可以访问当前this实例）
  mounted () {
      this.getNewsDetail()
      this.newsForm = this.newsdetail
      
      //解析图片字段,转为数组[]
      let imgs = JSON.parse(this.newsdetail.newsImg); //[] [""] ["",""]
      //修改上传图片，图片为数组格式
      this.newsForm.newsImg = imgs //获取vuex里面数组 转成数组语法
      console.log('解析图片字段',imgs)
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

      //富文本回显
      //获取文本编译器数据
      this.editor = this.newsdetail.newsContent
      //将文本数据传给wnageeditor

    
  },

  
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.addnews {
  margin:0 auto;
  width: 1000px;
  background:#fff;
  padding:10px;
}
</style>