<template>
<div class="account container-fluid">
  <div class="title pt-3 pb-3">
    <div class="form-inline">
      <div class="form-group mb-2 mr-0" @click="$bvModal.show('modal-add')" style="cursor: pointer">
        <i class="icon iconfont iconjia mr-3"></i>
        <span class="h5">新增账户</span>
      </div>
      <div class="form-group mb-2 w-50" style="padding-right: -1rem;justify-content: flex-end;">
        <label for="inputPassword2" class="sr-only">搜索</label>
        <input
          @input="accountCodeChange($event.target)"
          type="text" ref="searchInput"
          class="form-control w-50" id="inputPassword2"
          placeholder="请输入关键字" style="font-size: 0.8rem">
        <b-btn size="sm" variant="primary ml-1" @click="accountCodeChange($refs.searchInput)">搜索</b-btn>
      </div>
    </div>
  </div>
  <!--表格内容-->
  <div class="content overflow-auto">
    <b-table outlined hover responsive="sm" :items="d_accountList" :fields="d_accountFields">
      <template slot="[number]" slot-scope="data">
        {{ data.index + 1 }}
      </template>
      <template slot="[operate]" slot-scope="data">
        <div
          data-toggle="tooltip" data-placement="top" title="编辑账户"
          @click="$bvModal.show('modal-update');accountOperateClick(data.item,'editor')"
          class="bg-info"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconxiugai1 text-light"></i>
        </div>
        <div
          data-toggle="tooltip" data-placement="top" title="删除账户"
          @click="accountOperateClick(data.item,'del')"
          class="bg-danger ml-3 mr-3"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconshanchu text-light"></i>
        </div>
        <div
          data-toggle="tooltip" data-placement="top" title="账户密码修改"
          @click="$bvModal.show('modal-password');accountOperateClick(data.item,'password')"
          class="bg-success mr-3"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconquanxian text-light"></i>
        </div>
        <div
          data-toggle="tooltip" data-placement="top" title="账户角色配置"
          @click="$bvModal.show('modal-role');accountOperateClick(data.item,'destroy')"
          class="bg-warning"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconquanxian text-light"></i>
        </div>
      </template>
    </b-table>
  </div>
  <!--新增弹窗-->
  <b-modal
    id="modal-add" centered title="账户添加"
    :header-bg-variant="'primary'"
    :header-text-variant="'light'"
    no-close-on-backdrop>
    <template slot="default">
      <div class="form-group row">
        <label for="user" class="col-sm-3 col-form-label">账户：</label>
        <div class="col-sm-9">
          <input type="text" id="user" class="form-control" v-model="d_accountAdd.user">
        </div>
      </div>
      <div class="form-group row">
        <label for="userName" class="col-sm-3 col-form-label">账户名称：	</label>
        <div class="col-sm-9">
          <input type="text" id="userName" class="form-control" v-model="d_accountAdd.userName">
        </div>
      </div>
      <div class="form-group row">
        <label for="userPhone" class="col-sm-3 col-form-label">用户电话：</label>
        <div class="col-sm-9">
          <input type="tel" id="userPhone" class="form-control" v-model="d_accountAdd.userPhone">
        </div>
      </div>
      <div class="form-group row">
        <label for="password" class="col-sm-3 col-form-label">密码：</label>
        <div class="col-sm-9">
          <input type="password" id="password" class="form-control" v-model="d_accountAdd.password">
        </div>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ close }">
      <b-button
        class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
        v-on:click="close();accountAdd('add')">
        确定
      </b-button>
      <b-button
        class="pl-md-5 pr-md-5" size="sm" variant="danger"
        v-on:click="close()">
        取消
      </b-button>
    </template>
  </b-modal>
  <!--修改弹窗-->
  <b-modal
    id="modal-update" centered
    :header-bg-variant="'info'"
    :header-text-variant="'light'"
    no-close-on-backdrop title="账户信息修改">
    <template slot="default">
      <div class="form-group row">
        <label for="update-userName" class="col-sm-4 col-form-label">新账户名称：	</label>
        <div class="col-sm-8">
          <input type="text" id="update-userName" class="form-control" v-model="d_accountUpdate.userName">
        </div>
      </div>
      <div class="form-group row">
        <label for="update-userPhone" class="col-sm-4 col-form-label">新用户电话：</label>
        <div class="col-sm-8">
          <input type="tel" id="update-userPhone" class="form-control" v-model="d_accountUpdate.userPhone">
        </div>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ close }">
      <b-button
        class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
        v-on:click="close();accountAdd('editor')">
        确定
      </b-button>
      <b-button
        class="pl-md-5 pr-md-5" size="sm" variant="danger"
        v-on:click="close()">
        取消
      </b-button>
    </template>
  </b-modal>
  <!--密码修改弹窗-->
  <b-modal
    id="modal-password" centered
    :header-bg-variant="'success'"
    :header-text-variant="'light'"
    no-close-on-backdrop title="账户密码修改">
    <template slot="default">
      <div class="form-group row">
        <label for="update-password" class="col-sm-3 col-form-label">新密码：</label>
        <div class="col-sm-9">
          <input type="tel" id="update-password" class="form-control" v-model="d_accountPassword.password">
        </div>
      </div>
    </template>
    <template slot="modal-footer" slot-scope="{ close }">
      <b-button
        class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
        v-on:click="close();accountAdd('password')">
        确定
      </b-button>
      <b-button
        class="pl-md-5 pr-md-5" size="sm" variant="danger"
        v-on:click="close()">
        取消
      </b-button>
    </template>
  </b-modal>
  <!--角色配置-->
  <b-modal
    id="modal-role" centered title="用户角色配置"
    :header-bg-variant="'warning'"
    :header-text-variant="'light'"
    no-close-on-backdrop>
    <template slot="default">
      <b-form-checkbox
        id="checkbox-1"
        name="checkbox-1"
        value="1"
        unchecked-value="not_accepted">
        admin
      </b-form-checkbox>
      <b-form-checkbox
        id="checkbox-2"
        name="checkbox-2"
        value="2"
        unchecked-value="not_accepted">
        收银员
      </b-form-checkbox>
      <b-form-checkbox
        id="checkbox-3"
        name="checkbox-3"
        value="3"
        unchecked-value="not_accepted">
        保安
      </b-form-checkbox>
    </template>
    <template slot="modal-footer" slot-scope="{ close }">
      <b-button
        class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
        v-on:click="close();accountAdd('role')">
        确定
      </b-button>
      <b-button
        class="pl-md-5 pr-md-5" size="sm" variant="danger"
        v-on:click="close()">
        取消
      </b-button>
    </template>
  </b-modal>
</div>
</template>

<script>
  var debounce = require('lodash.debounce')
  export default {
    name: 'Account',
    data(){
      return {
        d_accountList: [], // 账户列表
        d_accountFields: [
          // 账户列表表头字段
          {number: '#'},
          {user: '账户'},
          {userName: '用户名'},
          {operate: '操作'},
        ],
        d_accountAdd: {
          // 账户添加对象
          user: null,
          userName: null,
          userPhone: null,
          password: null,
          merchatCode: this.$localStorage.get('merchatCode')
        },
        d_accountUpdate: {
          // 账户添加对象
          id: null,
          userName: null,
          userPhone: null,
        },
        d_accountPassword: {
          id: null,
          password: null,
        },
        d_accountRole: []
      }
    },
    methods: {
      accountSelect() {
        // 账户列表查询
        this.post(
          '/authoritymanagement/account/index/select',
          {merchatCode:this.$localStorage.get('merchatCode')})
          .then((res) => {
            if (res.data.length !== 0) {
              this.d_accountList = res.data
            }
          })
          .catch(err => console.log(err))
      },
      accountAdd(type) {
        switch(type) {
          case 'editor':
            // 账户修改
            this.post('/authoritymanagement/account/updateuserinfo',this.d_accountUpdate)
              .then((res) => {
                this.accountSelect()
              })
              .catch((err) => console.log(err))
            break
          case 'add':
            // 账户添加
            this.post('/authoritymanagement/account/adduserinfo',this.d_accountAdd)
              .then((res) => {
                console.log(res);
                this.d_accountAdd = this.reset_form(this.d_accountAdd)
                this.accountSelect()
              })
              .catch((err) => console.log(err))
            break
          case 'password':
            // 密码修改
            this.post('/authoritymanagement/account/updateuserinfopassword',this.d_accountPassword)
              .then((res) => {
                this.accountSelect()
              })
              .catch((err) => console.log(err))
            break
        }
      },
      accountOperateClick(item,type) {
        // 账户列表相关操作
        switch(type) {
          case 'del':
            this.$bvModal.msgBoxConfirm(
              '你确定删除此账号码？',
              {
                title: '删除提示',
                centered: true,
                hideHeaderClose: false,
                headerBgVariant: 'danger',
                headerTextVariant: 'light',
                headerCloseVariant: 'light',
                size: 'sm',
                buttonSize: 'sm',
                okTitle: '确定',
                okVariant: 'success',
                cancelTitle: '取消',
                cancelVariant: 'danger',
                footerClass: ['p-3']
              }
            )
              .then(value => {
              if (value) {
                this.post('/authoritymanagement/account/delete',{id: item.id})
                  .then((res) => {
                    this.accountSelect()
                  })
                  .catch((err) => console.log(err))
              }
            })
            break
          case 'editor':
            this.clone_copy_a(item,this.d_accountUpdate)
            break
          case 'password':
            this.clone_copy_a(item,this.d_accountPassword)
            break
        }
      },
      accountCodeChange: debounce(function (event) {
        // 账号模糊查询
        if (event.value.length === 0) {
          this.accountSelect();
        } else {
          // 角色模糊查询
          this.post(
            '/authoritymanagement/account/key/select',
            {key: event.value,merchatCode: this.$localStorage.get('merchatCode')})
            .then((res) => {
              console.log(res);
              this.d_accountList = res.data
            })
            .catch(err => {})
        }
      },500),
    },
    created () {
      this.accountSelect();
    }
  }
</script>

<style lang="scss">
@import "Account.component";
</style>
