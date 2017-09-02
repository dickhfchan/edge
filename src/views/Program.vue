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
          <v-btn primary dark @click="compile" :loading="compiling" :disabled="compiling">
            Compile
            <span slot="loader" class="loader"><v-icon light>cached</v-icon></span>
          </v-btn>
        </template>

        <v-btn primary dark class="ml-0" @click="save" :loading="saving" :disabled="saving">
          Save
          <span slot="loader" class="loader"><v-icon light>cached</v-icon></span>
        </v-btn>

        <v-btn @click="newItem">New</v-btn>

        <v-dialog v-model="searchDialog" width="1000">
          <v-btn slot="activator">Search</v-btn>
          <v-card>
            <v-card-title class="headline">Search</v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex>
                  <form @submit.prevent="search" class="w-100">
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field
                          label="Keyword"
                          v-model="searchText"
                          type="text"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          v-bind:items="['Subroutine', 'Program','Main','Manual', 'Auto']"
                          v-model="searchMode"
                          label="Search mode"
                          bottom
                        ></v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-checkbox label="Match upper lower case" v-model="searchMULC"></v-checkbox>
                      </v-flex>
                      <v-flex xs8>
                        <v-checkbox label="Match whole word" v-model="searchMWW"></v-checkbox>
                      </v-flex>
                      <v-flex xs4>
                        <v-btn type="submit" block :loading="searching" :disabled="searching">
                          Search
                          <span slot="loader" class="loader">
                            <v-icon light>cached</v-icon>
                          </span>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </form>
                </v-flex>
                <v-flex xs12 class="mt-2">
                    <Datatable2
                      :headers="headers2"
                      :items="rows2"
                      class="elevation-1"
                      :actionsVisible="false"
                    >
                    </Datatable2>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn warning @click.native="searchDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
            <tr v-for="(row, i) in filteredRows" @mouseenter="hoveringRow=row" @mouseleave="hoveringRow=null">
              <td v-for="col in headers" class="text-xs-left">
                <template v-if="col.value !== 'actions'">
                  <template v-if="col.editAble!==false">
                    <input v-if="col.type === 'number'" type="number" v-model="row[col.value]" />
                    <input v-else type="text" v-model="row[col.value]" />
                  </template>
                  <span v-else>{{row[col.value]}}</span>
                </template>
                <template v-else>
                  <v-btn error small class="" @click="remove(row, i)">
                    Remove
                  </v-btn>
                  <v-btn small class="ml-0" @click="insert(i)">
                    Insert
                  </v-btn>
                </template>
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
import Datatable2 from '../components/Datatable.vue'
import { newService } from '@/utils'

const allStmts = 'ALL'
export default {
  components: {Datatable, Datatable2},
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
        {text: 'No', value: 'no', align: 'left', width: '50px', sortAble: false, editAble: false},
        {text: 'Statement', value: 'stmt', align: 'left', width: '50px', sortAble: false},
        {text: 'Expression', value: 'expr', align: 'left', sortAble: false},
        {text: 'Actions', value: 'actions', align: 'left', sortAble: false},
      ],
      rows: [],
      saving: false,
      succeeded: false,
      compiling: false,
      // insert when keydown enter
      hoveringRow: null,
      // 2
      searchText: null,
      headers2: [
        {text: 'Line number', value: 'line', align: 'left', width: '50px', sortAble: false},
        {text: 'Start at character position', value: 'chnu', align: 'left', width: '50px', sortAble: false},
        {text: 'Description', value: 'desc', align: 'left', sortAble: false},
      ],
      rows2: [],
      searching: false,
      searchDialog: false,
      searchMode: 'Subroutine',
      searchMULC: false,
      searchMWW: false,
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
        this.rows = data.rows
        this.dataSource.close()
      }
      this.dataSource.connect()
    },
    rows: {
      immediate: true,
      handler() {
        this.rows.forEach((row, i) => {
          this.$set(row, 'no', i + 1)
        })
      },
    },
  },
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
      document.addEventListener('keydown', this.keydownEnter)
    })
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownEnter)
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
      item.stmt = this.statement === allStmts ? null : this.statement
      this.rows.push(item)
    },
    insert(i) {
      const item = {}
      this.headers.forEach(col => {
        item[col.value] = null
      })
      item.stmt = this.statement === allStmts ? null : this.statement
      this.rows.splice(i + 1, 0, item)
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
      this.compiling = true
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
        this.compiling = false
      })
    },
    keydownEnter(e) {
      if (e.key === 'Enter') {
        if (this.hoveringRow) {
          this.insert(this.rows.indexOf(this.hoveringRow))
        }
      }
    },
    search() {
      const data = {'func': 23, 'srhm': this.searchMode.toLowerCase(), 'upca': this.searchMULC ? '1' : '0', 'wwrd': this.searchMWW ? '1' : '0', 'srhs': this.searchText || ''}
      this.searching = true
      newService(data).then(r => {
        if (r.errc > 0) {
          this.$alert('Search failed')
          console.log(r)
        } else {
          this.rows2 = r.rows
        }
        this.searching = false
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
