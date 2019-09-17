// @ is an alias to /src
import Badge from '@/components/Badge.vue'
// import Vue from 'vue'
// import {post} from '@/util/api'

export default {
  name: 'home',
  components: {
    Badge
  },
  data () {
    return {
      a: false,
      d_homeNavs: []
    }
  },
  beforeRouteEnter (to, frm, next) {
    next()
  },
  beforeRouteLeave (to, from, next) {
    next()
    /*const answer = window.confirm('当前页面数据未保存，确定要离开？')
    if (answer) {
      next()
    }*/
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
  /*beforeRouteEnter(to, from, next) {
    console.log(from);
    post(
      '/user/getpermission',
      {userId: Vue.localStorage.get('userCode'),merchatCode: Vue.localStorage.get('merchatCode')})
      .then((res) => {
        next((vm => {
          vm.d_homeNavs = res.data
          Vue.localStorage.set('routers', JSON.stringify(res.data))
        }))
      })
      .catch((err) => {
        next(false)
      })
  },*/
  methods: {
    homeNavClick (router) {
      this.$router.push(router)
    },
  },
  created () {
    this.post(
      '/user/getpermission',
      { userId: this.$localStorage.get('userCode'), merchatCode: this.$localStorage.get('merchatCode') })
      .then((res) => {
        res.data.push(
          {
            permissionMark: '商户管理',
            permissionName: '/store',
            title: '商户'
          }
        )
        this.d_homeNavs = res.data
        this.$localStorage.set('routers', JSON.stringify(res.data))
      })
      .catch((err) => {
        console.log(err)
      })
  },
}
