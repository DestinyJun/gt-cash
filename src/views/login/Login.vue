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
      <!--请输入用户名
      v-bind:class="{ 'is-invalid': !!d_loginError.user_error }"
       v-on:onchange="loginFormCheck(e)"
      -->
      <div class="form-group">
        <label for="user" class="sr-only"></label>
        <input
          type="text" class="form-control"
          v-model="d_loginForm.user"
          v-on:input="loginUserChange()"
          placeholder="请输入用户名" name="user" id='user'>
        <span class="text-danger" v-if="d_loginError.user_error">用户名是必填项</span>
      </div>
      <!--下拉选框-->
      <div class="form-group">
        <button
          class="form-control dropdown-toggle"
          type="button" id="dropdownMenuButton"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{d_loginShopSelect}}
        </button>
        <div class="dropdown-menu overflow-auto">
          <span class="dropdown-item" v-for="item in d_loginOptions" @click="loginShopSelect(item)">{{item.merchatName}}</span>
        </div>
      </div>
      <!--密码输入-->
      <div class="form-group">
        <label for="user" class="sr-only"></label>
        <input
          type="password" class="form-control"
          v-model="d_loginForm.password"
          placeholder="请输入密码" name="password" id='password'/>
      </div>
      <!--记住密码及忘记密码-->
      <div class="form-check">
        <toggle-button
          :value="false"
          name="switch"
          :labels="{unchecked: '否',checked: '是'}"
          :color="{checked: '#28A745', unchecked: '#DC3545'}"
          :width="50"
          :height="20"
          @change="loginSwitchChange($event)"
        />
        <span class="align-middle ml-2">记住我</span>
        <span class="align-middle float-right">忘记密码</span>
      </div>
      <!--登陆按钮-->
      <div class="form-group">
        <button type="button" class="btn btn-block btn-primary" @click="loginClick()">登陆</button>
      </div>
    </form>
  </div>
</template>

<script>
  const axios  = require('axios')
  export default {
    name: 'Login',
    data: () => {
      return {
        d_loginForm: {
          user: '',
          password: '',
          merchatCode: '',
        },
        d_loginError: {
          user_error: '',
          password_error: ''
        },
        d_loginOptions: [
          { merchatCode: null, merchatName: '请选择店铺...' },
        ],
        d_loginShopSelect: '请选择店铺...'
      }
    },
    methods: {
      loginClick () {
        if (this.d_loginForm.user && this.d_loginForm.password) {
          axios.post('http://192.168.28.207:8080/user/login',this.d_loginForm)
            .then((response) => {
              const data = response.data
              if (data.code == 1000) {
                this.$router.push('/home')
              }
            })
            .catch((err) => {
              console.log(err);
            })
          return true
        }
        if (!this.d_loginForm.user) {
          this.d_loginError.user_error = '用户名是必填项';
        }
        if (!this.d_loginForm.password) {
          this.d_loginError.password_error = '密码是必填项';
        }
      },
      loginShopSelect (item) {
        this.d_loginForm.merchatCode=item.merchatCode
        this.d_loginShopSelect=item.merchatName
      },
      loginSwitchChange () {
        console.log('222');
      },
      loginUserChange() {
        const that = this;
        this.d_loginOptions = [{ merchatCode: null, merchatName: '请选择店铺...' }]
        let aTime;
        aTime = setTimeout(() => {
          axios.post('http://192.168.28.207:8080/user/selectmerchatbyuser', { user: this.d_loginForm.user })
            .then(function (response) {
              const data = response.data.data
              for(var i = 0, len = data.length; i < len; i++){
                that.d_loginOptions.push(data[i])
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }, 500)
      },
      loginFormCheck(e) {
        console.log(e);
        if (this.d_loginForm.user) {
          this.d_loginError.user_error = '';
        }
        if (this.d_loginForm.password) {
          this.d_loginError.password_error = '';
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "login.component";
</style>
