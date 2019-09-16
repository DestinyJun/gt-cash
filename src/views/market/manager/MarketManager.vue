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
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconxiugai1 text-light"></i>
          </div>
          <div
            @click="mnTableOperateClick(data.item,'del')"
            class="bg-warning ml-3 mr-3"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconshanchu text-light"></i>
          </div>
          <!--<div
            @click="$bvModal.show('modal-center-destroy');mnTableOperateClick(data.item,'destroy')"
            class="bg-danger"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconxiaohui text-light"></i>
          </div>-->
        </template>
      </b-table>
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
                  name="haveCapacity" class="custom-control-input"
                  value="0" v-model="d_mnPublicUpdate.upperShelf">
                <label class="custom-control-label" for="public_upperShelf1">是</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline ml-5">
                <input
                  type="radio" id="public_upperShelf2"
                  name="haveCapacity" class="custom-control-input"
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

<script>
  export default {
    name: 'market-manager',
    data: function () {
      return {
        d_mnHaveStatus: false,  // 是否有容量的状态
        d_mFields: [
          // 表头
          { index: '#' },
          { goodsName: '产品名称' },
          { upperShelf: '是否上架' },
          { purchasePrice: '进价' },
          { company: '单位' },
          { unitPrice: '单价' },
          { nowSize: '当前库存' },
          { operate: '操作' },
        ],
        d_mnGoods: [], // 商品列表
        d_mnGoodTypes: [], // 商品类型列表
        d_destroy: {
          // 下架商品
          id:null,
          goodsType:null,
          destructionNumber:null,
          mark:null,
          userCode:null,
          merchatCode:null,
          goodsName:null,
        },
        d_mnPrivateUpdate: {
          // private商品修改
          id: null,
          goodsCode: null,
          goodsName: null,
          merchatCode: 1,
          company: null,
          unitPrice: null,
          upperShelf: null,
          purchasePrice: null,
          goodsType: null,
        },
        d_mnPublicUpdate: {
          // public商品修改
          id: null,
          goodsCode: null,
          goodsName: null,
          merchatCode: 1,
          company: null,
          unitPrice: null,
          upperShelf: null,
          purchasePrice: null,
          goodsType: null,
          haveCapacity: null,
          containGoodsCode: null,
          capacity: null,
          capacityCompany: null,
        }
      }
    },
    methods: {
      // 商品添加参数切换
      mnHaveCapacityChange(val){
        if (val === '1') {
          this.d_mnHaveStatus = false
        } else if (val === '0') {
          this.d_mnHaveStatus = true
        }
      },
      mnSelectGoodList () {
        // 商品列表查询
        this.post(
          `/supermarketmanagement/supermarketstorage/goods/getlist`,
          { merchatCode: this.$localStorage.get('merchatCode') })
          .then((res) => {
            this.d_mnGoods = res.data.publicGoodsList.concat(res.data.privateGoodsList);
          })
      },
      mnTableOperateClick (item,type) {
        // 商品操作事件
        switch (type) {
          case 'editor':
            if (item.type === 'public') {
              this.$bvModal.show('add-code');
              for (const prop in this.d_mnPublicUpdate) {
                if (this.d_mnPublicUpdate.hasOwnProperty(prop)) {
                  this.d_mnPublicUpdate[prop] = item[prop]
                }
              }
              this.d_mnPublicUpdate.merchatCode = this.$localStorage.get('merchatCode')
              this.mnHaveCapacityChange(this.d_mnPublicUpdate.haveCapacity);
            } else {
              this.$bvModal.show('update-no-code');
              for (const prop in this.d_mnPrivateUpdate) {
                if (this.d_mnPrivateUpdate.hasOwnProperty(prop)) {
                  this.d_mnPrivateUpdate[prop] = item[prop]
                }
              }
              this.d_mnPrivateUpdate.merchatCode = this.$localStorage.get('merchatCode')
            }
            break
          case 'del':
            this.$bvModal.msgBoxConfirm(
              '您确定要是删除此商品吗？',
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
                  this.post(
                    '/supermarketmanagement/supermarketstorage/goods/delete',
                    {id:item.id,goodsType:item.goodsType})
                    .then((res) => {
                      this.$bvModal.msgBoxOk(
                        '删除成功！',
                        {
                          title: '操作提醒', // 标题
                          centered: true, // 弹窗是否居中
                          hideHeaderClose: false, // 是否隐藏头部关闭按钮
                          headerBgVariant: 'success', // 头部背景
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
                        this.mnSelectGoodList()
                    })
                }
              })
              .catch((err) => {
                console.log(err);
              })
            break
          case 'destroy':
            for (const prop in this.d_destroy) {
              if (this.d_destroy.hasOwnProperty(prop)) {
                this.d_destroy[prop] = item[prop]
              }
            }
        }
      },
      mnGoodsSureOperate(target,type) {
        switch (target) {
          case 'destroy':
            this.d_destroy.merchatCode = this.$localStorage.get('merchatCode')
            this.d_destroy.userCode = this.$localStorage.get('userCode')
            // 商品销毁操作
            this.post('/supermarketmanagement/supermarketstorage/goods/destruction',this.d_destroy)
              .then((res) => {
                this.mnSelectGoodList()
              })
            break;
          case 'editor':
            if (type === 'private') {
              // 自定义条码商品修改
              this.post('/supermarketmanagement/supermarketstorage/private/update',this.d_mnPrivateUpdate)
                .then((res) => {
                  this.$bvModal.msgBoxOk(
                    '商品修改成功！',
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
                    .then(value => {
                    })
                    .catch((err) => {
                    })
                  this.mnSelectGoodList()
                })
            } else {
              // 自定义条码商品修改
              this.post('/supermarketmanagement/supermarketstorage/public/update',this.d_mnPublicUpdate)
                .then((res) => {
                  this.$bvModal.msgBoxOk(
                    '商品修改成功！',
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
                    .then(value => {
                    })
                    .catch((err) => {
                    })
                  this.mnSelectGoodList()
                })
            }
            break;
        }
      }
    },
    created () {
      this.mnSelectGoodList()
      // 商品类型查询
      this.post('/supermarketmanagement/supermrketstorage/goodstype/get',{}).then((res) => {
        this.d_mnGoodTypes = res.data
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "MarketManager.component";
</style>
