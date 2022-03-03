/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-12-21 14:31:25
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme/style.css'
import Avue from '@smallwei/avue'             // api: https://avue.top
import '@smallwei/avue/lib/index.css'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import i18n from './i18n/i18n'
import moment from 'moment'
Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(Avue, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(Avue)
Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.config.productionTip = false


// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法
//Vue.prototype.$echarts = echarts

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

// 自定义moment（js时间组件）
moment.locale('zh-cn', {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY-MM-DD HH:mm:ss'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // 星期一， 是一个星期的第一天
    doy: 4  // 1月4日所在的的一周是一年的第一周
  }
})
