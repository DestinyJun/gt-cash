<template>
  <div class="login">
    <div class="login-scan"></div>
    <form class="login-form pl-2 pr-2 pt-5 rounded">
      <!--半圆效果-->
      <div class="form-circle rounded-circle">
        <span class="icon iconfont iconshouyintai"></span>
      </div>
      <!--标题-->
      <div class="form-group">
        <span>请先登录以进行管理</span>
      </div>
      <!--用户名-->
      <div class="form-group">
        <label for="user" class="sr-only"></label>
        <input
          type="text" class="form-control"
          v-model.trim="$v.d_loginForm.user.$model"
          v-on:input="loginUserChange()"
          placeholder="请输入用户名" name="user" id='user'>
        <span class="text-danger" v-if="$v.d_loginForm.user.$error">用户名是必填项</span>
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
          <span class="dropdown-item" v-for="item in d_loginOptions"
                @click="loginShopSelect(item)">{{item.merchatName}}</span>
        </div>
      </div>
      <!--密码输入-->
      <div class="form-group">
        <label for="user" class="sr-only"></label>
        <input
          type="password" class="form-control"
          v-model.trim="$v.d_loginForm.password.$model"
          placeholder="请输入密码" name="password" id='password'/>
        <span class="text-danger" v-if="$v.d_loginForm.password.$error">密码是必填项</span>
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
      <div class="form-group pb-1">
        <button
          type="button"
          class="btn btn-info float-left"
          @click="$bvModal.show('modal-shift-broken')"
          :disabled="!$v.d_loginForm.$dirty || $v.d_loginForm.$error">
          断线重连
        </button>
        <button
          type="button"
          class="btn btn-danger float-right"
          @click="$bvModal.show('modal-shift')"
          :disabled="!$v.d_loginForm.$dirty || $v.d_loginForm.$error">
          交班登陆
        </button>
      </div>
    </form>
    <!--交班登陆弹窗-->
    <b-modal id="modal-shift" centered size="md" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            交班登陆
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="d-flex border-bottom pb-2">
          <div class="d-flex" style="flex: 2;align-items: center">
            <span class="align-middle">选择班别：</span>
          </div>
          <div style="flex: 8">
            <b-form-select class="align-middle" :value="null" :options="d_shiftOptions"
                           @change="shiftSelectChange($event,'select')"></b-form-select>
          </div>
        </div>
        <div class="pt-2 border-bottom pb-2">
          <p class="text-info font-weight-bold">请选择上一个收银员：</p>
          <b-form-group>
            <b-form-radio-group
              v-model="d_loginForm.thisUserId"
              class="text-left text-dark"
              :options="d_shiftMemberOptions"
              stacked>
            </b-form-radio-group>
          </b-form-group>
        </div>
        <div class="d-flex pt-2">
          <div class="d-flex" style="flex: 2;align-items: center">
            <span class="align-middle">本次班别：</span>
          </div>
          <div style="flex: 8">
            <b-form-select class="align-middle" :value="null" :options="d_shiftOptions" @change="shiftSelectChange($event)"></b-form-select>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button class="pl-md-4 pr-md-4" size="sm" variant="info" :disabled="!d_loginForm.thisShiftCode || !d_loginForm.nextShiftCode" v-on:click="close(),loginClick('shift')">
          登陆
        </b-button>
      </template>
    </b-modal>
    <!--短线登陆弹窗-->
    <b-modal id="modal-shift-broken" centered size="md" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            交班登陆
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="d-flex border-bottom pb-2">
          <div class="d-flex" style="flex: 2;align-items: center">
            <span class="align-middle">选择班别：</span>
          </div>
          <div style="flex: 8">
            <b-form-select class="align-middle" :value="null" :options="d_shiftOptions" @change="shiftSelectChange($event,'select')"></b-form-select>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button class="pl-md-4 pr-md-4" size="sm" variant="info" :disabled="!d_loginForm.thisShiftCode" v-on:click="close(),loginClick('broken')">
          登陆
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script src="./login.component.js"></script>
<style scoped lang="scss">
  @import "login.component";
</style>
