<template>
<v-layout row wrap class="ma-3 timer-exceptions">
  <v-flex xs12 class="mb-1">
    <v-btn class="ml-0" @click="add">Add</v-btn>
    <v-btn v-if="changed" primary class="ml-0" :loading="saving" @click="save">Save</v-btn>
  </v-flex>
  <v-flex xs12 class="">
    <div class="w-100">
      <Datatable
        :headers="headers"
        :items="rows"
        class="elevation-1"
        :editBtnVisible="true"
        @edit="edit($event.row, $event.index)"
        @remove="remove($event.row, $event.index)"
      >
      </Datatable>
    </div>
  </v-flex>

  <!-- form dialog -->
  <v-dialog v-model="formDialog.visible" persistent content-class="formDialog" width="600">
    <v-card>
      <v-card-title>
        <span class="headline">{{formDialog.mode==='add'?'Add':'Edit'}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-select
                v-bind:items="channels"
                v-model="formDialog.data.chnl"
                item-text="name"
                item-value="cnum"
                label="Channel"
                bottom
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <label>Channel Status</label>
            </v-flex>
            <v-flex xs4>
              <v-radio label="On" v-model="formDialog.data.stat" value="on"></v-radio>
            </v-flex>
            <v-flex xs4>
              <v-radio label="Off" v-model="formDialog.data.stat" value="off"></v-radio>
            </v-flex>
            <v-flex xs6>
              <label>From Date</label>
            </v-flex>
            <v-flex xs3>
              <label>Hour</label>
            </v-flex>
            <v-flex xs3>
              <label>Minute</label>
            </v-flex>
            <!-- from date -->
            <v-flex xs4>
              <v-select
                v-bind:items="monthDetails"
                v-model="formDialog.data.frmo"
                item-text="name"
                item-value="number"
                single-line
                bottom
              ></v-select>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                single-line
                v-model="formDialog.data.frda"
              ></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                single-line
                v-model="formDialog.data.frhr"
              ></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                single-line
                v-model="formDialog.data.frmi"
              ></v-text-field>
            </v-flex>
            <!-- to date -->
            <v-flex xs4>
              <v-select
                v-bind:items="monthDetails"
                v-model="formDialog.data.tomo"
                item-text="name"
                item-value="number"
                single-line
                bottom
              ></v-select>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                single-line
                v-model="formDialog.data.toda"
              ></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                single-line
                v-model="formDialog.data.tohr"
              ></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field
                single-line
                v-model="formDialog.data.tomi"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1" flat @click.native="formDialog.visible = false">Close</v-btn>
        <v-btn class="blue--text darken-1" flat @click.native="saveFormDialog">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <LoadingBlock v-if="loading"></LoadingBlock>
</v-layout>
</template>

<script>
import Datatable from '../components/Datatable.vue'
import {secondsFormat, timeToSeconds, cloneObjByKeys, monthDetails, numToMon, monToNum, compareNumberArray} from '@/utils'

export default {
  components: {Datatable},
  data() {
    return {
      monthDetails: Object.values(monthDetails),
      title: 'Timer Exceptions',
      loading: false,
      changed: false,
      rows: null,
      channels: [],
      headers: [
        //  "rnum":	0, "chnl":	3, "stat":	"on", "frmo":	8, "frda":	6, "frti":	0, "tomo":	8, "toda":	7, "toti":	0
        {text: 'Row', value: 'rnum', align: 'left', sortAble: false},
        {text: 'Channel', value: 'chnlText', align: 'left', sortAble: false},
        {text: 'Status', value: 'stat', align: 'left', sortAble: false},
        {text: 'From Month', value: 'frmoText', align: 'left', sortAble: false},
        {text: 'From Day', value: 'frda', align: 'left', sortAble: false},
        {text: 'From Time', value: 'frtiText', align: 'left', sortAble: false},
        {text: 'To Month', value: 'tomoText', align: 'left', sortAble: false},
        {text: 'To Day', value: 'toda', align: 'left', sortAble: false},
        {text: 'To Time', value: 'totiText', align: 'left', sortAble: false},
      ],
      saving: false,
      formDialog: {
        mode: 'add',
        visible: false,
        data: {},
      },
    }
  },
  methods: {
    getChannelMappping(){
      const mp = {}
      this.channels.forEach(v => {
        mp[v.cnum] = v
      })
      return mp
    },
    correctRow(row) {
      if (!this.channelMappping) {
        this.channelMappping = this.getChannelMappping()
      }
      const {channelMappping} = this
      this.$set(row, 'chnlText', channelMappping[row.chnl].name)
      this.$set(row, 'frmoText', numToMon(row.frmo))
      this.$set(row, 'frtiText', secondsFormat(row.frti))
      this.$set(row, 'tomoText', numToMon(row.tomo))
      this.$set(row, 'totiText', secondsFormat(row.toti))
    },
    getRowData(row) {
      return cloneObjByKeys(row, ['rnum', 'chnl', 'stat', 'frmo', 'frda', 'frti', 'tomo', 'toda', 'toti'])
    },
    getData() {
      this.loading = true
      Promise.all([
        this.$newService({func: 11}),
        this.$newService({func: 14, istp: 0}),
      ]).then(datas => {
        this.channels = datas[0].chnl
        datas[1].rows.forEach(row => {
          this.correctRow(row)
        })
        this.rows = datas[1].rows
        this.loading = false
      }).catch(e => {
        this.loading = false
        throw e
      })
    },
    onChanged() {
      this.changed = true
      this.$preventURLChange()
    },
    remove(row, index) {
      for (let i = index + 1; i < this.rows.length; i++) {
        const row = this.rows[i]
        row.rnum--
      }
      this.rows.splice(index, 1)
      this.onChanged()
    },
    add() {
      const data = this.getRowData({})
      data.frhr = 0
      data.frmi = 0
      data.tohr = 0
      data.tomi = 0
      // default
      data.rnum = this.rows.length
      data.chnl = 0
      data.stat = 'off'
      data.frmo = 1
      data.frda = 1
      data.tomo = 1
      data.toda = 1
      //
      this.formDialog.data = data
      this.formDialog.mode = 'add'
      this.formDialog.visible = true
    },
    edit(row, index) {
      const data = this.getRowData(row)
      let t
      t = row.frtiText.split(':')
      data.frhr = parseInt(t[0])
      data.frmi = parseInt(t[1])
      t = row.totiText.split(':')
      data.tohr = parseInt(t[0])
      data.tomi = parseInt(t[1])
      this.formDialog.data = data
      this.formDialog.row = row
      this.formDialog.mode = 'edit'
      this.formDialog.visible = true
    },
    saveFormDialog() {
      const {formDialog} = this
      const data = this.getRowData(formDialog.data)
      data.frti = timeToSeconds(`${data.frhr}:${data.frmi}`)
      data.toti = timeToSeconds(`${data.tohr}:${data.tomi}`)
      if (compareNumberArray([data.frmo, data.frda, data.frti], [data.tomo, data.toda, data.toti]) >= 0) {
        this.$alert(`To time must be bigger than from time`)
        return
      }
      let row
      if (formDialog.mode === 'add') {
        row = {}
        Object.assign(row, formDialog.data)
        row.frti = null
        row.toti = null
        this.rows.push(row)
        console.log(row);
      } else {
        row = formDialog.row
        Object.assign(row, formDialog.data)
      }
      this.correctRow(row)
      formDialog.visible = false
      this.onChanged()
    },
    save() {
      if (this.saving) {
        return
      }
      this.saving = true

      const data = {func: 15, istp: 0, nrow: this.rows.length, rows: this.rows.map(row => {
        const rowData = this.getRowData(row)
        rowData.stat = row.stat === 'on' ? 1 : 0
        return rowData
      })}

      this.$newService(data).then(() => {
        this.saving = false
        this.changed = false
        this.$allowURLChange()
      }, e => {
        this.saving = false
        throw e
      })
    },
  },
  created() {
    this.getData()
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
.formDialog{
  label{
    color: rgba(0,0,0,.54);
  }
}
</style>
