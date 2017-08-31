<template>
  <v-layout row wrap class="global-variable ma-3">
    <v-flex xs12 class="mb-1 flex-align-center">
      <v-btn primary dark class="ml-0" @click="save">Save</v-btn>
      <v-btn @click="newItem">New</v-btn>
      <v-progress-circular v-if="saving" indeterminate class="primary--text" :size="20"></v-progress-circular>
      <transition name="fade-transition">
        <v-icon right class="green--text" v-if="succeeded">check</v-icon>
      </transition>
    </v-flex>
    <v-flex xs12>
      <Datatable
        :headers="headers"
        :items="rows"
        class="elevation-1"
      >
        <tbody slot="tbody">
          <tr v-for="(row, i) in rows">
            <td v-for="col in headers" class="text-xs-left">
              <template v-if="col.value !== 'actions'">
                <input v-if="col.type === 'number'" type="number" v-model="row[col.value]" />
                <input v-else type="text" v-model="row[col.value]" />
              </template>
              <v-btn v-else error small class="ma-1" @click="remove(row, i)">
                Remove
              </v-btn>
            </td>
          </tr>
        </tbody>
      </Datatable>
    </v-flex>
  </v-layout>
</template>
<script>
import DataSource from '@/DataSource'
import Datatable from '../components/Datatable.vue'
import { newService } from '@/utils.js'

export default {
  components: { Datatable },
  data() {
    return {
      title: 'Global Variable',
      loading: true,
      rows: [],
      headers: [
        {text: 'Global Variable', value: 'glov', align: 'left', width: '50px', sortAble: false},
        {text: 'Nos', value: 'leng', align: 'left', width: '50px', type: 'number', sortAble: false},
        {text: 'Description', value: 'comt', align: 'left', sortAble: false},
        {text: 'Actions', value: 'actions', align: 'left', sortAble: false},
      ],
      saving: false,
      succeeded: false,
    }
  },
  computed: {
  },
  created() {
    this.dataSource = new DataSource()
    this.dataSource.type = 'services'
    this.dataSource.func = {func: 16}
    this.dataSource.ongetdata = data => {
      this.rows = data.rows
      this.dataSource.close()
    }
    this.dataSource.connect()
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  beforeDestroy() {
    this.dataSource.close()
  },
  methods: {
    newItem() {
      const item = {}
      this.headers.forEach(col => {
        item[col.value] = null
      })
      this.rows.push(item)
    },
    save() {
      let valid = true
      const notEmptyRows = []
      for (const row of this.rows) {
        if (Object.values(row).find(v => v != null && v !== '')) {
          notEmptyRows.push(row)
        }
      }
      this.rows = notEmptyRows
      for (const row of this.rows) {
        let rowValid = true
        for (const col of this.headers) {
          if (col.value !== 'actions') {
            const val = row[col.value]
            if (val == null || val === '') {
              rowValid = false
              break
            }
          }
        }
        if (!rowValid) {
          valid = false
          break
        }
      }
      if (!valid) {
        this.$alert('Empty cell is not allowed, please check your input')
        return
      }
      const data = {func: 17, nrow: this.rows.length, rows: []}
      this.rows.forEach(row => {
        const row2 = {}
        this.headers.forEach(col => {
          row2[col.value] = col.type === 'number' ? parseFloat(row[col.value]) : row[col.value]
        })
        data.rows.push(row2)
      })
      this.saving = true
      newService(data).then(r => {
        if (r.errc > 0) {
          this.$alert('Save failed')
          console.log(r)
        } else {
          this.succeeded = true
          window.setTimeout(() => {
            this.succeeded = false
          }, 1000)
        }
        this.saving = false
      })
    },
    remove(row, i) {
      this.rows.splice(i, 1)
      this.save()
    },
  },
}
</script>
<style lang="scss">
.global-variable{

}
</style>
