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

export default {
  name: 'home',
  components: {
    Badge
  },
  data: () => {
    return {
      d_homeNavs: []
    }
  },
  methods: {
    homeNavClick(router) {
      this.$router.push(router)
    }
  },
  created() {
    this.d_homeNavs = JSON.parse(this.$localStorage.get('routers'))
  }
}
</script>
<style lang="scss">
  @import "Home.component";
</style>
