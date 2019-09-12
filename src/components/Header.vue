<template>
  <div class="header">
    <i class="icon iconfont mr-3" :class="[icon[0]]" @click="routerBack('back')"></i>
    <i class="icon iconfont mr-3" :class="[icon[1]]"></i>
    <span>{{title}}</span>
    <span class="float-right pr-2 pl-2" @click="routerBack('login')" style="">退出</span>
    <!--<img src="@/assets/images/xz.jpg" class="rounded-circle float-right" alt="头像">-->
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
      routerBack: function (type) {
        switch(type) {
          case 'back':
            this.$router.back(-1)
            break
          case 'login':
            this.$router.push('/login')
            this.$localStorage.remove('userCode')
            this.$localStorage.remove('merchatCode')
            this.$localStorage.remove('routers')
        }

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
    padding: 0 0 0 15px;
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
    .float-right{
      display: inline-flex;
      margin-left: auto;
      cursor: pointer;
      height: 100%;
      align-items: center;
    }
  }
</style>
