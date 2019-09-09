import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    LOADING: false // 控制请求加载动画状态
  },
  mutations: {
    // 改变状态的函数
    showLoading(state){
      state.LOADING = true
    },
    // 改变状态的函数
    hideLoading (state) {
      state.LOADING = false
    }
  },
  actions: {

  }
})
