import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import login from '@/components/Login'
const home = () =>
    import ('@/components/Home')
const image = () =>
    import ('@/components/Image')
const article = () =>
    import ('@/components/Article')
const welcome = () =>
    import ('@/components/Welcome')
const comments = () =>
    import ('@/components/Comments')
const fans = () =>
    import ('@/components/Fans')
const my = () =>
    import ('@/components/My')
const publish = () =>
    import ('@/components/Publish')
Vue.use(Router)


const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/',
            name: 'home',
            component: home,
            redirect: '/welcome',
            children: [{
                    path: '/welcome',
                    name: 'welcome',
                    component: welcome
                }, {
                    path: '/article',
                    name: 'article',
                    component: article
                },
                {
                    path: '/image',
                    name: 'image',
                    component: image
                },
                {
                    path: '/comments',
                    name: 'comments',
                    component: comments
                },
                {
                    path: '/fans',
                    name: 'fans',
                    component: fans
                },
                {
                    path: '/my',
                    name: 'my',
                    component: my
                },
                {
                    path: '/publish',
                    name: 'publish',
                    component: publish
                },
            ]
        },
    ],
    mode: 'history', //去掉url中的#
})

//路由守卫
router.beforeEach((to, from, next) => {
    //to将要访问，from来自哪里,next执行下一个函数，放行
    if (to.path === '/login') return next()

    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()


})

//请求拦截器
axios.interceptors.request.use(
        //所有请求会经过这里
        //confing请求配置的相关信息，可以修改
        function(confing) {
            let token = sessionStorage.getItem("token")
            if (token) {
                confing.headers.Authorization = `${token}`
            }
            return confing
        },
        //失败经过的地方
        function(error) {
            return Promise.reject(error)
        })
    //响应拦截器
axios.interceptors.response.use(function(response) {
    return response
}, function(error) {
    //任何超出2××的响应码都会进入到这里
    if (error.response && error.response.status == 401) {
        //防止伪造token,跳转到登陆页面
        router.push("/login")
    }
    return Promise.reject(error)
})
export default router