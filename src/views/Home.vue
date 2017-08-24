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
          {{data1.datetime}}
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

    <v-flex xs12 class="mt-3" v-if="data2">
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

    <div class="absolute-backdrop center-wrapper" v-if="loading">
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
      loading: true,
      configuration: null,
      originData1: null,
      object1: null,
      item1: null,
      cache: {
        data1: {}
      },
      data2: null,
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
    originData1() {
      this.mergeOriginData1ToData1()
    },
    data1() {
      this.mergeOriginData1ToData1()
    },
  },
  created() {
    const configReady = new Promise((resolve, reject) => {
      this.configDataSource = new DataSource()
      this.configDataSource.type = 'configuration'
      this.configDataSource.connect()
      this.configDataSource.ongetdata = data => {
        this.configuration = data
        this.configDataSource.close()
        console.log('configuration got')
        resolve()
      }
    })

    const dataSourceGetOnce = new Promise((resolve, reject) => {
      this.dataSource = new DataSource()
      let data1GetCount = 0
      let data2GetCount = 0
      let resolved = false
      const getOnce = () => data1GetCount > 0 && data2GetCount > 0
      const checkForResolve = () => {
        if (getOnce()) {
          if (!resolved) {
            resolved = true
            resolve()
          }
        }
      }
      this.dataSource.ongetdata1 = data => {
        this.originData1 = data
        data1GetCount++
        checkForResolve()
        console.log('data1 got')
      }
      this.dataSource.ongetdata2 = data => {
        this.data2 = data
        data2GetCount++
        checkForResolve()
        console.log('data2 got')
      }
      this.dataSource.connect()
    })
    Promise.all([configReady, dataSourceGetOnce]).then(() => {
      this.loading = false
    })
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
    mergeOriginData1ToData1() {
      if (!this.data1 || !this.data1.objects) {
        return
      }
      if (!this.originData1) {
        return
      }
      const data = this.data1
      const originData = this.originData1
      this.$set(data, 'timestamp', originData.TimeStamp)
      this.$set(data, 'datetime', originData.DateTime)
      originData.Objects.forEach(item => {
        const obj = data.objects.find(v => v.objaddr === item.ObjectName)
        if (obj) {
          const tempItems = []
          item.Items.forEach((item2, i) => {
            tempItems.push({
              text: i + 1,
              data: item2
            })
          })
          if (JSON.stringify(tempItems) !== JSON.stringify(obj.items)) {
            obj.items = tempItems
          }
        }
      })
    },
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
