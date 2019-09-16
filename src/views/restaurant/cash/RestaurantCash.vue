<template>
  <div class="cash container-fluid">
    <div class="row h-100">
      <div class="menu col-md-2 pl-1 pr-1">
        <div class="cash-header pt-3">
          <p class="mb-0">MENU</p>
          <p>菜单</p>
        </div>
        <div class="cash-list">
          <ul class="list-group">
            <li
              v-for="item in d_cashMenuList"
              @click="cashMenuClick(item)"
              :class="{'bg-danger':item.active,'text-light':item.active}"
              class="list-group-item w-100 pt-2 pb-2">{{item.goodsTypeName}}
            </li>
          </ul>
        </div>
      </div>
      <div class="desk col-md-10 overflow-auto pr-0 pl-0">
        <div class="dest-dish float-left overflow-auto">
          <div class="row ml-0 mr-0 pl-2">
            <div
              class="dish-select col-sm-12 col-md-4 col-lg-3"
              v-for="item in d_cashDishList"
              @click="cashDishClick(item)"
              style="padding-right: 0;padding-left: 0;">
              <div class="mr-2" style="border: 1px solid #DFDFDF">
                <img src="@/assets/images/青椒肉丝.png" class="rounded" alt="图片地址无效">
                <p class="title mb-0">{{item.goodsName}}</p>
                <p class="price mb-0 text-danger">{{item.unitPrice}}</p>
              </div>
            </div>
            <p class="text-center w-100" v-if="!(d_cashDishList)">此分类暂无菜品，敬请期待！</p>
            <div class="dish-pagination position-absolute">
              <b-pagination
                limit='5'
                :hide-goto-end-buttons='true'
                :hide-ellipsis='true'
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
              ></b-pagination>
            </div>
          </div>
        </div>
        <div class="dest-nums float-right overflow-auto">
          <ul class="list-group" onselectstart="return false;" style="-moz-user-select:none;">
            <li class="list-group-item d-flex justify-content-between align-items-center pt-1 pb-1 pl-2 pr-1">
              <div class="name">
                <p class="mb-0 text-left">菜品/单价</p>
              </div>
              <span class="badge badge-primary badge-pill operate"
                    style="color: #2c3e50;font-size: 1rem;font-weight: 500">数量</span>
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center pt-1 pb-1 pl-2 pr-1"
              v-for="(item,index) in d_cashOrderList"
              :key="index"
            >
              <div class="name">
                <p class="mb-0 text-left">{{item.goodsName}}</p>
                <p class="text-danger mb-0 text-left">{{item.unitPrice}}</p>
              </div>
              <span class="badge badge-primary badge-pill operate">
                <i class="icon iconfont iconziyuan" @click="cashOrderNumClick ('minus',index)"></i>
                <span class="nums mr-3 ml-3">{{item.num}}</span>
                <i class="icon iconfont icon iconfont iconziyuan1" @click="cashOrderNumClick('add',index)"></i>
              </span>
            </li>
          </ul>
        </div>
        <div class="dest-footer">
          <div class="footer-pay">
            <div class="footer-pay-content position-absolute">
              <span style="color: #000;">支付方式：</span>
              <b-form-select v-model="d_cashOrderSure.payType" :options="d_cashOptions" size="sm"></b-form-select>
            </div>
            <div class="footer-pay-border position-absolute"></div>
          </div>
          <div class="footer-total">
        <span class="h4 text-dark">合计金额：
          <strong class="h3 text-danger">￥{{d_cashOrderTotal | twoDecimals}}</strong>
        </span>
          </div>
          <div class="footer-btn">
            <button class="btn btn-primary" @click="cashOrderSure()" :disabled="d_cashOrderList.length === 0">确认收款成功</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        rows: 100,
        perPage: 10,
        currentPage: 1
      }
    },
    methods: {
      // 菜单分类选择操作
      cashMenuClick (item) {
        this.d_cashMenuList.map((val) => {
          val.active = false
        })
        item.active = true
        this.cashGetDishList(item.goodsTypeCode)
      },
      // 根据菜品分类查询菜品数量
      cashGetDishList (type) {
        this.post('/cateringcashier/getgoodslist', {
          restaurantType: type,
          merchatCode: this.$localStorage.get('merchatCode')
        })
          .then((res) => {
            this.d_cashDishList = res.data
          })
          .catch((err) => {
            this.d_cashDishList = []
          })
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
                  window.open(`${process.env.VUE_APP_URL}/printpdf/cateringcashier?merchatCode=${this.$localStorage.get('merchatCode')}&orderNum=${res.data}`)
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
          res.data.map((val) => {
            val.active = false
          })
          this.d_cashMenuList = res.data
        })
      this.post('/cateringcashier/getallgoodsinfo', {merchatCode:this.$localStorage.get('merchatCode')})
        .then((res) => {
          this.d_cashDishList = res.data
        })
    }
  }
</script>

<style scoped lang="scss">
  @import "RestaurantCash.component";
</style>
