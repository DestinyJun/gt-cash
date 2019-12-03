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
              <i class="icon iconfont icon iconfont iconziyuan1 mr-3 align-middle" v-on:click="cashOperateClick('add',index)"></i>
              <i class="icon iconfont iconziyuan mr-3 align-middle" @click="cashOperateClick('minus',index)"></i>
              <i class="icon iconfont iconziyuan1-copy align-middle" @click="cashOperateClick('del',index)"></i>
              <b-button size="sm" variant="info align-middle ml-3" pill style="font-size: 12px" @click="cashModalOperateClick(index);$bvModal.show('modal-shop')">
                <span class="mr-1">操</span>
                <span>作</span>
              </b-button>
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
        <!--:disabled="d_cashGoods.length === 0"-->
        <button class="btn btn-primary" @click="$bvModal.show('modal-cash')">确认收款</button>
      </div>
    </div>
    <!--商品操作-->
    <b-modal id="modal-shop" centered size="md" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6>
            <b-button class="float-left" size="sm" variant="outline-info" @click="close();d_cashCodeGoods=[]">
              商品操作
            </b-button>
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close();d_cashCodeGoods=[]">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="type mt-3">
          <div class="munber">
            <div class="input-group w-100">
              <span class="mr-3">原价：</span><span class="text-danger h5">{{(d_cashShopInfo.unitPrice * d_cashShopInfo.num).toFixed(2)}}</span>元
            </div>
            <div class="input-group w-100 mt-2">
              <button class="btn btn-default pl-0">折扣：</button>
              <input type="tel" class="form-control" placeholder="请输入0-1之间的数" v-model="$v.d_cashShopInfo.discount.$model">
            </div>
            <div class="input-group w-100 mt-2">
              <span class="mr-3">现价：</span><span class="text-danger h5">{{((d_cashShopInfo.unitPrice * d_cashShopInfo.num)*d_cashShopInfo.discount).toFixed(2)}}</span>元
            </div>
          </div>
          <div class="discount pb-2 pr-2">
            <b-button pill size="sm" variant="outline-info" @click="cashDiscountOperate(0.5)">
              <span class="mr-1 pl-2">5</span>
              <span class="pr-2">折</span>
            </b-button>
            <b-button pill size="sm" variant="outline-info ml-2 mr-2" @click="cashDiscountOperate(0.88)">
              <span class="mr-1 pl-2">8.8</span>
              <span class="pr-2">折</span>
            </b-button>
            <b-button pill size="sm" variant="outline-info" @click="cashDiscountOperate(0.9)">
              <span class="mr-1 pl-2">9</span>
              <span class="pr-2">折</span>
            </b-button>
            <div class="input-group w-75 mt-2">
              <button class="btn btn-default pl-0" @click="">数量：</button>
              <input type="number" class="form-control" placeholder="填写数量" v-model="d_cashShopInfo.num" @input="test1()">
            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <div class="keyboard">
          <div class="box" v-for="(item,index,) in d_keybordTxt" :key="index">
            <span style="color: #333333;font-size: 20px;font-weight: 600">{{item}}</span>
          </div>
        </div>
        <div class="btn-list">
          <b-button
            class="pt-2 pb-2 btn-block" size="sm" variant="default"
            v-on:click="">
            <span class="icon iconfont iconbackspace-fill" style="font-size: 30px"></span>
          </b-button>
          <b-button
            class=" btn-block" size="sm"  variant="bg1"
            v-on:click="close()">
            <span class="d-block h6" style="padding-top: 36px;padding-bottom: 36px;margin-bottom: 3px">确认</span>
            <!--<span class="d-block mb-2 h6 mt-4" style="visibility: hidden">收款</span>-->
          </b-button>
        </div>
      </template>
    </b-modal>
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
    <!--收款成功-->
    <b-modal id="modal-cash" centered size="lg" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6>
            <b-button class="float-left" size="sm" variant="outline-info" @click="close();d_cashCodeGoods=[]">
              收款确认
            </b-button>
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close();d_cashCodeGoods=[]">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="total text-center">
         <p class="mb-0"><span class="h5">应收：</span><span class="text-danger h3">200.00</span><span class="h5">元</span></p>
        </div>
        <div class="type mt-3">
          <div class="munber" style="">
            <div class="input-group w-100">
              <span class="mr-3">应收金额：</span><span class="text-danger h5">5.23</span>元
            </div>
            <div class="input-group w-100 mt-2">
              <button class="btn btn-default pl-0" @click="">收取现金：</button>
              <input type="tel" class="form-control" placeholder="请输入现金" v-model="d_cashCodeOperate">
            </div>
            <div class="input-group w-100 mt-2">
              <button class="btn btn-default pl-0" @click="">实收金额：</button>
              <input type="tel" class="form-control" placeholder="请输入金额" v-model="d_cashCodeOperate">
            </div>
            <div class="input-group w-100 mt-2">
              <span class="mr-3">找零金额：</span><span class="text-danger h5">2.00</span>元
            </div>
          </div>
          <div class="pay-way">
            <div class="title w-100 mb-3">
              <span>请选择支付方式：</span>
            </div>
            <div class="way w-100">
              <div class="box">
                <b-button
                  size="lg"
                  block
                  :pressed="true"
                  variant="default"
                  @click=""
                >
                  <span class="icon iconfont iconweixin mr-2 text-success h3 align-middle"></span>
                  <span class="align-middle">微信</span>
                </b-button>
              </div>
              <div class="box">
                <b-button
                  size="lg"
                  block
                  :pressed="true"
                  variant="default"
                  @click=""
                >
                  <span class="icon iconfont iconumidd17 mr-2 text-info h2 align-middle"></span>
                  <span class="align-middle">支付宝</span>
                </b-button>
              </div>
              <div class="box">
                <b-button
                  size="lg"
                  block
                  :pressed="true"
                  variant="default"
                  @click=""
                >
                  <span class="icon iconfont iconrmb mr-2 text-warning h2 align-middle"></span>
                  <span class="align-middle">现金</span>
                </b-button>
              </div>
              <div class="box">
                <b-button
                  size="lg"
                  block
                  :pressed="true"
                  variant="default"
                  @click=""
                >
                  <img class="mr-2" src="../../../assets/images/yinglian.png" width="auto" height="32">
                  <span class="align-middle">现金</span>
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <div class="keyboard">
          <div class="box" v-for="(item,index,) in d_keybordTxt" :key="index">
            <span style="color: #333333;font-size: 20px;font-weight: 600">{{item}}</span>
          </div>
        </div>
        <div class="btn-list">
          <b-button
            class="pt-2 pb-2 btn-block" size="sm" variant="default"
            v-on:click="">
            <span class="icon iconfont iconbackspace-fill" style="font-size: 30px"></span>
          </b-button>
          <b-button
            class=" btn-block" size="sm"  variant="bg1"
            v-on:click="close();cashCodeGoodsClick('sure')">
            <span class="d-block mb-2 h6 mt-4">收款</span>
            <span class="d-block h6 mb-4">成功</span>
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script src="./MarketCash.component.js"></script>
<style scoped lang="scss">
  @import "MarketCash.component";
</style>
