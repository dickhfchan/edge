<template>
  <v-layout row wrap class="ma-3">
    <v-flex v-if="data2" xs12>
      <p class="data2-table-footer w-100">
          <span>Communication: {{data2.Status.PLCComm}}</span>
          <span>Mode: {{data2.Status.LineMode}}</span>
          <span>Status: {{data2.Status.AlarmStatus}}</span>
          <span>No of Alarm: {{data2.Status.NoAlarms}}</span>
      </p>
    </v-flex>
    <v-flex xs12>
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
      <div style="width:200px;" class="mr-3" v-if="object1&&object1.objaddr==='temp'">
       <v-select
        v-bind:items="['C', '%']"
        v-model="temperatureUnit"
        label="Unit"
        ></v-select>
      </div>
      <div style="align-items:center; padding:18px 0;" class="mr-3">
        <div class="" style="height: 30px; display: flex; align-items: flex-end;">
          {{data1.datetime}}
        </div>
      </div>

      <div v-if="object1&&object1.objaddr==='temp'&&item1" class="flex-1 flex" style="position: relative; top: -8px;align-items: center;">
        <div class="mr-3">Y - axle</div>
        <TwoEndSlider v-model="userCustomTemperatureChartRange" :min="temperatureChartRange[0]" :max="temperatureChartRange[1]"
          class="pa-0 flex-1 chart-range-slider"></TwoEndSlider>
      </div>
    </v-flex>

    <v-flex xs12>
      <div class="data1" style="width:400px;">
        <v-data-table
            :items="itemRows1"
            hide-actions
            class="data1-list"
          >
          <template slot="items" scope="props">
            <td class="">{{props.item.text}}</td>
            <td class="text-xs-right relative">
              {{ props.item.value }}
              <span @click="editData1ListItemValue(props.item)">
                <v-icon v-if="props.item.field.original.flddbaddr==='-'" class="edit-btn">mode_edit</v-icon>
              </span>
            </td>
          </template>
        </v-data-table>
      </div>
      <div class="ml-4" v-if="object1&&object1.objaddr==='temp'" style="width:1000px;">
        <div class="temperature-chart-labels">
          <div class="temperature-chart-label" v-for="item in temperatureChartLabels">
            <div class="block" :style="{backgroundColor: item.color}"></div>
            <span class="text">{{item.text}}</span>
          </div>
        </div>
        <canvas class="temperature-chart"></canvas>
      </div>
    </v-flex>

    <v-flex xs12 class="" v-if="data2">
      <div class="w-100">
        <v-data-table
          :headers="headers2"
          :items="data2.Status.AlarmDetails"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" scope="props">
            <td v-for="(header, i) in headers2" :class="{'text-xs-right': i > 0}" @click="clickData2Row(props.item)">
              {{ props.item[header.value] }}
            </td>
          </template>
        </v-data-table>
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
import TwoEndSlider from '@/components/TwoEndSlider.vue'
import { newService } from '@/utils'

export default {
  components: {TwoEndSlider},
  data() {
    return {
      title: 'Datathread',
      loading: true,
      configuration: null,
      originData1: null,
      object1: null,
      temperatureUnit: 'C',
      temperatureChartLabels: [],
      item1: null,
      cache: {
        data1: {}
      },
      data2: null,
      temperatureChartMaxTimestampCount: 100,
      userCustomTemperatureChartRange: null,
      headers2: [
        // {
        //   'text': 'WordIX',
        //   'value': 'WordIX',
        //   'align': 'left'
        // },
        // {
        //   'text': 'BitIX',
        //   'value': 'BitIX'
        // },
        {
          'text': 'Category',
          'value': 'Category',
          'align': 'left'
        },
        {
          'text': 'Status',
          'value': 'AlarmStatus'
        },
        {
          'text': 'Mode',
          'value': 'AlarmMode'
        },
        {
          'text': 'Comments',
          'value': 'Comments'
        }
      ],
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
    itemRows1All() {
      try {
        const flds = this.object1.fileds.slice(0) // copy
        const rows = []
        if (this.object1.objaddr === 'temp') {
          const top3 = flds.splice(0, 3)
          const dataInConfig = this.configuration.config[this.data1.objects.indexOf(this.object1)].data[this.object1.items.indexOf(this.item1)].datafields
          top3.forEach(fld => {
            rows.push({text: fld.text, value: dataInConfig[fld.name], field: fld})
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
          return { text: fld.text, value: val, originalValue, unit: oFld.fldunits, field: fld }
        }))
      } catch (e) {
        return []
      }
    },
    // for temperature, temperature will filter by unit
    itemRows1() {
      if (this.object1 && this.object1.objaddr === 'temp') {
        const r = []
        for (let i = 0; i < this.itemRows1All.length; i++) {
          const row = this.itemRows1All[i]
          if (i < 3) {
            r.push(row)
          } else {
            row.unit === this.temperatureUnit && r.push(row)
          }
        }
        return r
      } else {
        return this.itemRows1All
      }
    },
    temperatureChartRange() {
      if (this.object1 && this.object1.objaddr === 'temp') {
        let max, min
        this.itemRows1.forEach(row => {
        const fld = row.field.original
          if (max == null || max < fld.fldmaxval) {
            max = fld.fldmaxval
          }
          if (min == null || min > fld.fldminval) {
            min = fld.fldminval
          }
        })
        return [min && min * 0.8, max && max * 1.2]
      }
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
    temperatureUnit() {
      this.updateTemperatureChartDatasetVisibility()
    },
    temperatureChartRange(v) {
      if (!this.object1 || this.object1.objaddr !== 'temp') {
        return
      }
      if (!this.userCustomTemperatureChartRangeInited && v[0] != null) {
        this.userCustomTemperatureChartRangeInited = true
        this.userCustomTemperatureChartRange = v.slice(0)
      }
      // if (this.userCustomTemperatureChartRangeInited) {
      //   const custom = this.userCustomTemperatureChartRange
      //   if (custom[0] < v[0]) {
      //     const cp = custom.slice(0)
      //     cp[0] = v[0]
      //     this.userCustomTemperatureChartRange = cp
      //   }
      //   if (custom[1] > v[1]) {
      //     const cp = custom.slice(0)
      //     cp[1] = v[1]
      //     this.userCustomTemperatureChartRange = cp
      //   }
      // }
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
            const len1 = obj.items.length
            const len2 = tempItems.length
            const len = len1 > len2 ? len1 : len2
            for (let i = 0; i < len; i++) {
              if (!obj.items[i]) {
                obj.items[i] = tempItems[i]
              } else {
                Object.assign(obj.items[i], tempItems[i])
              }
            }
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
        grey: 'rgb(154, 154, 154)'
      }
      const colors = Object.values(chartColors)
      const ctx = this.$el.querySelector('.temperature-chart').getContext('2d')
      const rows = this.itemRows1All.slice(3)
      let i = -1
      this.temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [format(new Date(this.data1.datetime), 'mm:ss')],
          datasets: rows.map(row => {
            i++
            const color = colors[i % 7]
            return {
              label: row.text,
              fill: false,
              hidden: row.unit !== this.temperatureUnit,
              temperatureUnit: row.unit,
              borderColor: color,
              backgroundColor: color,
              data: [row.originalValue],
              // yAxesID: 'y-axis-1',
            }
          }),
        },
        options: {
          scales: {
            yAxes: [{
              id: 'y-axis-0',
              ticks: {
                min: this.temperatureChartRange[0],
                max: this.temperatureChartRange[1],
              }
            }]
          },
          legend: {
            display: false
          },
        },
      })
      this.updateTemperatureChartDatasetVisibility()
    },
    checkAndUpdateTemperatureChart() {
      if (this.temperatureChart) {
        const chart = this.temperatureChart
        // update data
        chart.data.labels.push(format(new Date(this.data1.datetime), 'mm:ss'))
        chart.data.datasets.forEach((dataset, i) => {
          dataset.data.push(this.itemRows1All[i + 3].originalValue)
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
        // update y axle
        const ticks = chart.options.scales.yAxes[0]
        const custom = this.userCustomTemperatureChartRange
        if (ticks.min !== custom[0] || ticks.max !== custom[1]) {
          chart.options.scales.yAxes = Chart.helpers.scaleMerge(Chart.defaults.scale, {yAxes:
            [{
             id: 'y-axis-0',
             ticks: {
               min: custom[0],
               max: custom[1],
             },
            }]
          }).yAxes
        }
          // ticks.min = custom[0]
        // }
        // if (ticks.max !== custom[1]) {
        //   ticks.max = custom[1]
        // }
        chart.update()
      }
    },
    updateTemperatureChartDatasetVisibility() {
      if (this.temperatureChart) {
        const chart = this.temperatureChart
        const labels = []
        chart.data.datasets.forEach((dataset, i) => {
          dataset.hidden = dataset.temperatureUnit !== this.temperatureUnit
          if (!dataset.hidden) {
            labels.push({
              color: dataset.backgroundColor,
              text: dataset.label,
            })
          }
        })
        this.temperatureChartLabels = labels
        chart.update()
      }
    },
    destroyTemperatureChart() {
      if (this.temperatureChart) {
        this.temperatureChart.destroy()
        this.temperatureChart = null
      }
    },
    editData1ListItemValue(item) {
      this.$prompt('Edit', item.originalValue).then(value => {
        if (!isFinite(value)) {
          this.$alert('Input invalid')
          return
        }
        const decimal = item.field.original.flddecim
        value = Math.floor(value * Math.pow(10, decimal))
        newService({func: 25, objn: this.object1.objaddr, item: parseInt(this.item1.text), fldn: item.field.name, valn: value}).then(result => {
          if (!result || result.errc > 0) {
            this.$alert((result && result.errt) || `Save failed: ${JSON.stringify(result)}`)
          }
        })
      })
    },
    clickData2Row(row) {
      console.log('data2 row clicked, start send message to backend');
      newService({func: 8, wdix: row.WordIX, btix: row.BitIX, actn: "acknowledge"}).then(data => {
        console.log('send message to backend successfully');
      }, () => {
        console.warn('send message to backend failed');
      })
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
  .data1-list{
    .edit-btn{
      font-size: 18px;
      position: absolute;
      top: 6px;
      right: 2px;
      cursor: pointer;
      &:hover{
        color: #00bcd4;
      }
    }
  }
}
.data2-table-footer{
  background-color: #8a8a8a;
  color: #fff;
  padding: 5px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  span{
    display: inline;
    margin-right: 0;
  }
}
.temperature-chart-label {
    display: inline-block;
    margin-right: 1em;

    .block {
        width: 30px;
        height: 1em;
        display: inline-block;
    }

    .text {
        font-size: .9em;
    }
}
.chart-range-slider{
  position: relative;
  top: 2px;
  .values{
    position: absolute;
    width: 100%;
    top: -15px;
  }
}
</style>
