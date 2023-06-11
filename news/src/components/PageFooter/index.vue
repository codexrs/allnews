<template>
  <div class="footer">
    <div class="container">
      <div class="foot-main">
        <div class="foot-nav">
          <a>关于我们</a> |
          <a>业务联系</a> |
          <a>招聘信息</a>|
          <a>免责条款</a> |
          <a>隐私条例</a> |
          <a>版权所有</a> |
          <a>友情链接</a>
        </div><hr/>
        <p class="p">
          
          <a>编辑声明:</a>
          <a>本网站所收集的部分公开资料来源于互联网，转载的目的在于传递更多信息及用于网络分享，并不代表本站赞同其观点和对其真实性负责，也不构成任何其他建议。本站部分作品是由网友自主投稿和发布、编辑整理上传，对此类作品本站仅提供交流平台，不为其版权负责。
          如果您发现网站上有侵犯您的知识产权的作品，请与我们取得联系，我们会及时修改或删除。</a>
          <br />
          
        </p>
        <p>
          <hr/>
          <a>联系方式:</a>
          020-38814589
          <a>网上传播视听节目许可证 编号：2304068</a> 发证机关：广东新闻总局
          <br />
           
          <a>版权所有 广告网  © Copyright 1998-2022</a> 广东新闻网版权所有
          <a>粤B2-20040750号</a>
          <br />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pagefooter",
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.footer {

  text-align: center;
  background-color: #3c3c3c;
  color: #ffffff;
  padding: 20px 0px;
  width: 100%;
  line-height: 30px;
  .p{
    width:60%;
    font-size:14px;
    margin-left:220px;
  }
  hr {
    width:80%;
    margin-left:100px;
  }
}
</style>