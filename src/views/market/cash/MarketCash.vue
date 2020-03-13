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
            <td class="icon-operate" onselectstart="return false;" >
              <i class="icon iconfont icon iconfont iconziyuan1 mr-3 align-middle" v-on:click="cashOperateClick('add',item)"></i>
              <i class="icon iconfont iconziyuan mr-3 align-middle" @click="cashOperateClick('minus',item,index)"></i>
              <i class="icon iconfont iconziyuan1-copy align-middle" @click="cashOperateClick('del',item,index)"></i>
              <b-button size="sm" variant="info align-middle ml-3" pill style="font-size: 12px" @click="cashModalOperateClick(item);$bvModal.show('modal-shop')">
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
          <b-button variant="danger" @click="$bvModal.show('modal-return');cashOrderPageChange()">退货操作</b-button>
          <b-button variant="info ml-3" @click="$bvModal.show('modal-gift');cashGiftPageChange()">大礼包</b-button>
        </div>
        <div class="footer-pay-border position-absolute"></div>
      </div>
      <div class="footer-total">
        <span class="h4 text-dark">合计金额：
          <strong class="h3 text-danger">￥{{d_cashPaySure.sales | twoDecimals}}</strong>
        </span>
      </div>
      <div class="footer-btn">
        <button class="btn btn-primary" @click="$bvModal.show('modal-cash')" :disabled="d_cashGoods.length===0">确认收款</button>
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
              <input id="discount" ref="discount" type="tel" class="form-control" placeholder="请输入0-1之间的数" v-model="$v.d_cashShopInfo.discount.$model" @focus="cashShopNumFocus($event.target)">
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
              <input
                id="shopNum" type="tel" class="form-control" placeholder="填写数量"
                v-model="d_cashShopInfo.num" @focus="cashShopNumFocus($event.target)">
            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <div class="keyboard">
          <div class="box" v-for="(item,index,) in d_keybordTxt" :key="index" @click="cashKeybordClick(index)">
            <span style="color: #333333;font-size: 20px;font-weight: 600">{{item}}</span>
          </div>
        </div>
        <div class="btn-list">
          <b-button
            class="pt-2 pb-2 btn-block" size="sm" variant="default"
            @click="cashKeybordClick('del')">
            <span class="icon iconfont iconbackspace-fill" style="font-size: 30px"></span>
          </b-button>
          <b-button
            class=" btn-block" size="sm"  variant="bg1"
            @click="close();cashKeybordClick('sure')">
            <span class="d-block h6" style="padding-top: 36px;padding-bottom: 36px;margin-bottom: 3px">确认</span>
          </b-button>
        </div>
      </template>
    </b-modal>
    <!--手动查询商品/大礼包商品-->
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
            v-bind:class="{'table-info':item.active}" v-on:click="cashCodeGoodsClick(index,'select')">
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
          v-on:click="close();cashCodeGoodsClick('sure','manual')">
          确定
        </b-button>
      </template>
    </b-modal>
    <!--收款成功-->
    <b-modal id="modal-cash" centered size="lg" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6>
            <b-button class="float-left" size="sm" variant="outline-info">
              收款确认
            </b-button>
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close();d_cashCodeGoods=[];d_cashChangeMoney=0">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="total text-center">
         <p class="mb-0">
           <span class="h5">应收：</span>
           <span class="text-danger h4">{{d_cashPaySure.accountsReceivable}}</span>
           <span class="h5">元</span>
           <span class="h5 ml-5">实收：</span>
           <span class="text-danger h3">{{d_cashPaySure.sales}}</span>
           <span class="h5">元</span>
         </p>
        </div>
        <div class="type mt-3">
          <div class="munber" style="">
            <div class="input-group w-100 mt-5">
              <button class="btn btn-default pl-0" @click="">收取金额：</button>
              <input
                id="cashMoney" type="number" class="form-control" placeholder="请输入现金" autofocus
                v-model="d_cashMoney"
                @focus="cashShopNumFocus($event.target)"
                @input="cashChangeMoneyOperate($event.target.value)"
              >
            </div>
            <div class="input-group w-100 mt-4">
              <span class="mr-3">找零金额：</span><span class="text-danger h5">{{d_cashChangeMoney?d_cashChangeMoney + '元':'无需找零！'}}</span>
            </div>
          </div>
          <div class="pay-way">
            <div class="title w-100 mb-3">
              <span>请选择支付方式：</span>
            </div>
            <div class="way w-100">
              <div class="box">
                <b-form-radio
                  size="lg"
                  :pressed="true"
                  button-variant="default w-100"
                  button
                  value="微信"
                  v-model="d_cashPaySure.payType"
                >
                  <span class="icon iconfont iconweixin mr-2 text-success h3 align-middle"></span>
                  <span class="align-middle">微信</span>
                </b-form-radio>
              </div>
              <div class="box">
                <b-form-radio
                  size="lg"
                  block
                  :pressed="true"
                  button-variant="default w-100"
                  button
                  value="支付宝"
                  v-model="d_cashPaySure.payType"
                >
                  <span class="icon iconfont iconumidd17 mr-2 text-info h2 align-middle"></span>
                  <span class="align-middle">支付宝</span>
                </b-form-radio>
              </div>
              <div class="box">
                <b-form-radio
                  size="lg"
                  block
                  :pressed="true"
                  button-variant="default w-100"
                  button
                  value="现金"
                  v-model="d_cashPaySure.payType"
                >
                  <span class="icon iconfont iconrmb mr-2 text-warning h2 align-middle"></span>
                  <span class="align-middle">现金</span>
                </b-form-radio>
              </div>
              <div class="box">
                <b-form-radio
                  size="lg"
                  block
                  :pressed="true"
                  button-variant="default w-100"
                  button
                  value="银联"
                  v-model="d_cashPaySure.payType"
                >
                  <img class="mr-2" src="../../../assets/images/yinglian.png" width="auto" height="32">
                  <span class="align-middle">银联</span>
                </b-form-radio>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <div class="keyboard">
          <div class="box" v-for="(item,index,) in d_keybordTxt" :key="index" @click="cashKeybordClick(index)">
            <span style="color: #333333;font-size: 20px;font-weight: 600">{{item}}</span>
          </div>
        </div>
        <div class="btn-list">
          <b-button
            class="pt-2 pb-2 btn-block" size="sm" variant="default"
            v-on:click="cashKeybordClick('del')">
            <span class="icon iconfont iconbackspace-fill" style="font-size: 30px"></span>
          </b-button>
          <b-button
            :disabled="d_cashMoney === ''"
            class=" btn-block" size="sm"  variant="bg1"
            v-on:click="close();cashPaySure()">
            <span class="d-block mb-2 h6 mt-4">收款</span>
            <span class="d-block h6 mb-4">成功</span>
          </b-button>
        </div>
      </template>
    </b-modal>
    <!--退货订单查询-->
    <b-modal id="modal-return" centered size="lg" no-close-on-backdrop ok-only no-stacking>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            订单退货
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close()">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
          <div class="input-group w-50">
            <input type="tel" class="form-control" id="orderCode" placeholder="输入订单号" v-model="d_cashOrderNum">
            <button class="btn btn-info ml-1" @click="cashOrderPageSearch()">查询</button>
          </div>
        </div>
        <table class="table table-bordered ">
          <thead>
          <tr>
            <th scope="col">序号</th>
            <th scope="col">订单号</th>
            <th scope="col">成交时间</th>
            <th scope="col">订单金额</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item,index,) in d_cashOrderList" :key="index"
            v-bind:class="{'table-info':item.active}" v-on:click="cashOrderSelect(item);$bvModal.show('modal-order')">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.orderNumber}}</td>
            <td>{{item.date}}</td>
            <td>{{item.actualAccountsReceivable}}</td>
          </tr>
          </tbody>
        </table>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-pagination
          v-model="d_cashPage.currentPage"
          :total-rows="d_cashPage.pageNum"
          :per-page="d_cashPage.pageSize"
          @input="cashOrderPageChange()"
          aria-controls="my-table"
        >
          <template v-slot:first-text><span class="text-success">首页</span></template>
          <template v-slot:prev-text><span class="text-danger">上一页</span></template>
          <template v-slot:next-text><span class="text-warning">下一页</span></template>
          <template v-slot:last-text><span class="text-info">末页</span></template>
        </b-pagination>
      </template>
    </b-modal>
    <!--退货订单详情-->
    <b-modal id="modal-order" centered size="lg" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6>
            <b-button class="float-left" size="sm" variant="outline-info" @click="close()">
              订单退货
            </b-button>
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close()">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
          <div class="input-group w-50">
            <input type="tel" class="form-control" id="orderCodeInfo" placeholder="输入订单号" v-model="d_cashOrderNum">
            <button class="btn btn-info ml-1" @click="cashOrderReturnInfo()">查询</button>
          </div>
        </div>
        <b-row>
          <b-col md="7">
            <table class="table table-bordered ">
              <thead>
              <tr>
                <th scope="col">商品名称</th>
                <th scope="col">单价</th>
                <th scope="col">数量</th>
                <th scope="col">折扣</th>
                <th scope="col">退货数量</th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(item,index,) in d_cashOrderInfo" :key="index"
                v-bind:class="{'table-info':item.active}">
                <td>{{item.goodsName}}</td>
                <td>{{item.unitPrice}}</td>
                <td>{{item.number}}</td>
                <td>{{item.discount}}</td>
                <td>
                  <b-form-input
                    id="cashOrderInfoId" type="number" size="sm"
                    v-model="d_cashOrderInfoNum" placeholder="请填写数量"
                    @focus="cashShopNumFocus($event.target)"
                    @blur="cashOrderInfoIdBlur(item)"
                  >
                  </b-form-input>
                </td>
              </tr>
              </tbody>
            </table>
          </b-col>
          <b-col md="5">
            <div class="order-keyboard">
              <div class="keyboard">
                <div class="box" v-for="(item,index,) in d_keybordTxt" :key="index" @click="cashKeybordClick(index)">
                  <span style="color: #333333;font-size: 20px;font-weight: 600">{{item}}</span>
                </div>
              </div>
              <div class="btn-list">
                <b-button
                  class="pt-2 pb-2 btn-block" size="sm" variant="default"
                  @click="cashKeybordClick('del')">
                  <span class="icon iconfont iconbackspace-fill" style="font-size: 30px"></span>
                </b-button>
                <b-button
                  class="btn-block" size="sm"  variant="bg1"
                  @click="hide();cashOrderReturnSure()">
                  <span class="d-block h6" style="padding-top: 24px;padding-bottom: 24px;margin-bottom: 3px">确认退货</span>
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <span></span>
      </template>
    </b-modal>
    <!--大礼包列表-->
    <b-modal id="modal-gift" centered size="lg" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            大礼包管理
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close()">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
          <div class="input-group w-50">
            <input type="text" class="form-control" id="giftKeyword" placeholder="输入礼包名称/编号" v-model="d_cashGiftNum">
            <button class="btn btn-info ml-1" @click="cashGiftPageSearch()">搜索大礼包</button>
          </div>
          <div class="input-group w-50 justify-content-sm-end">
            <b-button variant="success" size="sm" @click="$bvModal.show('modal-gift-add')">新建大礼包</b-button>
          </div>
        </div>
        <table class="table table-bordered" style="table-layout: fixed;">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">礼包编号</th>
            <th scope="col">礼包名称</th>
            <th scope="col" width="25%" >包含商品</th>
            <th scope="col">销售状态</th>
            <th scope="col">总价</th>
            <th scope="col">操作</th>
          </tr>
          </thead>
          <tbody>
            <tr
            v-for="(item,index,) in d_cashGiftList" :key="index"
            v-bind:class="{'table-info':item.active}">
            <td scope="row">{{index + 1}}</td>
            <td>{{item.giftPackageCode}}</td>
            <td>{{item.giftName}}</td>
            <td style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap" :title="item.goodsString">
              {{item.goodsString}}
            </td>
            <td>{{item.upperShelf}}</td>
            <td>{{item.unitPrice}}</td>
            <td>
              <div
                @click="$bvModal.show('modal-gift-edit');cashGiftEditClick(item)"
                class="bg-info"
                style="width: 25px;height: 25px;display: inline-block;cursor: pointer;text-align: center">
                <i class="icon iconfont iconxiugai1 text-light"></i>
              </div>
              <div
                @click="cashGiftDelete(item,'del')"
                class="bg-warning ml-3 mr-3 text-center"
                style="width: 25px;height: 25px;display: inline-block;cursor: pointer;text-align: center">
                <i class="icon iconfont iconshanchu text-light"></i>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-pagination
          v-model="d_cashGiftPage.currentPage"
          :total-rows="d_cashGiftPage.pageNum"
          :per-page="d_cashGiftPage.pageSize"
          @input="cashGiftPageChange()"
          aria-controls="my-table"
        >
          <template v-slot:first-text><span class="text-success">首页</span></template>
          <template v-slot:prev-text><span class="text-danger">上一页</span></template>
          <template v-slot:next-text><span class="text-warning">下一页</span></template>
          <template v-slot:last-text><span class="text-info">末页</span></template>
        </b-pagination>
      </template>
    </b-modal>
    <!--新增大礼包-->
    <b-modal id="modal-gift-add" centered size="lg" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            新增大礼包
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close()">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
          <div class="input-group w-50 mb-2">
            <b-button variant="info mr-1" size="sm">大礼包名称</b-button>
            <input type="text" class="form-control" id="giftName" placeholder="输入礼包名称/编号" v-model="d_cashGiftAdd.giftName">
          </div>
          <div class="input-group w-50 mb-2 justify-content-end">
            <b-button variant="danger mr-1" size="sm">定价</b-button>
            <input type="number" class="form-control" id="giftPrice" placeholder="请输入价格" v-model="d_cashGiftAdd.unitPrice">
          </div>
          <div class="input-group w-50">
            <b-button variant="success mr-1" size="sm">
              <span class="mr-1">销售</span><span class="mr-1">状态</span>
            </b-button>
            <b-form-radio v-model="d_cashGiftAdd.upperShelf" name="radio-inline" value="0" >在售</b-form-radio>
            <b-form-radio v-model="d_cashGiftAdd.upperShelf" name="radio-inline" value="1" selected>下架</b-form-radio>
          </div>
          <div class="input-group w-50 justify-content-end">
            <b-button variant="primary mr-1 pl-2 pr-2" size="sm">编号</b-button>
            <input type="number" class="form-control" id="giftCode" placeholder="请输入编号" v-model="d_cashGiftAdd.giftCode">
          </div>
        </div>
        <table class="table table-bordered ">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">商品名称</th>
            <th scope="col">单价</th>
            <th scope="col">数量</th>
            <th scope="col">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item,index,) in d_cashGiftAdd.giftPackageInfoDTOS" :key="index">
            <td scope="row">{{index + 1}}</td>
            <td>{{item.goodsName}}</td>
            <td>{{item.unitPrice}}</td>
            <td>{{item.number}}</td>
            <td>
              <i class="icon iconfont icon iconfont iconziyuan1 mr-3 align-middle" style="font-size: 22px" v-on:click="cashGiftOperate('add','add',item)"></i>
              <i class="icon iconfont iconziyuan mr-3 align-middle" style="font-size: 22px" @click="cashGiftOperate('add','minus',item,index)"></i>
              <i class="icon iconfont iconziyuan1-copy align-middle" style="font-size: 22px" @click="cashGiftOperate('add','del',item,index)"></i>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="input-group w-100 p-2" style="background: #F6F6F6;">
          <b-button variant="success" size="sm" @click="$bvModal.show('modal-gift-goods');d_cashGiftStatus='gift'">添加商品</b-button>
          <b class="text-right" style="flex: 1;text-align: right;">商品总价：￥{{d_cashGiftAdd.sales.toFixed(2)}}</b>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button variant="info pl-4 pr-4" @click="cashGiftAdd();close()">
          <span class="mr-1">保</span>
          <span>存</span>
        </b-button>
      </template>
    </b-modal>
    <!--编辑大礼包-->
    <b-modal id="modal-gift-edit" centered size="lg" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            编辑大礼包
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close()">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
          <div class="input-group w-50 mb-2">
            <b-button variant="info mr-1" size="sm">大礼包名称</b-button>
            <input type="text" class="form-control" placeholder="输入礼包名称/编号" v-model="d_cashGiftEdit.giftName">
          </div>
          <div class="input-group w-50 mb-2 justify-content-end">
            <b-button variant="danger mr-1" size="sm">定价</b-button>
            <input type="number" class="form-control" placeholder="请输入价格" v-model="d_cashGiftEdit.unitPrice">
          </div>
          <div class="input-group w-50">
            <b-button variant="success mr-1" size="sm">
              <span class="mr-1">销售</span><span class="mr-1">状态</span>
            </b-button>
            <b-form-radio v-model="d_cashGiftEdit.upperShelf" name="radio-inline" value="上架" >上架</b-form-radio>
            <b-form-radio v-model="d_cashGiftEdit.upperShelf" name="radio-inline" value="下架" selected>下架</b-form-radio>
          </div>
          <div class="input-group w-50 justify-content-end">
            <b-button variant="primary mr-1 pl-2 pr-2" size="sm">编号</b-button>
            <input type="number" class="form-control" placeholder="请输入编号" v-model="d_cashGiftEdit.giftPackageCode">
          </div>
        </div>
        <table class="table table-bordered ">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">商品名称</th>
            <th scope="col">单价</th>
            <th scope="col">数量</th>
            <th scope="col">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item,index,) in d_cashGiftEdit.giftGoodsInfos" :key="index">
            <td scope="row">{{index + 1}}</td>
            <td>{{item.goodsName}}</td>
            <td>{{item.unitPrice}}</td>
            <td>{{item.number}}</td>
            <td>
              <i class="icon iconfont icon iconfont iconziyuan1 mr-3 align-middle" style="font-size: 22px" v-on:click="cashGiftOperate('edit','add',item)"></i>
              <i class="icon iconfont iconziyuan mr-3 align-middle" style="font-size: 22px" @click="cashGiftOperate('edit','minus',item,index)"></i>
              <i class="icon iconfont iconziyuan1-copy align-middle" style="font-size: 22px" @click="cashGiftOperate('edit','del',item,index)"></i>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="input-group w-100 p-2" style="background: #F6F6F6;">
          <b-button variant="success" size="sm" @click="$bvModal.show('modal-gift-goods');d_cashGiftStatus='edit'">添加商品</b-button>
          <b class="text-right" style="flex: 1;text-align: right;">商品总价：￥{{d_cashGiftEdit.sales.toFixed(2)}}</b>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button variant="info pl-4 pr-4" @click="cashGiftEditSubmit();close()">
          <span>确认修改</span>
        </b-button>
      </template>
    </b-modal>
    <!--大礼包查询商品-->
    <b-modal id="modal-gift-goods" centered size="md" no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="w-100">
          <h6 class="text-center">
            大礼包查询商品
            <b-button class="float-right" size="sm" variant="outline-danger" @click="close();d_cashCodeGoods=[]">
              关闭
            </b-button>
          </h6>
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="search mb-2">
          <div class="input-group w-50">
            <input type="tel" class="form-control" id="giftGoodCode" placeholder="输入条码/自定义编号" v-model="d_cashCodeOperate">
            <button class="btn btn-info ml-1" @click="cashGiftGoodSearch()">查询</button>
          </div>
        </div>
        <table class="table table-bordered">
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
            v-bind:class="{'table-info':item.active}" v-on:click="cashCodeGoodsClick(index,'select')">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.goodsName}}</td>
            <td>{{item.goodsCode}}</td>
            <td>{{item.unitPrice}}</td>
          </tr>
          </tbody>
        </table>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <label for="giftAmount" class="">添加数量：</label>
        <input
          v-model="d_cashCodeGoodAmount"
          type="tel" id="giftAmount" class="form-control"
          style="display: inline-block;flex: none;">
        <b-button
          class="pl-md-4 pr-md-4" size="sm" variant="success"
          v-on:click="close();cashCodeGoodsClick('sure',d_cashGiftStatus)">
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
