<template>
  <div class="chart">
    <Header :title="$route.name" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="container-fluid">
      <div class="row h-100">
        <div class="col-md-12 h-100">
         <!-- <div class="chart-date position-absolute">
            <date-picker v-model="time1" valueType="format" :first-day-of-week="1"></date-picker>
          </div>-->
          <div class="chart-sell">
            <v-chart :options="d_barSell"
              ref="bar" theme="ovilia-green" autoresize
              @click="barClick($event)">
            </v-chart>
          </div>
        </div>
        <!--<div class="col-md-6 h-50">
          <div class="chart-sell">
            <v-chart :options="d_barTop"
              ref="bar" theme="ovilia-green" autoresize
              @click="barClick($event)">
            </v-chart>
          </div>
        </div>
        <div class="col-md-6 h-50">
          <div class="chart-sell">
            <v-chart
              :options="d_barTopPro"
              ref="bar" theme="ovilia-green" autoresize>
            </v-chart>
          </div>
        </div>-->
      </div>
    </div>
    <!--订单统计-->
    <b-modal
      id="order-count"
      centered size="lg"
      :title="d_orderCountTitle"
      title-class="h6"
      :hide-footer="true"
      scrollable
      no-clise-on-backdrop>
      <b-table
        striped hover
        :fields="d_orderCountFields" :items="d_orderCountItems"
        @row-clicked="orderCountClick($event)">
        <template slot="[index]" slot-scope="data">
          <span>{{data.index + 1}}</span>
        </template>
      </b-table>
    </b-modal>
    <!--订单详情-->
    <b-modal
      id="order-detail"
      centered size="md"
      title="订单详情"
      title-class="h6"
      :hide-footer="true"
      scrollable
      no-clise-on-backdrop>
      <b-table striped hover :fields="d_orderDetailFields" :items="d_orderDetailItems" >
        <template slot="[index]" slot-scope="data">
          <span>{{data.index + 1}}</span>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>
<script src="./Chart.component.js"></script>
<style scoped lang="scss">
  @import "./Chart.component";
</style>
