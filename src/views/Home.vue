<template>
  <v-layout row wrap>
    <v-flex xs4>
      <v-select
       v-bind:items="data1.Objects"
       item-text="ObjectName"
       v-model="object"
       label="Object"
       ></v-select>
    </v-flex>
    <v-flex xs4>
      <v-select
      :disabled="!object"
       v-bind:items="object ? object.Items : []"
       item-text="plal"
       v-model="item"
       label="Item"
       ></v-select>
    </v-flex>
    <v-flex xs4 style="align-items:center;">
      {{data1.DateTime}}
    </v-flex>
    <v-flex xs12>
      <v-data-table
          :items="itemRows1"
          hide-actions
          class="elevation-1"
        >
        <template slot="items" scope="props">
          <td class="">{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.value }}</td>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex xs12 class="mt-3">
      <div class="">
        <p>
            PLCComm: {{data2.Status.PLCComm}}
            LineMode: {{data2.Status.LineMode}}
            AlarmStatus: {{data2.Status.AlarmStatus}}
            NoAlarms: {{data2.Status.NoAlarms}}
        </p>
        <v-data-table
          :headers="headers2"
          :items="data2.Status.AlarmDetails"
          hide-actions
          class="elevation-1"
        >
        <template slot="items" scope="props">
          <td>{{ props.item.Category }}</td>
          <td>{{ props.item.AlarmStatus }}</td>
          <td>{{ props.item.AlarmMode }}</td>
          <td>{{ props.item.Comments }}</td>
        </template>
      </v-data-table>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      title: 'Home',
      data1: {
        'TimeStamp': 1502339657000,
        'DateTime': '12:34:17 10 Aug 2017',
        'Objects': [
          {
            'ObjectName': 'temp',
            'Items': [
              {
                'plal': 20,
                'pllm': 40,
                'tact': 0,
                'tout': 0,
                'phlm': 60,
                'phal': 80
              },
              {
                'plal': 20,
                'pllm': 40,
                'tact': 0,
                'tout': 0,
                'phlm': 60,
                'phal': 80
              },
              {
                'plal': 20,
                'pllm': 40,
                'tact': 0,
                'tout': 0,
                'phlm': 60,
                'phal': 80
              },
              {
                'plal': 20,
                'pllm': 40,
                'tact': 0,
                'tout': 0,
                'phlm': 60,
                'phal': 80
              },
              {
                'plal': 20,
                'pllm': 40,
                'tact': 0,
                'tout': 0,
                'phlm': 60,
                'phal': 80
              },
              {
                'plal': 20,
                'pllm': 40,
                'tact': 0,
                'tout': 0,
                'phlm': 60,
                'phal': 80
              }
            ]
          }
        ]
      },
      object: null,
      item: null,
      data2: {
        'TimeStamp': 1502339232000,
        'DateTime': '12:27:12 10 Aug 2017',
        'Status': {
          'PLCComm': 'UP',
          'LineMode': 'AUTO',
          'AlarmStatus': 'UNACKALARMS',
          'NoAlarms': 6,
          'AlarmDetails': [
            {
              'Category': 'alarm',
              'AlarmStatus': 'ON',
              'AlarmMode': 'UNACKALARM',
              'Comments': 'Temperature 1 Alarm'
            },
            {
              'Category': 'alarm',
              'AlarmStatus': 'ON',
              'AlarmMode': 'UNACKALARM',
              'Comments': 'Temperature 2 Alarm'
            },
            {
              'Category': 'alarm',
              'AlarmStatus': 'ON',
              'AlarmMode': 'UNACKALARM',
              'Comments': 'Temperature 3 Alarm'
            },
            {
              'Category': 'alarm',
              'AlarmStatus': 'ON',
              'AlarmMode': 'UNACKALARM',
              'Comments': 'Temperature 4 Alarm'
            },
            {
              'Category': 'alarm',
              'AlarmStatus': 'ON',
              'AlarmMode': 'UNACKALARM',
              'Comments': 'Temperature 5 Alarm'
            },
            {
              'Category': 'alarm',
              'AlarmStatus': 'ON',
              'AlarmMode': 'UNACKALARM',
              'Comments': 'Temperature 6 Alarm'
            }
          ]
        }
      },
    }
  },
  computed: {
    itemRows1() {
      return Object.keys(this.item || {}).map(key => {
        return { name: key, value: this.item[key] }
      })
    },
    headers2() {
      return Object.keys(this.data2.Status.AlarmDetails[0]).map(key => {
        return { text: key, value: key }
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
}
</script>
<style lang="scss">
</style>
