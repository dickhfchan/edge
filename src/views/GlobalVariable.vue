<template>
  <v-layout row wrap>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="rows"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" scope="props">
          <td v-for="(header, i) in headers" :class="{'text-xs-right': i > 0}">{{ props.item[header.value] }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import DataSource from '@/DataSource'

export default {
  data() {
    return {
      title: 'Global Variable',
      loading: true,
      rows: [],
      headers: [
        {text: 'Global Variable', value: 'glov', align: 'left'},
        {text: 'Nos', value: 'leng'},
        {text: 'Description', value: 'comt'},
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
