<template>
  <div class="market">
    <div class="market-header">
      <i class="icon iconfont icontubiaozhizuomoban-copy mr-3"></i>
      <i class="icon iconfont icondianpu-copy mr-3"></i>
      <span>{{name}}</span>
      <img src="../../assets/images/xz.jpg" class="rounded-circle float-right" alt="头像">
    </div>
    <div class="market-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Market',
    data: () => {
      return {
        name: '中驿超市（上行店）'
      }
    }
  }
</script>

<style lang="scss">
  .market{
    height: 100vh;
    .market-header{
      height: 60px;
      background-color: #FEFFF9;
      border-bottom: 1px solid #ECECEC;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 15px;
      img{
        width: 50px;
        height: auto;
        margin-left: auto;
      }
    }
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
