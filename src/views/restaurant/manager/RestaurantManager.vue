<template>
  <div class="manager container-fluid">
    <div class="title pt-3 pb-3">
      <div class="form-inline">
        <div class="form-group mb-2 w-50" style="padding-right: -1rem;justify-content: flex-start;">
          <label for="search" class="sr-only">搜索</label>
          <input
            @input="managerDishSearchChange($event.target)"
            type="text" ref="searchInput"
            class="form-control w-50" id="search"
            placeholder="请输入关键字">
          <b-btn variant="primary ml-1" @click="managerDishSearchChange($refs.searchInput)">搜索</b-btn>
        </div>
        <div class="form-group mb-2 mr-0" @click="$bvModal.show('modal-add')" style="cursor: pointer">
          <b-btn variant="success pl-3 pr-3" size="sm">
            <i class="icon iconfont iconjia1"></i>
            新增菜品</b-btn>
        </div>
      </div>
    </div>
    <div class="content overflow-auto">
      <b-table outlined hover responsive="sm" :items="d_managerDishList" :fields="d_managerDishFields">
        <template slot="[number]" slot-scope="data">
          {{ data.index + 1 }}
        </template>
        <template slot="[operate]" slot-scope="data">
          <div
            data-toggle="tooltip" data-placement="top" title="编辑菜品"
            @click="$bvModal.show('modal-update');managerDishOperate(data.item,'editor')"
            class="bg-info"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconxiugai1 text-light"></i>
          </div>
          <div
            data-toggle="tooltip" data-placement="top" title="删除菜品"
            @click="managerDishAdd('del',data.item)"
            class="bg-danger ml-3 mr-3"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconshanchu text-light"></i>
          </div>
        </template>
      </b-table>
    </div>
    <!--新增弹窗-->
    <b-modal
      id="modal-add" centered title="菜品添加"
      :header-bg-variant="'success'"
      :header-text-variant="'light'"
      no-close-on-backdrop>
      <template slot="default">
        <!--菜品名称-->
        <div class="form-group row">
          <label for="goodsName" class="col-sm-4 col-form-label">菜品名称：</label>
          <div class="col-sm-8">
            <input type="text" id="goodsName" class="form-control"
              @input="managerDishNameChange($event.target.value)"
              v-model="d_managerDishAdd.goodsName">
            <div v-if="d_managerDishMainShow" style="width: calc(100% - 2rem);
              position: absolute;
              z-index: 1097;
              top: 40px;
              left: 1rem;
              cursor: pointer;
              background: rgba(50,50,50,0.5);
              max-height: 200px;
              overflow: auto;">
              <p class="mb-0 pl-2 pt-2 pb-2 text-light" v-for="item in d_managerDishMain" @click="managerDishMainClick(item)">
                {{item.goodsName}}
              </p>
            </div>
          </div>
        </div>
        <!--菜品单价-->
        <div class="form-group row">
          <label for="unitPrice" class="col-sm-4 col-form-label">菜品单价：	</label>
          <div class="col-sm-8">
            <input type="number" id="unitPrice" class="form-control" v-model="d_managerDishAdd.unitPrice">
          </div>
        </div>
        <!--商品类型-->
        <div class="form-group row">
          <label for="restaurantType" class="col-sm-4 col-form-label">菜品所属类型：</label>
          <div class="col-sm-8">
            <select type="text" class="form-control" id="restaurantType" name="goodsType" v-model="d_managerDishAdd.restaurantType">
              <option value="0">请选择商品类型......</option>
              <option v-for="item in d_managerDishTypes" :value="item.goodsTypeCode">{{item.goodsTypeName}}</option>
            </select>
          </div>
        </div>
        <!--菜品进价-->
        <div class="form-group row">
          <label for="purchasePrice" class="col-sm-4 col-form-label">菜品进价：</label>
          <div class="col-sm-8">
            <input type="number" id="purchasePrice" class="form-control" v-model="d_managerDishAdd.purchasePrice">
          </div>
        </div>
        <!--是否是自定义菜品-->
        <div class="form-group row">
          <label class="col-sm-4 col-form-label">自定义菜品：</label>
          <div class="col-sm-8">
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio" id="addType1"
                name="haveCapacity" class="custom-control-input"
                value="1" v-model="d_managerDishAdd.addType">
              <label class="custom-control-label" for="addType1">是</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline ml-5">
              <input
                type="radio" id="addType2"
                name="haveCapacity" class="custom-control-input"
                value="0" v-model="d_managerDishAdd.addType">
              <label class="custom-control-label" for="addType2">否</label>
            </div>
          </div>
        </div>
        <!--菜品自定义编号-->
        <div class="form-group row">
          <label for="merchatGoodsCode" class="col-sm-4 col-form-label">菜品自定义编号：</label>
          <div class="col-sm-8">
            <input type="text" id="merchatGoodsCode" class="form-control" v-model="d_managerDishAdd.merchatGoodsCode">
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button
          class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
          v-on:click="close();managerDishAdd('add')">
          确定
        </b-button>
        <b-button
          class="pl-md-5 pr-md-5" size="sm" variant="danger"
          v-on:click="close()">
          取消
        </b-button>
      </template>
    </b-modal>
    <!--修改弹窗-->
    <b-modal
      id="modal-update" centered title="菜品修改"
      :header-bg-variant="'info'"
      :header-text-variant="'light'"
      no-close-on-backdrop>
      <template slot="default">
        <!--菜品名称-->
        <div class="form-group row">
          <label for="u-goodsName" class="col-sm-4 col-form-label">菜品名称：</label>
          <div class="col-sm-8">
            <input type="text" id="u-goodsName" class="form-control" v-model="d_managerDishUpdate.goodsName">
          </div>
        </div>
        <!--菜品单价-->
        <div class="form-group row">
          <label for="unitPrice" class="col-sm-4 col-form-label">菜品单价：	</label>
          <div class="col-sm-8">
            <input type="number" id="u-unitPrice" class="form-control" v-model="d_managerDishUpdate.unitPrice">
          </div>
        </div>
        <!--菜品类型-->
        <div class="form-group row">
          <label for="u-restaurantType" class="col-sm-4 col-form-label">菜品所属类型：</label>
          <div class="col-sm-8">
            <select type="text" class="form-control" id="u-restaurantType" name="goodsType" v-model="d_managerDishUpdate.restaurantType">
              <option value="0">请选择商品类型......</option>
              <option v-for="item in d_managerDishTypes" :value="item.goodsTypeCode">{{item.goodsTypeName}}</option>
            </select>
          </div>
        </div>
        <!--菜品进价-->
        <div class="form-group row">
          <label for="u-purchasePrice" class="col-sm-4 col-form-label">菜品进价：</label>
          <div class="col-sm-8">
            <input type="number" id="u-purchasePrice" class="form-control" v-model="d_managerDishUpdate.purchasePrice">
          </div>
        </div>
        <!--菜品自定义编号-->
        <div class="form-group row">
          <label for="u-merchatGoodsCode" class="col-sm-4 col-form-label">菜品自定义编号：</label>
          <div class="col-sm-8">
            <input type="text" id="u-merchatGoodsCode" class="form-control" v-model="d_managerDishUpdate.merchatGoodsCode">
          </div>
        </div>
      </template>
      <template slot="modal-footer" slot-scope="{ close }">
        <b-button
          class="pl-md-5 pr-md-5 mr-5" size="sm" variant="success"
          v-on:click="close();managerDishAdd('update')">
          确定
        </b-button>
        <b-button
          class="pl-md-5 pr-md-5" size="sm" variant="danger"
          v-on:click="close()">
          取消
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  var debounce = require('lodash.debounce')
  export default {
    name: 'RestaurantManager',
    data: function () {
      return {
        d_managerDishMainShow: false,
        d_managerDishMain: [
          {goodsCode: "1113",
            goodsName: "红烧牛肉面"}
        ],  // 主库菜品
        d_managerDishList: [], // 菜品列表
        d_managerDishFields: [
          // 表头字段
          {number: '#'},
          {merchatGoodsCode: '条码/自定义编码'},
          {goodsName: '商品名称'},
          {unitPrice: '单价'},
          {purchasePrice: '成本价'},
          {restaurantTypeName: '所属类别'},
          {operate: '操作'},
        ],
        // 菜品添加参数
        d_managerDishAdd: {
          goodsCode: -1,
          goodsName: null,
          unitPrice: null,
          restaurantType: 1,
          purchasePrice: null,
          addType: 1,
          merchatGoodsCode: null,
          merchatCode: this.$localStorage.get('merchatCode'),
        },
        // 菜品膝修改参数
        d_managerDishUpdate: {
          // 菜品修改
          id: null,
          goodsName: null,
          unitPrice: null,
          restaurantType: 1,
          purchasePrice: null,
          merchatGoodsCode: null,
        },
        d_managerDishTypes: [], // 菜品所属分类
      }
    },
    methods: {
      // 菜品列表查询
      managerDishList() {
        this.post('/cateringcashier/getallgoodsinfo',{merchatCode: this.$localStorage.get('merchatCode')})
          .then((res) => {
            this.d_managerDishList = res.data
          })
          .catch((err) => {})
      },
      // 根据关键字查询菜品列表
      managerSelectDish(name) {
        this.post(
          '/cateringmanagement/findgoodsbyname',
          {name: name,merchatCode: this.$localStorage.get('merchatCode')})
          .then((res) => {
            this.d_managerDishList = res.data
          })
          .catch((err) => {})
      },
      // 菜品增删改
      managerDishAdd(type,item) {
        switch (type) {
          case 'add':
            this.post('/cateringmanagement/addgoods', this.d_managerDishAdd)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '添加成功！',
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
                this.managerDishList();
              })
              .catch((err) => {})
            break;
          case 'update':
            this.post('/cateringmanagement/updategoodsinfo', this.d_managerDishUpdate)
              .then((res) => {
                this.$bvModal.msgBoxOk(
                  '修改成功！',
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
                this.managerDishList();
              })
              .catch((err) => {
                console.log();
              })
            break;
          case 'del':
            this.$bvModal.msgBoxConfirm(
              '您确定要是删除此菜品吗？',
              {
                title: '删除提醒', // 标题
                centered: true, // 弹窗是否居中
                hideHeaderClose: false, // 是否隐藏头部关闭按钮
                headerBgVariant: 'danger', // 头部背景
                headerTextVariant: 'light', // 头部文字
                headerCloseVariant: 'light', // 头部关闭按钮
                size: 'sm', // 框尺寸
                buttonSize: 'sm', // 按钮尺寸
                okTitle: '取消', // 确认按钮内容
                okVariant: 'danger', // 确认按钮样式
                cancelTitle: '确认',// 取消按钮内容
                cancelVariant: 'success',// 确取消按钮样式
                footerClass: ['p-3'],
              })
              .then(value => {
                if (!value) {
                  this.post('/cateringmanagement/deletegoods', {id:item.id})
                    .then((res) => {
                      this.managerDishList();
                    })
                    .catch((err) => {})
                }
              })
              .catch((err) => {})
            break;
        }
      },
      // 编辑菜品选择
      managerDishOperate(item,type) {
        switch(type) {
          case 'editor':
            this.clone_copy_a(item,this.d_managerDishUpdate)
            break
        }
      },
      // 菜品模糊查询
      managerDishSearchChange: debounce(function (event) {
        if (event.value.length === 0) {
          this.managerDishList()
        } else {
          this.managerSelectDish(event.value)
        }
      },500),
      // 主库菜品模糊查询
      managerDishNameChange: debounce(function (event) {
        this.post('/cateringmanagement/addgoods/getgoodsbyname',{name: event})
          .then((res) => {
            this.d_managerDishMain = res.data
            this.d_managerDishMainShow = true
          })
      },800),
      // 主库菜品选择
      managerDishMainClick(item) {
        this.d_managerDishMainShow = false
        this.d_managerDishAdd.goodsName = item.goodsName
        this.d_managerDishAdd.merchatGoodsCode = item.goodsCode
      }
    },
    created () {
      // 查询菜品列表
      this.managerDishList();
      // 菜品分类
      this.post('/cateringmanagement/addgoods/getgoodstype',{})
        .then((res) => {
          this.d_managerDishTypes = res.data
        })
        .catch((err) => {})
    }
  }
</script>

<style lang="scss">
@import "RestaurantManager.component";
</style>
