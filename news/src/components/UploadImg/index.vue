<template>
<div>
  <!-- 
    必选 action上传地址
    list-type文件列表类型 文件列表的类型	string	text/picture/picture-card
    on-preview点击文件列表中已上传的文件时的钩子 function(file)
    on-remove	文件列表移除文件时的钩子 function(file, fileList)
    on-success	文件上传成功时的钩子 	function(response, file, fileList)	
    on-error 文件上传失败时的钩子 	function(err, file, fileList)	
    on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList)
    auto-upload	是否在选取文件后立即进行上传	boolean	—	true
    limit 上传图片个数现在
    on-exceed	文件超出个数限制时的钩子	function(files, fileList)
   
    before-remove	删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false
     或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    multiple	是否支持多选文件	boolean 默认true

    disabled	是否禁用
    on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList)
    
    file-list	上传的文件列表
   
   -->
  <el-upload
    :action="url"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    ref="uploadImg"
    :limit="limit"
    :on-exceed="handleExceed"
    multiple
    :on-change="handleOnChange"
    :file-list="fileList"
    >
    <i class="el-icon-plus"></i>
  </el-upload>

  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <div v-if="isShow" slot="tip" class="el-upload__tip">只能上传不超过{{limit}}张</div>
  <!-- <el-button type="primary" @click="submitUpload">点击上传</el-button> -->
</div>

</template>

<script>
//导入上传新闻图片地址 //导入轮播图地址/用户头像地址


export default {
// import引入的组件需要注入到对象中才能使用
  components: {},
  props:{
    fileList:{
      type:Array,
      default:function() {
        return []
      }
    },
    url:{
      type:String,
      default:""
    },
    limit:{
      type:Number,
      default:1
    }
  },


  data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        //url:newImgUpload,
        
        isShow:false,
        //上传图片集合
        imgList:[],
        //图片列表容器，数据格式[{url:''},{}]
        //fileList: []
        
        
      };
    },
    methods: {
      //禁止自动上传， 手动进行上传数据库
      submitUpload(){
        this.$refs.uploadImg.submit()
        //console.log(this.imgList);
      },
      //删除文件之前的钩子，参数为上传的文件和文件列表
      handleRemove(file, fileList) {
        //console.log(file.url, fileList);
        this.isShow = false;
        for(let i = 0; i < this.fileList.length; i++) {
          if(this.fileList[i].url == file.url) {
            this.fileList.splice(i, 1)
          }
        }  
        this.imgList = this.fileList
        console.log(this.imgList)

      },
      //点击文件列表中已上传的文件时的钩子
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //上传成功
      handleSuccess(response, file, fileList) {
        console.log('成功函数', response,file,fileList);
        //保存上的图片列表
        //this.fileList = fileList
        //图片路径  response.url
        //this.imgList.push(response.url)
        //this.imgList = Array.from(new Set(this.imgList));
        //发送给父组件
        fileList.forEach(item => {
          this.imgList.push(item.response.url)
        })
        //console.log(this.imgList)
        this.$emit('sendImage',this.imgList)
      },
      //文件超出个数限制的钩子函数
      handleExceed(files, fileList) {
        //文件超出个数限制的钩子函数
        this.isShow = true
      },
      //文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      handleOnChange() {
        this.isShow = false
      }
    }

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.el-upload__tip {
  color:red;
}
</style>