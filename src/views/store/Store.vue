<template>
  <div class="store">
    <Header :title="this.$route.name" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="content">
      <span class="h5">待开发......</span>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  export default {
    name: 'Store',
    components: {
      Header
    }
  }
</script>

<style scoped lang="scss">
  /*餐饮模块*/
  .store{
    height: 100vh;
  .content{
    height: calc(100vh - 60px);
    background-image: url('../../assets/images/bg02.png');
    background-repeat: no-repeat;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    background-position: center center;
  }
  }
</style>
