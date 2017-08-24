<template>
  <v-layout row wrap>
    <v-flex>
      <div style="width:250px;" class="mr-3">
        <v-select
        :single-line="true"
         v-bind:items="data1.objects"
         item-text="text"
         v-model="object1"
         label="Object"
         ></v-select>
      </div>
      <div style="width:200px;" class="mr-3">
       <v-select
        v-bind:items="object1 ? object1.items : []"
        item-text="text"
        v-model="item1"
        label="Item"
        ></v-select>
      </div>
      <div style="align-items:center; padding:18px 0;">
        <div class="" style="height: 30px; display: flex; align-items: flex-end;">
          <!-- {{data1.DateTime}} -->
        </div>
      </div>
    </v-flex>

    <v-flex xs12>
      <div class="data1" style="width:400px;">
        <v-data-table
            :items="itemRows1"
            hide-actions
            class=""
          >
          <template slot="items" scope="props">
            <td class="">{{props.item.text}}</td>
            <td class="text-xs-right">{{ props.item.value }}</td>
          </template>
        </v-data-table>
      </div>
    </v-flex>

    <v-flex xs12 class="mt-3">
      <div class="w-100">
        <v-data-table
          :headers="headers2"
          :items="data2.Status.AlarmDetails"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" scope="props">
            <td>{{ props.item.Category }}</td>
            <td class="text-xs-right">{{ props.item.AlarmStatus }}</td>
            <td class="text-xs-right">{{ props.item.AlarmMode }}</td>
            <td class="text-xs-right">{{ props.item.Comments }}</td>
          </template>
        </v-data-table>
        <p class="mt-3">
            <span class="mr-5">PLCComm: {{data2.Status.PLCComm}}</span>
            <span class="mr-5">LineMode: {{data2.Status.LineMode}}</span>
            <span class="mr-5">AlarmStatus: {{data2.Status.AlarmStatus}}</span>
            <span class="mr-5">NoAlarms: {{data2.Status.NoAlarms}}</span>
        </p>
      </div>
    </v-flex>

    <div class="absolute-backdrop center-wrapper" v-if="!configuration">
      <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </div>
  </v-layout>
</template>
<script>

class DataSource {
  wsUri = 'ws://54.169.111.193:7681/';
  websocket;
  type = 'datathread'; // datathread/configuration
  connect() {
    this.close()
    const { wsUri } = this
    this.websocket = new window.WebSocket(wsUri, this.type)
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
      const data = JSON.parse(e.data)
      if (this.type === 'datathread') {
        if (i > 1) {
          if (i % 2 === 1) {
            this.ongetdata1 && this.ongetdata1(data)
          } else {
            this.ongetdata2 && this.ongetdata2(data)
          }
        }
        i++
      } else if (this.type === 'configuration') {
        this.ongetdata && this.ongetdata(data)
      }
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
      configuration: null,
      object1: null,
      item1: null,
      cache: {
        data1: {}
      },
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
    data1() {
      const data1 = {}
      const { configuration: config } = this
      if (!config) {
        return {}
      }
      data1.objects = config.objects
      const { objects } = data1
      objects.forEach((obj, objIndex) => {
        // set text
        obj.text = obj.objdesc
        // set fileds
        obj.fileds = obj.objfield.map(fld => {
          return { name: fld.fldsname, text: fld.fldfname }
        })
        // set items
        obj.items = []
        for (let i = 0; i < obj.objitem; i++) {
          obj.items.push({
            text: i + 1,
            data: config.config[objIndex].data[i].datafields,
          })
        }
      })
      this.cache.data1 = data1
      return data1
    },
    itemRows1() {
      try {
        return this.object1.fileds.map(fld => {
          return { text: fld.text, value: this.item1.data[fld.name] }
        })
      } catch (e) {
        return []
      }
    },
    headers2() {
      const r = Object.keys(this.data2.Status.AlarmDetails[0]).map(key => {
        return { text: key, value: key }
      })
      r[0].align = 'left'
      return r
    },
  },
  watch: {
  },
  created() {
    this.configDataSource = new DataSource()
    this.configDataSource.type = 'configuration'
    this.configDataSource.connect()
    this.configDataSource.ongetdata = data => {
      this.configuration = data
      this.configDataSource.close()
      console.log('configuration got')
      console.log(this.configuration)
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  beforeDestroy() {
    this.configDataSource && this.configDataSource.close()
  },
  methods: {
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
