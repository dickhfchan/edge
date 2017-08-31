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
            <div class="custom-select" v-if="col.value==='stmt'">
              <select class="" name="" v-model="program.statement">
                <option v-for="item in program.statements" :value="item">
                  {{item}}
                </option>
              </select>
              <v-icon>arrow_drop_down</v-icon>
            </div>
             <span v-else>{{col.text}}</span>
            <i class="material-icons icon" v-if="col.sortAble!==false">arrow_upward</i>
          </th>
        </tr>
      </thead>
    </slot>
    <slot name="tbody">
      <tbody>
        <tr v-for="(row, index) in items">
          <td v-for="col in headers" :key="col.value" :class="col.align==='right'?'text-xs-right':'text-xs-left'">
            {{row[col.value]}}
          </td>
          <td>
            <v-btn flat danger @click.native="$emit('remove', {row, index})">Remove</v-btn>
          </td>
        </tr>
      </tbody>
    </slot>
  </table>
</div>
</template>

<script>
import Datatable from './Datatable.vue'

export default {
  extends: Datatable,
  props: ['program']
}
</script>
<style lang="scss">
table.table thead th>div.custom-select{
  width: auto;
}
.custom-select{
  display: inline-block;
  position: relative;
  cursor: pointer;
  select{
    padding-right: 10px;
  }
  .icon{
    position: absolute;
    top: -2.5px;
    right: -5px;
  }
}
</style>
