//公共的方法文件

/*
  处理数据html标签显示界面
 */
export function removeHTMLTag(htmlStr) {
    let html = htmlStr
    .replace(/<img.*?>/g,"[图片]")
    .replaceAll(/<[^>+]>/g,"")
    .replace(/&nbsp;/gi,"")
    return html;
}

/**
 * 数组找出重复的元素以及个数
 */
/**
 * 返回形式 [{value:'个数',name:'数组元素名'}]
 */

export function removeRepeat(arr) {
   let tempArr = []
   let obj = {}
   let resultArr = []
 
   arr.forEach(v=>{
     if(!tempArr.includes(v)) {
       tempArr.push(v)
     }
   })
   arr.forEach(v=>{
     if(obj[v]) {
       obj[v]++
     }else {
       obj[v] = 1
     }
   })
   tempArr.forEach(v=>{
     resultArr.push({
       name: v,
       value: obj[v]
     })
   })
 
   return resultArr
}

 