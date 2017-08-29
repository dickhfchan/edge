<template>
  <v-layout row wrap class="ma-3">
    <v-flex>
      <div style="width:250px;" class="mr-3">
        <v-select
         v-bind:items="programs"
         item-text="name"
         item-value="subr"
         v-model="subr"
         label="Program"
         ></v-select>
      </div>
      <div style="width:250px;" class="mr-3">
        <v-select
         v-bind:items="statements"
         v-model="statement"
         label="Statement"
         ></v-select>
      </div>
    </v-flex>

    <v-flex xs12>
      <div class="w-100">
        <v-data-table
            :headers="headers"
            :items="filteredRows"
            hide-actions
            class=""
          >
          <template slot="items" scope="props">
            <td v-for="(header, i) in headers" class="text-xs-left"
              :width="header.width"
            >
              {{ props.item[header.value] }}
            </td>
          </template>
        </v-data-table>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import DataSource from '@/DataSource'

export default {
  data() {
    return {
      title: 'Program',
      loading: true,
      programs: [],
      statements: ['ALL', 'COMMENT', 'DECLARE', 'IF', 'THEN', 'ELSE', 'DO'],
      statement: 'ALL',
      subr: null,
      headers: [
        {text: 'No', value: 'no', align: 'left', width: '50px'},
        {text: 'Statement', value: 'stmt', align: 'left', width: '50px'},
        {text: 'Expression', value: 'expr', align: 'left'},
      ],
      rows: [],
    }
  },
  computed: {
    filteredRows() {
      if (this.statement === 'ALL') {
        return this.rows
      }
      return this.rows.filter(row => row.stmt === this.statement)
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
    this.dataSource = new DataSource()
    this.dataSource.type = 'services'
    this.dataSource.func = {func: 18}
    this.dataSource.ongetdata = data => {
      this.programs = data.rows
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
}
</script>
<style lang="scss">
.data1 {
  > .table__overflow {
    border: 1px solid #ccc;
    thead{
      display: none;
    }
  }
}
</style>
