<template>
<div class="table__overflow elevation-1">
  <table class="datatable table">
    <slot name="thead">
      <thead>
        <tr>
          <th class="column" v-for="col in headers" :width="col.width"
            :class="[(col.align==='right'?'text-xs-right':'text-xs-left') + sortClass(col), {sortable: col.sortAble!==false}]"
            @click="sort(col)"
          >
            {{col.text}}
            <i class="material-icons icon" v-if="col.sortAble!==false">arrow_upward</i>
          </th>
        </tr>
      </thead>
    </slot>
    <slot name="tbody">
      <tbody>
        <tr v-for="row in items">
          <td v-for="col in headers" :key="col.value" :class="col.align==='right'?'text-xs-right':'text-xs-left'">
            {{row[col.value]}}
          </td>
          <td>
            <!-- <v-btn flat danger>Remove</v-btn> -->
          </td>
        </tr>
      </tbody>
    </slot>
  </table>
</div>
</template>
<script>
export default {
  // components:
  props: {
    headers: {},
    items: {},
  },
  data() {
    return {
      sortBy: null,
      sortOrder: null,
    }
  },
  methods: {
    sort(col) {
      if (col.sortAble === false) {
        return
      }
      const {sortBy, sortOrder} = this
      if (col.value === sortBy) {
        if (sortOrder === 'desc') {
          this.sortOrder = 'asc'
        } else {
          this.sortOrder = 'desc'
        }
      } else {
        this.sortBy = col.value
        this.sortOrder = 'desc'
      }
      //
      this.items.sort((a, b) => {
        const val1 = a[col.value]
        const val2 = b[col.value]
        if (val1 < val2) {
          return -1
        } else if (val1 === val2) {
          return 0
        } else {
          return 1
        }
      })
      if (this.sortOrder === 'desc') {
        this.items.reverse()
      }
    },
    sortClass(col) {
      if (col.sortAble === false) {
        return ''
      }
      const {sortBy, sortOrder} = this
      if (col.value === sortBy) {
        return ' active ' + sortOrder
      } else {
        return ''
      }
    },
  }
}
</script>
<style lang="scss">
</style>
