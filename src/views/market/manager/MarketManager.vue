<template>
  <div class="manager">
    <!--搜索框-->
    <div class="saerch pt-3 pl-3">
      <div class="input-group w-50">
        <input type="text" class="form-control" id="goodName" placeholder="输入商品名称">
        <button class="btn btn-info ml-1">查询</button>
      </div>
    </div>
    <!--表格内容-->
    <div class="content pl-3 pr-3 overflow-auto">
      <b-table outlined hover responsive="sm" :items="d_mnGoods" :fields="d_mFields">
        <template slot="[index]" slot-scope="data">
          <span>{{data.index + 1}}</span>
        </template>
        <template slot="[upperShelf]" slot-scope="data">
          <span>{{data.item.upperShelf === '0'?'上架中':'下架中'}}</span>
        </template>
        <template slot="[operate]" slot-scope="data">
          <div
            @click="mnTableOperateClick(data.item,'editor')"
            class="bg-info"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer;">
            <i class="icon iconfont iconxiugai1 text-light"></i>
          </div>
          <div
            @click="mnTableOperateClick(data.item,'del')"
            class="bg-warning ml-3 mr-3"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer;">
            <i class="icon iconfont iconshanchu text-light"></i>
          </div>
        </template>
      </b-table>
      <b-pagination
        v-model="d_page.currentPage"
        :total-rows="d_page.pageNum"
        :per-page="d_page.pageSize"
        @input="mnGoodsPageChange()"
        aria-controls="my-table"
      >
        <template v-slot:first-text><span class="text-success">首页</span></template>
        <template v-slot:prev-text><span class="text-danger">上一页</span></template>
        <template v-slot:next-text><span class="text-warning">下一页</span></template>
        <template v-slot:last-text><span class="text-info">末页</span></template>
      </b-pagination>
    </div>
    <!--商品销毁弹窗-->
    <b-modal
      id="modal-center-destroy"
      centered size="md"
      no-close-on-backdrop>
      <template slot="modal-header" slot-scope="{ close }">
        <div class="form-group">
          <label class="h6" for="quantity">销毁数量：</label>
          <input type="tel" class="form-control" id="quantity" name="destructionNumber" v-model="d_destroy.destructionNumber">
        </div>
      </template>
      <template slot="default" slot-scope="{ hide }">
        <div class="form-group pl-md-5 pr-md-5">
          <label for="mark">备注：</label>
          <textarea name="mark" id="mark" cols="30" rows="3" class=form-control v-model="d_destroy.mark"></textarea>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button
          class="pl-md-5 pr-md-5" size="sm" variant="success"
          v-on:click="close();mnGoodsDestroyClick()">
          确定
        </b-button>
        <b-button
          class="pl-md-5 pr-md-5" size="sm" variant="danger"
          v-on:click="close()">
          取消
        </b-button>
      </template>
    </b-modal>
    <!--无条码商修改弹窗-->
    <b-modal
      title="修改自定义条码商品"
      title-class="h6"
      id="update-no-code"
      centered size="lg"
      no-clise-on-backdrop>
      <template slot="default">
        <form ref="fromline">
          <!--商品条码-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_goodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">自定义条码</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="un_goodsCode" name="goodsCode" v-model="d_mnPrivateUpdate.goodsCode">
            </div>
          </div>
          <!--商品名称-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_goodsName" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="un_goodsName" name="goodsName" v-model="d_mnPrivateUpdate.goodsName">
            </div>
          </div>
          <!--单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_company" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="un_company" name="company" v-model="d_mnPrivateUpdate.company">
            </div>
          </div>
          <!--是否上架-->
          <div class="form-group row pl-3 pr-3">
            <label class="col-sm-3 col-form-label" style="font-size: 0.8rem">是否上架</label>
            <div class="col-sm-9">
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio" id="private_upperShelf2"
                  name="haveCapacity" class="custom-control-input"
                  value="0" v-model="d_mnPrivateUpdate.upperShelf">
                <label class="custom-control-label" for="private_upperShelf2">是</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline ml-5">
                <input
                  type="radio" id="private_upperShelf1"
                  name="haveCapacity" class="custom-control-input"
                  value="1" v-model="d_mnPrivateUpdate.upperShelf">
                <label class="custom-control-label" for="private_upperShelf1">否</label>
              </div>
            </div>
          </div>
          <!--单价-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_unitPrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="un_unitPrice" name="unitPrice" v-model="d_mnPrivateUpdate.unitPrice">
            </div>
          </div>
          <!--进价-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_purchasePrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">进价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="un_purchasePrice" name="purchasePrice" v-model="d_mnPrivateUpdate.purchasePrice">
            </div>
          </div>
          <!--商品类型-->
          <div class="form-group row pl-3 pr-3">
            <label for="un_goodsType" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品类型</label>
            <div class="col-sm-9">
              <select type="text" class="form-control" id="un_goodsType" name="goodsType" v-model="d_mnPrivateUpdate.goodsType">
                <option value="0">请选择商品类型......</option>
                <option v-for="item in d_mnGoodTypes" :value="item.sysCode">{{item.sysName}}</option>
              </select>
            </div>
          </div>
        </form>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-btn variant="success" class="pl-5 pr-5 mr-5" @click="close();mnGoodsSureOperate('editor','private')">确定</b-btn>
        <b-btn variant="danger" class="pl-5 pr-5" @click="close()">取消</b-btn>
      </template>
    </b-modal>
    <!--有条码商品修改弹窗-->
    <b-modal
      title="修改条码商品"
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
              <input type="number" class="form-control" id="goodsCode" name="goodsCode" v-model="d_mnPublicUpdate.goodsCode">
            </div>
          </div>
          <!--商品名称-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsName" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="goodsName" name="goodsName" v-model="d_mnPublicUpdate.goodsName">
            </div>
          </div>
          <!--单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="company" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="company" name="company" v-model="d_mnPublicUpdate.company">
            </div>
          </div>
          <!--单价-->
          <div class="form-group row pl-3 pr-3">
            <label for="unitPrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">单价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="unitPrice" name="unitPrice" v-model="d_mnPublicUpdate.unitPrice">
            </div>
          </div>
          <!--是否上架-->
          <div class="form-group row pl-3 pr-3">
            <label class="col-sm-3 col-form-label" style="font-size: 0.8rem">是否上架</label>
            <div class="col-sm-9">
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio" id="public_upperShelf1"
                  name="upperShelf" class="custom-control-input"
                  value="0" v-model="d_mnPublicUpdate.upperShelf">
                <label class="custom-control-label" for="public_upperShelf1">是</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline ml-5">
                <input
                  type="radio" id="public_upperShelf2"
                  name="upperShelf" class="custom-control-input"
                  value="1" v-model="d_mnPublicUpdate.upperShelf">
                <label class="custom-control-label" for="public_upperShelf2">否</label>
              </div>
            </div>
          </div>
          <!--进价-->
          <div class="form-group row pl-3 pr-3">
            <label for="purchasePrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">进价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="purchasePrice" name="purchasePrice" v-model="d_mnPublicUpdate.purchasePrice">
            </div>
          </div>
          <!--商品类型-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsType" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品类型</label>
            <div class="col-sm-9">
              <select type="text" class="form-control" id="goodsType" name="goodsType" v-model="d_mnPublicUpdate.goodsType">
                <option value="0">请选择商品类型......</option>
                <option v-for="item in d_mnGoodTypes" :value="item.sysCode">{{item.sysName}}</option>
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
                  value="1" v-model="d_mnPublicUpdate.haveCapacity"
                  @input="mnHaveCapacityChange($event.target.value)">
                <label class="custom-control-label" for="customRadioInline1">是</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline ml-5">
                <input
                  type="radio" id="customRadioInline2"
                  name="haveCapacity" class="custom-control-input"
                  value="0" v-model="d_mnPublicUpdate.haveCapacity"
                  @input="mnHaveCapacityChange($event.target.value)">
                <label class="custom-control-label" for="customRadioInline2">否</label>
              </div>
            </div>
          </div>
          <!--所包含的商品-->
          <div class="form-group row pl-3 pr-3">
            <label for="containGoodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">包含的商品条码</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="containGoodsCode" name="purchasePrice" :disabled="d_mnHaveStatus" v-model="d_mnPublicUpdate.containGoodsCode">
            </div>
          </div>
          <!--容量-->
          <div class="form-group row pl-3 pr-3">
            <label for="capacity" class="col-sm-3 col-form-label" style="font-size: 0.8rem">容量</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="capacity" name="capacity" :disabled="d_mnHaveStatus" v-model="d_mnPublicUpdate.capacity">
            </div>
          </div>
          <!--容量单位-->
          <div class="form-group row pl-3 pr-3">
            <label for="capacityCompany" class="col-sm-3 col-form-label" style="font-size: 0.8rem">容量单位</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="capacityCompany" name="capacityCompany" :disabled="d_mnHaveStatus" v-model="d_mnPublicUpdate.capacityCompany">
            </div>
          </div>
        </form>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-btn variant="success" class="pl-5 pr-5 mr-5" @click="close();mnGoodsSureOperate('editor','public')">确定</b-btn>
        <b-btn variant="danger" class="pl-5 pr-5" @click="close()">取消</b-btn>
      </template>
    </b-modal>
  </div>
</template>

<script src="./MarketManager.component.js"></script>

<style scoped lang="scss">
  @import "MarketManager.component";
</style>
