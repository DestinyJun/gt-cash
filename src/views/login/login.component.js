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
  validations: {
    d_loginForm:{
      user:{
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    loginClick () {
      if (!(this.$v.d_loginForm.$error) && this.$v.d_loginForm.$dirty) {
        if (this.d_loginForm.merchatCode) {
          this.post(`/user/login`,this.d_loginForm)
            .then((res) => {
              this.$localStorage.set('merchatCode', res.data.merchatCode)
              this.$localStorage.set('userCode', res.data.userId)
              this.$localStorage.set('APPKEY', res.data.APPKEY)
              this.$router.push('/home')
            })
        } else {
          this.$store.commit('remindChange',{show:true,code:'xxx',msg:'请选择店铺！'})
        }
      } else {
        this.$store.commit('remindChange',{show:true,code:'xxx',msg:'请填入正确的表单格式!'})
      }
    },
    loginShopSelect (item) {
      this.d_loginForm.merchatCode=item.merchatCode
    },
    loginSwitchChange () {
      console.log('222');
    },
    loginUserChange: debounce(function () {
      const that = this;
      this.d_loginOptions = [{ merchatCode: null, merchatName: '请选择店铺...' }]
      let aTime;
      aTime = setTimeout(() => {
        this.$http.post(`/user/selectmerchatbyuser`, { user: this.d_loginForm.user })
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
    }, 800)
  },
  created () {
    this.$localStorage.remove('userCode')
    this.$localStorage.remove('merchatCode')
    this.$localStorage.remove('routers')
  }
}
