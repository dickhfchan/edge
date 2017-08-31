<template>
  <v-layout row wrap class="ma-3 program">
    <v-flex class="">
      <div style="width:250px;" class="mr-3">
        <v-select
         v-bind:items="programs"
         item-text="name"
         item-value="subr"
         v-model="subr"
         label="Program"
         ></v-select>
      </div>
      <div class="flex flex-align-center" style="padding-bottom: 20px;">
        <template v-if="program">
          <v-btn error dark class="ml-0" @click="removeProgram">Remove Program</v-btn>
          <v-btn primary dark @click="compile">Compile</v-btn>
        </template>
        <v-btn primary dark class="ml-0" @click="save">Save</v-btn>
        <v-btn @click="newItem">New</v-btn>
        <v-progress-circular v-if="saving" indeterminate class="primary--text" :size="20"></v-progress-circular>
        <transition name="fade-transition">
          <v-icon right class="green--text" v-if="succeeded">check</v-icon>
        </transition>
      </div>
    </v-flex>

    <v-flex xs12>
      <div class="w-100">
        <Datatable
          :headers="headers"
          :items="rows"
          :program="self"
          class="elevation-1 program-table"
        >
          <tbody slot="tbody">
            <tr v-for="(row, i) in filteredRows">
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
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import DataSource from '@/DataSource'
import Datatable from '../components/ProgramDatatable.vue'
import { newService } from '@/utils'

const allStmts = 'ALL'
export default {
  components: {Datatable},
  data() {
    return {
      self: this,
      title: 'Program',
      loading: true,
      programs: [],
      statements: [allStmts, 'COMMENT', 'DECLARE', 'IF', 'THEN', 'ELSE', 'DO'],
      statement: allStmts,
      subr: null,
      headers: [
        {text: 'No', value: 'no', align: 'left', width: '50px', sortAble: false},
        {text: 'Statement', value: 'stmt', align: 'left', width: '50px', sortAble: false},
        {text: 'Expression', value: 'expr', align: 'left', sortAble: false},
        {text: 'Actions', value: 'actions', align: 'left', sortAble: false},
      ],
      rows: [],
      saving: false,
      succeeded: false,
    }
  },
  computed: {
    filteredRows() {
      if (this.statement === allStmts) {
        return this.rows
      }
      return this.rows.filter(row => row.stmt === this.statement)
    },
    program() {
      return this.programs && this.programs.find(v => v.subr === this.subr)
    },
  },
  watch: {
    subr() {
      this.dataSource = new DataSource()
      this.dataSource.type = 'services'
      this.dataSource.func = {func: 19, subr: this.subr}
      this.dataSource.ongetdata = data => {
        this.rows = data.rows.map((row, i) => {
          row.no = i + 1
          return row
        })
        this.dataSource.close()
      }
      this.dataSource.connect()
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
  beforeDestroy() {
    this.dataSource.close()
  },
  methods: {
    getData() {
      newService({func: 18}).then(data => {
        this.programs = data.rows
      })
    },
    newItem() {
      const item = {}
      this.headers.forEach(col => {
        item[col.value] = null
      })
      item.stmt = this.statement
      this.rows.push(item)
    },
    removeEmptyRows() {
      const notEmptyRows = []
      for (const row of this.rows) {
        if (Object.values(row).find(v => v != null && v !== '')) {
          notEmptyRows.push(row)
        }
      }
      this.rows = notEmptyRows
    },
    validateRows(noAlert) {
      let valid = true
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
      if (!valid && !noAlert) {
        this.$alert('Empty cell is not allowed, please check your input')
      }
      return valid
    },
    getDataRows() {
      const dataRows = []
      this.rows.forEach(row => {
        const row2 = {}
        this.headers.filter(col => col.value !== 'no' && col.value !== 'actions').forEach(col => {
          row2[col.value] = col.type === 'number' ? parseFloat(row[col.value]) : row[col.value]
        })
        dataRows.push(row2)
      })
    },
    save() {
      this.removeEmptyRows()
      if (!this.validateRows()) {
        return
      }
      const data = {func: 20, csub: 1, subr: this.program.subr, name: this.program.name, nrow: this.rows.length, rows: this.getDataRows()}
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
    removeProgram() {
      this.$confirm('Are you sure to remove the program?').then(() => {
        const data = {func: 21, subr: this.program.subr}
        this.saving = true
        newService(data).then(r => {
          if (r.errc > 0) {
            this.$alert('Remove failed')
            console.log(r)
          } else {
            this.succeeded = true
            window.setTimeout(() => {
              this.succeeded = false
            }, 1000)
            this.subr = null
            this.getData()
          }
        })
      })
    },
    compile() {
      this.removeEmptyRows()
      if (!this.validateRows()) {
        return
      }
      const data = {func: 22, nrow: this.rows.length, rows: this.getDataRows()}
      this.saving = true
      newService(data).then(r => {
        if (r.errc > 0) {
          this.$alert('Compile failed')
          console.log(r)
        } else {
          this.succeeded = true
          window.setTimeout(() => {
            this.succeeded = false
          }, 1000)
          console.log(r)
        }
        this.saving = false
      })
    },
  }
}
</script>
<style lang="scss">
.program-table{
  table{
    border-collapse: separate;
  }
}
</style>
