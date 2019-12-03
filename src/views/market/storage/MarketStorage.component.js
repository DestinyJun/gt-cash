var debounce = require('lodash.debounce')
export default {
  name: 'MarketStorage',
  data() {
    return {
      // 是否有容量的状态
      d_stHaveStatus: false,
      // 添加有条码商品参数
      d_stGoodAddCode: {
        id: '-1',
        goodsCode: null,
        goodsName: null,
        merchatCode: this.$localStorage.get('merchatCode'),
        company: null,
        unitPrice: null,
        purchasePrice: null,
        goodsType: '0',
        haveCapacity: 1,
        containGoodsCode: null,
        capacity: null,
        capacityCompany: null,
      },
      // 添加无条码商品参数
      d_stGoodAddNoCode: {
        id: '-1',
        goodsCode: null,
        goodsName: null,
        merchatCode: this.$localStorage.get('merchatCode'),
        company: null,
        unitPrice: null,
        purchasePrice: null,
        goodsType: '0',
      },
      // 表头字段
      d_stCodeGoodsField: [
        {goodsCode: '条码/自定义编码'},
        {goodsName: '商品名称'},
        {nowSize: '当前库存'},
        {company: '单位'},
        {unitPrice: '单价'},
        {purchasePrice: '进价'},
        {purchasePrice: '进价'},
        {number: '入库数量'},
      ],
      // 准备入库的商品列表
      d_stCodeGoodsList: [],
      // 商品类型
      d_stGoodTypes: [],
      // 根据商品码查询出的商品
      d_stGoodSearch: [],
      // 选择入库商品
      d_stGoodSearchSelect: {
        active: null,
        company: null,
        goodsCode: null,
        goodsName: null,
        goodsType: null,
        type: null,
        id: null,
        nowSize: null,
        number: null,
        purchasePrice: null,
        unitPrice: null,
      }
    }
  },
  methods: {
    // 商品添加参数切换
    stHaveCapacityChange(event){
      if (event.target.value === '1') {
        this.d_stHaveStatus = false
      } else if (event.target.value === '0') {
        this.d_stHaveStatus = true
      }
    },
    // 有条码商品添加
    stAddGoodClick(){
      this.post('/supermarketmanagement/supermarketstorage/public/update',this.d_stGoodAddCode)
        .then(() => {
          this.$bvModal.msgBoxOk(
            '商品添加成功！',
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
          this.stInputReset();
        })
        .catch((err) => {})
    },
    // 无条码商品添加
    stNoCodeGoodAddGood() {
      this.post('/supermarketmanagement/supermarketstorage/private/update', this.d_stGoodAddNoCode)
        .then(() => {
          this.$bvModal.msgBoxOk(
            '商品添加成功！',
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
            .then(value => {
            })
            .catch((err) => {
            })
          this.stInputReset();
        })
        .catch((err) => {})
    },
    // 表单重置
    stInputReset() {
      for (const prop in this.d_stGoodAdd) {
        if (this.d_stGoodAdd.hasOwnProperty(prop)) {
          this.d_stGoodAdd[prop] = null
        }
      }
    },
    //扫码入库查询
    stScanChange: debounce(function (event) {
      console.log(event.value);
      this.d_stGoodSearch = []
      this.post(
        '/supermarketmanagement/supermarketstorage',
        {goodsCode: event.value,merchatCode:this.$localStorage.get('merchatCode')})
        .then((res) => {
          if (!(res.data.length === 0)) {
            this.$bvModal.show('modal-center-scan')
            res.data[0].active = false
            res.data[0].type = 'public'
            res.data[0].number = 0
            this.d_stGoodSearch.push(res.data[0])
          }
        })
        .catch(err => {
          /*this.$bvModal.msgBoxConfirm(
            '查无此商品条码，请手动入库！',
            {
              title: '操作提醒', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'danger', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'md', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              okTitle: '手动入库', // 确认按钮内容
              okVariant: 'success', // 确认按钮样式
              cancelTitle: '取消入库',// 取消按钮内容
              cancelVariant: 'danger',// 确取消按钮样式
              footerClass: ['p-3'],
            })
            .then(value => {
              if (value) {
                this.$bvModal.hide('modal-center-scan')
                this.$bvModal.show('modal-center-code')
              }
            })
            .catch((err) => {})*/
        })
      event.value = ''
    },500),
    // 手动入库查询
    stCodeChange(event) {
      this.d_stGoodSearch = []
      this.post(
        '/supermarketmanagement/supermarketstorage',
        {goodsCode: event.value,merchatCode:this.$localStorage.get('merchatCode')})
        .then((res) => {
          if (!(res.data.length === 0)) {
            res.data.map((val) => {
              val.active = false
              val.number = 0
              this.d_stGoodSearch.push(val)
            })
          }
        })
        .catch(err => {
          /*this.$bvModal.msgBoxConfirm(
            '查无此商品条码，请新增商品！',
            {
              title: '操作提醒', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'danger', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'md', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              okTitle: '新增商品', // 确认按钮内容
              okVariant: 'success', // 确认按钮样式
              cancelTitle: '取消入库',// 取消按钮内容
              cancelVariant: 'danger',// 确取消按钮样式
              footerClass: ['p-3'],
            })
            .then(value => {
              if (value) {
                // this.$bvModal.hide('modal-center-code')
                this.$bvModal.show('modal-center-add')
              }
            })
            .catch((err) => {})*/
        })
      event.value = ''
    },
    // 选择需要入库的商品
    stSearchGoodsSelect: function (item) {
      this.d_stGoodSearch.map((val) => {
        val.active = false
      })
      item.active = true
      this.clone_copy_a(item,this.d_stGoodSearchSelect)
    },
    // 确认入库数量
    stStorageSure: function () {
      if (this.d_stGoodSearchSelect.goodsCode == null) {
        this.$bvModal.msgBoxOk(
          '请选择需要入库的商品！',
          {
            title: '错误操作', // 标题
            centered: true, // 弹窗是否居中
            hideHeaderClose: false, // 是否隐藏头部关闭按钮
            headerBgVariant: 'danger', // 头部背景
            headerTextVariant: 'light', // 头部文字
            headerCloseVariant: 'light', // 头部关闭按钮
            size: 'sm', // 框尺寸
            buttonSize: 'sm', // 按钮尺寸
            okTitle: '确定', // 确认按钮内容
            okVariant: 'info', // 确认按钮样式
            footerClass: ['p-3'],
          })
          .then(value => {})
          .catch((err) => {})
      }
      else {
        const goodCode = []
        for (let i = 0; i < this.d_stCodeGoodsList.length; i++) {
          goodCode.push(this.d_stCodeGoodsList[i].goodsCode)
        }
        if (goodCode.includes(this.d_stGoodSearchSelect.goodsCode)) {
          this.d_stCodeGoodsList.map((val) => {
            if (this.d_stGoodSearchSelect.goodsCode === val.goodsCode) {
              val.number = parseFloat(val.number) + parseFloat(this.d_stGoodSearchSelect.number)
            }
          })
        }
        else {
          const obj = this.clone_obj(this.d_stGoodSearchSelect);
          this.d_stCodeGoodsList.push(obj)
        }
      }
      this.d_stGoodSearch = [];
      this.reset_form(this.d_stGoodSearchSelect)
    },
    // 提交入库
    stStorageSubmit: function () {
      const data = []
      this.d_stCodeGoodsList.map((val) => {
        data.push({id: val.id,type: val.type,number:val.number})
      })
      this.post('/supermarketmanagement/supermarketstorage/submit',data)
        .then((res) => {
          this.$bvModal.msgBoxConfirm(
            '入库成功！',
            {
              title: '操作提醒', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'success', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'md', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              okTitle: '继续入库', // 确认按钮内容
              okVariant: 'success', // 确认按钮样式
              cancelTitle: '取消入库',// 取消按钮内容
              cancelVariant: 'danger',// 确取消按钮样式
              footerClass: ['p-3'],
            })
            .then(value => {
              this.refs.storageCodeInput.focus()
              this.$refs.storageCodeBtn.style.display = 'none'
            })
            .catch((err) => {})
          this.d_stCodeGoodsList = []
        })
        .catch((err) => {})
    },
    // 扫码输入切换
    srCodeBtnClick: function () {
      this.$refs.storageCodeInput.focus()
      this.$refs.storageCodeBtn.style.display = 'none'
    },
    // 扫码输入切换
    srCodeInputBlur: function () {
      this.$refs.storageCodeBtn.style.display = 'inline-block'
    },
  },
  created () {
    this.post('/supermarketmanagement/supermrketstorage/goodstype/get',{}).then((res) => {
      this.d_stGoodTypes = res.data
    })
  }
}
