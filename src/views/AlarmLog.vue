<template>
<v-layout row wrap class="ma-3 alarm-log">
  <v-flex xs12 class="second-bar mb-3">
    <div class="">
      <label>Search From</label>
      <datepicker class="date-picker-1" :date="startDate" :option="datepickerOption"></datepicker>
    </div>
    <div class="">
      <label>Search To</label>
      <datepicker class="date-picker-1" :date="endDate" :option="datepickerOption"></datepicker>
    </div>
    <div class="">
      <label>Category</label>
      <v-text-field class="text-field-1"
        single-line
        v-model="category"
      ></v-text-field>
    </div>
    <div class="">
      <label>Pattern</label>
      <v-text-field class="text-field-1"
        single-line
        v-model="pattern"
      ></v-text-field>
    </div>
    <div class="">
      <v-btn primary dark @click="search">Search</v-btn>
    </div>
  </v-flex>
  <v-flex xs12 class="" v-if="rows">
    <div class="w-100">
      <Datatable
        :headers="headers"
        :items="rows"
        class="elevation-1"
        :editBtnVisible="false"
        :removeBtnVisible="false"
      >
      <!-- @remove="remove($event.row, $event.index)" -->
      </Datatable>
    </div>
  </v-flex>
</v-layout>
</template>

<script>
import {format} from 'date-functions'
import datepicker from 'vue-datepicker/vue-datepicker-es6'
import Datatable from '../components/Datatable.vue'

export default {
  components: {Datatable, datepicker},
  data() {
    return {
      title: 'Alarm Log',
      headers: [
        // {text: 'Alarm ID', value: 'alid', align: 'left', sortAble: false},
        // {text: 'Alarm number', value: 'anum', align: 'left', sortAble: false},
        {text: 'Datetime stamp', value: 'dtstDisplay', align: 'left', sortAble: false,},
        {text: 'Date', value: 'date', align: 'left', sortAble: false},
        // {text: 'Date export', value: 'dexp', align: 'left', sortAble: false},
        {text: 'Category', value: 'cate', align: 'left', sortAble: false},
        {text: 'Status', value: 'stat', align: 'left', sortAble: false},
        {text: 'Alarm text', value: 'text', align: 'left', sortAble: false},
      ],
      rows: null,
      // search
      startDate: {
        time: '',
      },
      endDate: {
        time: '',
      },
      datepickerOption: {
        type: 'min',
        week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: 'YYYY-MM-DD HH:mm'
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
      if (!this.startDate.time) {
        this.$alert('Search from is required')
        return
      }
      if (!this.endDate.time) {
        this.$alert('Search from is required')
        return
      }
      const sdate = resolveDate(this.startDate.time)
      const edate = resolveDate(this.endDate.time)
      this.searchDt = this.$newHistoricalData(
        {func: 9, srch: '', sett: '', usid: '', ofst: 0,
          fryr: sdate.year, frmo: sdate.month, frda: sdate.date, frhr: sdate.hour, frmi: sdate.minute,
          toyr: edate.year, tomo: edate.month, toda: edate.date, tohr: edate.hour, tomi: edate.minute,
          mxal: 100, cate: this.category || '', patn: this.pattern || ''
        },
        data => {
          data.alrm.forEach(row => {
            row.dtstDisplay = format(new Date(row.dtst * 1000))
          })
          if (!this.rows) {
            this.rows = []
          }
          this.rows.push(...data.alrm)
        }
      )
    },
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
}
// format: 2017-11-24 00:56
function resolveDate(date) {
  date = date || ''
  const r = {
    year: date.substr(0, 4),
    month: date.substr(5, 2),
    date: date.substr(8, 2),
    hour: date.substr(11, 2),
    minute: date.substr(14, 2),
  }
  for (const key in r) {
    r[key] = parseInt(r[key])
  }
  return r
}
</script>

<style lang="scss">
.alarm-log{
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
