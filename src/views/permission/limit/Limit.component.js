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
        this.post('/authoritymanagement/role/select', {name: event.value,merchatCode: this.$localStorage.get('merchatCode')})
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
