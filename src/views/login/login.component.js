import Loading from '../../components/Loading'
import { required } from 'vuelidate/lib/validators'

var debounce = require('lodash.debounce')
export default {
  name: 'Login',
  components: { Loading },
  data: () => {
    return {
      d_loginForm: {
        user: '',
        password: '',
        merchatCode: '',
        thisUserId: '-1', // 本次交班的code
        thisShiftCode: null, // 上次交班的code
        nextShiftCode: null, // 本次交班的code
      },
      d_loginError: {
        user_error: '',
        password_error: ''
      },
      d_loginOptions: [
        { merchatCode: null, merchatName: '请选择店铺...' },
      ],
      d_loginShopSelect: '请选择店铺...',
      d_shiftOptions: [
        { value: null, text: '请选择班别...' },
      ],
      d_shiftMemberOptions: [
        { text: '无交班登陆', value: '-1' },
      ]
    }
  },
  validations: {
    d_loginForm: {
      user: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    loginClick (flag) {
      if (!(this.$v.d_loginForm.$error) && this.$v.d_loginForm.$dirty) {
        if (this.d_loginForm.merchatCode) {
          if (flag === 'shift') {
            this.post(`/user/shift/login`, this.d_loginForm)
              .then((res) => {
                this.$localStorage.set('merchatCode', res.data.merchatCode)
                this.$localStorage.set('userCode', res.data.userId)
                this.$localStorage.set('APPKEY', res.data.APPKEY)
                this.$localStorage.set('serverId', res.data.serverId)
                this.$router.push('/home')
              })
          } else {
            const login = Object.assign({}, {
              user: this.d_loginForm.user,
              password: this.d_loginForm.password,
              shiftCode: this.d_loginForm.thisShiftCode,
              merchatCode: this.d_loginForm.merchatCode,
            })
            this.post(`/user/shift/brokenLineLogin`, login)
              .then((res) => {
                this.$localStorage.set('merchatCode', res.data.merchatCode)
                this.$localStorage.set('userCode', res.data.userId)
                this.$localStorage.set('APPKEY', res.data.APPKEY)
                this.$localStorage.set('serverId', res.data.serverId)
                this.$router.push('/home')
              })
          }
        } else {
          this.$store.commit('remindChange', { show: true, code: 'xxx', msg: '请选择店铺！' })
        }
      } else {
        this.$store.commit('remindChange', { show: true, code: 'xxx', msg: '请填入正确的表单格式!' })
      }
    },
    loginShopSelect (item) {
      this.d_loginShopSelect = item.merchatName
      this.d_loginForm.merchatCode = item.merchatCode
      this.get(`/user/getShiftName`, { merchatCode: item.merchatCode })
        .then((res) => {
          res.data.map((item) => {
            this.d_shiftOptions.push(Object.assign({}, { value: item.shiftCode, text: item.shiftName }))
          })
        })
    },
    loginSwitchChange () {
      console.log('222')
    },
    loginUserChange: debounce(function () {
      const that = this
      this.d_loginOptions = [{ merchatCode: null, merchatName: '请选择店铺...' }]
      let aTime
      aTime = setTimeout(() => {
        this.$http.post(`/user/selectmerchatbyuser`, { user: this.d_loginForm.user })
          .then(function (response) {
            const data = response.data.data
            for (var i = 0, len = data.length; i < len; i++) {
              that.d_loginOptions.push(data[i])
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }, 500)
    }, 800),
    shiftSelectChange (item, flag) {
      if (flag === 'select') {
        this.d_shiftMemberOptions = [
          { text: '无交班登陆', value: '-1' },
        ]
        this.d_loginForm.thisShiftCode = item
        this.post(`/user/getSuccessor`, { merchatCode: this.d_loginForm.merchatCode, shiftCode: item })
          .then((res) => {
            res.data.map((item) => {
              this.d_shiftMemberOptions.push(Object.assign({}, { value: item.thisUserId, text: item.thisUserName }))
            })
          })
      } else {
        this.d_loginForm.nextShiftCode = item
      }
    }
  },
  created () {
    this.$localStorage.remove('userCode')
    this.$localStorage.remove('merchatCode')
    this.$localStorage.remove('routers')
  },
}
