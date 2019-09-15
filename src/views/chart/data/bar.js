export default function getData (data,x_data) {
  return {
    title: {
      text: '本月销售利润统计',
      left: 'center'
    },
    legend: {},
    tooltip: {
      formatter: function (params ) {
        return `<span>时间：${params.name}</span>;<span class="ml-3">总收益：${params.value}元</span>`
      }
    },
    xAxis: {
      type: 'category',
      data: x_data
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: data
      }
    ]
  }
}
