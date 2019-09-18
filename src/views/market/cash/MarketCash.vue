<template>
  <div class="market-cash">
    <div class="market-cash-table overflow-auto ml-3 mr-3">
      <button
        ref="cashCodeBtn"
        @click="cashCodeBtnClick()"
        class="btn btn-warning position-absolute">
        点击扫码商品
      </button>
      <div class="mt-3">
        <label>
          <input
            ref="cashCodeInput"
            type="text"
            class="form-control position-absolute"
            @input="cashGoodChange($event)"
            @blur="cashInputBlur"
            autofocus/>
        </label>
        <table class="table table-bordered ">
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
          <tr v-for="(item,index,) in d_cashGoods" :key="index">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.goodsName}}</td>
            <td>{{item.goodsCode}}</td>
            <td>{{item.unitPrice}}</td>
            <td>{{item.num}}</td>
            <td class="icon-operate">
              <i class="icon iconfont icon iconfont iconziyuan1 mr-3" v-on:click="cashOperateClick('add',index)"></i>
              <i class="icon iconfont iconziyuan mr-3" @click="cashOperateClick('minus',index)"></i>
              <i class="icon iconfont iconziyuan1-copy" @click="cashOperateClick('del',index)"></i>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <div class="footer-semicircle position-absolute">
        <div style="cursor: pointer;display: inline-block" @click="$bvModal.show('modal-center')">
          <p class="h5">手动查询</p>
        </div>
      </div>
      <div class="footer-pay">
        <div class="footer-pay-content position-absolute">
          <span style="color: #000;">支付方式：</span>
          <b-form-select v-model="d_cashPaySure.payType" :options="d_cashOptions" size="sm"></b-form-select>
        </div>
        <div class="footer-pay-border position-absolute"></div>
      </div>
      <div class="footer-total">
        <span class="h4 text-dark">合计金额：
          <strong class="h3 text-danger">￥{{d_cashTotal | twoDecimals}}</strong>
        </span>
      </div>
      <div class="footer-btn">
        <button class="btn btn-primary" @click="cashPaySure()" :disabled="d_cashGoods.length === 0">确认收款成功</button>
      </div>
    </div>
    <!--手动查询商品-->
    <b-modal id="modal-center" centered size="md" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            查询无条形码商品
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close();d_cashCodeGoods=[]">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
         <!-- <div class="input-group w-50">
            <input type="text" class="form-control" id="goodName" placeholder="输入商品名称">
            <button class="btn btn-info ml-1">查询</button>
          </div>-->
          <div class="input-group w-50">
            <input type="tel" class="form-control" id="goodCode" placeholder="输入条码/自定义编号" v-model="d_cashCodeOperate">
            <button class="btn btn-info ml-1" @click="cashCodeGoodSearch()">查询</button>
          </div>
        </div>
        <table class="table table-bordered ">
          <thead>
          <tr>
            <th scope="col">序号</th>
            <th scope="col">商品</th>
            <th scope="col">条码/自定义编码</th>
            <th scope="col">单价</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item,index,) in d_cashCodeGoods" :key="index"
            v-bind:class="{'table-info':item.active}" v-on:click="cashCodeGoodsClick(index)">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.goodsName}}</td>
            <td>{{item.goodsCode}}</td>
            <td>{{item.unitPrice}}</td>
          </tr>
          </tbody>
        </table>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <label for="amount" class="">购买数量：</label>
        <input
          v-model="d_cashCodeGoodAmount"
          type="tel" id="amount" class="form-control"
          style="display: inline-block;flex: none;">
        <b-button
          class="pl-md-4 pr-md-4" size="sm" variant="success"
          v-on:click="close();cashCodeGoodsClick('sure')">
          确定
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script src="./MarketCash.component.js"></script>
<style scoped lang="scss">
  @import "MarketCash.component";
</style>
