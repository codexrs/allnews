<template>
  <div class='home'>
      <!--1.  顶部区域布局---------- -->
    <div class="home-bgc">
      <div class="header">
      <div class="item">
        <!-- 用户总人数 -->
        用户总人数
        <div class='num'>{{ userCount | num }}</div>
      </div>
      <div class="item">
        <!-- 当前在线人数 -->
        在线用户数
        <div class='num'>1</div>
      </div>
      <div class="item">新闻数目
        <div class='num'>{{  newsCount |num }}</div>
      </div>
      <div class="item">当日新闻
        <div class='num'>{{  nowCount }}</div>
      </div>
    </div>

    <!--2. 访问数据统计 ----------------->
    <div class="content">
      <div class="tubiao">
        <div class="cavasbox" ref="SCEchart"></div>
        <div class="cavasbox" ref="SUMEchart"></div>
      </div>
      <div class="tubiao">
        <div class="cavasbox" ref="payEchart"></div>
      
      </div>
    </div>
    </div>
 </div>
</template>

<script type="text/ecmascript-6">
import dayjs from 'dayjs'
import {removeRepeat} from '@/utils'
export default {
  name:'home',
  data() {
    return {
      num:0,
      //顶部数据
      userCount:0,
      newsCount:0,
      nowCount:0,
      //echarts数据
      SCEoptionchart: "",
      SUMoptionchart: "",
      payNumoptionchart: "",
      payoptionchart: "",
      //配置项
      SCEoption: {
        legend: {
          data: [
            {
              name: "新增用户",
              icon: "rect"
            }
          ],
          top: 1,
          left: 1,
          itemGap: 10,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            fontSize: 12,
            color: "#323232"
          }
        },
        grid: {
          left: 50,
          right: 10,
          top: 30,
          bottom: 30,
          borderWidth: 1
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "新增用户",
            data: [1, 4, 2, 5, 8, 4, 3],
            type: "line"
          }
        ]
      },
      SUMoption: {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [
            {
              name: "新增新闻",
              icon: "rect"
            }
          ],
          top: 1,
          left: 1,
          itemGap: 10,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            fontSize: 12,
            color: "#323232"
          }
        },
        grid: {
          left: 50,
          right: 10,
          top: 30,
          bottom: 30,
          borderWidth: 1
        },
        xAxis: {
          type: "category",
          data: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ]
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#999999",
              width: 1
            }
          },
          axisLabel: {
            margin: 14,
            textStyle: {
              fontSize: 10,
              color: "#999999"
            }
          }
        },
        series: [
            {
            name: "新增新闻",
            data: [10, 40, 30, 60, 80, 30, 100],
            type: "line"
          }
        ]
      },
      payoption: {
        backgroundColor: "#2c343c",
        title: {
          text: "新闻分类占比",
          left: 0,
          top: 5,
          textStyle: {
            fontSize: 12,
            color: "#ccc"
          }
        },
        tooltip: {
          trigger: "item",
          
        },
        legend: {
          top:20,
          orient: "vertical",
          left: "left",
          data: ["娱乐新闻", "体育新闻","实时新闻"],
          textStyle: {
            fontSize: 12,
            color: "#ccc",
            
          }
        },
        series: [
          {
            name: "新闻类型",
            type: "pie",
            radius: "80%",
            center: ["50%", "50%"],
            data: [
              { value: 0, name: "娱乐新闻" },
              { value: 0, name: "体育新闻" },
              { value: 0, name: "实时新闻" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      

    };
  },
  filters:{
    //过滤器
    num(val) {
      //如果不存在
      if(!val) return ''
      //转字符串
      return val.toLocaleString()
    }
  },
  components: {
    
  },
  mounted() {
    //获取顶部数据信息
    this.getAllUserList()
    //this.getAdminNewList()
    this.getNowDayNews()
    this.getSUM();
    //当DOM加载完成之后调用
    this.$nextTick(() => {
      this.getSCE();
    
      this.getNewsData()
    });
  },
  methods: {
    dayjs,
    //今日新闻数量
    async getNowDayNews() {
      let res = await this.$api.getNowDayNews() 
      if(res.code == 200) {
        this.nowCount = res.newslist.length
      } else {
        this.nowCount = 0
      }
    },
    
    //用户数量
    async getAllUserList() {
       let res = await this.$api.getAllUserList()
       if(res.code == 200) {
         this.userCount = res.total
       }
      // console.log(this.objCount)
    },
    
    //新闻列表数据--分类
    async getNewsData() {
      this.payoptionchart = this.$echarts.init(this.$refs.payEchart);
      this.payoptionchart.setOption(this.payoption);
      //this.payoptionchart.showLoading();
      this.$api.getNewsData().then(res => {
        this.payoptionchart.hideLoading();
        if (res.code == 200) {
          this.newsCount = res.newslist.length
          let legendData = []
          let seriesData = []
          for(let i = 0; i < res.newslist.length; i++) {
            legendData.push(res.newslist[i].newsType)
            
          }
          seriesData = removeRepeat(legendData)
          
        
          this.payoptionchart.setOption({
            series: [
              {
                data: seriesData
              }
            ],
            legend: {
              data:Array.from(new Set(legendData))
            }
          });
        }
      });
    },


    //绘制折现
    // 新增用户
    getSCE() {
      //获取实例对象
      this.SCEoptionchart = this.$echarts.init(this.$refs.SCEchart);
        this.$api.getSevenNewsCount('userTime','user').then(res => {
        //this.SUMoptionchart.hideLoading();
        if(res.code == 200) {  
          let seriesdata = [];
          let xAxisdata = [];
          for(let i = 0; i < res.data.length; i++) {
            seriesdata.push(res.data[i].count)
            xAxisdata.push(dayjs(res.data[i].click_date).format('YY月DD日'))
          }
        
          this.SCEoptionchart.setOption({
            series: [
              {
                name: "新增用户",
                data: seriesdata,
                type: "line"
              }
            ]
          });
          this.SCEoptionchart.setOption({
            xAxis: [
              {
                data:xAxisdata
              }
            ]
          });
        }
      });

      this.SCEoptionchart.setOption(this.SCEoption);
    },
    // 新增新闻
    async getSUM() {
      this.SUMoptionchart = this.$echarts.init(this.$refs.SUMEchart);
      this.SUMoptionchart.showLoading();  
      this.$api.getSevenNewsCount('newsTime','news').then(res => {
        this.SUMoptionchart.hideLoading();
        if(res.code == 200) {
        
          let seriesdata = [];
          let xAxisdata = [];
        
          for(let i = 0; i < res.data.length; i++) {
            seriesdata.push(res.data[i].count)
            xAxisdata.push(dayjs(res.data[i].click_date).format('YY月DD日'))
          }
        
          this.SUMoptionchart.setOption({
            series: [
              {
                name: "新增新闻",
                data: seriesdata,
                type: "line"
              }
            ]
          });
          this.SUMoptionchart.setOption({
            xAxis: [
              {
                data:xAxisdata
              }
            ]
          });
        }
      });
      this.SUMoptionchart.setOption(this.SUMoption);
    },
  
  
  }
  
}
</script>

<style lang="less" scoped>
.home {
  margin: 10px;

}

.header {
  display: flex;
  padding-right: 30px;

  .item {
    flex: 1;
    height: 100px;
    padding:10px;
    background: #fff;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
    font-weight: bold;
    color: #fff;
    // text-align: center;
    position: relative;

    .num {
      font-size: 22px;
      margin: 10px;
      color: #fff;
    }
  }

  .item:nth-child(1) {
    background-image: linear-gradient(#df9918, #88554d);
  }

  .item:nth-child(2) {
    background-image: linear-gradient(#259eff, #2e556e);
  }

  .item:nth-child(3) {
    background-image: linear-gradient(#4fc659, #713c7a);
  }

  .item:nth-child(4) {
    background-image: linear-gradient(#f11ce6, #39717a);
  }
}
.content {
  width:100%;
  height:100%;
  
  .tubiao{
    display:flex;
  
  }
}
.cavasbox {

  flex:1;
  width: 800px;
  height: 220px;
  padding:10px;
  margin:10px;
}

</style>
