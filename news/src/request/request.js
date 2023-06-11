/*
    封装axios网络连接
*/ 
//对axios进行二次封装
import axios from 'axios'

//1.创建axios实例
const requests = axios.create({
    
    //代表请求超时时间
    timeout: 90000,

})
//请求拦截器
requests.interceptors.request.use((config) => {
    return config
})

//响应拦截器
requests.interceptors.response.use(res => {
    //成功的回调函数：服务器相应数据回来以后，响应拦截器可以检测到
    return res.data
},err => {
    //响应失败的回调函数
    return err

})

export default requests
    

            
  
