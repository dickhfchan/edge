<template>
<v-layout row wrap class="ma-3 Timer timer">
  <template v-if="!loading">
    <v-flex xs12 class="header">
      <div style="width:250px;">
        <v-select
         v-bind:items="channels"
         item-text="name"
         v-model="channel"
         label="Channel"
         ></v-select>
      </div>
      <div style="width:250px;" v-if="channel">
        <v-text-field
          label="Description"
          v-model="channel.description"
        ></v-text-field>
      </div>
      <div style="width:250px;" class="flex-col" v-if="channel">
        <span class="state-label">State</span>
        <v-switch class="pa-0" :value="channel.state==='on'"></v-switch>
      </div>
    </v-flex>

    <v-flex xs12 class="" v-if="channel">
      <div class="w-100">
        <Datatable
          :headers="headers"
          :items="channel.rows"
          :actionsVisible="false"
          class="elevation-1"
        >
        </Datatable>
      </div>
    </v-flex>
  </template>

  <div class="absolute-backdrop center-wrapper" v-if="loading">
    <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
  </div>
</v-layout>
</template>
<script>
import Datatable from '../components/Datatable.vue'
import {newService} from '@/utils'

const dayMapping = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
  'Mon-Fri': 'Monday - Friday',
  'Sat-Sun': 'Saturday - Sunday',
}

export default {
  components: {Datatable},
  data() {
    return {
      title: 'Timer',
      loading: true,
      originalData: null,
      channel: null,
      headers: [
        {text: 'Row', value: 'rnum', align: 'left', sortAble: false},
        {text: 'Day - period', value: 'dayText', align: 'left', sortAble: false},
        {text: 'Time on', value: 'timeOnText', align: 'left', sortAble: false},
        {text: 'Time off', value: 'timeOffText', align: 'left', sortAble: false},
      ],
    }
  },
  computed: {
    channels() {
      return this.originalData.channels
    },
  },
  created() {
    newService({func: 11}).then(data => {
      data.channels = data.chnl
      data.channels.forEach(channel => {
        channel.description = channel.desc
        channel.state = channel.stat
        channel.rows.forEach(row => {
          row.dayText = dayMapping[row.cday]
          row.timeOnText = row.tion
          row.timeOffText = row.tiof
        })
      })
      this.originalData = data
      this.loading = false
    })
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  // methods:
}
</script>
<style lang="scss">
.Timer{
  .header{
    justify-content: space-between;
    .state-label{
      color: rgba(0,0,0,.54);
    }
  }
}
</style>
