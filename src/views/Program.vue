<template>
  <v-layout row wrap>
    <v-flex>
      <div style="width:250px;" class="mr-3">
        <v-select
        :single-line="true"
         v-bind:items="programs"
         item-text="name"
         item-value="subr"
         v-model="subr"
         label="Programe"
         ></v-select>
      </div>
    </v-flex>

    <v-flex xs12>
      <div class="w-100">
        <v-data-table
            :headers="headers"
            :items="rows"
            hide-actions
            class=""
          >
          <template slot="items" scope="props">
            <td class="">{{props.item.no}}</td>
            <td class="text-xs-right">{{ props.item.stmt }}</td>
            <td class="text-xs-right">{{ props.item.expr }}</td>
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
      subr: null,
      headers: [
        {text: 'No', value: 'no', align: 'left'},
        {text: 'Statement', value: 'stmt', align: 'left'},
        {text: 'Expression', value: 'expr'},
      ],
      rows: [],
    }
  },
  computed: {
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
