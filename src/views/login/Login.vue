<template>
  <div class="login">
    <form class="login-form pl-2 pr-2 pt-5 rounded">
      <!--半圆效果-->
      <div class="form-circle rounded-circle">
        <span class="icon iconfont iconshouyintai"></span>
      </div>
      <!--标题-->
      <div class="form-group">
        <span>请先登录以进行管理</span>
      </div>
      <!--请输入用户名-->
      <div class="form-group">
        <label for="user" class="sr-only"></label>
        <input type="text" class="form-control" placeholder="请输入用户名" name="user" id='user'>
      </div>
      <!--下拉选框-->
      <div class="form-group">
        <button
          class="form-control dropdown-toggle"
          type="button" id="dropdownMenuButton"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          请选择店铺
        </button>
        <div class="dropdown-menu overflow-auto">
          <a class="dropdown-item" href="#">久长服务区</a>
          <a class="dropdown-item" href="#">木竹东服务区</a>
          <a class="dropdown-item" href="#">安顺服务区</a>
          <a class="dropdown-item" href="#">安顺服务区</a>
          <a class="dropdown-item" href="#">安顺服务区</a>
          <a class="dropdown-item" href="#">安顺服务区</a>
        </div>
      </div>
      <!--密码输入-->
      <div class="form-group">
        <label for="user" class="sr-only"></label>
        <input
          type="password" class="form-control"
          placeholder="请输入密码" name="password" id='password' />
      </div>
      <!--记住密码及忘记密码-->
      <div class="form-check">
        <toggle-button :value="true"
                       name="phone"
                       :labels="{checked: 'Android', unchecked: 'iPhone'}"
                       :color="{checked: '#7DCE94', unchecked: '#82C7EB'}"
                       :width="80"/>
      </div>
      <!--登陆按钮-->
      <div class="form-group">
        <button class="btn btn-block btn-primary" @click="login()">登陆</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      message: 'wenjun'
    }
  },
  methods: {
    login () {
      console.log('登陆')
      this.message = '文君'
    }
  }
}
</script>

<style lang="scss">
  @import "login.component";
</style>
