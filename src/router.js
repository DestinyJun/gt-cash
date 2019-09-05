import Vue from 'vue'
import Router from 'vue-router'
import Market from './views/market/Market.vue'
import Restaurant from './views/restaurant/Restaurant.vue'
import Permission from './views/permission/Permission.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登陆',
      component: () => import('@/views/login/Login.vue')
    },
    {
      path: '/home',
      name: '导航首页',
      component: () => import('@/views/home/Home.vue')
    },
    {
      path: '/market',
      name: '超市',
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
    },
    {
      path: '/restaurant',
      name: '餐饮',
      redirect: '/restaurant/cash',
      component: Restaurant,
      children: [
        {
          path: 'cash',
          name: '餐饮收银',
          component: () => import('@/views/restaurant/cash/RestaurantCash.vue')
        },
        {
          path: 'manager',
          name: '餐饮管理',
          component: () => import('@/views/restaurant/manager/RestaurantManager.vue')
        },
      ]
    },
    {
      path: '/permission',
      name: '权限管理模块',
      redirect: '/permission/account',
      component: Permission,
      children: [
        {
          path: 'account',
          name: '账号管理',
          component: () => import('@/views/permission/account/Account.vue')
        },
        {
          path: 'limit',
          name: '角色管理',
          component: () => import('@/views/permission/limit/Limit.vue')
        },
        {
          path: 'userlimit',
          name: '角色权限分配',
          component: () => import('@/views/permission/userlimit/Userlimit.vue')
        }
      ]
    }
  ]
})
