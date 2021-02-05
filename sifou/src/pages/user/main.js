import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/pages/user/router'
import '@/assets/css/base.css'
import 'highlight.js/styles/darcula.css'
Vue.use(ElementUI)
Vue.config.productionTip = false //提供一些提示
new Vue({
  render:h=>h(App),
  router
}).$mount('#app')