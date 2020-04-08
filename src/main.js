import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/element-var.less'
Vue.use(ElementUI)

import {
  toast
} from './utils/toast'
window._toast = toast

window.echarts = require('echarts')

// lodash
window._ = require('lodash')

// 过滤器相关
import filters from '@/utils/filter'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype._toast = toast

import ApiServices from '@/services/api.service'
window.apiServices = new ApiServices(Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// mytodo
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.projectInfo.authorityMode == 'edit') {
      next()
    } else {
      next({ path: '/authArror' })
    }
  } else {
    next()
  }
})

// 地图部分 初始化
import gwmap from '@/gwmap'
window.gwmap = gwmap
gwmap.init('mapContainer')
gwmap.loadMapComponents('mapContainer')
