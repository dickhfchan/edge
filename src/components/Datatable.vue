<template>
<div class="table__overflow elevation-1">
  <table class="datatable table">
    <slot name="thead">
      <thead>
        <tr>
          <th class="column" v-for="col in headers" v-if="col.value!=='actions'||actionsVisible" :width="col.width"
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
        <tr v-for="(row, index) in items">

          <td v-for="col in headers" :key="col.value" :class="col.align==='right'?'text-xs-right':'text-xs-left'">
            <span v-if="!col.type">{{row[col.value]}}</span>
            <input v-else-if="col.type === 'default'" v-model="row[col.value]" />
            <input v-else-if="col.type === 'number'" type="number" v-model="row[col.value]" />
            <div v-else-if="col.type==='select'" class="select-cell">
              <select v-model="row[col.value]">
                <option v-for="option in col.options" :value="option.value">
                  {{option.text}}
                </option>
              </select>
              <v-icon>arrow_drop_down</v-icon>
            </div>
          </td>
          <td v-if="actionsVisible">
            <v-btn v-if="editBtnVisible" primary small @click.native="$emit('edit', {row, index})">Edit</v-btn>
            <v-btn v-if="removeBtnVisible" error small @click.native="$emit('remove', {row, index})">Remove</v-btn>
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
    actionsVisible: {default: true},
    editBtnVisible: {default: true},
    removeBtnVisible: {default: true},
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
.datatable{
  .select-cell{
    select{

    }
  }
}
</style>
