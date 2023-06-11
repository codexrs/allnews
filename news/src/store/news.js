export default {
    state: {
        //新闻类别数据
        newstypeList:[],
    
        //当前行新闻数据
        newsData:{},
        //
        title:'添加',
        //当前新闻分类，默认首页
        newsType:'首页',

        //搜索新闻关键词
        keyword:""
    
    },
    //里面定义方法，操作state方发
  mutations: {
    getnewstypeList(state,typeList) {
      state.newstypeList = typeList
    },

    getchangeTile(state,title) {
      state.title = title
    },
    getnewsDate(state, newsData) {
      state.newsData = newsData
    },
    getnewsType(state,newsType) {
      state.newsType = newsType
    },
    getkeyword(state,keyword) {
      state.keyword = keyword
    }



  },

}