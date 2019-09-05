import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLocalStorage from 'vue-localstorage'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import ToggleButton from 'vue-js-toggle-button'
import PortalVue from 'portal-vue'
import BootstrapVue from 'bootstrap-vue'
import {get,post} from './util/api'
import {reset_form,clone_obj,clone_copy,clone_copy_a} from './util/tools'

//挂载自定义方法到Vue原型上
Vue.prototype.get = get;
Vue.prototype.post = post;
Vue.prototype.reset_form = reset_form;
Vue.prototype.clone_obj = clone_obj;
Vue.prototype.clone_copy = clone_copy;
Vue.prototype.clone_copy_a = clone_copy_a;

// 使用vue插件
Vue.config.productionTip = false
Vue.use(VueAxios, axios) // axios请求插件
Vue.use(ToggleButton) // switch开关插件
Vue.use(VueLocalStorage) // session storage插件
Vue.use(PortalVue) // bootstrap-vue支持插件
Vue.use(BootstrapVue) // bootstrap-vue UI插件

// 定义全局筛选器
Vue.filter('twoDecimals',(value) => {
  return value.toFixed(2)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.log(process.env.VUE_APP_ENV)
