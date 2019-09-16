import { required, minLength } from 'vuelidate/lib/validators'
export default {
  name: 'Test',
  data() {
    return {
      form: {
        userName: null,
        password: null
      }
    }
  },
  validations: {
    form: {
      userName: {
        required,
        // minLength: minLength(5)
      },
      password: {
        required,
        // minLength: minLength(8)
      }
    }
  }
}
