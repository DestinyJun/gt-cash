import Card from '@/components/Card.vue'
export default {
  name: 'RestaurantCash',
  components: {
    Card
  },
  data: function () {
    return {
      d_cashMenuList: [], // 菜品分类
      d_cashDishList: [], // 菜品列表
      d_cashOrderList: [], // 订餐列表
      d_cashOrderTotal: 0.00,   // 订餐总价
      // 收费方式列表
      d_cashOptions: [
        { value: '现金支付', text: '现金支付' },
        { value: '网上支付', text: '网上支付' },
      ],
      // 订单确认收款
      d_cashOrderSure: {
        userId: this.$localStorage.get('userCode'),
        merchatCode: this.$localStorage.get('merchatCode'),
        payType: '现金支付',
        date: null
      },
      d_cashRows: 0, // 总条数
      d_cashPerPage: 10, // 每页显示10条
      d_cashCurrentPage: 1, // 当前页
      d_cashPageAction: 'all'
    }
  },
  methods: {
    // 菜单分类选择操作
    cashMenuClick (item) {
      this.d_cashMenuList.map((val) => {
        val.active = false
      })
      item.active = true
      if (item.goodsType === -1) {
       this.cashGetAllDishList();
      } else {
        this.cashGetDishList(item.goodsTypeCode)
      }
    },
    // 根据菜品分类查询菜品数量
    cashGetDishList (type) {
      this.d_cashPageAction = type;
      this.post('/cateringcashier/getgoodslist', {
        restaurantType: this.d_cashPageAction,
        merchatCode: this.$localStorage.get('merchatCode'),
        pageNum: this.d_cashCurrentPage,
        pageSize: this.d_cashPerPage,
      })
        .then((res) => {
          this.d_cashRows = res.totalRecord;
          this.d_cashDishList = res.data
        })
        .catch((err) => {
          this.d_cashDishList = []
        })
    },
    // 获取所有菜品
    cashGetAllDishList () {
      this.d_cashPageAction = 'all';
      this.post('/cateringcashier/getallgoodsinfocash', {
        merchatCode:this.$localStorage.get('merchatCode'),
        pageNum: this.d_cashCurrentPage,
        pageSize: this.d_cashPerPage,
      })
        .then((res) => {
          this.d_cashRows = res.totalRecord;
          this.d_cashDishList = res.data
        })
    },
    // 分页事件
    cashPageChange() {
      if (this.d_cashPageAction === 'all') {
        this.cashGetAllDishList();
      } else {
        this.cashGetDishList(this.d_cashPageAction);
      }
    },
    // 菜品添加
    cashDishClick (item) {
      const goodsType = []
      if (this.d_cashOrderList.length === 0) {
        item.num = 1
        this.d_cashOrderList.push(item)
        this.cashOrderTotal()
      } else {
        for (let i = 0; i < this.d_cashOrderList.length; i++) {
          goodsType.push(this.d_cashOrderList[i].goodsName)
        }
        if (goodsType.includes(item.goodsName)) {
          this.d_cashOrderList.map((val) => {
            if (val.goodsName === item.goodsName) {
              val.num++
            }
          })
          this.cashOrderTotal()
        } else {
          item.num = 1
          this.d_cashOrderList.push(item)
          this.cashOrderTotal()
        }
      }
    },
    // 计算订单总价
    cashOrderTotal() {
      this.d_cashOrderTotal = 0.00
      this.d_cashOrderList.map((val) => {
        this.d_cashOrderTotal += (parseFloat(val.unitPrice)*parseFloat(val.num))
      })
    },
    // 确认订单支付
    cashOrderSure() {
      const data = []
      this.d_cashOrderList.map((val) => {
        data.push({id: val.id,num:val.num})
      })
      this.d_cashOrderSure.date = data;
      this.post('/cateringcashier/pay',this.d_cashOrderSure)
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
              footerClass: ['p-3'],
            })
            .then(value => {
              if(value) {
                this.get(`/printpdf/cateringcashier?merchatCode=${this.$localStorage.get('merchatCode')}&orderNum=${res.data}`)
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
          this.d_cashOrderTotal = 0.00
          this.d_cashOrderList = []
        })
        .catch(() => {})
    },
    // 菜单数量操作
    cashOrderNumClick(type,index) {
      switch (type) {
        case 'minus':
          this.d_cashOrderList[index].num = parseFloat(this.d_cashOrderList[index].num)- 1
          if (this.d_cashOrderList[index].num === 0) {
            this.d_cashOrderList.splice(index,1)
          }
          this.cashOrderTotal()
          break
        case 'add':
          this.d_cashOrderList[index].num = parseFloat( this.d_cashOrderList[index].num) + 1
          this.cashOrderTotal()
          break
      }
    }
  },
  created () {
    this.post('/cateringmanagement/addgoods/getgoodstype', {})
      .then((res) => {
        res.data.unshift({
          active: true,
          goodsType: -1,
          goodsTypeName: '全部'
        })
        res.data.map((val) => {
          val.active = false
        })
        this.d_cashMenuList = res.data
      })
    this.cashGetAllDishList();
  }
}
