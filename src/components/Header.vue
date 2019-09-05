<template>
  <div class="header">
    <i class="icon iconfont mr-3" :class="[icon[0]]" @click="routerBack"></i>
    <i class="icon iconfont mr-3" :class="[icon[1]]"></i>
    <span>{{title}}</span>
    <img src="@/assets/images/xz.jpg" class="rounded-circle float-right" alt="头像">
  </div>
</template>

<script>
  export default {
    name: 'Header',
    props: {
      title: {
        type: String,
        default: ''
      },
      icon: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    methods: {
      routerBack: function () {
        this.$router.back(-1)
      }
    }
  }
</script>

<style lang="scss">
  .header{
    height: 60px;
    background-color: #FEFFF9;
    border-bottom: 1px solid #ECECEC;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 15px;
    :nth-child(1){
      cursor: pointer;
      font-size: 1.5rem;
      font-weight: bold;
    }
    img{
      width: 50px;
      height: auto;
      margin-left: auto;
    }
  }
</style>
