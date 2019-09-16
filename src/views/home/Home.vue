<template>
  <div class="home">
    <div class="home-container">
      <div class="home-title text-center">
        <h3>您好！欢迎您进入高投收银系统</h3>
      </div>
      <div class="home-badge">
        <div class="row">
          <div v-for="item in d_homeNavs" class="col-md-4 mt-3 mt-md-3" @click="homeNavClick(item.permissionName)">
            <Badge
              width="100%"
              icon="icon iconfont iconcaidan"
              v-bind:content="{title: item.title,subtitle: item.permissionMark}">
            </Badge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Badge from '@/components/Badge.vue'
// import Vue from 'vue'
// import {post} from '@/util/api'

export default {
  name: 'home',
  components: {
    Badge
  },
  data ()  {
    return {
      a: false,
      d_homeNavs: []
    }
  },
  beforeRouteEnter (to,frm,next) {
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
    homeNavClick(router) {
      this.$router.push(router)
    },
  },
  created() {
    this.post(
      '/user/getpermission',
      {userId: this.$localStorage.get('userCode'),merchatCode: this.$localStorage.get('merchatCode')})
      .then((res) => {
        this.d_homeNavs = res.data
        this.$localStorage.set('routers', JSON.stringify(res.data))
      })
      .catch((err) => {
        console.log(err);
      })
  },
}
</script>
<style scoped lang="scss">
  @import "Home.component";
</style>
