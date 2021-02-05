import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let projectRouterConfig = [
  {
    path:'/',
    redirect:'/dataView'
  },
  {
    path:'/dataView',
    name:'dataView',
    component:() => import('./views/DataView')
  },
  {
    path:'/review',
    name:'review',
    component:() => import('./views/Review')
  },
  {
    path:'/tipOff',
    name:'tipOff',
    component:() => import('./views/TipOff')
  },
  {
    path:'/permission',
    name:'permission',
    component:() => import('./views/Permission')
  },
  {
    path:'/dbmanager',
    name:'dbmanager',
    component:() => import('./views/DBManager')
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