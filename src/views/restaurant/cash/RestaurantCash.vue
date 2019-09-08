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
            <p class="text-center" v-if="!(d_cashDishList.length > 0)">暂无菜品，敬请期待！</p>
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
              v-for="item in d_cashOrderList"
            >
              <div class="name">
                <p class="mb-0 text-left">{{item.goodsName}}</p>
                <p class="text-danger mb-0 text-left">{{item.unitPrice}}</p>
              </div>
              <span class="badge badge-primary badge-pill operate">
                <i class="icon iconfont iconziyuan" @click="cashOrderNumClick ('minus',item)"></i>
                <span class="nums mr-3 ml-3">{{item.num}}</span>
                <i class="icon iconfont icon iconfont iconziyuan1" v-on:click="cashOrderNumClick('add',item)"></i>
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
            <button class="btn btn-primary" @click="cashOrderSure()">确认收款成功</button>
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
        d_cashSelected: 1, // 已选收费方式
        d_cashOptions: [
          // 收费方式列表
          { value: '1', text: '现金支付' },
          { value: '2', text: '支付宝支付' },
          { value: '3', text: '微信支付' },
        ],
        d_cashOrderSure: {
          // 订单确认收款
          userId: this.$localStorage.get('userCode'),
          merchatCode: this.$localStorage.get('merchatCode'),
          payType: 1,
          date: null
        },
        rows: 100,
        perPage: 10,
        currentPage: 1
      }
    },
    methods: {
      cashMenuClick (item) {
        // 菜品点击操作
        this.d_cashMenuList.map((val) => {
          val.active = false
        })
        item.active = true
        this.cashGetDishList(item.goodsTypeCode)
      },
      cashGetDishList (type) {
        // 根据菜品分类查询菜品数量
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
      cashOrderTotal() {
        // 计算订单总价
        this.d_cashOrderTotal = 0.00
        this.d_cashOrderList.map((val) => {
          this.d_cashOrderTotal += (parseFloat(val.unitPrice)*parseFloat(val.num))
        })
      },
      cashOrderSure() {
        const data = []
        this.d_cashOrderList.map((val) => {
          data.push({id: val.id,num:val.num})
        })
        this.d_cashOrderSure.date = data;
        this.post('/cateringcashier/pay',this.d_cashOrderSure)
          .then((res) => {
            this.d_cashOrderTotal = 0.00
            this.d_cashOrderList = []
          })
          .catch((err) => {
            console.log('请求出错');
          })
      },
      cashOrderNumClick(type,item) {
        switch (type) {
          case 'minus':
            item.num = parseFloat(item.num)- 1
            break
          case 'add':
            item.num = parseFloat(item.num) + 1
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
          // res.data[0].active = true;
          this.d_cashMenuList = res.data
        })
    }
  }
</script>

<style lang="scss">
  @import "RestaurantCash.component";
</style>
