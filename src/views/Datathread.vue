<template>
  <v-layout row wrap>
    <v-flex xs12 class="mb-3" v-if="data2">
      <div class="w-100">
        <v-data-table
          :headers="headers2"
          :items="data2.Status.AlarmDetails"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" scope="props">
            <td v-for="(header, i) in headers2" :class="{'text-xs-right': i > 0}">{{ props.item[header.value] }}</td>
          </template>
        </v-data-table>
        <p class="mt-3 data2-table-footer">
            <span>PLCComm: {{data2.Status.PLCComm}}</span>
            <span>LineMode: {{data2.Status.LineMode}}</span>
            <span>AlarmStatus: {{data2.Status.AlarmStatus}}</span>
            <span>NoAlarms: {{data2.Status.NoAlarms}}</span>
        </p>
      </div>
    </v-flex>
    <v-flex>
      <div style="width:250px;" class="mr-3">
        <v-select
        :single-line="true"
         v-bind:items="data1.objects"
         item-text="text"
         v-model="object1"
         @change="item1=null"
         label="Object"
         ></v-select>
      </div>
      <div style="width:200px;" class="mr-3">
       <v-select
        v-bind:items="object1 ? object1.items : []"
        item-text="text"
        v-model="item1"
        label="Item"
        ></v-select>
      </div>
      <div style="align-items:center; padding:18px 0;">
        <div class="" style="height: 30px; display: flex; align-items: flex-end;">
          {{data1.datetime}}
        </div>
      </div>
    </v-flex>

    <v-flex xs12>
      <div class="data1" style="width:400px;">
        <v-data-table
            :items="itemRows1"
            hide-actions
            class=""
          >
          <template slot="items" scope="props">
            <td class="">{{props.item.text}}</td>
            <td class="text-xs-right">{{ props.item.value }}</td>
          </template>
        </v-data-table>
      </div>
      <div class="flex-1 ml-4">
        <canvas class="temperature-chart"></canvas>
      </div>
    </v-flex>

    <div class="absolute-backdrop center-wrapper" v-if="loading">
      <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </div>
  </v-layout>
</template>
<script>
import { isNumeric } from 'helper-js'
import {format} from 'date-functions'
import DataSource from '@/DataSource'
import Chart from 'chart.js'

export default {
  data() {
    return {
      title: 'Datathread',
      loading: true,
      configuration: null,
      originData1: null,
      object1: null,
      item1: null,
      cache: {
        data1: {}
      },
      data2: null,
      temperatureChartMaxTimestampCount: 20,
    }
  },
  computed: {
    data1() {
      const data1 = {}
      const { configuration: config } = this
      if (!config) {
        return {}
      }
      data1.objects = config.objects
      const { objects } = data1
      objects.forEach((obj, objIndex) => {
        // set text
        obj.text = obj.objdesc
        // set fileds
        obj.fileds = obj.objfield.map(fld => {
          return { name: fld.fldsname, text: fld.fldfname, original: fld }
        })
        // set items
        obj.items = []
        for (let i = 0; i < obj.objitem; i++) {
          obj.items.push({
            text: i + 1,
            data: config.config[objIndex].data[i].datafields,
          })
        }
      })
      this.cache.data1 = data1
      return data1
    },
    itemRows1() {
      try {
        const flds = this.object1.fileds.slice(0) // copy
        const rows = []
        if (this.object1.objaddr === 'temp') {
          const top3 = flds.splice(0, 3)
          const dataInConfig = this.configuration.config[this.data1.objects.indexOf(this.object1)].data[this.object1.items.indexOf(this.item1)].datafields
          top3.forEach(fld => {
            rows.push({text: fld.text, value: dataInConfig[fld.name]})
          })
        }
        return rows.concat(flds.map(fld => {
          const oFld = fld.original
          let val = this.item1.data[fld.name] || 0
          const originalValue = val
          if (isNumeric(val)) {
            if (val < oFld.fldminval) {
              val = oFld.fldminval
            } else if (val > oFld.fldmaxval) {
              val = oFld.fldmaxval
            }
            val = parseFloat(val).toFixed(oFld.flddecim || 0)
            if (oFld.fldunits) {
              val = `${val} ${oFld.fldunits}`
            }
          }
          return { text: fld.text, value: val, originalValue }
        }))
      } catch (e) {
        return []
      }
    },
    headers2() {
      const r = Object.keys(this.data2.Status.AlarmDetails[0]).map(key => {
        return { text: key, value: key }
      })
      r[0].align = 'left'
      return r
    },
  },
  watch: {
    originData1() {
      this.mergeOriginData1ToData1()
      this.$emit('data1Merged')
    },
    data1() {
      this.mergeOriginData1ToData1()
    },
    object1() {
      if (!this.object1 || this.object1.objaddr !== 'temp') {
        this.destroyTemperatureChart()
      }
    },
    item1() {
      if (this.object1 && this.object1.objaddr === 'temp') {
        if (!this.item1) {
          this.destroyTemperatureChart()
        } else {
          this.renderTemperatureChart()
        }
      }
    },
  },
  created() {
    const configReady = new Promise((resolve, reject) => {
      this.configDataSource = new DataSource()
      this.configDataSource.type = 'configuration'
      this.configDataSource.connect()
      this.configDataSource.ongetdata = data => {
        this.configuration = data
        this.configDataSource.close()
        console.log('configuration got')
        resolve()
      }
    })

    const dataSourceGetOnce = new Promise((resolve, reject) => {
      this.dataSource = new DataSource()
      let data1GetCount = 0
      let data2GetCount = 0
      let resolved = false
      const getOnce = () => data1GetCount > 0 && data2GetCount > 0
      const checkForResolve = () => {
        if (getOnce()) {
          if (!resolved) {
            resolved = true
            resolve()
          }
        }
      }
      this.dataSource.ongetdata1 = data => {
        this.originData1 = data
        data1GetCount++
        checkForResolve()
        // console.log('data1 got')
      }
      this.dataSource.ongetdata2 = data => {
        this.data2 = data
        data2GetCount++
        checkForResolve()
        // console.log('data2 got')
      }
      this.dataSource.connect()
    })
    Promise.all([configReady, dataSourceGetOnce]).then(() => {
      this.loading = false
    })
    this.$on('data1Merged', this.checkAndUpdateTemperatureChart)
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  beforeDestroy() {
    this.configDataSource && this.configDataSource.close()
    this.dataSource && this.dataSource.close()
  },
  methods: {
    mergeOriginData1ToData1() {
      if (!this.data1 || !this.data1.objects) {
        return
      }
      if (!this.originData1) {
        return
      }
      const data = this.data1
      const originData = this.originData1
      this.$set(data, 'timestamp', originData.TimeStamp)
      this.$set(data, 'datetime', originData.DateTime)
      originData.Objects.forEach(item => {
        const obj = data.objects.find(v => v.objaddr === item.ObjectName)
        if (obj) {
          const tempItems = []
          item.Items.forEach((item2, i) => {
            tempItems.push({
              text: i + 1,
              data: item2
            })
          })
          if (JSON.stringify(tempItems) !== JSON.stringify(obj.items)) {
            obj.items = tempItems
          }
        }
      })
    },
    renderTemperatureChart() {
      const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(231,233,237)'
      }
      const colors = Object.values(chartColors)
      const ctx = this.$el.querySelector('.temperature-chart').getContext('2d')
      const rows = this.itemRows1.slice(3)
      this.temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [format(new Date(this.data1.datetime), 'mm:ss')],
          datasets: rows.map(row => {
            const color = colors.shift()
            return {
              label: row.text,
              fill: false,
              borderColor: color,
              backgroundColor: color,
              data: [row.originalValue]
            }
          })
        },
        options: {
          scales: {
            yAxes: [{
              stacked: true
            }]
          }
        }
      })
    },
    checkAndUpdateTemperatureChart() {
      if (this.temperatureChart) {
        const chart = this.temperatureChart
        chart.data.labels.push(format(new Date(this.data1.datetime), 'mm:ss'))
        this.itemRows1.slice(3)
        chart.data.datasets.forEach((dataset, i) => {
          dataset.data.push(this.itemRows1[i + 3].originalValue)
        })
        const max = this.temperatureChartMaxTimestampCount
        const len = chart.data.labels.length
        const diff = len - max
        if (diff > 0) {
          chart.data.labels.splice(0, 1)
          chart.data.datasets.forEach((dataset, i) => {
            dataset.data.splice(0, 1)
          })
        }
        chart.update()
      }
    },
    destroyTemperatureChart() {
      if (this.temperatureChart) {
        this.temperatureChart.destroy()
        this.temperatureChart = null
      }
    },
  },
}
</script>
<style lang="scss">
.data1 {
  > .table__overflow {
    border: 1px solid #ccc;
    thead{
      display: none;
    }
  }
}
.data2-table-footer{
  span{
    display: inline-block;
    margin-right: 100px;
  }
}
</style>
