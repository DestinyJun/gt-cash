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
            新增商品</b-btn>
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
          <!--<div
            data-toggle="tooltip" data-placement="top" title="账户密码修改"
            @click="$bvModal.show('modal-password');accountOperateClick(data.item,'password')"
            class="bg-success mr-3"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconquanxian text-light"></i>
          </div>
          <div
            data-toggle="tooltip" data-placement="top" title="账户角色配置"
            @click="$bvModal.show('modal-role');accountOperateClick(data.item,'role')"
            class="bg-warning"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconquanxian text-light"></i>
          </div>-->
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
            <input type="text" id="goodsName" class="form-control" v-model="d_managerDishAdd.goodsName">
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
                value="1" v-model="d_managerDishAdd.addType"
                @input="stHaveCapacityChange($event)">
              <label class="custom-control-label" for="addType1">是</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline ml-5">
              <input
                type="radio" id="addType2"
                name="haveCapacity" class="custom-control-input"
                value="0" v-model="d_managerDishAdd.addType"
                @input="stHaveCapacityChange($event)">
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
        d_managerDishList: [],
        d_managerDishFields: [
          // 表头字段
          {number: '#'},
          {goodsCode: '条码/自定义编码'},
          {goodsName: '商品名称'},
          {unitPrice: '单价'},
          {purchasePrice: '成本价'},
          {restaurantTypeName: '所属类别'},
          {operate: '操作'},
        ],
        d_managerDishAdd: {
          // 菜品添加
          goodsCode: -1,
          goodsName: null,
          unitPrice: null,
          restaurantType: 1,
          purchasePrice: null,
          addType: 1,
          merchatGoodsCode: null,
          merchatCode: this.$localStorage.get('merchatCode'),
        },
        d_managerDishUpdate: {
          // 菜品修改
          id: null,
          goodsName: null,
          unitPrice: null,
          restaurantTypeCode: 1,
          purchasePrice: null,
          merchatGoodsCode: null,
        },
        d_managerDishTypes: [], // 菜品所属分类
      }
    },
    methods: {
      managerSelectDish(name) {
        // 查询菜品列表
        this.post(
          '/cateringmanagement/findgoodsbyname',
          {name: name,merchatCode: this.$localStorage.get('merchatCode')})
          .then((res) => {
            console.log(res.data);
            this.d_managerDishList = res.data
          })
          .catch((err) => {
            console.log();
          })
      },
      managerDishAdd(type,item) {
        // 菜品增删改
        switch (type) {
          case 'add':
            this.post('/cateringmanagement/addgoods', this.d_managerDishAdd)
              .then((res) => {
                this.managerSelectDish('红烧');
              })
              .catch((err) => {
                console.log();
              })
            break;
          case 'update':
            this.post('/cateringmanagement/addgoods', this.d_managerDishAdd)
              .then((res) => {
                this.managerSelectDish('红烧');
              })
              .catch((err) => {
                console.log();
              })
            break;
          case 'del':
            this.post('/cateringmanagement/deletegoods', {id:item.id})
              .then((res) => {
                this.managerSelectDish('红烧');
              })
              .catch((err) => {
                console.log();
              })
            break;
        }
      },
      managerDishOperate(item,type) {
        console.log(item);
        switch(type) {
          case 'editor':
            this.clone_copy_a(item,this.d_managerDishUpdate)
            console.log(this.d_managerDishUpdate);
            break
        }
      },
      managerDishSearchChange: debounce(function (event) {
        // 菜品模糊查询
        if (event.value.length === 0) {
          this.managerSelectDish('兰州');
        } else {
          this.managerSelectDish(event.value);
        }
      },500),
    },
    created () {
      // 查询菜品列表
      this.managerSelectDish('红烧');
      // 菜品分类
      this.post('/cateringmanagement/addgoods/getgoodstype',{})
        .then((res) => {
          this.d_managerDishTypes = res.data
        })
        .catch((err) => {
          console.log();
        })
    }
  }
</script>

<style lang="scss">
@import "RestaurantManager.component";
</style>
