<template>
  <!--一个template必须用一个div包裹所有元素，否则报错-->
  <div class="market-cash">
    <div class="market-cash-table overflow-auto ml-3 mr-3">
      <table class="table table-bordered mt-3">
        <thead>
        <tr>
          <th scope="col">序号</th>
          <th scope="col">名称</th>
          <th scope="col">条码</th>
          <th scope="col">单价</th>
          <th scope="col">数量</th>
          <th scope="col">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index,) in goods" :key="index">
          <th scope="row">{{index + 1}}</th>
          <td>{{item.goodsName}}</td>
          <td>{{item.goodsCode}}</td>
          <td>{{item.unitPrice}}</td>
          <td>{{item.amuont}}</td>
          <td class="icon-operate">
            <i class="icon iconfont icon iconfont iconziyuan1 mr-3"></i>
            <i class="icon iconfont iconziyuan mr-3"></i>
            <i class="icon iconfont iconziyuan1-copy"></i>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <div class="footer-semicircle position-absolute">
        <p class="h1">查询</p>
        <p class="h6">无条形码商品</p>
      </div>
      <div class="footer-pay">
        <div class="footer-pay-content position-absolute">
          <span style="color: #000;">支付方式：</span>
          <b-form-select v-model="selected" :options="options" size="sm"></b-form-select>
        </div>
        <div class="footer-pay-border position-absolute"></div>
     </div>
      <div class="footer-total">
        <span class="h4 text-dark">合计金额：
          <strong class="h3 text-danger">￥22.40</strong>
        </span>
      </div>
      <div class="footer-btn">
        <button class="btn btn-primary">确认收款成功</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MarketCash',
    data: () => {
      return {
        goods: [
          {goodsName: '粉红西瓜',goodsCode: '123456789',unitPrice: '10.11',amuont: '3'},
          {goodsName: '粉红西瓜',goodsCode: '123456789',unitPrice: '10.11',amuont: '3'},
          {goodsName: '粉红西瓜',goodsCode: '123456789',unitPrice: '10.11',amuont: '3'},
        ],
        selected: 1,
        options: [
          { value: '1', text: '现金支付' },
          { value: '2', text: '支付宝支付' },
          { value: '3', text: '微信支付' },
        ]
      }
    }
  }
</script>

<style lang="scss">
  @import "MarketCash.component";
</style>
