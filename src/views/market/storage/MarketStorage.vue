<template>
  <div class="market-storage">
    <!--头部-->
    <div class="header pl-3 pr-3 pt-2 pb-2">
      <span class="h4">商品入库</span>
      <b-button variant="info" pressed @click="$bvModal.show('modal-center-add')">
        <i class="icon iconfont iconjia mr-2"></i>
        <span>新增商品</span>
      </b-button>
    </div>
    <!--表格内容-->
    <div class="content">
      <b-table outlined hover responsive="sm"
        :items="d_stCodeGoods"
        :fields="d_stCodeGoodsField">
      </b-table>
    </div>
    <!--底部提交-->
    <div class="footer"></div>
    <!--商品添加弹窗-->
    <b-modal id="modal-center-add" centered size="lg" no-clise-on-backdrop>
      <template slot="modal-header">
        <h6>新增条形码商品</h6>
      </template>
      <template slot="default">
        <form ref="fromline">
          <!--商品条码-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品条码</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="goodsCode" name="goodsCode" v-model="d_stGoodAdd.goodsCode">
            </div>
          </div>
          <!--商品名称-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsName" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="goodsName" name="goodsName" v-model="d_stGoodAdd.goodsName">
            </div>
          </div>
          <!--单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="company" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="company" name="company" v-model="d_stGoodAdd.company">
            </div>
          </div>
          <!--单价-->
          <div class="form-group row pl-3 pr-3">
            <label for="unitPrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单价</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="unitPrice" name="unitPrice" v-model="d_stGoodAdd.unitPrice">
            </div>
          </div>
          <!--进价-->
          <div class="form-group row pl-3 pr-3">
            <label for="purchasePrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">进价</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="purchasePrice" name="purchasePrice" v-model="d_stGoodAdd.purchasePrice">
            </div>
          </div>
          <!--商品类型-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsType" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品类型</label>
            <div class="col-sm-9">
              <select type="text" class="form-control" id="goodsType" name="goodsType" v-model="d_stGoodAdd.goodsType">
                <option value="0">请选择商品类型</option>
              </select>
            </div>
          </div>
          <!--是否拥有容量-->
          <div class="form-group row pl-3 pr-3">
            <label class="col-sm-3 col-form-label" style="font-size: 0.8rem">是否拥有容量</label>
            <div class="col-sm-9">
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio" id="customRadioInline1"
                  name="haveCapacity" class="custom-control-input"
                  value="1" v-model="d_stGoodAdd.haveCapacity"
                  @input="stHaveCapacityChange($event)">
                <label class="custom-control-label" for="customRadioInline1">是</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline ml-5">
                <input
                  type="radio" id="customRadioInline2"
                  name="haveCapacity" class="custom-control-input"
                  value="0" v-model="d_stGoodAdd.haveCapacity"
                  @input="stHaveCapacityChange($event)">
                <label class="custom-control-label" for="customRadioInline2">否</label>
              </div>
            </div>
          </div>
          <!--所包含的商品-->
          <div class="form-group row pl-3 pr-3">
            <label for="containGoodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">所包含的商品</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="containGoodsCode" name="purchasePrice" :disabled="d_stHaveStatus" v-model="d_stGoodAdd.containGoodsCode">
            </div>
          </div>
          <!--容量-->
          <div class="form-group row pl-3 pr-3">
            <label for="capacity" class="col-sm-3 col-form-label" style="font-size: 0.8rem">容量</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="capacity" name="capacity" :disabled="d_stHaveStatus" v-model="d_stGoodAdd.capacity">
            </div>
          </div>
          <!--容量单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="capacityCompany" class="col-sm-3 col-form-label" style="font-size: 0.8rem">容量单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="capacityCompany" name="capacityCompany" :disabled="d_stHaveStatus" v-model="d_stGoodAdd.capacityCompany">
            </div>
          </div>
        </form>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-btn variant="success" class="pl-5 pr-5 mr-5" @click="close();stAddGoodClick()">确定</b-btn>
        <b-btn variant="danger" class="pl-5 pr-5" @click="close()">取消</b-btn>
      </template>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'MarketStorage',
    data() {
      return {
        d_stHaveStatus: false, // 是否有容量的状态
        d_stGoodAdd: {
          id: '-1',
          goodsCode: null,
          goodsName: null,
          merchatCode: null,
          company: null,
          unitPrice: null,
          purchasePrice: null,
          goodsType: null,
          haveCapacity: 1,
          containGoodsCode: null,
          capacity: null,
          capacityCompany: null,
        },
        d_stCodeGoodsField: [
          {goodsCode: '条码/自定义编码'},
          {goodsName: '商品名称'},
          {nowSize: '当前库存'},
          {company: '单位'},
          {unitPrice: '单价'},
          {purchasePrice: '进价'},
          {purchasePrice: '进价'},
          {number: '入库数量'},
        ],
        d_stCodeGoods: []
      }
    },
    methods: {
      stHaveCapacityChange(event){
        if (event.target.value === '1') {
          this.d_stHaveStatus = false
        } else if (event.target.value === '0') {
          this.d_stHaveStatus = true
        }
      },
      stAddGoodClick(){
        console.log(this.d_stGoodAdd);
        this.stInputReset();
      },
      stInputReset() {
        for (const prop in this.d_stGoodAdd) {
          if (this.d_stGoodAdd.hasOwnProperty(prop)) {
            this.d_stGoodAdd[prop] = null
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "MarketStorage.component";
</style>
