<template>
<v-layout row wrap class="ma-3 timer-exceptions">
  <v-flex xs12 class="">
    <div class="w-100">
      <Datatable
        :headers="headers"
        :items="rows"
        class="elevation-1"
        :editBtnVisible="false"
        @remove="remove($event.row, $event.index)"
      >
      </Datatable>
    </div>
  </v-flex>
  <LoadingBlock v-if="loading"></LoadingBlock>
</v-layout>
</template>

<script>
import Datatable from '../components/Datatable.vue'
export default {
  components: {Datatable},
  data() {
    return {
      title: 'Timer Exceptions',
      loading: true,
      changed: false,
      rows: null,
      headers: [
        {text: 'Row', value: 'rnum', align: 'left', sortAble: false},
        // {text: 'Day - period', value: 'cday', align: 'left', sortAble: false,
        //   type: 'select',
        //   options: Object.keys(dayMapping).map(key => {
        //     return {value: key, text: dayMapping[key]}
        //   })
        // },
        {text: 'Time on', value: 'timeOnText', align: 'left', sortAble: false, type: 'default'},
        {text: 'Time off', value: 'timeOffText', align: 'left', sortAble: false, type: 'default'},
      ],
      saving: false,
    }
  },
  methods: {
    getData() {
      this.$newService({func: 13}).then(data => {
        data.channels = data.chnl
        data.channels.forEach((channel, index) => {
          channel.description = channel.desc
          // right channel 'stat' is in data2
          channel.state = data2.chnl[index].stat
          channel.rows.forEach(row => {
            if (row.tion === -1) {
              row.tion = 0
            }
            if (row.tiof === -1) {
              row.tiof = 0
            }
            row.timeOnText = secondsFormat(row.tion)
            row.timeOffText = secondsFormat(row.tiof)
          })
        })
        this.originalData = data
        this.loading = false
        // watch
        data.channels.forEach(cn => {
          cn.rows.forEach(row => {
            this.watchRow(row)
          })
        })
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
}
</script>

<style lang="scss">
.timer-exceptions{
}
</style>
