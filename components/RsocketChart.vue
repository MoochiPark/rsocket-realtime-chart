<template>
  <el-card class="chart-card" shadow="never">
    <client-only>
      <v-chart :ref="chartOption" class="chart" :option="chartOption" />
    </client-only>
  </el-card>
</template>

<script>
import { getLatestSensingData } from '@/rsocket'

export default {
  data() {
    return {
      chartOption: {
        title: {
          left: 'left',
          text: '센싱 데이터 차트',
          padding: [2, 0, 0, 0],
          textStyle: {
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          top: 'top',
          left: 'right',
          data: ['전체 전압', '전류'],
          padding: [32, 27, 0, 0],
        },
        color: ['#fd7e14', '#0ca678', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
        grid: {
          left: '0%',
          right: '2%',
          top: '18%',
          bottom: '7%',
          containLabel: true,
          borderColor: '#ccc',
          borderWidth: 1,
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: {
              day: '{a| {d}일 }',
              hour: '{HH}:{mm}',
            },
            rich: {
              a: {
                fontWeight: 'bold',
              },
            },
          },
          splitLine: {
            show: true,
          },
          minorSplitLine: {
            show: true,
          },
          axisLine: { onZero: false },
          minInterval: 0,
          maxInterval: 3600 * 1000 * 24 * 10,
        },
        yAxis: {
          type: 'value',
          min: -150,
          max: 150,
          minorSplitLine: {
            show: true,
          },
        },
        series: [
          {
            name: '전체 전압',
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: {
              width: 1,
            },
            data: [],
          },
          {
            name: '전류',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 1,
            },
            data: [],
          },
          {
            name: '프로세스 코드',
            type: 'line',
            lineStyle: {
              opacity: 0,
            },
            symbol: 'none',
            data: [],
          },
          {
            name: 'AC',
            type: 'line',
            lineStyle: {
              opacity: 0,
            },
            symbol: 'none',
            data: [],
          },
          {
            name: 'DC',
            type: 'line',
            lineStyle: {
              opacity: 0,
            },
            symbol: 'none',
            data: [],
          },
        ],
        animation: false,
      },
      vols: [],
      currents: [],
      codes: [],
      acStates: [],
      dcStates: [],
    }
  },
  mounted() {
    this.updateChart(300)
    setInterval(() => {
      this.updateChart(1)
    }, 10000)
  },
  methods: {
    async getChartData(n) {
      const responses = await getLatestSensingData(n)
      if (this.vols.length === 300) {
        this.vols.shift()
        this.currents.shift()
        this.codes.shift()
        this.acStates.shift()
        this.dcStates.shift()
      }
      responses.forEach((response) => {
        this.vols.push([response.sensingTime, response.voltage])
        this.currents.push([response.sensingTime, response.current])
        this.codes.push([response.sensingTime, response.code])
        this.acStates.push([response.sensingTime, response.acState])
        this.dcStates.push([response.sensingTime, response.dcState])
      })
    },
    async updateChart(n) {
      await this.getChartData(n)
      this.synchronizeChartData()
    },
    synchronizeChartData() {
      this.chartOption.series = [
        {
          data: this.vols,
        },
        {
          data: this.currents,
        },
        {
          data: this.codes,
        },
        {
          data: this.acStates,
        },
        {
          data: this.dcStates,
        },
      ]
    },
  },
}
</script>

<style>
.chart-card {
  height: 317px;
  margin-top: 20px;
  text-align: right;
}

.chart {
  height: 290px;
  width: 100%;
}
</style>
