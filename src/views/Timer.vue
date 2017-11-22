<template>
<v-layout row wrap class="ma-3 Timer timer">
  <template v-if="!loading">
    <v-flex xs12 class="mb-1" v-if="changed">
      <v-btn primary class="ml-0" :loading="saving" @click="save">Save</v-btn>
    </v-flex>
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
        <v-switch class="pa-0" v-model="channelState"></v-switch>
      </div>
    </v-flex>

    <v-flex xs12 class="mb-1" v-if="channel">
      <v-btn class="ml-0" @click="newItem">New</v-btn>
    </v-flex>

    <v-flex xs12 class="" v-if="channel">
      <div class="w-100">
        <Datatable
          :headers="headers"
          :items="channel.rows"
          class="elevation-1"
          :editBtnVisible="false"
          @remove="remove($event.row, $event.index)"
        >
        </Datatable>
      </div>
    </v-flex>
  </template>

  <LoadingBlock v-if="loading"></LoadingBlock>

</v-layout>
</template>
<script>
import Datatable from '../components/Datatable.vue'
import {secondsFormat, timeToSeconds} from '@/utils'

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
      changed: false,
      originalData: null,
      channel: null,
      headers: [
        {text: 'Row', value: 'rnum', align: 'left', sortAble: false},
        {text: 'Day - period', value: 'cday', align: 'left', sortAble: false,
          type: 'select',
          options: Object.keys(dayMapping).map(key => {
            return {value: key, text: dayMapping[key]}
          })
        },
        {text: 'Time on', value: 'timeOnText', align: 'left', sortAble: false, type: 'default'},
        {text: 'Time off', value: 'timeOffText', align: 'left', sortAble: false, type: 'default'},
      ],
      saving: false,
    }
  },
  computed: {
    channels() {
      return this.originalData.channels
    },
    // max no
    maxId() {
      let max = -1
      this.channel.rows.forEach(row => {
        if (row.rnum > max) {
          max = row.rnum
        }
      })
      return max
    },
    channelState: {
      get() {
        return this.channel.state==='on'
      },
      set() {},
    }
  },
  created() {
    this.getData()
    this.$on('changed', this.onChanged)
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  methods: {
    getData() {
      Promise.all([this.$newService({func: 11}), this.$newService({func: 13})]).then(([data, data2]) => {
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
    watchRow(row) {
      this.$watch(() => row.cday, this.onChanged)
      this.$watch(() => row.timeOnText, this.onChanged)
      this.$watch(() => row.timeOffText, this.onChanged)
    },
    onChanged() {
      this.changed = true
      this.$preventURLChange()
    },
    newItem() {
      const id = this.maxId + 1
      if (id > 50) {
        this.$alert('Sorry, maximum number of records reached')
        return
      }
      const row = {
        rnum: id,
        cday: 'Mon',
        timeOnText: '00:00',
        timeOffText: '00:00',
      }
      this.channel.rows.push(row)
      this.watchRow(row)
      this.onChanged()
    },
    save() {
      if (this.saving) {
        return
      }
      this.saving = true
      let inValidObj = null
      const data = {func: 12, chns: this.originalData.channels.map(cn => {
        return {
          chnl: cn.cnum,
          nrow: cn.rows.length,
          rows: cn.rows.map(row => {
            const t = {
              rnum: row.rnum,
              cday: row.cday,
              tion: timeToSeconds(row.timeOnText),
              tiof: timeToSeconds(row.timeOffText),
            }
            if (!inValidObj && (t.tion > 0 || t.tiof > 0) && t.tion >= t.tiof) {
              inValidObj = {
                cnum: cn.cnum,
                rnum: row.rnum
              }
            }
            return t
          })
        }
      })}

      // validate
      if (inValidObj) {
        this.$alert(`Time off must be bigger than time on at channel ${inValidObj.cnum + 1} row ${inValidObj.rnum}`)
        this.saving = false
        return
      }

      this.$newService(data).then(() => {
        this.saving = false
        this.changed = false
        this.$allowURLChange()
      }, e => {
        this.saving = false
        throw e
      })
    },
    remove(row, index) {
      for (let i = index + 1; i < this.channel.rows.length; i++) {
        const row = this.channel.rows[i]
        row.rnum--
      }
      this.channel.rows.splice(index, 1)
      this.onChanged()
    },
  },
}
</script>
<style lang="scss">
.Timer{
  .header{
    height: 55px;
    justify-content: space-between;
    .state-label{
      color: rgba(0,0,0,.54);
    }
  }
}
</style>
