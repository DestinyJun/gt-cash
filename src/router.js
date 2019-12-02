import Vue from 'vue'
import Router from 'vue-router'
import Market from './views/market/Market.vue'
import Restaurant from './views/restaurant/Restaurant.vue'
import Permission from './views/permission/Permission.vue'
import Chart from './views/chart/Chart.vue'
import Test from './views/test/Test.vue'
import Store from './views/store/Store.vue'

Vue.use(Router)
const routes = new Router({
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
        }
      ]
    },
    {
      path: '/chart',
      name: '图表统计',
      component: Chart,
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('@/views/error/error.vue')
    },
    {
      path: '/store',
      name: '商户管理',
      component: Store,
    },
    {
      path: '/test',
      name: '测试',
      component: Test,
    },
    {
      path: '**',
      redirect: '/login'
    }
  ]
})
routes.beforeEach((to, from, next) => {
  const arr = ['/login','/error']
  if (arr.includes(to.path)) {
    next(true)
  } else if (Vue.localStorage.get('userCode')){
    const arr2 = ['/home','/test','/store','/assets']
    if (arr2.includes(to.path)) {
      next(true)
    } else {
      let success = []
      JSON.parse(Vue.localStorage.get('routers')).map((val) => {
        success.push(val.permissionName)
      })
      if (success.includes(to.path)) {
        next(true)
      } else {
        next({path: '/error'})
      }
    }
  } else {
    next({path: '/error'})
  }
})
export default routes
