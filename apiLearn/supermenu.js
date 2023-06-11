module.exports = [
	{
	  menuid: 10,
        icon: "iconfont icon-yingyongzhongxin",
        menuname: "首页",
        hasThird: null,
        url: '/adminHome',
        menus:[
              {
                  menuid: 2,
                  icon: "icon-cat-skuQuery",
                  menuname: "首页",
                  hasThird: "N",
                  url: "/adminHome",
                  menus: null
              }
        ]
	},

      {
            menuid: 1,
            icon: "iconfont icon-jichuguanli",
            menuname: "基础管理",
            hasThird: null,
            url: null,
            menus: [
                  {
                        menuid: 2,
                        icon: "icon-cat-skuQuery",
                        menuname: "新闻管理",
                        hasThird: "N",
                        url: "/basesmanage/newsmanage",
                        menus: null
                  },
                  {
                        menuid: 3,
                        icon: "icon-cs-manage",
                        menuname: " 新闻分类",
                        hasThird: "N",
                        url: "/basesmanage/sortmanage",
                        menus: null
                  },
                  {
                        menuid: 4,
                        icon: "el-icon-outline",
                        icontype: "el",
                        menuname: "轮播图",
                        hasThird: "N",
                        url: "/basesmanage/swipermanage",
                        menus: null
                  },
                  {
                        menuid: 5,
                        icon: "icon-cms-manage",
                        menuname: "留言管理",
                        hasThird: "N",
                        url: "/basesmanage/leavewordemanage",
                        menus: null
                  },
			{
										
				menuid: 6,
				icon: "icon-cms-manage",
				menuname: "评论管理",
				hasThird: "N",
				url: "/basesmanage/commentmanage",
				menus: null
								
			}
            ]
      },
      {
            menuid: 71,
            icon: "iconfont icon-xitongguanli",
            menuname: "系统管理",
            hasThird: null,
            url: null,
            menus: [
                  {
                        menuid: 72,
                        icon: "icon-cus-manage",
                        menuname: "用户管理",
                        hasThird: "N",
                        url: "/system/usermanage",
                        menus: null
                  },
                  {
                        menuid: 73,
                        icon: "icon-news-manage",
                        menuname: "管理员",
                        hasThird: "N",
                        url: "/system/adminmanage",
                        menus: null
                  }
            ]
      },
      {
            menuid: 150,
            icon: "iconfont icon-guanggaoguanli",
            menuname: "广告分类",
            hasThird: null,
            url: null,
            menus: [
                  {
                        menuid: 159,
                        icon: "icon-provider-manage",
                        menuname: "广告管理",
                        hasThird: "N",
                        url: "/advert/advertmanage",
                        menus: null
                  }
            ]
      }
]