# vue-purhase

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
校园新闻后台管理系统页面

pc前端页面：用户

pc后端页面：管理员-收费的-权限的

项目制作：

	2.开发对应的模块功能

	3.开发过程中--产品和需求文档

	4.前后端交互--接口连接网址/postman接口


项目搭建

	1.开启后端导入数据库操作

	2.搭建项目

		vue全家桶技术

项目安装依赖

1.安装vue create vue-purhase

2.npm i axios -S

3.npm i querystring -S

4.npm i echarts -S

40 vue add element-ui

后端服务

1.技术nodejs+mysql+mock

2.npm i express -S

3.npm i cors -S



项目初始化

1.删除不用的组件

2.css初始化

3.图标-iconfont

4.axios请求二次封装

##日期处理格式
1.moment.js /老
2. dayjs /轻
  1.npm install dayjs --save
  2.import * as dayjs from 'dayjs'
  3.使用dayjs().format() 
    // 默认返回的是 ISO8601 格式字符串 '2020-04-02T08:02:17-05:00'

    dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') 
    // 'YYYYescape 2019-01-25T00:00:00-02:00Z'

    dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'

##echarts图标工具
1.安装
  npm i echarts -S
2.使用echarts
  1.全局main.js引入，所以组件都可以使用
  2.开发成vue插件使用Vue.use(xx)
  3.组件内直接使用也可以
  
###vuex数据持久化
npm install vuex-persistedstate --save

 在使用vue+node开发的过程中,在写登录时候我们会使用到token验证,下面我来分享一下express生成token和简单的使用,希望对你有所帮助

 安装
npm install express-jwt
npm install jsonwebtoken --save

express-jwt内部引用了jsonwebtoken,对其封装使用。在实际的项目中这两个都需要引用,他们两个的定位不一样。
 jsonwebtoken是用来生成token给客户端的,express-jwt是用来验证token的。


