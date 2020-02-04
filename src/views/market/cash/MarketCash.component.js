import Vue from 'vue'
import { between,or,required } from 'vuelidate/lib/validators'
import { regex } from "vuelidate/lib/validators/common.js"
var phoneNumber = regex('请输入正确的手机号！', /^1(3|4|5|7|8)\d{9}$/);
var debounce = require('lodash.debounce')
export default {
  name: 'MarketCash',
  data: function () {
    return {
      d_cashGoods: [], // 扫描的商品列表
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
        payType: '现金',
        accountsReceivable: 0.00, // 应收金额
        sales: 0.00, // 实收金额
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
      d_cashDom: null,
      d_cashMoney: null, // 收取现金
      d_cashChangeMoney: 0, // 应找零钱
      d_cashPage: {
        currentPage: 1, // 当前页
        pageNum: 1,// 总页数
        pageSize: 5, // 每页显示多少条
      },
      d_cashOrderNum: null, // 订单编号
      d_cashOrderList: [], //订单列表
      d_cashOrderInfo: [], // 订单详情
      d_cashOrderInfoId: [], // 退货商品
      d_cashOrderInfoNum: null, // 退货商品数量
      d_cashGiftList: [], // 大礼包列表
      d_cashGiftPage: { // 大礼包分页
        currentPage: 1, // 当前页
        pageNum: 1,// 总页数
        pageSize: 5, // 每页显示多少条
      },
      d_cashGiftAdd: { // 大礼包添加
        merchatCode: this.$localStorage.get('merchatCode'),
        lastUserId: this.$localStorage.get('userCode'),
        giftName: null, // 大礼包名称
        unitPrice: null, // 大礼包定价
        sales: 0.00, // 包含商品总价
        giftCode: null, // 大礼包编码
        upperShelf: 0, // 出售状态
        giftPackageInfoDTOS:[] // 包含商品
      },
      d_cashGiftNum: null, // 大礼包编号
      d_cashGiftEdit: { // 大礼包添加
        merchatCode: this.$localStorage.get('merchatCode'),
        lastUserId: this.$localStorage.get('userCode'),
        giftName: null, // 大礼包名称
        unitPrice: null, // 大礼包定价
        sales: 0.00, // 包含商品总价
        giftPackageCode: null, // 大礼包编码
        upperShelf: '上架', // 出售状态
        giftGoodsInfos:[] // 包含商品
      },
      d_cashGiftStatus: 'add',
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
    // 扫码增加商品到购物车
    cashGoodChange: debounce(function (event) {
      const goodCode = []
      for (let i = 0; i < this.d_cashGoods.length; i++) {
        goodCode.push(this.d_cashGoods[i].goodsCode)
      }
      this.cashGoodsSelect(event.target.value)
        .then((res) => {
          if (!(res.length === 0)) {
            this.d_cashPaySure.sales = 0
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

    // 手动添加商品到购物车或者添加大礼包商品
    cashCodeGoodsClick: function (index,modal) {
      if (modal === 'select') {
        this.d_cashCodeGoods.map((val) => {
          val.active = false;
        })
        this.d_cashCodeGoods[index].active = true
        this.d_cashCodeGoodSelect = index
      }
      else {
        if(this.d_cashCodeGoods.length !== 0) {
          let goodCode = []
          // manual
          if (modal === 'manual') {
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
              this.cashCalculateTotal('manual')
            }
            else {
              // 不存在时，新增商品
              const val = this.d_cashCodeGoods[this.d_cashCodeGoodSelect]
              val.num = this.d_cashCodeGoodAmount
              val.discount = 1
              val.nowPrice = ((val.unitPrice * val.num) * val.discount).toFixed(2)
              this.d_cashGoods.push(val)
              this.cashCalculateTotal('manual')
            }
          }
          // gift
          if (modal === 'gift') {
            for (let i = 0; i < this.d_cashGiftAdd.giftPackageInfoDTOS.length; i++) {
              goodCode.push(this.d_cashGiftAdd.giftPackageInfoDTOS[i].goodsCode)
            }
            if (goodCode.includes(this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode)) {
              // 购物车中已存在时，增加数量
              this.d_cashGiftAdd.giftPackageInfoDTOS.map((val) => {
                if (this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode === val.goodsCode) {
                  val.number = parseFloat(val.number) + parseFloat(this.d_cashCodeGoodAmount);
                  val.nowPrice = (val.unitPrice * val.number).toFixed(2)
                }
              })
              this.cashCalculateTotal('gift')
            }
            else {
              // 不存在时，新增商品
              const val = this.d_cashCodeGoods[this.d_cashCodeGoodSelect]
              val.number = this.d_cashCodeGoodAmount
              val.nowPrice = (val.unitPrice * val.number).toFixed(2)
              this.d_cashGiftAdd.giftPackageInfoDTOS.push(val)
              this.cashCalculateTotal('gift')
            }
          }
          // edit
          if (modal === 'edit') {
            for (let i = 0; i < this.d_cashGiftEdit.giftGoodsInfos.length; i++) {
              goodCode.push(this.d_cashGiftEdit.giftGoodsInfos[i].goodsCode)
            }
            if (goodCode.includes(this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode)) {
              // 购物车中已存在时，增加数量
              this.d_cashGiftEdit.giftGoodsInfos.map((val,index) => {
                if (this.d_cashCodeGoods[this.d_cashCodeGoodSelect].goodsCode === val.goodsCode) {
                  // Vue.set(val.number,parseFloat(val.number) + parseFloat(this.d_cashCodeGoodAmount))
                  // Vue.set(val.nowPrice,(val.unitPrice * val.number).toFixed(2))
                  // this.$set(this.d_cashGiftEdit.giftGoodsInfos[index],'number',parseFloat(val.number) + parseFloat(this.d_cashCodeGoodAmount))
                  // this.$set(this.d_cashGiftEdit.giftGoodsInfos[index],'nowPrice',(val.unitPrice * val.number).toFixed(2))
                  val.number = parseFloat(val.number) + parseFloat(this.d_cashCodeGoodAmount)
                  val.nowPrice = (val.unitPrice * val.number).toFixed(2)
                }
              })
              this.cashCalculateTotal('edit')
            }
            else {
              // 不存在时，新增商品
              const val = this.d_cashCodeGoods[this.d_cashCodeGoodSelect]
              val.number = this.d_cashCodeGoodAmount
              val.nowPrice = (val.unitPrice * val.number).toFixed(2)
              this.d_cashGiftEdit.giftGoodsInfos.push(val)
              this.cashCalculateTotal('edit')
            }
          }
          this.d_cashCodeGoods = []
          this.d_cashCodeGoodAmount = 1
        }
      }
    },

    // 计算商品折扣
    cashDiscountOperate: function (num) {
      this.d_cashDom = this.$refs.discount
      this.d_cashShopInfo.discount = parseFloat(num);
      this.d_cashShopInfo.nowPrice = ((this.d_cashShopInfo.unitPrice * this.d_cashShopInfo.num) * this.d_cashShopInfo.discount).toFixed(2)
      this.cashCalculateTotal('manual');
    },

    // 结算页商品列表操作
    cashOperateClick: function (ope,item,index) {
      this.clone_copy(this.d_cashShopInfo,item)
      switch (ope) {
        case 'add':
          item.num = parseInt(item.num) + 1
          item.nowPrice = ((item.unitPrice * item.num) * item.discount).toFixed(2)
          this.cashCalculateTotal('manual')
          break
        case 'minus':
          item.num = parseInt(item.num) - 1
          if (item.num === 0) {
            this.d_cashGoods.splice(index, 1)
          } else {
            item.nowPrice = ((item.unitPrice * item.num) * item.discount).toFixed(2)
          }
          this.cashCalculateTotal('manual')
          break
        case 'del':
          this.d_cashGoods.splice(index, 1)
          this.cashCalculateTotal('manual')
          break
      }
    },

    // 商品弹窗操作
    cashModalOperateClick:function(item) {
      this.clone_copy(this.d_cashShopInfo,item)
    },

    // 计算总价
    cashCalculateTotal: function (model) {
      if (model === 'edit') {
        let totalPrice = 0
        this.d_cashGiftEdit.giftGoodsInfos.map((val) => {
          totalPrice += parseFloat(val.nowPrice);
        })
        this.$set(this.d_cashGiftEdit,'sales',totalPrice);
      }
      if (model === 'gift') {
        this.d_cashGiftAdd.sales = 0
        this.d_cashGiftAdd.giftPackageInfoDTOS.map((val) => {
          this.d_cashGiftAdd.sales += parseFloat(val.nowPrice);
        })
      }
      if (model === 'manual') {
        this.d_cashPaySure.sales = 0
        this.d_cashPaySure.accountsReceivable = 0
        this.d_cashPaySure.data = []
        this.d_cashGoods.map((val) => {
          this.d_cashPaySure.sales += parseFloat(val.nowPrice);
          this.d_cashPaySure.accountsReceivable += parseFloat((val.unitPrice * val.num).toFixed(2))
          this.d_cashPaySure.data.push({
            id: val.id,
            type: val.type,
            num: val.num,
            discount: val.discount
          })
        })
      }
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

    // 键盘操作
    cashKeybordClick: function (item) {
      if (!this.d_cashDom) {
        return false;
      }
      if (item.toString()) {
        this.d_cashDom.focus()
        if (item === 'del') {
          let str = this.d_cashDom.value
          str=str.substring(0,str.length-1)
          this.cashInputValue(str)
        }
        else if (item === 'sure') {
          this.d_cashShopInfo.nowPrice = ((this.d_cashShopInfo.unitPrice * this.d_cashShopInfo.num)*this.d_cashShopInfo.discount).toFixed(2)
          this.d_cashGoods.map((val) => {
            if(this.d_cashShopInfo.id === val.id) {
              this.clone_copy(val,this.d_cashShopInfo)
              this.cashCalculateTotal('manual');
            }
          })
        }
        else {
          let astr = this.d_cashDom.value
          astr += this.d_keybordTxt[item]
          this.cashInputValue(astr)
        }
      }
    },

    // 给获得焦点的input赋值
    cashInputValue: function(value) {
      if (this.d_cashDom.id === 'shopNum') {
        this.d_cashShopInfo.num = value;
      }
      if (this.d_cashDom.id === 'discount') {
        this.d_cashShopInfo.discount = value;
      }
      if (this.d_cashDom.id === 'cashMoney') {
        this.d_cashMoney = value;
        this.cashChangeMoneyOperate(value);
      }
      if (this.d_cashDom.id === 'cashOrderInfoId') {
        this.d_cashOrderInfoNum = value;
      }
    },

    // 给input绑定键盘
    cashShopNumFocus: function(dom,model) {
      this.d_cashDom = dom;
    },

    // 零钱计算
    cashChangeMoneyOperate: function(value) {
      if (value && parseFloat(value) >this.d_cashPaySure.sales ) {
        this.d_cashChangeMoney = (parseFloat(value) - parseFloat(this.d_cashPaySure.sales)).toFixed(2)
      } else {
        this.d_cashChangeMoney = 0
      }
    },

    // 确认支付成功
    cashPaySure () {
      this.post('/supermarketmanagement/supermarketcashier/goods/newPay', this.d_cashPaySure)
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
          this.d_cashPaySure.sales = 0.00
        })
        .catch(() => {})
    },

    // 订单列表分页查询
    cashOrderPageChange() {
      this.post(
        `/supermarketmanagement/returnGoods/getBillList`,
        {
          pageSize: this.d_cashPage.pageSize,
          pageNum: this.d_cashPage.currentPage,
          merchatCode: this.$localStorage.get('merchatCode'),
          userId: this.$localStorage.get('userCode'),
        }).then((res) => {
          this.d_cashOrderList = res.data
          this.d_cashPage.pageNum = res.totalRecord;
      })
    },

    // 根据订单号精准查询
    cashOrderPageSearch() {
      this.post(
        `/supermarketmanagement/returnGoods/selectBill`,
        {
          orderNum: this.d_cashOrderNum,
          merchatCode: this.$localStorage.get('merchatCode'),
        }).then((res) => {
          console.log(res);
          this.d_cashOrderList = res.data
          this.d_cashPage.pageNum = res.totalRecord;
      })
    },

    // 订单详情
    cashOrderSelect(item) {
      this.post(
        `/supermarketmanagement/returnGoods/getBillInfo`,
        {
          billId: item.id,
        }).then((res) => {
        this.d_cashOrderInfo = res.data;
      })
    },

    // 退货数量失去焦点
    cashOrderInfoIdBlur(item) {
      if (this.d_cashOrderInfoId.length>0) {
        this.d_cashOrderInfoId.map((val) => {
          if (val.billInfoId === item.id) {
            val.num = this.d_cashOrderInfoNum;
          } else {
            this.d_cashOrderInfoId.push({
              billInfoId: item.id,
              num: this.d_cashOrderInfoNum
            })
          }
        })
      } else {
        this.d_cashOrderInfoId.push({
          billInfoId: item.id,
          num: this.d_cashOrderInfoNum
        })
      }
    },

    // 退货订单精准查询
    cashOrderReturnInfo() {
      this.post(
        `/supermarketmanagement/returnGoods/selectBill`,
        {
          orderNum: this.d_cashOrderNum,
          merchantCode: this.$localStorage.get('merchatCode'),
        }).then((res) => {
        this.post(
          `/supermarketmanagement/returnGoods/getBillInfo`,
          {
            billId: res.data[0].id,
          }).then((res) => {
          this.d_cashOrderInfo = res.data;
        })
      })
    },

    // 确定退货
    cashOrderReturnSure() {
      this.post(
        `/supermarketmanagement/returnGoods/returnGoods`,
        this.d_cashOrderInfoId
        ).then((res) => {
        this.$bvModal.msgBoxOk(
          '退货成功！',
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
            footerClass: ['p-3']
          })
          .then(value => {})
          .catch((err) => {})
      })
    },

    // 大礼包分页查询
    cashGiftPageChange() {
      this.post(
        `/supermarketmanagement/gift/getGiftList`,
        {
          pageSize: this.d_cashGiftPage.pageSize,
          pageNum: this.d_cashGiftPage.currentPage,
          merchatCode: this.$localStorage.get('merchatCode'),
        }).then((res) => {
          this.d_cashGiftList = res.data
          this.d_cashGiftList.map((val) => {
            let goodsString = '';
            val.giftGoodsInfos.map((res) =>{
              goodsString += res.goodsName + '，';
            })
            goodsString = goodsString.substring(0,goodsString.length-1)
            val.goodsString = goodsString
          })
          this.d_cashGiftPage.pageNum = res.totalRecord;
      })
    },

    // 大礼包根据编号精准查询
    cashGiftPageSearch() {
      this.post(
        `/supermarketmanagement/gift/selectGoods`,
        {
          key: this.d_cashGiftNum,
          merchatCode: this.$localStorage.get('merchatCode'),
        }).then((res) => {
        this.d_cashGiftList = res.data
        this.d_cashGiftPage.pageNum = res.totalRecord;
      })
    },

    // 大礼包操作
    cashGiftOperate (type,ope,item,index) {
      switch (ope) {
        case 'add':
          item.number = parseInt(item.number) + 1
          item.nowPrice = (item.unitPrice * item.number).toFixed(2)
          if (type === 'add') {
            this.cashCalculateTotal('gift')
          }
          if (type === 'edit') {
            this.cashCalculateTotal('edit')
          }
          break
        case 'minus':
          item.number = parseInt(item.number) - 1
          if (item.number === 0) {
            if (type === 'add') {
              this.d_cashGiftAdd.giftPackageInfoDTOS.splice(index, 1)
            } else {
              this.d_cashGiftEdit.giftGoodsInfos.splice(index, 1)
            }
          } else {
            item.nowPrice = (item.unitPrice * item.number).toFixed(2)
          }
          if (type === 'add') {
            this.cashCalculateTotal('gift')
          }
          if (type === 'edit') {
            this.cashCalculateTotal('edit')
          }
          break
        case 'del':
          if (type === 'add') {
            this.cashCalculateTotal('gift')
            this.d_cashGiftAdd.giftPackageInfoDTOS.splice(index, 1)
          }
          if (type === 'edit') {
            this.d_cashGiftEdit.giftGoodsInfos.splice(index, 1)
            this.cashCalculateTotal('edit')
          }
          break
      }
    },

    // 大礼包编辑点击
    cashGiftEditClick(item) {
      item.giftGoodsInfos.map((val) => {
        val.nowPrice = (val.unitPrice * val.number).toFixed(2)
      })
      this.d_cashGiftEdit=item;
      this.d_cashGiftEdit.sales = 0
      this.cashCalculateTotal('edit')
    },

    // 大礼包编辑提交
    cashGiftEditSubmit() {
      console.log(this.d_cashGiftEdit);
    },

    // 大礼包查询商品
    cashGiftGoodSearch: function () {
      this.d_cashCodeGoods = []
      const data = { merchatCode: this.$localStorage.get('merchatCode'), code: this.d_cashCodeOperate }
      this.post(`/supermarketmanagement/gift/getGoods`, data)
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
    },

    // 新增大礼包操作
    cashGiftAdd: function () {
      this.d_cashGiftAdd.giftPackageInfoDTOS.map((val) =>{
        val.goodsId = val.id
        delete val.active
        delete val.id
        delete val.nowPrice
      })
      this.post(
        `/supermarketmanagement/gift/addNewGoods`,
        this.d_cashGiftAdd
      ).then(() => {
        this.$bvModal.msgBoxOk(
          '添加成功！',
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
            footerClass: ['p-3']
          })
          .then(() => {
            // 重置参数
            this.d_cashGiftAdd = {
              merchatCode: this.$localStorage.get('merchatCode'),
                lastUserId: this.$localStorage.get('userCode'),
                giftName: null, // 大礼包名称
                unitPrice: null, // 大礼包定价
                sales: 0.00, // 包含商品总价
                giftCode: null, // 大礼包编码
                upperShelf: 0, // 出售状态
                giftPackageInfoDTOS:[] // 包含商品
            }
            this.cashGiftPageChange()
          })
      })
    },

    // 大礼包操作删除/编辑操作
    cashGiftDelete (item, type) {
      switch (type) {
        case 'del':
          this.$bvModal.msgBoxConfirm(
            '您确定要是删除此大礼包吗？',
            {
              title: '删除提醒', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'danger', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'sm', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              okTitle: '取消', // 确认按钮内容
              okVariant: 'danger', // 确认按钮样式
              cancelTitle: '确认', // 取消按钮内容
              cancelVariant: 'success', // 确取消按钮样式
              footerClass: ['p-3']
            })
            .then(value => {
              if (!value) {
                this.post(`/supermarketmanagement/gift/deleteGift`, { id: item.id, userId: this.$localStorage.get('userCode')}).then(() => {
                  this.$bvModal.msgBoxOk(
                    '删除成功！',
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
                      footerClass: ['p-3']
                    })
                    .then(() => {
                      this.cashGiftPageChange()
                    })
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
          break
        case 'editor':
          break
      }
    }
  }
}
