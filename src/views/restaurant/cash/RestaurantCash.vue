<template>
  <div class="cash container-fluid">
    <div class="row h-100">
      <div class="menu col-md-2 pl-1 pr-1">
        <div class="cash-header pt-3">
          <p class="mb-0">MENU</p>
          <p>菜单</p>
        </div>
        <div class="cash-list">
          <ul class="list-group">
            <li
              v-for="item in d_cashMenuList"
              @click="cashMenuClick(item)"
              :class="{'bg-danger':item.active,'text-light':item.active}"
              class="list-group-item w-100 pt-2 pb-2">{{item.goodsTypeName}}</li>
          </ul>
        </div>
      </div>
      <div class="desk col-md-10 overflow-auto">
        <div class="dest-dish">
           <div class="row">
        <div
          v-for="item in [1,1,1,1]"
          class="col-sm-12 col-md-4 col-lg-3"
          style="padding-right: 0;padding-left: 0;" >
          <img src="@/assets/images/青椒肉丝.png" class="rounded" alt="图片地址无效">
          <p class="title mb-0">青椒肉丝</p>
          <p class="price mb-0 text-danger">28.8</p>
        </div>
      </div>
        </div>
        <div class="dest-nums"></div>

      </div>
    </div>
  </div>
</template>

<script>
  import Card from '@/components/Card.vue'
  export default {
    name: 'RestaurantCash',
    components: {
      Card
    },
    data: function () {
      return {
        d_cashMenuList: []
      }
    },
    methods: {
      cashMenuClick(item){
        this.d_cashMenuList.map((val) => {
          val.active = false;
        })
        item.active = true
      },
    },
    created () {
      this.post('/cateringmanagement/addgoods/getgoodstype',{})
        .then((res) => {
          res.data.map((val) => {
            val.active = false;
          })
          this.d_cashMenuList = res.data;
        })
    }
  }
</script>

<style lang="scss">
@import "RestaurantCash.component";
</style>
