import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap'
import ToggleButton from 'vue-js-toggle-button'

Vue.config.productionTip = false
Vue.use(ToggleButton)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
console.log(process.env.VUE_APP_ENV)
