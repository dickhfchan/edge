<template>
<v-layout row wrap class="ma-3 trends">
  <v-flex xs12 class="">
    <div class="">
      <canvas :id="chart1Id" class="chart1" style="width:1400px; height:400px;"></canvas>
    </div>
  </v-flex>
</v-layout>
</template>

<script>
import {format} from 'date-functions'
import {arrayLast} from 'helper-js'
// import datepicker from 'vue-datepicker/vue-datepicker-es6'
import Chart from 'chart.js'

export default {
  // components: {datepicker},
  data() {
    return {
      title: 'Trends',
      chart1Id: `chart1_${this._uid}`,
      rows: [],
    }
  },
  methods: {
    getData() {
      let i = 0
      this.$newHistoricalData({func: 24, objn: 'temp', item: 0, fend: 0, fryr: 2017, frmo: 10, frda: 24, frhr: 15, frmi: 16, toyr: 2017, tomo: 10, toda: 24, tohr: 15, tomi: 30}, (data) => {
        if (i > 0) {
          data.trds.forEach(item => {
            const row = {
              originalData: item,
            }
            row.stmp = item.stmp
            item.data.forEach(v => {
              const key = Object.keys(v)[0]
              row[key] = v[key]
            })
            row.formattedTime = format(new Date(row.stmp * 1000), 'mm:ss')
            this.rows.push(row)
          })
          this.oneRowsPushed(data.trds.length)
        }
        i++
      })
    },
    oneRowsPushed(length) {
      if (!this.chart1) {
        this.renderChart1()
      }
      this.updateChart1WhenOneRowPushed(length)
    },
    renderChart1() {
      const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(154, 154, 154)'
      }
      const colors = Object.values(chartColors)
      const ctx = document.getElementById(this.chart1Id).getContext('2d')
      const fldNames = ["plal", "pllm", "tact", "tout", "phlm", "phal", "hlal", "hlll", "hact", "hout", "hllh", "hlah"].map(v => {
        return {name: v, text: v}
      })
      let i = -1
      this.chart1 = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: fldNames.map(row => {
            i++
            const color = colors[i % 7]
            return {
              label: row.text,
              fill: false,
              // hidden: row.unit !== this.temperatureUnit,
              // temperatureUnit: row.unit,
              borderColor: color,
              backgroundColor: color,
              data: [],
              // yAxesID: 'y-axis-1',
            }
          }),
        },
      })
    },
    updateChart1WhenOneRowPushed(newRowLength) {
      const chart = this.chart1
      // update data
      const len = this.rows.length
      for (let i = len - newRowLength; i < len; i++) {
        const row = this.rows[i]
        chart.data.labels.push(row.formattedTime)
        chart.data.datasets.forEach((dataset, i) => {
          dataset.data.push(row[dataset.label])
        })
      }
      chart.update()
    },
  },
  created(){
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
    this.getData() // render Chart1 afeter mounted
  },
}

</script>

<style lang="scss">
.trends{
}
</style>
