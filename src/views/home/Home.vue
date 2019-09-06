<template>
  <div class="home">
    <div class="home-container">
      <div class="home-title text-center">
        <h3>点击进入管理模块</h3>
      </div>
      <div class="home-badge">
        <div class="row">
          <div v-for="item in d_homeNavs" class="col-md-4 mt-3 mt-md-3" @click="homeNavClick(item.router)">
            <Badge
              width="100%"
              icon="icon iconfont iconcaidan"
              v-bind:content="{title: item.title,subtitle: item.subtitle}">
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

export default {
  name: 'home',
  components: {
    Badge
  },
  data: () => {
    return {
      d_homeNavs: [
        {title: '超市',subtitle: '收银入口',router: '/market/cash'},
        {title: '超市',subtitle: '入库管理',router: '/market/storage'},
        {title: '超市',subtitle: '库存管理入口',router: '/market/manager'},
        {title: '餐厅',subtitle: '收银入口',router: '/restaurant/cash'},
        {title: '餐厅',subtitle: '管理入口',router: '/restaurant/manager'},
        {title: '权限管理',subtitle: '账号管理',router: '/permission/account'},
        {title: '权限管理',subtitle: '角色管理',router: '/permission/limit'},
        // {title: '权限管理',subtitle: '角色权限分配',router: '/permission/userlimit'},
        {title: '查看报表',subtitle: '系统报表信息',router: '/chart'},
      ]
    }
  },
  methods: {
    homeNavClick(router) {
      this.$router.push(router)
    }
  }
}
</script>
<style lang="scss">
  @import "Home.component";
</style>
