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
    <!--商品添加弹窗-->
    <b-modal
      title="新增商品"
      title-class="h6"
      id="modal-center-add"
      centered size="lg"
      no-clise-on-backdrop>
      <template slot="default">
        <form ref="fromline">
          <!--商品条码-->
          <div class="form-group row pl-3 pr-3">
            <label for="goodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">商品条码</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="goodsCode" name="goodsCode" v-model="d_stGoodAdd.goodsCode">
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
            <label for="containGoodsCode" class="col-sm-3 col-form-label" style="font-size: 0.8rem">包含的商品条码</label>
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
         <!-- <div class="form-group mb-2 mr-0">
            <span class="form-control-plaintext">查询到的商品：</span>
          </div>-->
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

<script>
  var debounce = require('lodash.debounce')
  export default {
    name: 'MarketStorage',
    data() {
      return {
        // 是否有容量的状态
        d_stHaveStatus: false,
        // 添加商品参数
        d_stGoodAdd: {
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
        // 表头字段
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
        // 准备入库的商品列表
        d_stCodeGoodsList: [],
        // 商品类型
        d_stGoodTypes: [],
        // 根据商品码查询出的商品
        d_stGoodSearch: [],
        // 选择入库商品
        d_stGoodSearchSelect: {
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
      // 商品添加参数切换
      stHaveCapacityChange(event){
        if (event.target.value === '1') {
          this.d_stHaveStatus = false
        } else if (event.target.value === '0') {
          this.d_stHaveStatus = true
        }
      },
      // 确认商品添加
      stAddGoodClick(){
        this.post('/supermarketmanagement/supermarketstorage/public/update',this.d_stGoodAdd)
          .then(() => {
            this.$bvModal.msgBoxOk(
              '商品添加成功！',
              {
                title: '操作提醒', // 标题
                centered: true, // 弹窗是否居中
                hideHeaderClose: false, // 是否隐藏头部关闭按钮
                headerBgVariant: 'success', // 头部背景
                headerTextVariant: 'light', // 头部文字
                headerCloseVariant: 'light', // 头部关闭按钮
                size: 'sm', // 框尺寸
                buttonSize: 'sm', // 按钮尺寸
                okTitle: '关闭', // 确认按钮内容
                okVariant: 'danger', // 确认按钮样式
                footerClass: ['p-3'],
              })
              .then(value => {})
              .catch((err) => {})
            this.stInputReset();
          })
          .catch((err) => {
            console.log(err);
          })
      },
      // 表单重置
      stInputReset() {
        for (const prop in this.d_stGoodAdd) {
          if (this.d_stGoodAdd.hasOwnProperty(prop)) {
            this.d_stGoodAdd[prop] = null
          }
        }
      },
      //扫码入库查询
      stScanChange: debounce(function (event) {
        this.d_stGoodSearch = []
        this.post(
          '/supermarketmanagement/supermarketstorage',
          {goodsCode: event.value,merchatCode:this.$localStorage.get('merchatCode')})
          .then((res) => {
            this.$bvModal.show('modal-center-scan')
            res.data.active = false
            res.data.type = 'public'
            res.data.number = 0
            this.d_stGoodSearch.push(res.data)
          })
          .catch(err => {
            this.$bvModal.msgBoxConfirm(
              '查无此商品条码，请手动入库！',
              {
                title: '操作提醒', // 标题
                centered: true, // 弹窗是否居中
                hideHeaderClose: false, // 是否隐藏头部关闭按钮
                headerBgVariant: 'danger', // 头部背景
                headerTextVariant: 'light', // 头部文字
                headerCloseVariant: 'light', // 头部关闭按钮
                size: 'md', // 框尺寸
                buttonSize: 'sm', // 按钮尺寸
                okTitle: '手动入库', // 确认按钮内容
                okVariant: 'success', // 确认按钮样式
                cancelTitle: '取消入库',// 取消按钮内容
                cancelVariant: 'danger',// 确取消按钮样式
                footerClass: ['p-3'],
              })
              .then(value => {
                if (value) {
                  this.$bvModal.hide('modal-center-scan')
                  this.$bvModal.show('modal-center-code')
                }
              })
              .catch((err) => {})
          })
        event.value = ''
      },500),
      // 手动入库查询
      stCodeChange(event) {
        this.d_stGoodSearch = []
        this.post(
          '/supermarketmanagement/supermarketstorage',
          {goodsCode: event.value,merchatCode:this.$localStorage.get('merchatCode')})
          .then((res) => {
            res.data.active = false
            res.data.type = 'private'
            res.data.number = 0
            this.d_stGoodSearch.push(res.data)
          })
          .catch(err => {
            this.$bvModal.msgBoxConfirm(
              '查无此商品条码，请新增商品！',
              {
                title: '操作提醒', // 标题
                centered: true, // 弹窗是否居中
                hideHeaderClose: false, // 是否隐藏头部关闭按钮
                headerBgVariant: 'danger', // 头部背景
                headerTextVariant: 'light', // 头部文字
                headerCloseVariant: 'light', // 头部关闭按钮
                size: 'md', // 框尺寸
                buttonSize: 'sm', // 按钮尺寸
                okTitle: '新增商品', // 确认按钮内容
                okVariant: 'success', // 确认按钮样式
                cancelTitle: '取消入库',// 取消按钮内容
                cancelVariant: 'danger',// 确取消按钮样式
                footerClass: ['p-3'],
              })
              .then(value => {
                if (value) {
                  // this.$bvModal.hide('modal-center-code')
                  this.$bvModal.show('modal-center-add')
                }
              })
              .catch((err) => {})
          })
        event.value = ''
      },
      // 选择需要入库的商品
      stSearchGoodsSelect: function (item) {
        this.d_stGoodSearch.map((val) => {
          val.active = false
        })
        item.active = true
        this.clone_copy_a(item,this.d_stGoodSearchSelect)
      },
      // 确认入库数量
      stStorageSure: function () {
        if (this.d_stGoodSearchSelect.goodsCode == null) {
          this.$bvModal.msgBoxOk(
            '请选择需要入库的商品！',
            {
              title: '错误操作', // 标题
              centered: true, // 弹窗是否居中
              hideHeaderClose: false, // 是否隐藏头部关闭按钮
              headerBgVariant: 'danger', // 头部背景
              headerTextVariant: 'light', // 头部文字
              headerCloseVariant: 'light', // 头部关闭按钮
              size: 'sm', // 框尺寸
              buttonSize: 'sm', // 按钮尺寸
              okTitle: '确定', // 确认按钮内容
              okVariant: 'info', // 确认按钮样式
              footerClass: ['p-3'],
            })
            .then(value => {})
            .catch((err) => {})
        }
        else {
          const goodCode = []
          for (let i = 0; i < this.d_stCodeGoodsList.length; i++) {
            goodCode.push(this.d_stCodeGoodsList[i].goodsCode)
          }
          if (goodCode.includes(this.d_stGoodSearchSelect.goodsCode)) {
            this.d_stCodeGoodsList.map((val) => {
              if (this.d_stGoodSearchSelect.goodsCode === val.goodsCode) {
                val.number = parseFloat(val.number) + parseFloat(this.d_stGoodSearchSelect.number)
              }
            })
          }
          else {
            const obj = this.clone_obj(this.d_stGoodSearchSelect);
            this.d_stCodeGoodsList.push(obj)
          }
        }
        this.d_stGoodSearch = [];
        this.reset_form(this.d_stGoodSearchSelect)
      },
      // 提交入库
      stStorageSubmit: function () {
        const data = []
        this.d_stCodeGoodsList.map((val) => {
          data.push({id: val.id,type: val.type,number:val.number})
        })
        this.post('/supermarketmanagement/supermarketstorage/submit',data)
          .then((res) => {
            this.$bvModal.msgBoxConfirm(
              '入库成功！',
              {
                title: '操作提醒', // 标题
                centered: true, // 弹窗是否居中
                hideHeaderClose: false, // 是否隐藏头部关闭按钮
                headerBgVariant: 'success', // 头部背景
                headerTextVariant: 'light', // 头部文字
                headerCloseVariant: 'light', // 头部关闭按钮
                size: 'md', // 框尺寸
                buttonSize: 'sm', // 按钮尺寸
                okTitle: '继续入库', // 确认按钮内容
                okVariant: 'success', // 确认按钮样式
                cancelTitle: '取消入库',// 取消按钮内容
                cancelVariant: 'danger',// 确取消按钮样式
                footerClass: ['p-3'],
              })
              .then(value => {
                this.refs.storageCodeInput.focus()
                this.$refs.storageCodeBtn.style.display = 'none'
              })
              .catch((err) => {})
            this.d_stCodeGoodsList = []
          })
          .catch((err) => {})
      },
      // 扫码输入切换
      srCodeBtnClick: function () {
        this.$refs.storageCodeInput.focus()
        this.$refs.storageCodeBtn.style.display = 'none'
      },
      // 扫码输入切换
      srCodeInputBlur: function () {
        this.$refs.storageCodeBtn.style.display = 'inline-block'
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
