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
        <v-switch class="pa-0" :value="channel.state==='on'"></v-switch>
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
import {newService2} from '@/utils'

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

const sencondsFormat = (seconds) => {
  const m0 = seconds / 60
  const h = Math.floor(m0 / 60)
  const m = Math.floor(m0 % 60)
  const hh = h < 10 ? `0${h}` : h.toString()
  const mm = m < 10 ? `0${m}` : m.toString()
  return `${hh}:${mm}`
}

const timeToSeconds = (time) => {
  const [h, m] = time.split(':')
  return h * 3600 + m * 60
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
      form: {
        mode: null,
        visible: false,
        data: {},
      },
      rules: {
        required: (value) => !!value || 'Required',
      },
    }
  },
  computed: {
    channels() {
      return this.originalData.channels
    },
    // max no
    maxId() {
      let max = 0
      this.channel.rows.forEach(row => {
        if (row.rnum > max) {
          max = row.rnum
        }
      })
      return max
    },
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
      newService2({func: 11}).then(data => {
        data.channels = data.chnl
        data.channels.forEach(channel => {
          channel.description = channel.desc
          channel.state = channel.stat
          channel.rows.forEach(row => {
            row.timeOnText = sencondsFormat(row.tion)
            row.timeOffText = sencondsFormat(row.tiof)
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
      const row = {
        rnum: this.maxId + 1,
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
      const data = {func: 12, chns: this.originalData.channels.map(cn => {
        return {
          chnl: cn.cnum,
          nrow: cn.rows.length,
          rows: cn.rows.map(row => {
            return {
              rnum: row.rnum,
              cday: row.cday,
              tion: timeToSeconds(row.timeOnText),
              tiof: timeToSeconds(row.timeOffText),
            }
          })
        }
      })}
      const done = (result) => {
        this.saving = false
        this.changed = false
        this.$allowURLChange()
      }
      newService2(data).then(done, done)
    },
    remove(row, i) {
      this.channel.rows.splice(i, 1)
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
