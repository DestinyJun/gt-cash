<template>
  <div class="market-storage h-100">
    <!--头部-->
    <div class="storage-header pl-3 pr-3 pt-2 pb-2">
      <span class="h4">商品入库</span>
      <div class="btn-group">
        <b-button variant="warning mr-2" @click="$bvModal.show('modal-center-code')">
          <i class="icon iconfont iconjia mr-2"></i>
          <span>无条码入库</span>
        </b-button>
        <b-button variant="info" pressed @click="$bvModal.show('add-code')">
          <i class="icon iconfont iconjia mr-2"></i>
          <span>新增有条码商品</span>
        </b-button>
        <b-button variant="danger ml-2" pressed @click="$bvModal.show('add-no-code')">
          <i class="icon iconfont iconjia mr-2"></i>
          <span>新增无条码商品</span>
        </b-button>
      </div>
    </div>
    <!--表格内容-->
    <div class="content container-fluid">
      <b-table outlined hover responsive="sm"
        :items="d_stCodeGoodsList"
        :fields="d_stCodeGoodsField">
      </b-table>
    </div>
    <!--底部提交-->
    <div class="footer position-absolute">
      <button
        ref="storageCodeBtn"
        @click="srCodeBtnClick()"
        class="btn btn-danger mr-3 text-light">
        点击扫码入库品
      </button>
      <b-btn
        size="max-md-1g"
        :disabled="d_stCodeGoodsList.length === 0"
        variant="success pl-5 pr-5"
        @click="stStorageSubmit()">提交入库</b-btn>
    </div>
    <!--扫码框-->
    <div class="scan-code">
      <input
        ref="storageCodeInput"
        type="text"
        class="form-control position-absolute"
        @input="stScanChange($event.target,'')"
        @blur="srCodeInputBlur"
        autofocus/>
    </div>
    <!--有条码商品添加弹窗-->
    <b-modal
      title="新增有条码商品"
      title-class="h6"
      id="add-code"
      centered size="lg"
      no-clise-on-backdrop>
      <template slot="default">
        <form ref="fromline">
          <!--商品条码-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品条码</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="goodsCode" name="goodsCode" v-model="d_stGoodAddCode.goodsCode">
            </div>
          </div>
          <!--商品名称-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsName" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="goodsName" name="goodsName" v-model="d_stGoodAddCode.goodsName">
            </div>
          </div>
          <!--单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="company" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="company" name="company" v-model="d_stGoodAddCode.company">
            </div>
          </div>
          <!--单价-->
          <div class="form-group row pl-3 pr-3">
            <label for="unitPrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="unitPrice" name="unitPrice" v-model="d_stGoodAddCode.unitPrice">
            </div>
          </div>
          <!--进价-->
          <div class="form-group row pl-3 pr-3">
            <label for="purchasePrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">进价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="purchasePrice" name="purchasePrice" v-model="d_stGoodAddCode.purchasePrice">
            </div>
          </div>
          <!--商品类型-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsType" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品类型</label>
            <div class="col-sm-9">
              <select type="text" class="form-control" id="goodsType" name="goodsType" v-model="d_stGoodAddCode.goodsType">
                <option value="0">请选择商品类型......</option>
                <option v-for="item in d_stGoodTypes" :value="item.sysCode">{{item.sysName}}</option>
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
                  value="1" v-model="d_stGoodAddCode.haveCapacity"
                  @input="stHaveCapacityChange($event)">
                <label class="custom-control-label" for="customRadioInline1">是</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline ml-5">
                <input
                  type="radio" id="customRadioInline2"
                  name="haveCapacity" class="custom-control-input"
                  value="0" v-model="d_stGoodAddCode.haveCapacity"
                  @input="stHaveCapacityChange($event)">
                <label class="custom-control-label" for="customRadioInline2">否</label>
              </div>
            </div>
          </div>
          <!--所包含的商品-->
          <div class="form-group row pl-3 pr-3">
            <label for="containGoodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">包含的商品条码</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="containGoodsCode" name="purchasePrice" :disabled="d_stHaveStatus" v-model="d_stGoodAddCode.containGoodsCode">
            </div>
          </div>
          <!--容量-->
          <div class="form-group row pl-3 pr-3">
            <label for="capacity" class="col-sm-3 col-form-label" style="font-size: 0.8rem">容量</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="capacity" name="capacity" :disabled="d_stHaveStatus" v-model="d_stGoodAddCode.capacity">
            </div>
          </div>
          <!--容量单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="capacityCompany" class="col-sm-3 col-form-label" style="font-size: 0.8rem">容量单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="capacityCompany" name="capacityCompany" :disabled="d_stHaveStatus" v-model="d_stGoodAddCode.capacityCompany">
            </div>
          </div>
        </form>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-btn variant="success" class="pl-5 pr-5 mr-5" @click="close();stAddGoodClick()">确定</b-btn>
        <b-btn variant="danger" class="pl-5 pr-5" @click="close()">取消</b-btn>
      </template>
    </b-modal>
    <!--无条码商品添加弹窗-->
    <b-modal
      title="新增无条码商品"
      title-class="h6"
      id="add-no-code"
      centered size="lg"
      no-clise-on-backdrop>
      <template slot="default">
        <form ref="fromline">
          <!--商品条码-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_goodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">自定义条码</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="un_goodsCode" name="goodsCode" v-model="d_stGoodAddNoCode.goodsCode">
            </div>
          </div>
          <!--商品名称-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_goodsName" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="un_goodsName" name="goodsName" v-model="d_stGoodAddNoCode.goodsName">
            </div>
          </div>
          <!--单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_company" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="un_company" name="company" v-model="d_stGoodAddNoCode.company">
            </div>
          </div>
          <!--单价-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_unitPrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="un_unitPrice" name="unitPrice" v-model="d_stGoodAddNoCode.unitPrice">
            </div>
          </div>
          <!--进价-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_purchasePrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">进价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="un_purchasePrice" name="purchasePrice" v-model="d_stGoodAddNoCode.purchasePrice">
            </div>
          </div>
          <!--商品类型-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_goodsType" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品类型</label>
            <div class="col-sm-9">
              <select type="text" class="form-control" id="un_goodsType" name="goodsType" v-model="d_stGoodAddNoCode.goodsType">
                <option value="0">请选择商品类型......</option>
                <option v-for="item in d_stGoodTypes" :value="item.sysCode">{{item.sysName}}</option>
              </select>
            </div>
          </div>
        </form>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-btn variant="success" class="pl-5 pr-5 mr-5" @click="close();stNoCodeGoodAddGood()">确定</b-btn>
        <b-btn variant="danger" class="pl-5 pr-5" @click="close()">取消</b-btn>
      </template>
    </b-modal>
    <!--扫码入库弹窗-->
    <b-modal
      id="modal-center-scan"
      title="扫码入库"
      title-class="h6"
      centered no-close-on-backdrop>
      <template slot="default" slot-scope="{ hide }">
        <div class="form-inline">
          <div class="form-group mb-2 mr-0">
            <span class="form-control-plaintext">查询到的商品：</span>
          </div>
         <!-- <div class="form-group mb-2" style="padding-right: -1rem">
            <label for="inputPassword2" class="sr-only">搜索</label>
            <input type="number" ref="searchInput" class="form-control" id="inputPassword2" placeholder="请输入条码/自定义编码" style="font-size: 0.8rem">
            <b-btn size="sm" variant="primary ml-1" @click="stCodeChange($refs.searchInput, 'private')">搜索</b-btn>
          </div>-->
        </div>
        <table class="table table-bordered ">
          <thead>
          <tr>
            <th scope="col">商品名称</th>
            <th scope="col">当前库存</th>
            <th scope="col">单位</th>
            <th scope="col">单价</th>
            <th scope="col">进价</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item,index,) in d_stGoodSearch" :key="index"
            v-bind:class="{'table-info':item.active}" v-on:click="stSearchGoodsSelect(item)">
            <td>{{item.goodsName}}</td>
            <td>{{item.nowSize}}</td>
            <td>{{item.company}}</td>
            <td>{{item.unitPrice}}</td>
            <td>{{item.purchasePrice}}</td>
          </tr>
          </tbody>
        </table>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <label for="amount" class="">请输入入库数量：</label>
        <input
          type="number" id="amount" class="form-control"
          v-model="d_stGoodSearchSelect.number"
          style="display: inline-block;flex: none;">
        <b-button
          class="pl-md-4 pr-md-4" size="sm" variant="success"
          v-on:click="stStorageSure();close()">
          确定入库
        </b-button>
      </template>
    </b-modal>
    <!--手动入库弹窗-->
    <b-modal
      id="modal-center-code"
      title="手动入库"
      title-class="h6"
      centered no-close-on-backdrop>
      <template slot="default" slot-scope="{ hide }">
        <div class="form-inline">
          <div class="form-group mb-2">
            <label for="inputPassword2" class="sr-only">搜索</label>
            <input type="number" ref="searchInput" class="form-control" id="inputPassword2" placeholder="请输入条码/自定义编码" style="font-size: 0.8rem">
            <b-btn size="sm" variant="primary ml-1" @click="stCodeChange($refs.searchInput)">搜索</b-btn>
          </div>
        </div>
        <table class="table table-bordered ">
          <thead>
          <tr>
            <th scope="col">商品名称</th>
            <th scope="col">当前库存</th>
            <th scope="col">单位</th>
            <th scope="col">单价</th>
            <th scope="col">进价</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(item,index,) in d_stGoodSearch" :key="index"
            v-bind:class="{'table-info':item.active}" v-on:click="stSearchGoodsSelect(item)">
            <td>{{item.goodsName}}</td>
            <td>{{item.nowSize}}</td>
            <td>{{item.company}}</td>
            <td>{{item.unitPrice}}</td>
            <td>{{item.purchasePrice}}</td>
          </tr>
          </tbody>
        </table>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <label for="amount2" class="">请输入入库数量：</label>
        <input
          type="number" id="amount2" class="form-control"
          v-model="d_stGoodSearchSelect.number"
          style="display: inline-block;flex: none;">
        <b-button
          class="pl-md-4 pr-md-4" size="sm" variant="success"
          v-on:click="stStorageSure();close()">
          确定入库
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script src="./MarketStorage.component.js"></script>

<style scoped lang="scss">
  @import "MarketStorage.component";
</style>
