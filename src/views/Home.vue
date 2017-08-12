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

class DataSource {
  wsUri = 'ws://54.255.227.246:7681/';
  websocket;
  connect() {
    this.close()
    const { wsUri } = this
    this.websocket = new window.WebSocket(wsUri, 'datathread')
    this.websocket.addEventListener('open', () => {
      var j = {func: 1, name: 'root', pass: '1234'}
    //    var j={func: 1, name:'joey', pass:'joey'};
      var txt = JSON.stringify(j)
      this.websocket.send(txt)
    })
    this.websocket.addEventListener('close', () => {
      console.log('socket closed')
    })
    this.websocket.addEventListener('error', (e) => {
      console.log('socket error')
      throw e
    })
    let i = 0
    this.websocket.addEventListener('message', (e) => {
      if (i > 0) {
        const data = JSON.parse(e.data)
        if (i % 2 === 0) {
          this.ongetdata1 && this.ongetdata1(data)
        } else {
          this.ongetdata2 && this.ongetdata2(data)
        }
      }
      i++
    })
  }
  close() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }
}

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
  created() {
    this.dataSource = new DataSource()
    this.dataSource.connect()
    this.dataSource.ongetdata1 = (data) => {
      if (JSON.stringify(this.data1.Objects) === JSON.stringify(data.Objects)) {
        delete data.Objects
      } else {
        this.object = null
        this.item = null
      }
      Object.assign(this.data1, data)
    }
    this.dataSource.ongetdata2 = (data) => {
      this.data2 = data
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  beforeDestroy() {
    this.dataSource && this.dataSource.close()
  }
}
</script>
<style lang="scss">
</style>
