<template>
<v-layout row wrap class="ma-3 Timer alarm-log">
  <v-flex xs12 class="">
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
import {newHistoricalData} from '@/utils.js'
import {format} from 'date-functions'
import Datatable from '../components/Datatable.vue'

export default {
  components: {Datatable},
  data() {
    return {
      headers: [
        {text: 'Alarm ID', value: 'alid', align: 'left', sortAble: false},
        {text: 'Alarm number', value: 'anum', align: 'left', sortAble: false},
        {text: 'Datetime stamp', value: 'dtstDisplay', align: 'left', sortAble: false,},
        {text: 'Date', value: 'date', align: 'left', sortAble: false},
        {text: 'Date export', value: 'dexp', align: 'left', sortAble: false},
        {text: 'Category', value: 'cate', align: 'left', sortAble: false},
        {text: 'Status', value: 'stat', align: 'left', sortAble: false},
        {text: 'Alarm text', value: 'text', align: 'left', sortAble: false, type: 'default'},
      ],
      rows: [],
    }
  },
  created() {
    this.$newHistoricalData({func: 9, srch: '', sett: '', usid: '', ofst: 0, fryr: 2017, frmo: 10, frda: 28, frhr: 23, frmi: 56, toyr: 2017, tomo: 10, toda: 28, tohr: 23, tomi: 59, mxal: 100, cate: '', patn: ''},
      data => {
        data.alrm.forEach(row => {
          row.dtstDisplay = format(new Date(row.dtst * 1000))
        })
        this.rows.push(...data.alrm)
      }
    )
  },
}
</script>

<style lang="scss">
.alram-log{

}
</style>
