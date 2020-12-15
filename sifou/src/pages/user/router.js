import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let projectRouterConfig = [
  {
    path:'/',
    redirect:'/home'
  },{
    path:'/home',
    name:'home',
    component:() => import('./views/Home')
  },{
    path:'/chatHome',
    name:'chatHome',
    component:() => import('./views/ChatHome')
  },{
    path:'/articleEdit',
    name:'articleEdit',
    component:() => import('./views/ArticleEdit')
  },{
    path:'/articleDetail/:id',
    name:'articleDetail',
    component:() => import('./views/ArticleDetail')
  },{
    path:'/blogList/:searchKey',
    name:'blogList',
    component:() => import('./views/BlogList')
  }
]
export default new VueRouter({
  routes:projectRouterConfig
})