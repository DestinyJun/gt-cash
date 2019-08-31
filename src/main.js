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


Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(ToggleButton)
Vue.use(VueLocalStorage)
Vue.use(PortalVue)
Vue.use(BootstrapVue)
Vue.filter('twoDecimals',(value) => {
  return value.toFixed(2)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.log(process.env.VUE_APP_ENV)
