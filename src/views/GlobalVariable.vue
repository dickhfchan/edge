<template>
  <v-layout row wrap class="global-variable ma-3">
    <v-flex xs12 class="mb-1">
      <v-btn primary dark class="ml-0" @click="save">Save</v-btn>
      <v-btn @click="newItem">New</v-btn>
    </v-flex>
    <v-flex xs12>
      <Datatable
        :headers="headers"
        :items="rows"
        class="elevation-1"
      >
        <tbody slot="tbody">
          <tr v-for="row in rows">
            <td v-for="col in headers" class="text-xs-left">
              <input v-if="col.type === 'number'" type="number" v-model="row[col.value]" />
              <input v-else type="text" v-model="row[col.value]" />
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
        {text: 'Global Variable', value: 'glov', align: 'left', width: '50px'},
        {text: 'Nos', value: 'leng', align: 'left', width: '50px', type: 'number'},
        {text: 'Description', value: 'comt', align: 'left'},
      ],
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
        for (const v of Object.values(row)) {
          if (v == null || v === '') {
            rowValid = false
            break
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
      const data = {func: 17, nrow: this.rows.length, rows: this.rows}
      newService(data).then(r => {
        if (r.errc > 0) {
          this.$alert('Save failed')
          console.log(r)
        }
      })
    },
  },
}
</script>
<style lang="scss">
.global-variable{

}
</style>
