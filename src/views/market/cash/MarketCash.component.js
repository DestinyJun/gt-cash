import { between,or,required } from 'vuelidate/lib/validators'
import { regex } from "vuelidate/lib/validators/common.js"

var phoneNumber = regex('请输入正确的手机号！', /^1(3|4|5|7|8)\d{9}$/);

var debounce = require('lodash.debounce')
export default {
  name: 'MarketCash',
  data: function () {
    return {
      d_cashGoods: [], // 扫描的商品列表
      d_cashTotal: 0.00, // 商品总价
      d_cashOptions: [
        // 收费方式列表
        { value: '现金支付', text: '现金支付' },
        { value: '网上支付', text: '网上支付' }
      ],
      d_cashCodeGoods: [], // 手动查询商品列表
      d_cashCodeGoodSelect: null, // 手动选择商品
      d_cashCodeGoodAmount: 1, // 手动输入商品数量
      d_cashCodeOperate: null, // 手动输入商品条码
      d_cashPaySure: {
        // 确认收款
        merchatCode: this.$localStorage.get('merchatCode'),
        serverId: this.$localStorage.get('serverId'),
        userId: this.$localStorage.get('userCode'),
        payType: '现金支付',
        data: []
      },
      d_keybordTxt: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '00',],
      d_cashShopInfo: {
        active: true,
        company: "",
        discount: 1,
        goodsCode: '',
        goodsName: "",
        goodsType: "",
        id: "",
        nowPrice: "",
        nowSize: 0,
        num: "",
        purchasePrice: "",
        type: "",
        unitPrice: ""
      },
    }
  },
  validations: {
    d_cashShopInfo:{
      discount:{
        between: between(0, 1)
      },
      num: {
        required,
      }
    }
  },
  methods: {
    test1: function() {
      console.error(this.$v.d_cashShopInfo.num);
    },
    // 扫码增加商品到购物车
    cashGoodChange: debounce(function (event) {
      const goodCode = []
      for (let i = 0; i < this.d_cashGoods.length; i++) {
        goodCode.push(this.d_cashGoods[i].goodsCode)
      }
      this.cashGoodsSelect(event.target.value)
        .then((res) => {
          if (!(res.length === 0)) {
            this.d_cashTotal = 0
            if (goodCode.includes(res[0].goodsCode)) {
              this.d_cashGoods.map((val) => {
                if (res[0].goodsCode === val.goodsCode) {
                  val.num = parseInt(val.num) + 1
                  val.nowPrice = ((val.unitPrice * val.num) * val.discount).toFixed(2)
                }
              })
              this.cashCalculateTotal()
            }
            else {
              res.map((val) => {
                val.num = 1
                val.discount = 1
                val.nowPrice = ((val.unitPrice * val.num) * val.discount).toFixed(2)
                this.d_cashGoods.push(val)
              })
              this.cashCalculateTotal()
            }
          }
        })
      event.target.value = ''
    }, 800),

    // 手动添加商品到购物车
    cashCodeGoodsClick: function (index) {
      if (!(index === 'sure')) {
        this.d_cashCodeGoods.map((val) => {
          val.active = false;
        })
        this.d_cashCodeGoods[index].active = true
        this.d_cashCodeGoodSelect = index
      } else {
        if(this.d_cashCodeGoods.length !== 0) {
          this.d_cashCodeGoods[this.d_cashCodeGoodSelect].num = this.d_cashCodeGoodAmount
          const goodCode = []
          for (let i = 0; i < this.d_cashGoods.length; i++) {
            goodCode.push(this.d_cashGoods[i].goodsCode)
          }
          if (goodCode.includes(this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode)) {
            // 购物车中已存在时，增加数量
            this.d_cashGoods.map((val) => {
              if (this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode === val.goodsCode) {
                val.num = parseFloat(val.num) + parseFloat(this.d_cashCodeGoodAmount);
                val.nowPrice = ((val.unitPrice * val.num) * val.discount).toFixed(2)
              }
            })
            this.cashCalculateTotal()
          }
          else {
            // 不存在时，新增商品
            const val = this.d_cashCodeGoods[this.d_cashCodeGoodSelect]
            val.num = this.d_cashCodeGoodAmount
            val.discount = 1
            val.nowPrice = ((val.unitPrice * val.num) * val.discount).toFixed(2)
            this.d_cashGoods.push(val)
          }
          this.cashCalculateTotal()
          this.d_cashCodeGoods = []
          this.d_cashCodeGoodAmount = 1
        }
      }
    },

    // 计算商品折扣
    cashDiscountOperate: function (num) {
      this.d_cashShopInfo.discount = parseFloat(num);
      this.d_cashShopInfo.nowPrice = ((this.d_cashShopInfo.unitPrice * this.d_cashShopInfo.num) * this.d_cashShopInfo.discount).toFixed(2)
      this.cashCalculateTotal();
    },

    // 结算页商品列表操作
    cashOperateClick: function (ope, index) {
      switch (ope) {
        case 'add':
          this.d_cashGoods[index].num = parseInt(this.d_cashGoods[index].num) + 1
          this.cashCalculateTotal()
          break
        case 'minus':
          this.d_cashGoods[index].num = parseInt(this.d_cashGoods[index].num) - 1
          this.cashCalculateTotal()
          if (this.d_cashGoods[index].num == '0') {
            this.d_cashGoods.splice(index, 1)
          }
          break
        case 'del':
          this.d_cashGoods.splice(index, 1)
          this.cashCalculateTotal()
          break
      }
    },

    // 商品弹窗操作
    cashModalOperateClick:function(index) {
      this.clone_copy(this.d_cashShopInfo,this.d_cashGoods[index])
    },

    // 计算总价
    cashCalculateTotal: function () {
      this.d_cashTotal = 0
      this.d_cashGoods.map((val) => {
        this.d_cashTotal += parseFloat(val.nowPrice);
      })
    },

    // 扫码输入切换
    cashCodeBtnClick: function () {
      this.$refs.cashCodeInput.focus()
      this.$refs.cashCodeBtn.style.display = 'none'
    },

    // 扫码输入切换
    cashInputBlur: function () {
      this.$refs.cashCodeBtn.style.display = 'block'
    },

    // 手动查询商品
    cashCodeGoodSearch: function () {
      this.d_cashCodeGoods = []
      const data = { merchatCode: this.$localStorage.get('merchatCode'), code: this.d_cashCodeOperate }
      this.post(`/supermarketmanagement/supermarketcashier/goods/select`, data)
        .then((res) => {
          if (!(res.data.length === 0)) {
            res.data.map((val) => {
              val.active = false
              this.d_cashCodeGoods.push(val)
            })
          } else {
            this.$bvModal.msgBoxOk('查无此商品', {
              title: '操作提醒',
              size: 'sm',
              buttonSize: 'sm',
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'danger', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              okTitle: '关闭',
              okVariant: 'danger',
              headerClass: 'p-2 border-bottom-0',
              footerClass: 'p-2 border-top-0',
              centered: true
            })
              .then((res) => {})
              .catch((err) => {})
          }
        })
        .catch((err) => {})
    },

    // 商品查询
    cashGoodsSelect: function (code) {
      const data = { merchatCode: this.$localStorage.get('merchatCode'), code: code }
      return this.post(`/supermarketmanagement/supermarketcashier/goods/select`, data)
        .then((res) => {
          res.data.map((val) => {
            val.num = 0
            val.active = false
          })
          return res.data
        })
        .catch((err) => {
          this.$bvModal.msgBoxConfirm(
            '查无此商品条码，请手动输入查询！',
            {
              title: '操作提醒', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'danger', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'md', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              okTitle: '手动查询', // 确认按钮内容
              okVariant: 'success', // 确认按钮样式
              cancelTitle: '取消查询', // 取消按钮内容
              cancelVariant: 'danger', // 确取消按钮样式
              footerClass: ['p-3']
            })
            .then(value => {
              this.$bvModal.show('modal-center')
            })
            .catch((err) => {})
        })
    },

    // 确认支付成功
    cashPaySure () {
      const data = []
      this.d_cashGoods.map((val) => {
        data.push({ id: val.id, num: val.num.toString(), type: val.type })
      })
      this.d_cashPaySure.data = data
      this.post('/supermarketmanagement/supermarketcashier/goods/pay', this.d_cashPaySure)
        .then((res) => {
          this.$bvModal.msgBoxConfirm(
            '订单支付成功！是否打印小票？',
            {
              title: '操作提醒', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'success', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'sm', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              cancelTitle: '关闭',
              cancelVariant: 'danger', // 确认按钮样式
              okTitle: '打印', // 确认按钮内容
              okVariant: 'success', // 确认按钮样式
              footerClass: ['p-3']
            })
            .then(value => {
              if (value) {
                this.get(`/printpdf/printsupermatket?merchatCode=${this.$localStorage.get('merchatCode')}&orderNum=${res.data}`)
                  .then((res)=> {
                    const windowprint = window.open('','print');
                    if (windowprint) {
                      windowprint.document.open();
                      windowprint.document.write(this.print(
                        res.data.serverName,
                        res.data.merchantName,
                        res.data.orderNum,
                        res.data.num,
                        res.data.data,
                        res.data.userName,
                        res.data.payTime,
                        res.data.sum,
                      ));
                      windowprint.document.close();
                      windowprint.print();
                      windowprint.close();
                    }
                  })
                  .catch(err => {})
              }
            })
            .catch((err) => {})
          this.d_cashGoods = []
          this.d_cashTotal = 0.00
        })
        .catch(() => {})
    }
  }
}
