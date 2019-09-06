<template>
  <div class="restaurant">
    <Header :title="this.$route.name" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  export default {
    name: 'Restaurant',
    components: {
      Header
    },
  }
</script>

<style lang="scss">
.restaurant{
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
