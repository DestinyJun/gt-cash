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
      d_cashCodeGoodAmount: null, // 手动输入商品数量
      d_cashCodeOperate: null, // 手动输入商品条码
      d_cashPaySure: {
        // 确认收款
        merchatCode: this.$localStorage.get('merchatCode'),
        serverId: '111',
        userId: this.$localStorage.get('userCode'),
        payType: '现金支付',
        data: []
      }
    }
  },
  methods: {
    // 扫码结算商品
    cashGoodChange: debounce(function (event) {
      const goodCode = []
      for (let i = 0; i < this.d_cashGoods.length; i++) {
        goodCode.push(this.d_cashGoods[i].goodsCode)
      }
      this.cashGoodsSelect(event.target.value)
        .then((res) => {
          if (res) {
            this.d_cashTotal = 0
            res.num = 1
            if (goodCode.includes(res.goodsCode)) {
              this.d_cashGoods.map((val) => {
                if (res.goodsCode === val.goodsCode) {
                  val.num = parseInt(val.num) + 1
                }
                this.d_cashTotal += (parseFloat(val.num) * parseFloat(val.unitPrice))
              })
            } else {
              this.d_cashGoods.push(res)
              this.cashCalculateTotal()
            }
          } else {
            // 错误提示
          }
        })
      event.target.value = ''
    }, 800),
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
    // 计算总价
    cashCalculateTotal: function () {
      this.d_cashTotal = 0
      this.d_cashGoods.map((val) => {
        this.d_cashTotal += (parseFloat(val.num) * parseFloat(val.unitPrice))
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
    // 手动输入编码商品操作
    cashCodeGoodsClick: function (index) {
      if (!(index === 'sure')) {
        this.d_cashCodeGoods.map((val) => {
          val.active = false
        })
        this.d_cashCodeGoods[index].active = true
        this.d_cashCodeGoodSelect = index
      } else {
        if (this.d_cashCodeGoodAmount) {
          if (this.d_cashCodeGoodAmount) {
            this.d_cashCodeGoods[this.d_cashCodeGoodSelect].num = this.d_cashCodeGoodAmount
            const goodCode = []
            for (let i = 0; i < this.d_cashGoods.length; i++) {
              goodCode.push(this.d_cashGoods[i].goodsCode)
            }
            if (goodCode.includes(this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode)) {
              this.d_cashGoods.map((val) => {
                if (this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode === val.goodsCode) {
                  val.num = parseFloat(val.num) + parseFloat(this.d_cashCodeGoodAmount)
                }
                this.cashCalculateTotal()
              })
            } else {
              this.d_cashGoods.push(this.d_cashCodeGoods[this.d_cashCodeGoodSelect])
              this.cashCalculateTotal()
            }
            this.cashCalculateTotal()
            this.d_cashCodeGoods = []
          }
        }
      }
    },
    // 手动查询商品
    cashCodeGoodSearch: function () {
      this.d_cashCodeGoods = []
      const data = { merchatCode: this.$localStorage.get('merchatCode'), code: this.d_cashCodeOperate }
      this.post(`/supermarketmanagement/supermarketcashier/goods/select`, data)
        .then((res) => {
          if (!(res.data.length === 0)) {
            res.data.num = 0
            res.data.active = false
            res.data.map((val) => {
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
        .catch((err) => {
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
        })
    },
    // 商品查询
    cashGoodsSelect: function (code) {
      const data = { merchatCode: this.$localStorage.get('merchatCode'), code: code }
      return this.post(`/supermarketmanagement/supermarketcashier/goods/select`, data)
        .then((res) => {
          res.data.num = 0
          res.data.active = false
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
                window.open(`${process.env.VUE_APP_URL}/printpdf/cateringcashier?merchatCode=${this.$localStorage.get('merchatCode')}&orderNum=${res.data}`)
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
