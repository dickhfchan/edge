<template>
<v-layout row wrap class="ma-3 Trends">
  <v-flex xs12 class="second-bar mb-3">
    <div class="">
      <label>Search From</label>
      <datepicker class="date-picker-1" :date="startDate" :option="$store.state.datepickerOption"></datepicker>
    </div>
    <div class="">
      <label>Search To</label>
      <datepicker class="date-picker-1" :date="endDate" :option="$store.state.datepickerOption"></datepicker>
    </div>
    <div class="">
      <v-btn primary dark @click="search">Search</v-btn>
    </div>
  </v-flex>

  <v-flex xs12 class="" v-if="rows">
    <div class="">
      <canvas :id="chart1Id" class="chart1" style="width:1400px; height:400px;"></canvas>
    </div>
  </v-flex>
</v-layout>
</template>

<script>
import {format} from 'date-functions'
import {arrayLast} from 'helper-js'
import datepicker from 'vue-datepicker/vue-datepicker-es6'
import Chart from 'chart.js'
import {resolveDate} from '@/utils'

export default {
  components: {datepicker},
  data() {
    return {
      title: 'Trends',
      chart1Id: `chart1_${this._uid}`,
      rows: null,
      // search
      startDate: {
        time: '',
      },
      endDate: {
        time: '',
      },
      category: null,
      pattern: null,
      searching: false,
    }
  },
  methods: {
    search() {
      if (this.searchDt) {
        this.searchDt.close()
        this.searchDt = null
      }
      if (this.chart1) {
        this.clearChart(this.chart1)
      }
      this.rows = null
      let i = 0
      const sdate = resolveDate(this.startDate.time)
      const edate = resolveDate(this.endDate.time)
      this.searchDt = this.$newHistoricalData({func: 24, objn: 'temp', item: 0, fend: 0,
        fryr: sdate.year, frmo: sdate.month, frda: sdate.date, frhr: sdate.hour, frmi: sdate.minute,
        toyr: edate.year, tomo: edate.month, toda: edate.date, tohr: edate.hour, tomi: edate.minute,
      }, (data) => {
        if (i > 0) {
          if (this.rows == null) {
            this.rows = []  
          }
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
    clearChart(chart) {
      chart.data.labels = []
      chart.data.datasets.forEach(dataset => {
        dataset.data = []
      })
      chart.update()
    },
  },
  created(){
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
}

</script>

<style lang="scss">
.Trends{
  .second-bar{
    // justify-content:space-between;
    align-items: baseline;
    > div{
      margin-right: 2em;
    }
    // .date-picker{
    //   width: 150px;
    // }
    .input-group.input-group--text-field{
      width: 150px;
    }
  }
}
</style>
