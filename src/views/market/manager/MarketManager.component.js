export default {
  name: 'market-manager',
  data: function () {
    return {
      d_mnHaveStatus: false, // 是否有容量的状态
      d_mFields: [
        // 表头
        { index: '#' },
        { goodsName: '产品名称' },
        { upperShelf: '是否上架' },
        { purchasePrice: '进价' },
        { company: '单位' },
        { unitPrice: '单价' },
        { nowSize: '当前库存' },
        { operate: '操作' }
      ],
      d_mnGoods: [], // 商品列表
      d_mnGoodTypes: [], // 商品类型列表
      d_destroy: {
        // 下架商品
        id: null,
        goodsType: null,
        destructionNumber: null,
        mark: null,
        userCode: null,
        merchatCode: null,
        goodsName: null
      },
      d_mnPrivateUpdate: {
        // private商品修改
        id: null,
        goodsCode: null,
        goodsName: null,
        merchatCode: 1,
        company: null,
        unitPrice: null,
        upperShelf: null,
        purchasePrice: null,
        goodsType: null
      },
      d_mnPublicUpdate: {
        // public商品修改
        id: null,
        goodsCode: null,
        goodsName: null,
        merchatCode: 1,
        company: null,
        unitPrice: null,
        upperShelf: null,
        purchasePrice: null,
        goodsType: null,
        haveCapacity: null,
        containGoodsCode: null,
        capacity: null,
        capacityCompany: null
      }
    }
  },
  methods: {
    // 商品添加参数切换
    mnHaveCapacityChange (val) {
      if (val === '1') {
        this.d_mnHaveStatus = false
      } else if (val === '0') {
        this.d_mnHaveStatus = true
      }
    },
    mnSelectGoodList () {
      // 商品列表查询
      this.post(
        `/supermarketmanagement/supermarketstorage/goods/getlist`,
        { merchatCode: this.$localStorage.get('merchatCode') })
        .then((res) => {
          this.d_mnGoods = res.data.publicGoodsList.concat(res.data.privateGoodsList)
        })
    },
    mnTableOperateClick (item, type) {
      // 商品操作事件
      switch (type) {
        case 'editor':
          if (item.type === 'public') {
            this.$bvModal.show('add-code')
            for (const prop in this.d_mnPublicUpdate) {
              if (this.d_mnPublicUpdate.hasOwnProperty(prop)) {
                this.d_mnPublicUpdate[prop] = item[prop]
              }
            }
            this.d_mnPublicUpdate.merchatCode = this.$localStorage.get('merchatCode')
            this.mnHaveCapacityChange(this.d_mnPublicUpdate.haveCapacity)
          } else {
            this.$bvModal.show('update-no-code')
            for (const prop in this.d_mnPrivateUpdate) {
              if (this.d_mnPrivateUpdate.hasOwnProperty(prop)) {
                this.d_mnPrivateUpdate[prop] = item[prop]
              }
            }
            this.d_mnPrivateUpdate.merchatCode = this.$localStorage.get('merchatCode')
          }
          break
        case 'del':
          this.$bvModal.msgBoxConfirm(
            '您确定要是删除此商品吗？',
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
                this.post(
                  '/supermarketmanagement/supermarketstorage/goods/delete',
                  { id: item.id, type: item.type })
                  .then((res) => {
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
                        okTitle: '确定', // 确认按钮内容
                        okVariant: 'info', // 确认按钮样式
                        footerClass: ['p-3']
                      })
                      .then(value => {})
                      .catch((err) => {})
                    this.mnSelectGoodList()
                  })
              }
            })
            .catch((err) => {
              console.log(err)
            })
          break
        case 'destroy':
          for (const prop in this.d_destroy) {
            if (this.d_destroy.hasOwnProperty(prop)) {
              this.d_destroy[prop] = item[prop]
            }
          }
      }
    },
    mnGoodsSureOperate (target, type) {
      switch (target) {
        case 'destroy':
          this.d_destroy.merchatCode = this.$localStorage.get('merchatCode')
          this.d_destroy.userCode = this.$localStorage.get('userCode')
          // 商品销毁操作
          this.post('/supermarketmanagement/supermarketstorage/goods/destruction', this.d_destroy)
            .then((res) => {
              this.mnSelectGoodList()
            })
          break
        case 'editor':
          if (type === 'private') {
            // 自定义条码商品修改
            this.post('/supermarketmanagement/supermarketstorage/private/update', this.d_mnPrivateUpdate)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '商品修改成功！',
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
                  .then(value => {
                  })
                  .catch((err) => {
                  })
                this.mnSelectGoodList()
              })
          } else {
            // 自定义条码商品修改
            this.post('/supermarketmanagement/supermarketstorage/public/update', this.d_mnPublicUpdate)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '商品修改成功！',
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
                  .then(value => {
                  })
                  .catch((err) => {
                  })
                this.mnSelectGoodList()
              })
          }
          break
      }
    }
  },
  created () {
    this.mnSelectGoodList()
    // 商品类型查询
    this.post('/supermarketmanagement/supermrketstorage/goodstype/get', {}).then((res) => {
      this.d_mnGoodTypes = res.data
    })
  }
}
