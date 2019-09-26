import Header from '@/components/Header.vue'
import ECharts from 'vue-echarts'
// bar组件
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pictorialBar'
import 'echarts/lib/chart/scatter'
// tooltip legend title 组件
import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
// registering custom theme
import theme from './theme.json'
ECharts.registerTheme('ovilia-green', theme)
// chart data
import barSellGetData from './data/bar_sell'
import barTopGetData from './data/bar_top'
import barTopProGetData from './data/bar_topPro'
// date
import DatePicker from 'vue2-datepicker'

export default {
  name: 'Chart',
  components: {
    Header,
    'v-chart': ECharts,
    DatePicker
  },
  data () {
    return {
      time1: '', //
      d_barSell: null, // 柱状图配置
      d_barTop: null, // 柱状图配置
      d_barTopPro: null, // 柱状图配置
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
    const arr1 = [122, 149, 204, 250, 259, 330, 358, 394, 561, 831]
    const arr2 = [
      '锦屏服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
      '款场服务区',
    ]
    // 初始化柱状图是数据
    this.post('/chart/getchart',{userId: this.$localStorage.get('userCode')})
      .then((res) => {
        console.log(res);
        const bar_data = [];
        const x_date = [];
        res.data.map((val) => {
          bar_data.push(val.sales);
          x_date.push(val.date);
        })
        this.d_barSell = barSellGetData(bar_data,x_date)
      })
    // top 10
    this.d_barTop = barTopGetData(arr1,arr2);
    this.d_barTopPro = barTopProGetData();
  }
}
