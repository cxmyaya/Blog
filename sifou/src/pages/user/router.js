import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let projectRouterConfig = [
  {
    path:'/',
    redirect:'/home/article'
  },{
    path:'/home/:module',
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
    path:'/blogList/:searchKey',
    name:'blogList',
    component:() => import('./views/BlogList')
  },
  {
    path:'/articleDetail/:id',
    name:'articleDetail',
    component:() => import('../../components/ArticleDetail')
  }
]
export default new VueRouter({
  routes:projectRouterConfig
})