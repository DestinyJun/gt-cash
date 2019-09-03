import Vue from 'vue'
import Router from 'vue-router'
import Market from './views/market/Market.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/Home.vue')
    },
    {
      path: '/market',
      name: 'market',
      redirect: '/market/cash',
      component: Market,
      children: [
        {
          path: 'cash',
          name: '超市收银',
          component: () => import('@/views/market/cash/MarketCash.vue')
        },
        {
          path: 'manager',
          name: '超市库存管理',
          component: () => import('@/views/market/manager/MarketManager.vue')
        },
        {
          path: 'storage',
          name: '超市入库管理',
          component: () => import('@/views/market/storage/MarketStorage.vue')
        }
      ]
    }
  ]
})
