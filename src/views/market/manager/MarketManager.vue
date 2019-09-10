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
        <template slot="[selected]" slot-scope="data">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" :id="'customCheck'+data.index">
            <label class="custom-control-label" :for="'customCheck'+data.index"></label>
          </div>
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
          <div
            @click="$bvModal.show('modal-center-destroy');mnTableOperateClick(data.item,'destroy')"
            class="bg-danger"
            style="width: 25px;height: 25px;display: inline-block;cursor: pointer">
            <i class="icon iconfont iconxiaohui text-light"></i>
          </div>
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
  </div>
</template>

<script>
  export default {
    name: 'market-manager',
    data: function () {
      return {
        d_mFields: [
          { selected: '选择' },
          // { index: '#' },
          { goodsName: '产品名称' },
          { upperShelf: '是否上架' },
          { purchasePrice: '进价' },
          { company: '单位' },
          { unitPrice: '单价' },
          { nowSize: '当前库存' },
          { operate: '操作' },
        ],
        d_mnGoods: [],
        d_destroy: {
          id:null,
          goodsType:null,
          destructionNumber:null,
          mark:null,
          userCode:null,
          merchatCode:null,
          goodsName:null,
        },
        d_mnUpdate: {

        }
      }
    },
    methods: {
      mnSelectGoodList () {
        // 商品列表查询
        this.post(
          `/supermarketmanagement/supermarketstorage/goods/getlist`,
          { merchatCode: this.$localStorage.get('merchatCode') })
          .then((res) => {
            res.data.publicGoodsList.map((val) => {
              val.goodsType = 'public'
            })
            res.data.privateGoodsList.map((val) => {
              val.goodsType = 'private'
            })
            this.d_mnGoods = res.data.publicGoodsList.concat(res.data.privateGoodsList);
          })
      },
      mnTableOperateClick (item,type) {
        // 商品操作事件
        switch (type) {
          case 'editor':
            console.log(item);
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
            for (const prop in item) {
              if (item.hasOwnProperty(prop)) {
                this.d_destroy[prop] = item[prop]
              }
            }
            this.post('',{})
              .then((res) => {})
              .catch((res) => {})
            break
        }
      },
      mnGoodsDestroyClick() {
        this.d_destroy.merchatCode = this.$localStorage.get('merchatCode')
        this.d_destroy.userCode = this.$localStorage.get('userCode')
        // 商品销毁操作
        this.post('/supermarketmanagement/supermarketstorage/goods/destruction',this.d_destroy)
          .then((res) => {
            if (res.code === '1000') {
              this.mnSelectGoodList()
            }
          })
      }
    },
    created () {
      this.mnSelectGoodList()
    }
  }
</script>

<style lang="scss">
  @import "MarketManager.component";
</style>
