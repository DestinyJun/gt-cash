<template>
  <div class="error">
  <p>
    <span class="h3 text-warning">非法访问！</span>
    <router-link to="/home">
      <button class="btn btn-danger">返回首页</button>
    </router-link>
  </p>
  </div>
</template>

<script>
  export default {
    name: 'error'
  }
</script>

<style lang="scss">
.error{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #17A2B8;
}
</style>
