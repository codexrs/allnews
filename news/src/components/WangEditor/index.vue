<template>
   <div style="border: 1px solid #ccc;">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="height: 300px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="onCreated" @onChange="onChange" />
    </div>
    
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'
//batchUpload 上传接口
//import axios from 'axios'
export default {
    props: ['editorData'],
    components: { Editor, Toolbar },
    watch: {
        //监听内容是否改变
        editorData(val) {
            console.log('------------------------', val);
            this.$nextTick(() => {
                // this.html = val;
                //方法2：操作editor 方法 获取值getHtml()  设置值sethtml()
                console.log('------------------------', this.editor);
                setTimeout(()=>{
                    console.log('------------------------', this.editor);
                    this.editor.setHtml(val)
                },0)
            })
        }
    },
    data() {
        return {
            editor: null,
            //用户输入的信息html
            html: '',
            //
            toolbarConfig: {
                //toolbarKeys-重新配置工具栏，显示哪些菜单，以及菜单的排序、分组
                // toolbarKeys: [
                //     'headerSelect', 'bold', 'underline', 'italic', 'color', 'bgColor', 'fontSize', 'fontFamily', 'lineHeight', 'bulletedList', 'numberedList', 'todo', '|', 'emotion', 'uploadImage',
                //      'insertLink', 'insertTable', 'codeBlock', 'divider','fullScreen',
                // ],
                //隐藏的菜单栏
                // excludeKeys:['headerSelect', 'blockquote', '|', 'bold', 'underline','group-justify']
            },
            editorConfig: { placeholder: '请输入内容...', MENU_CONF: {} },
            mode: 'default', // or 'simple'
            // mode: 'simple', // or 'simple'
        }
    },
    methods: {
      //wangeditor的生命周期，自动调用
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
            //console.log(' 一定要用 Object.seal() ，否则会报错');
        },
        onChange(editor) {
          //实时触发每输入都会触发
            // console.log('onChange--------');
            // console.log('onChange-----------查看导航栏所有菜单项-重新配置工具栏，显示哪些菜单，以及菜单的排序、分组-');
            // const toolbar = DomEditor.getToolbar(editor)
            // console.log(toolbar.getConfig().toolbarKeys);
            // console.log('编译器输入的值:',this.html);
            // console.log('-----',this.editor.getHtml());
            this.$emit('sendEditor', this.html)
        },
        // onBlur(){
        //     //失去焦点---认为你书写完毕--发送给父组件
        // }
        clear() {
            //console.log('清空编译器----------------');
            //清空编译器
            this.html = '';
            this.$message({
            message: '重置成功',
            type: 'success'
            });
            // this.editor.clear();
        },
        //上传图片
        uploadImg() {
            let that=this;
            this.editorConfig.MENU_CONF['uploadImage'] = {
                // 自定义上传
                maxFileSize:1 * 1024 *1024, //1M
                maxNumberOfFiles:10,  //最多上传文件个数
                async customUpload(file, insertFn) {                   // JS 语法
                    // file 即选中的文件 <input type='file'/>
                    //表单上传文件时 multipart/form-data 
                    let formData = new FormData()
                    formData.append("file", file);//file 后台接受变量字段 file 
                    //网络请求---------------------------
                    // console.log('this-----',that);
                    //console.log(formData);
                    let res = await that.$api.batchUpload(formData)
                    console.log(res.data);
                    let { url, alt, href } = res.data;
                    // 自己实现上传，并得到图片 url alt href
                    // 最后插入图片
                    insertFn(url, alt, href)
                },
                 

            }
        },
        uploadMv() {
           let that=this;
           this.editorConfig.MENU_CONF['uploadVideo'] = {
                // 自定义上传
                async customUpload(file, insertFn) {  // TS 语法
                    // async customUpload(file, insertFn) {                   // JS 语法
                    // file 即选中的文件
                    // 自己实现上传，并得到视频 url poster
                    // 最后插入视频
                    let formData = new FormData()
                    formData.append("file", file);//file 后台接受变量字段 file 
                    //网络请求---------------------------
                    // console.log('this-----',that);
                    //console.log(formData);
                    let res = await that.$api.batchUpload(formData)
                    console.log(res.data);
                    let { url } = res.data;
                    // 自己实现上传，并得到视频 url poster
                    
                    
                    insertFn(url)
                }
            }
        }

    },
    //vue组件生命周期函数--挂载组件完毕
    created() {
        //上传图片
        this.uploadImg(),
        //上传视频
        this.uploadMv()

    },
    mounted() {
        // 模拟 ajax 请求，异步渲染编辑器
        // setTimeout(() => {
        //     this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
        // }, 1500)
    },
    //销毁之前--清空编译器--优化---
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css">

</style>
