<template>
  <div class="chart">
    <Header :title="$route.name" :icon="['iconfanhui','icondianpu-copy']"></Header>
    <div class="content">
      <v-chart
        :options="d_bar"
        ref="bar"
        theme="ovilia-green"
        autoresize
        @click="barClick($event)"
      >
      </v-chart>
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

<script>
  import Header from '@/components/Header.vue'
  import ECharts from 'vue-echarts'
  // bar组件
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/pictorialBar'
  // tooltip legend title 组件
  import 'echarts/lib/component/tooltip'
  // import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  // registering custom theme
  import theme from './theme.json'
  ECharts.registerTheme('ovilia-green', theme)
  // chart data
  import getBar from './data/bar'

  export default {
    name: 'Chart',
    components: {
      Header,
      'v-chart': ECharts
    },
    data () {
      return {
        d_bar: null, // 柱状图配置
        d_orderCountTitle: null, // 订单统计弹窗标题
        // 订单统计表格字段
        d_orderCountFields: [
          { index: '#' },
          { orderNumber: '订单编号' },
          { profit: '订单金额' },
        ],
        // 订单统计表格数据
        d_orderCountItems: [],
        // 订单详情表格字段
        d_orderDetailFields: [
          { index: '#' },
          { goodsName: '商品名称' },
          { number: '数量' },
          { unitPrice: '单价' },
          { profit: '总额' },
        ],
        // 订单详情表格数据
        d_orderDetailItems: []
      }
    },
    methods: {
      // 柱状图点击是事件
      barClick(event) {
        this.d_orderCountTitle = event.name + ' 销售订单统计';
        this.post(
          '/chart/getchartorder',
          {
            userId: this.$localStorage.get('userCode'),
            date: event.name
          })
          .then((res) => {
            this.d_orderCountItems = res.data
            this.$bvModal.show('order-count');
          })
      },
      // 订单统计表格行点击事件
      orderCountClick(event) {
        this.post('/chart/getorderinfo', { id: event.id})
          .then((res) => {
            this.d_orderDetailItems  = res.data;
            this.$bvModal.show('order-detail');
          })
          .catch(() => {})
      }
    },
    created() {
      // 初始化柱状图是数据
      this.post('/chart/getchart',{userId: this.$localStorage.get('userCode')})
        .then((res) => {
          const bar_data = [];
          const x_date = [];
          res.data.map((val) => {
            bar_data.push(val.profit);
            x_date.push(val.date);
          })
          this.d_bar = getBar(bar_data,x_date)
        })
    }
  }
</script>

<style lang="scss">
  .echarts {
    width: 100%;
    height: 100%;
  }
  .chart {
    height: 100vh;
    .content{
      width: 100vw;
      height: 50vh;
    }
  }
</style>
