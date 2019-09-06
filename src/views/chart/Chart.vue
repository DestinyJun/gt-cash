<template>
  <div class="chart">
    <Header :title="$route.name" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="content">
      <span class="h5">待开发中......</span>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  export default {
    name: 'Chart',
    components: {
      Header
    }
  }
</script>

<style lang="scss">
.chart{
  height: 100vh;
}
</style>
