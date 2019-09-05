<template>
  <div class="permission">
    <Header title="账户管理" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="permission-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  export default {
    name: 'Permission',
    components: {
      Header
    },
  }
</script>

<style lang="scss">
.permission{
  height: 100vh;
  .permission-content{
    height: calc(100vh - 60px);
    background-image: url('../../assets/images/bg02.png');
    background-repeat: no-repeat;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    background-position: center center;
  }
}
</style>
