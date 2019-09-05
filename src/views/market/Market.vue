<template>
  <div class="market">
    <Header title="账户管理" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="market-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  export default {
    name: 'Market',
    components: {
      Header
    },
    data: () => {
      return {}
    }
  }
</script>

<style lang="scss">
  .market{
    height: 100vh;
    .market-content{
      height: calc(100vh - 60px);
      background-image: url('../../assets/images/bg02.png');
      background-repeat: no-repeat;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;
      background-position: center center;
    }
  }

</style>
