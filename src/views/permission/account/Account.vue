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
          :id="'operate-update'+data.index"
          @click="$bvModal.show('modal-update');accountOperateClick(data.item,'editor')"
          class="bg-info"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconxiugai1 text-light"></i>
          <b-tooltip :target="'operate-update'+data.index" variant="dark" placement="bottom">编辑账户</b-tooltip>
        </div>
        <div
          :id="'operate-del'+data.index"
          @click="accountOperateClick(data.item,'del')"
          class="bg-danger ml-3 mr-3"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconshanchu text-light"></i>
          <b-tooltip :target="'operate-del'+data.index" variant="dark" placement="bottom">删除账户</b-tooltip>
        </div>
        <div
          :id="'operate-password'+data.index"
          @click="$bvModal.show('modal-password');accountOperateClick(data.item,'password')"
          class="bg-success mr-3"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconquanxian text-light"></i>
          <b-tooltip :target="'operate-password'+data.index" variant="dark" placement="bottom">账户密码修改</b-tooltip>
        </div>
        <div
          :id="'operate-role'+data.index"
          @click="$bvModal.show('modal-role');accountOperateClick(data.item,'role')"
          class="bg-warning"
          style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
          <i class="icon iconfont iconquanxian text-light"></i>
          <b-tooltip :target="'operate-role'+data.index" variant="dark" placement="bottom">账户角色配置</b-tooltip>
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
        v-for="item in d_accountRole"
        :id="'checkbox'+item.id"
        :name="'checkbox'+item.id"
        value="true"
        v-model="item.status"
        unchecked-value="false">
        {{item.roleName}}
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
        // 账户列表表头字段
        d_accountFields: [
          {number: '#'},
          {user: '账户'},
          {userName: '用户名'},
          {operate: '操作'},
        ],
        // 账户添加对象
        d_accountAdd: {
          user: null,
          userName: null,
          userPhone: null,
          password: null,
          merchatCode: this.$localStorage.get('merchatCode')
        },
        // 账户添加对象
        d_accountUpdate: {
          id: null,
          userName: null,
          userPhone: null,
        },
        // 密码修改
        d_accountPassword: {
          id: null,
          password: null,
        },
        // 角色列表
        d_accountRole: [],
        // 账户角色修改
        d_accountRoleUpdate: {
          userId:null,
          merchatCode:null,
          roles: null
        },
      }
    },
    methods: {
      // 账户列表查询
      accountSelect() {
        this.post(
          '/authoritymanagement/account/index/select',
          {merchatCode:this.$localStorage.get('merchatCode')})
          .then((res) => {
            if (res.data.length !== 0) {
              this.d_accountList = res.data
            }
          })
          .catch(err => {})
      },
      // 账户操作
      accountAdd(type) {
        switch(type) {
          case 'editor':
            // 账户修改
            this.post('/authoritymanagement/account/updateuserinfo',this.d_accountUpdate)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '账户修改成功！',
                  {
                    title: '操作提醒', // 标题
                    centered: true, // 弹窗是否居中
                    hideHeaderClose: false, // 是否隐藏头部关闭按钮
                    headerBgVariant: 'success', // 头部背景
                    headerTextVariant: 'light', // 头部文字
                    headerCloseVariant: 'light', // 头部关闭按钮
                    size: 'sm', // 框尺寸
                    buttonSize: 'sm', // 按钮尺寸
                    okTitle: '关闭', // 确认按钮内容
                    okVariant: 'danger', // 确认按钮样式
                    footerClass: ['p-3'],
                  })
                  .then(value => {})
                  .catch((err) => {})
                this.accountSelect()
              })
              .catch((err) => {})
            break
          case 'add':
            // 账户添加
            this.post('/authoritymanagement/account/adduserinfo',this.d_accountAdd)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '账户添加成功！',
                  {
                    title: '操作提醒', // 标题
                    centered: true, // 弹窗是否居中
                    hideHeaderClose: false, // 是否隐藏头部关闭按钮
                    headerBgVariant: 'success', // 头部背景
                    headerTextVariant: 'light', // 头部文字
                    headerCloseVariant: 'light', // 头部关闭按钮
                    size: 'sm', // 框尺寸
                    buttonSize: 'sm', // 按钮尺寸
                    okTitle: '关闭', // 确认按钮内容
                    okVariant: 'danger', // 确认按钮样式
                    footerClass: ['p-3'],
                  })
                  .then(value => {})
                  .catch((err) => {})
                this.d_accountAdd = this.reset_form(this.d_accountAdd)
                this.accountSelect()
              })
              .catch((err) => console.log(err))
            break
          case 'password':
            // 密码修改
            this.post('/authoritymanagement/account/updateuserinfopassword',this.d_accountPassword)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '密码修改成功！',
                  {
                    title: '操作提醒', // 标题
                    centered: true, // 弹窗是否居中
                    hideHeaderClose: false, // 是否隐藏头部关闭按钮
                    headerBgVariant: 'success', // 头部背景
                    headerTextVariant: 'light', // 头部文字
                    headerCloseVariant: 'light', // 头部关闭按钮
                    size: 'sm', // 框尺寸
                    buttonSize: 'sm', // 按钮尺寸
                    okTitle: '关闭', // 确认按钮内容
                    okVariant: 'danger', // 确认按钮样式
                    footerClass: ['p-3'],
                  })
                  .then(value => {})
                  .catch((err) => {})
                this.accountSelect()
              })
              .catch((err) => console.log(err))
            break
          case 'role':
            // 角色修改
            this.post('/authoritymanagement/user/role/update',this.d_accountRoleUpdate)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '角色修改成功！',
                  {
                    title: '操作提醒', // 标题
                    centered: true, // 弹窗是否居中
                    hideHeaderClose: false, // 是否隐藏头部关闭按钮
                    headerBgVariant: 'success', // 头部背景
                    headerTextVariant: 'light', // 头部文字
                    headerCloseVariant: 'light', // 头部关闭按钮
                    size: 'sm', // 框尺寸
                    buttonSize: 'sm', // 按钮尺寸
                    okTitle: '关闭', // 确认按钮内容
                    okVariant: 'danger', // 确认按钮样式
                    footerClass: ['p-3'],
                  })
                  .then(value => {})
                  .catch((err) => {})
                this.accountSelect()
              })
              .catch((err) => {})
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
          case 'role':
            this.post('/authoritymanagement/user/role/select',
              {userId:item.id,merchatCode:this.$localStorage.get('merchatCode')})
              .then((res) => {
                this.d_accountRole = res.data;
                this.d_accountRoleUpdate.userId = item.id
                this.d_accountRoleUpdate.merchatCode = this.$localStorage.get('merchatCode')
                this.d_accountRoleUpdate.roles = this.d_accountRole
              })
              .catch((err) => {
                this.d_accountRole = []
              })
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

<style scoped lang="scss">
@import "Account.component";
</style>
