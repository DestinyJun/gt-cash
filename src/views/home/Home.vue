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
        {title: '餐厅',subtitle: '管理入口',router: ''},
        {title: '餐厅',subtitle: '收银入口',router: ''},
        {title: '权限管理',subtitle: '系统权限配置',router: ''},
        {title: '超市',subtitle: '库存管理入口',router: ''},
        {title: '超市',subtitle: '收银入口',router: '/market/cash'},
        {title: '超市',subtitle: '查看报表',router: ''},
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
