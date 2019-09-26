var debounce = require('lodash.debounce')
import { required, minLength, between } from 'vuelidate/lib/validators'
export default {
  name: 'RestaurantManager',
  data: function () {
    return {
      d_managerDishMainShow: false,
      d_managerDishMain: [
        {goodsCode: "1113",
          goodsName: "红烧牛肉面"}
      ],  // 主库菜品
      d_managerDishList: [], // 菜品列表
      d_managerDishFields: [
        // 表头字段
        {number: '#'},
        {merchatGoodsCode: '条码/自定义编码'},
        {goodsName: '商品名称'},
        {unitPrice: '单价'},
        {purchasePrice: '成本价'},
        {restaurantTypeName: '所属类别'},
        {operate: '操作'},
      ],
      // 菜品添加参数
      d_managerDishAdd: {
        goodsCode: -1,
        goodsName: '',
        unitPrice: null,
        restaurantType: 1,
        purchasePrice: null,
        addType: 1,
        merchatGoodsCode: null,
        merchatCode: this.$localStorage.get('merchatCode'),
      },
      // 菜品膝修改参数
      d_managerDishUpdate: {
        // 菜品修改
        id: null,
        goodsName: null,
        unitPrice: null,
        restaurantType: 1,
        purchasePrice: null,
        merchatGoodsCode: null,
      },
      d_managerDishTypes: [], // 菜品所属分类
    }
  },
  validations: {
    d_managerDishAdd: {
      goodsName:{
        required
      }
    }
  },
  methods: {
    // 菜品列表查询
    managerDishList() {
      this.post('/cateringcashier/getallgoodsinfo',{
        merchatCode: this.$localStorage.get('merchatCode'),
        pageNum: '1',
        pageSize:'10000',
        },
        )
        .then((res) => {
          this.d_managerDishList = res.data
        })
        .catch((err) => {})
    },
    // 根据关键字查询菜品列表
    managerSelectDish(name) {
      this.post(
        '/cateringmanagement/findgoodsbyname',
        {name: name,merchatCode: this.$localStorage.get('merchatCode')})
        .then((res) => {
          this.d_managerDishList = res.data
        })
        .catch((err) => {})
    },
    // 菜品增删改
    managerDishAdd(type,item) {
      switch (type) {
        case 'add':
          this.post('/cateringmanagement/addgoods', this.d_managerDishAdd)
            .then((res) => {
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
                  footerClass: ['p-3'],
                })
                .then(value => {})
                .catch((err) => {})
              this.managerDishList();
            })
            .catch((err) => {})
          break;
        case 'update':
          this.post('/cateringmanagement/updategoodsinfo', this.d_managerDishUpdate)
            .then((res) => {
              this.$bvModal.msgBoxOk(
                '修改成功！',
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
              this.managerDishList();
            })
            .catch((err) => {
              console.log();
            })
          break;
        case 'del':
          this.$bvModal.msgBoxConfirm(
            '您确定要是删除此菜品吗？',
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
              cancelTitle: '确认',// 取消按钮内容
              cancelVariant: 'success',// 确取消按钮样式
              footerClass: ['p-3'],
            })
            .then(value => {
              if (!value) {
                this.post('/cateringmanagement/deletegoods', {id:item.id})
                  .then((res) => {
                    this.managerDishList();
                  })
                  .catch((err) => {})
              }
            })
            .catch((err) => {})
          break;
      }
    },
    // 编辑菜品选择
    managerDishOperate(item,type) {
      switch(type) {
        case 'editor':
          this.clone_copy_a(item,this.d_managerDishUpdate)
          break
      }
    },
    // 菜品模糊查询
    managerDishSearchChange: debounce(function (event) {
      if (event.value.length === 0) {
        this.managerDishList()
      } else {
        this.managerSelectDish(event.value)
      }
    },500),
    // 主库菜品模糊查询
    managerDishNameChange: debounce(function (event) {
      this.post('/cateringmanagement/addgoods/getgoodsbyname',{name: event})
        .then((res) => {
          this.d_managerDishMain = res.data
          this.d_managerDishMainShow = true
        })
    },1),
    // 主库菜品选择
    managerDishMainClick(item) {
      this.d_managerDishMainShow = false
      this.d_managerDishAdd.goodsName = item.goodsName
      this.d_managerDishAdd.merchatGoodsCode = item.goodsCode
    }
  },
  created () {
    // 查询菜品列表
    this.managerDishList();
    // 菜品分类
    this.post('/cateringmanagement/addgoods/getgoodstype',{})
      .then((res) => {
        this.d_managerDishTypes = res.data
      })
      .catch((err) => {})
  }
}
