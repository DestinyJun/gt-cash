<template>
  <div class="market-storage h-100">
    <!--头部-->
    <div class="header pl-3 pr-3 pt-2 pb-2">
      <span class="h4">商品入库</span>
      <div class="btn-group">
        <b-button variant="warning mr-2" @click="$bvModal.show('modal-center-search')">
          <i class="icon iconfont iconjia mr-2"></i>
          <span>无条码入库</span>
        </b-button>
        <b-button variant="info" pressed @click="$bvModal.show('modal-center-add')">
          <i class="icon iconfont iconjia mr-2"></i>
          <span>新增商品</span>
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
      <b-btn size="max-md-1g" variant="success pl-5 pr-5" @click="stStorageSubmit">提交入库</b-btn>
    </div>
    <!--扫码框-->
    <div class="scan-code">
      <input
        ref="cashCodeInput"
        type="text"
        class="form-control position-absolute"
        @input="stCodeChange($event.target)"
        @blur="srCodeInputBlur"
        autofocus/>
    </div>
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
              <input type="number" class="form-control" id="unitPrice" name="unitPrice" v-model="d_stGoodAdd.unitPrice">
            </div>
          </div>
          <!--进价-->
          <div class="form-group row pl-3 pr-3">
            <label for="purchasePrice" class="col-sm-3 col-form-label" style="font-size: 0.8rem">进价</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="purchasePrice" name="purchasePrice" v-model="d_stGoodAdd.purchasePrice">
            </div>
          </div>
          <!--商品类型-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsType" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品类型</label>
            <div class="col-sm-9">
              <select type="text" class="form-control" id="goodsType" name="goodsType" v-model="d_stGoodAdd.goodsType">
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
              <input type="number" class="form-control" id="capacity" name="capacity" :disabled="d_stHaveStatus" v-model="d_stGoodAdd.capacity">
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
    <!--商品查询信息显示弹窗-->
    <b-modal id="modal-center-search" centered no-close-on-backdrop>
      <template slot="default" slot-scope="{ hide }">
        <div class="form-inline">
          <div class="form-group mb-2 mr-0">
            <span class="form-control-plaintext">查询到的商品：</span>
          </div>
          <div class="form-group mb-2" style="padding-right: -1rem">
            <label for="inputPassword2" class="sr-only">搜索</label>
            <input type="number" ref="searchInput" class="form-control" id="inputPassword2" placeholder="请输入条码/自定义编码" style="font-size: 0.8rem">
            <b-btn size="sm" variant="primary ml-1" @click="stCodeChange($refs.searchInput, 'private')">搜索</b-btn>
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
  </div>
</template>

<script>
  var debounce = require('lodash.debounce')
  export default {
    name: 'MarketStorage',
    data() {
      return {
        d_stHaveStatus: false, // 是否有容量的状态
        d_stGoodAdd: {
          // 添加商品参数
          id: '-1',
          goodsCode: null,
          goodsName: null,
          merchatCode: this.$localStorage.get('merchatCode'),
          company: null,
          unitPrice: null,
          purchasePrice: null,
          goodsType: '0',
          haveCapacity: 1,
          containGoodsCode: null,
          capacity: null,
          capacityCompany: null,
        },
        d_stCodeGoodsField: [
          // 表头字段
          {goodsCode: '条码/自定义编码'},
          {goodsName: '商品名称'},
          {nowSize: '当前库存'},
          {company: '单位'},
          {unitPrice: '单价'},
          {purchasePrice: '进价'},
          {purchasePrice: '进价'},
          {number: '入库数量'},
        ],
        d_stCodeGoodsList: [], // 准备入库的商品列表
        d_stGoodTypes: [], // 商品类型
        d_stGoodSearch: [], // 根据商品码查询出的商品
        d_stGoodSearchSelect: {
          // 选择入库商品
          active: null,
          company: null,
          goodsCode: null,
          goodsName: null,
          goodsType: null,
          type: null,
          id: null,
          nowSize: null,
          number: null,
          purchasePrice: null,
          unitPrice: null,
        }
      }
    },
    methods: {
      stHaveCapacityChange(event){
        // 切换参数的disabled
        if (event.target.value === '1') {
          this.d_stHaveStatus = false
        } else if (event.target.value === '0') {
          this.d_stHaveStatus = true
        }
      },
      stAddGoodClick(){
        // 确认添加事件
        console.log(this.d_stGoodAdd);
        this.post('/supermarketmanagement/supermarketstorage/public/update',this.d_stGoodAdd).then((res) => {
          if (res.data === '1000') {
            console.log(res);
            this.stInputReset();
          }
        })
      },
      stInputReset() {
        // 表单重置
        for (const prop in this.d_stGoodAdd) {
          if (this.d_stGoodAdd.hasOwnProperty(prop)) {
            this.d_stGoodAdd[prop] = null
          }
        }
      },
      stCodeChange: debounce(function (event,type='public') {
        if (type === 'private') {
          this.d_stGoodSearchSelect.type = 'private'
        } else {
          this.d_stGoodSearchSelect.type = 'public'
        }
        console.log( this.d_stGoodSearchSelect);
        this.d_stGoodSearch = []
        this.$bvModal.show('modal-center-search')
        this.post(
          '/supermarketmanagement/supermarketstorage',
          {goodsCode: event.value,merchatCode:this.$localStorage.get('merchatCode')})
          .then((res) => {
          res.data.active = false
          res.data.number = 0
          this.d_stGoodSearch.push(res.data)
        })
          .catch(err => {})
        event.value = ''
      },500),
      stSearchGoodsSelect: function (item) {
        // 选择入库商品
        this.d_stGoodSearch.map((val) => {
          val.active = false
        })
        item.active = true
        this.clone_copy(this.d_stGoodSearchSelect,item);
      },
      stStorageSure: function () {
        // 确认入库数量
        this.d_stCodeGoodsList.push(this.clone_obj(this.d_stGoodSearchSelect))
        this.d_stGoodSearch = []
      },
      stStorageSubmit: function () {
        // 提交入库
        const data = []
        this.d_stCodeGoodsList.map((val) => {
          data.push({id: val.id,type: val.type,number:val.number})
        })
        this.post('/supermarketmanagement/supermarketstorage/submit',data).then((res) => {
          this.d_stCodeGoodsList = []
        })
      },
      srCodeInputBlur: function () {
        // 扫码输入切换
        // this.$refs.cashCodeBtn.style.display = 'block'
      },
    },
    created () {
      this.post('/supermarketmanagement/supermrketstorage/goodstype/get',{}).then((res) => {
        if (res.code === '1000') {
          this.d_stGoodTypes = res.data
        }
      })
    }
  }
</script>

<style lang="scss">
  @import "MarketStorage.component";
</style>
