<template>
  <!--一个template必须用一个div包裹所有元素，否则报错-->
  <div class="market-cash">
    <div class="market-cash-table overflow-auto ml-3 mr-3">
      <button
        ref="cashCodeBtn"
        @click="cashCodeBtnClick()"
        class="btn btn-warning position-absolute">
        继续扫码
      </button>
      <div class="mt-3">
        <input
          ref="cashCodeInput"
          type="text"
          class="form-control position-absolute"
          @input="cashGoodChange($event)"
          @blur="cashInputBlur"
          autofocus />
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
            <td>{{item.amuont}}</td>
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
        <div style="cursor: pointer;display: inline-block" v-b-modal.modal-center="">
          <p class="h2">查询</p>
          <p class="h6">无条形码商品</p>
        </div>
        <b-modal id="modal-center" centered size="md" no-close-on-backdrop>
          <template slot="modal-header" slot-scope="{ close }">
            <div class="w-100">
              <h6 class="text-center">
                查询无条形码商品
                <b-button class="float-right" size="sm" variant="outline-danger" @click="close()">
                  关闭
                </b-button>
              </h6>
            </div>
          </template>
          <template slot="default" slot-scope="{ hide }">
            <div class="search mb-2">
              <div class="input-group w-50">
                <input type="text" class="form-control" id="goodName" placeholder="输入商品名称">
                <button class="btn btn-info ml-1">查询</button>
              </div>
              <div class="input-group w-50" style="justify-content: flex-end">
                <input type="text" class="form-control" id="goodCode" placeholder="输入自定义编号">
                <button class="btn btn-info ml-1">查询</button>
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
            <b-button class="pl-md-4 pr-md-4" size="sm" variant="success" @click="close()cashCodeGoodsClick('sure')">
              确定
            </b-button>
          </template>
        </b-modal>
      </div>
      <div class="footer-pay">
        <div class="footer-pay-content position-absolute">
          <span style="color: #000;">支付方式：</span>
          <b-form-select v-model="d_cashSelected" :options="d_cashOptions" size="sm"></b-form-select>
        </div>
        <div class="footer-pay-border position-absolute"></div>
      </div>
      <div class="footer-total">
        <span class="h4 text-dark">合计金额：
          <strong class="h3 text-danger">￥{{d_cashTotal}}</strong>
        </span>
      </div>
      <div class="footer-btn">
        <button class="btn btn-primary">确认收款成功</button>
      </div>
    </div>
  </div>
</template>

<script>
var debounce = require('lodash.debounce')
export default {
  name: 'MarketCash',
  data: () => {
    return {
      d_cashExDoods: [
        //模拟查询数据
        { goodsName: '粉红西瓜1', goodsCode: '6903244675147', unitPrice: '10.11', amuont: '3' },
        { goodsName: '粉红西瓜2', goodsCode: '02', unitPrice: '10.11', amuont: '3' },
        { goodsName: '粉红西瓜3', goodsCode: '03', unitPrice: '10.11', amuont: '3' },
        { goodsName: '粉红西瓜4', goodsCode: '04', unitPrice: '10.11', amuont: '3' },
        { goodsName: '粉红西瓜4', goodsCode: '05', unitPrice: '10.11', amuont: '3' },
        { goodsName: '粉红西瓜4', goodsCode: '06', unitPrice: '10.11', amuont: '3' },
      ],
      d_cashGoods: [
        // 已经扫描的商品
        { goodsName: '粉红西瓜1', goodsCode: '01', unitPrice: '10.11', amuont: '3' },
      ],
      d_cashTotal: 0,   // 商品总价
      d_cashSelected: 1, // 已选收费方式
      d_cashOptions: [
        // 收费方式列表
        { value: '1', text: '现金支付' },
        { value: '2', text: '支付宝支付' },
        { value: '3', text: '微信支付' },
      ],
      //
      d_cashCodeGoods: [
        { goodsName: '粉红西瓜1', goodsCode: '6903244675147', unitPrice: '10.11',active: false},
        { goodsName: '粉红西瓜2', goodsCode: '02', unitPrice: '10.11',active: false},
        { goodsName: '粉红西瓜3', goodsCode: '03', unitPrice: '10.11',active: false},
        { goodsName: '粉红西瓜4', goodsCode: '04', unitPrice: '10.11',active: false},
        { goodsName: '粉红西瓜4', goodsCode: '05', unitPrice: '10.11',active: false},
        { goodsName: '粉红西瓜4', goodsCode: '06', unitPrice: '10.11',active: false},
      ],
      d_cashCodeGoodAmount: null
    }
  },
  methods: {
    cashGoodChange: debounce(function (event) {
      const item = this.d_cashExDoods.filter((val) => {
        return val.goodsCode === event.target.value
      })
      const goodCode = []
      for (let i = 0; i < this.d_cashGoods.length; i++) {
        goodCode.push(this.d_cashGoods[i].goodsCode)
      }
      if (item.length > 0) {
        this.d_cashTotal = 0
        if (goodCode.includes(item[0].goodsCode)) {
          this.d_cashGoods.map((val) => {
            if (item[0].goodsCode === val.goodsCode) {
              val.amuont = parseInt(val.amuont) + 1
            }
            this.d_cashTotal += (parseFloat(val.amuont) * parseFloat(val.unitPrice))
          })
        } else {
          this.d_cashGoods.push(item[0])
          this.cashCalculateTotal()
        }
      }
      event.target.value = '';
    }, 800),
    cashOperateClick: function (ope, index) {
      switch (ope) {
        case 'add':
          this.d_cashGoods[index].amuont = parseInt(this.d_cashGoods[index].amuont) + 1
          this.cashCalculateTotal()
          break
        case 'minus':
          this.d_cashGoods[index].amuont = parseInt(this.d_cashGoods[index].amuont) - 1
          this.cashCalculateTotal()
          if (this.d_cashGoods[index].amuont == '0') {
            this.d_cashGoods.splice(index,1)
          }
          break
        case 'del':
          this.d_cashGoods.splice(index,1)
          this.cashCalculateTotal()
          break
      }
    },
    cashCalculateTotal: function () {
      this.d_cashTotal = 0
      this.d_cashGoods.map((val) => {
        this.d_cashTotal += (parseFloat(val.amuont) * parseFloat(val.unitPrice))
      })
    },
    cashCodeBtnClick: function () {
      this.$refs.cashCodeInput.focus();
      this.$refs.cashCodeBtn.style.display = 'none';
    },
    cashInputBlur: function () {
      this.$refs.cashCodeBtn.style.display = 'block';
    },
    cashCodeGoodsClick: function (index) {
      if (!index === 'srue') {
        this.d_cashCodeGoods.map((val) => {
          val.active = false;
        })
        this.d_cashCodeGoods[index].active = true;
      } else {
        console.log(index);
      }
    }
  }
}
</script>

<style lang="scss">
  @import "MarketCash.component";
</style>
