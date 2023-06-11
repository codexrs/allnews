import sStorage from '@/utils/sessionStorage.js'
//管理员登录存储信息
export default {
    state: {
        //管理员数据存储
        adminUserInfo:{
            admininfo:[{
                adminId:'',
                adminName:'',
                adminPass:'',
                adminEmail:'',
                adminTime:'',
                adminUrl:'',
                adminSex:''
            }]
        },
        token:"",
        //用来判断是否是超级管理员还是普通管理员=，超级：superAdmin
        adminIdentity:"user",

        //普通用户数据存储
        userInfo:[
            {
                userId:'',
                userName:'',
                userPass:'',
                userTime:'',
                userUrl:'',
                userSex:''
            }
        ],
        userToken:""

        
    
    },
    //里面定义方法，操作state方发
    mutations: {
        setadminUserInfo(state,payload) {
            state.adminUserInfo.admininfo = payload.data
            sStorage.setItem('admininfo',payload.data)
        },
        setadminIdentity(state,payload) {
            state.adminIdentity = payload
        },
        setToken(state,payload){
            state.token = payload
            sStorage.setItem('Token',payload)
        },
        //清空管理员数据和token
        deleteAdmin(state) {
            state.adminUserInfo = {
                admininfo:[],
                
            }
            sStorage.clear('admininfo')
        },
        //清空token
        deleteToken(state) {
            state.token = ''
            sStorage.clear('Token')
        },
        //清空管理员身份
        deleteadminIdentity(state) {
            state.adminIdentity = ''
        },

        //用户
        //存储用户信息
        setuserInfo(state,payload) {
            state.userInfo =  payload.data
            sStorage.setItem('userinfo',JSON.stringify(payload.data))
        },
        //清空用户信息
        deleteuserInfo(state) {
            state.userInfo = []
            sStorage.clear('userinfo')
        },
        //用户token
        setuserToken(state,payload){
            state.userToken = payload
            sStorage.setItem('userToken',payload)
        },
        //清空token
        deleteuserToken(state) {
            state.userToken = ''
            sStorage.clear('userToken')
        },


    },

}