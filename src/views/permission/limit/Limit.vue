<template>
  <div class="limit container-fluid">
    <!--标题-->
    <div class="title pt-3 pb-3">
      <div class="form-inline">
        <div class="form-group mb-2 mr-0" @click="$bvModal.show('modal-add')" style="cursor: pointer">
          <i class="icon iconfont iconjia mr-3"></i>
          <span class="h5">添加角色</span>
        </div>
        <div class="form-group mb-2 w-50" style="padding-right: -1rem;justify-content: flex-end;">
          <label for="inputPassword2" class="sr-only">搜索</label>
          <input
            @input="limitCodeChange($event.target)"
            type="text" ref="searchInput"
            class="form-control w-50" id="inputPassword2"
            placeholder="请输入用户账号" style="font-size: 0.8rem">
          <b-btn size="sm" variant="primary ml-1" @click="limitCodeChange($refs.searchInput)">搜索</b-btn>
        </div>
      </div>
    </div>
    <!--表格内容-->
    <div class="content overflow-auto">
      <b-table outlined hover responsive="sm" :items="d_limitList" :fields="d_limitFields">
        <template slot="[number]" slot-scope="data">
          {{ data.index + 1 }}
        </template>
        <template slot="[operate]" slot-scope="data">
          <div
            data-toggle="tooltip" data-placement="top" title="编辑角色"
            @click="$bvModal.show('modal-update');limitOperateClick(data.item,'editor')"
            class="bg-info"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconxiugai1 text-light"></i>
          </div>
          <div
            data-toggle="tooltip" data-placement="top" title="删除角色"
            @click="limitOperateClick(data.item,'del')"
            class="bg-danger ml-3 mr-3"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconshanchu text-light"></i>
          </div>
          <div
            data-toggle="tooltip" data-placement="top" title="角色权限配置"
            @click="$bvModal.show('modal-limit');limitOperateClick(data.item,'limit')"
            class="bg-warning"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconquanxian text-light"></i>
          </div>
        </template>
      </b-table>
    </div>
    <!--新增弹窗-->
    <b-modal
      id="modal-add" centered title="角色添加"
      :header-bg-variant="'primary'"
      :header-text-variant="'light'"
      no-close-on-backdrop>
      <template slot="default">
        <div class="form-group row">
          <label for="user" class="col-sm-3 col-form-label">角色名字：</label>
          <div class="col-sm-9">
            <input type="text" id="user" class="form-control" v-model="d_limitAdd.roleName">
          </div>
        </div>
        <div class="form-group row">
          <label for="userName" class="col-sm-3 col-form-label">角色描述：</label>
          <div class="col-sm-9">
            <textarea id="userName" rows="3" cols="10" class="form-control" v-model="d_limitAdd.roleMark"></textarea>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button
          class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
          v-on:click="limitAdd('add');close()">
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
          <label for="update-userName" class="col-sm-4 col-form-label">新角色名称：	</label>
          <div class="col-sm-8">
            <input type="text" id="update-userName" class="form-control" v-model="d_limitUpdate.roleName">
          </div>
        </div>
        <div class="form-group row">
          <label for="update-userPhone" class="col-sm-4 col-form-label">新角色备注：</label>
          <div class="col-sm-8">
            <input type="tel" id="update-userPhone" class="form-control" v-model="d_limitUpdate.roleMark">
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button
          class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
          v-on:click="close();limitAdd('editor')">
          确定
        </b-button>
        <b-button
          class="pl-md-5 pr-md-5" size="sm" variant="danger"
          v-on:click="close()">
          取消
        </b-button>
      </template>
    </b-modal>
    <!--角色权限分配弹窗-->
    <b-modal
      id="modal-limit" centered
      :header-bg-variant="'warning'"
      :header-text-variant="'light'"
      no-close-on-backdrop title="账户信息修改">
      <template slot="default">
        <b-form-checkbox
          v-for="item in d_limitPermission"
          :id="'checkbox'+item.id"
          :name="'checkbox'+item.id"
          value="true"
          v-model="item.status"
          unchecked-value="false">
          {{item.permissionMark}}
        </b-form-checkbox>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button
          class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
          v-on:click="close();limitAdd('limit')">
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
    name: 'Limit',
    data(){
      return {
        d_limitList: [], // 角色列表
        d_limitFields: [
          // 角色列表表头字段
          {number: '#'},
          {roleName: '角色名'},
          {roleMark: '角色描述'},
          // {useStatus: '是否可用'},
          {operate: '操作'},
        ],
        d_limitAdd: {
          // 角色添加对象
          roleName: null,
          roleMark: null,
          merchatCode: this.$localStorage.get('merchatCode')
        },
        d_limitUpdate: {
          // 角色修改
          id: null,
          roleName: null,
          roleMark: null,
        },
        d_limitPermission: [],
        d_limitPermissionUpdate: {
          roleId: null,
          rolePermissions: null
        }
      }
    },
    methods: {
      limitSelect() {
        // 角色列表查询
        this.post(
          '/authoritymanagement/role/getallrole',
          {merchatCode:this.$localStorage.get('merchatCode')})
          .then((res) => {
            if (res.data.length !== 0) {
              this.d_limitList = res.data
            }
          })
          .catch(err => console.log(err))
      },
      limitAdd(type) {
        switch(type) {
          case 'add':
            // 角色添加
            this.post('/authoritymanagement/role/addnewrole',this.d_limitAdd)
              .then((res) => {
                this.$bvToast.toast('角色添加成功！', {
                  title: `操作提醒`,
                  variant: 'success',
                  solid: true,
                  autoHideDelay: 2000
                })
                this.d_limitAdd = this.reset_form(this.d_limitAdd)
                this.limitSelect()
              })
              .catch((err) => console.log(err))
            break
          case 'editor':
            // 角色信息修改
            this.post('/authoritymanagement/role/name/update',this.d_limitUpdate)
              .then((res) => {
                this.$bvToast.toast('角色信息修改成功！', {
                  title: `操作提醒`,
                  variant: 'success',
                  solid: true,
                  autoHideDelay: 2000
                })
                this.limitSelect()
              })
              .catch((err) => console.log(err))
            break
          case 'limit':
            // 权限修改
            this.post('/authoritymanagement/role/permission/update',this.d_limitPermissionUpdate)
              .then((res) => {
                this.$bvToast.toast('权限修改成功！', {
                  title: `操作提醒`,
                  variant: 'success',
                  solid: true,
                  autoHideDelay: 2000
                })
              })
              .catch((err) => console.log(err))
            break
        }

      },
      limitOperateClick(item,type) {
        // 账户列表相关操作
        switch(type) {
          case 'del':
            this.$bvModal.msgBoxConfirm(
              '你确定删除此角色码？',
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
            ).then(value => {
              if (value) {
                this.post('/authoritymanagement/role/deleterole',{id: item.id})
                  .then((res) => {
                    this.limitSelect()
                  })
                  .catch((err) => console.log(err))
              }
            })
            break
          case 'editor':
            this.clone_copy_a(item,this.d_limitUpdate)
            break
          case 'limit':
            this.post('/authoritymanagement/permission/rolepermissiongetall',{roleId:item.id})
              .then((res) => {
                this.d_limitPermission = res.data;
                this.d_limitPermissionUpdate.roleId = item.id
                this.d_limitPermissionUpdate.rolePermissions = this.d_limitPermission
              })
              .catch((err) => {
                this.d_limitPermission = []
              })
            break
        }
      },
      limitCodeChange: debounce(function (event) {
        if (event.value.length === 0) {
          this.limitSelect();
        } else {
          // 角色模糊查询
          this.post('/authoritymanagement/role/select', {name: event.value})
            .then((res) => {
              this.d_limitList = res.data
            })
            .catch(err => {})
        }
      },500),
    },
    created () {
      this.limitSelect();
    }
  }
</script>

<style scoped lang="scss">
@import "Limit.component";
</style>
