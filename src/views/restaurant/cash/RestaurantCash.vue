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
          <div style="flex: 16;overflow-y: auto;justify-content: flex-start;text-align: left" class="w-100">
            <div class="dish-select"
               v-for="item in d_cashDishList"
               @click="cashDishClick(item)"
               style="padding-right: 0;padding-left: 0;width: 194px;display: inline-block;text-align: center">
              <!-- style="border: 1px solid #DFDFDF;cursor: pointer;background:#DC3545;color:white">-->
              <div class="mr-2 mt-2" style="border: 1px solid #DFDFDF;cursor: pointer;background:#DC3545;color:white">
                <!--<img src="@/assets/images/青椒肉丝.png" class="rounded" alt="图片地址无效">-->
                <p class="title mb-0">{{item.goodsName}}</p>
                <p class="price mb-0">{{item.unitPrice}}</p>
              </div>
            </div>
            <p class="text-center w-100" v-if="!(d_cashDishList)">此分类暂无菜品，敬请期待！</p>
          </div>
          <div style="flex: 3;justify-content: center;align-items: center">
            <div class="dish-pagination">
              <b-pagination
                limit='5'
                :hide-goto-end-buttons='true'
                :hide-ellipsis='true'
                v-model="d_cashCurrentPage"
                :total-rows="d_cashRows"
                :per-page="d_cashPerPage"
                @input="cashPageChange()"
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
            <button class="btn btn-primary" @click="cashOrderSure()" :disabled="d_cashOrderList.length === 0">确认收款成功
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./RestaurantCash.component.js"></script>
<style scoped lang="scss">
  @import "RestaurantCash.component";
</style>
