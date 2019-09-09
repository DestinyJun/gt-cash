<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view></router-view>
    <Loading v-if="$store.state.LOADING"></Loading>
  </div>
</template>
<script>
  import Loading from './components/Loading'
  export default {
    name: 'App',
    components: { Loading }
  }
</script>
<style lang="scss">
  @import "~bootstrap/scss/bootstrap";
  @import "~bootstrap-vue/src/index";
  @import "./assets/fonts/iconfont.css";
  #app {
    font-family: 'simhei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
