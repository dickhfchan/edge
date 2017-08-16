<template>
  <v-layout row wrap>
    <v-flex>
      <div style="width:200px;" class="mr-3">
        <v-select
        :single-line="true"
         v-bind:items="data1.objects2"
         item-text="displayName"
         v-model="object"
         label="Object"
         ></v-select>
      </div>
      <div style="width:200px;" class="mr-3">
       <v-select
       :disabled="!object"
        v-bind:items="object ? object.Items : []"
        item-text="plal"
        v-model="item"
        label="Item"
        ></v-select>
      </div>
      <div style="align-items:center; padding:18px 0;">
        <div class="" style="height: 30px; display: flex; align-items: flex-end;">
          {{data1.DateTime}}
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
            <td class="">{{ getFldDisplayName1(props.item.name) }}</td>
            <td class="text-xs-right">{{ getFldFormattedValue1(props.item.name, props.item.value) }}</td>
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
  </v-layout>
</template>
<script>
// const websocket = new window.WebSocket('ws://54.255.227.246:7681/', 'configuration')
// websocket.addEventListener('open', (e) => {
//   var j = {func: 1, name: 'root', pass: '1234'}
//   //    var j={func: 1, name:'joey', pass:'joey'};
//   var txt = JSON.stringify(j)
//   this.websocket.send(txt)
// })
// websocket.addEventListener('message', (e) => {
//   console.log(e);
// })
class DataSource {
  wsUri = 'ws://54.255.227.246:7681/';
  websocket;
  connect() {
    this.close()
    const { wsUri } = this
    this.websocket = new window.WebSocket(wsUri, 'datathread')
    // this.websocket2 = new window.WebSocket(wsUri, 'configuration')
    // this.websocket2.addEventListener('message', e => {
    //   console.log(e)
    // })
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

const configuration = {
  'objects': [
    {
      'objno': 1,
      'objitem': 30,
      'objaddr': 'schd',
      'objname': 'Scheduler',
      'objtype': 'scheduler',
      'objdesc': 'Scheduler trigger function',
      'objfield': [ ]
    },
    {
      'objno': 2,
      'objitem': 1,
      'objaddr': 'mach',
      'objname': 'Machine',
      'objtype': 'logical',
      'objdesc': 'Machine Status',
      'objfield': [ ]
    },
    {
      'objno': 5,
      'objitem': 6,
      'objaddr': 'temp',
      'objname': 'Temperature',
      'objtype': 'logical',
      'objdesc': 'Temperature',
      'objfield': [
        {
          'fldsname': 'tmno',
          'fldfname': 'Temperature Number',
          'fldtype': 'longint',
          'fldmodify': 'NN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'UL',
          'fldsubno': 0,
          'flddecim': 0,
          'fldmaxval': 6,
          'fldminval': 1,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'NN',
          'fldunits': ''
        },
        {
          'fldsname': 'tpna',
          'fldfname': 'Temperature Name',
          'fldtype': 'string16',
          'fldmodify': 'NN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': '',
          'fldsubno': 0,
          'flddecim': 0,
          'fldmaxval': 0,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'NN',
          'fldunits': ''
        },
        {
          'fldsname': 'abbr',
          'fldfname': 'Temperature Abbreviation',
          'fldtype': 'string4',
          'fldmodify': 'NN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': '',
          'fldsubno': 0,
          'flddecim': 0,
          'fldmaxval': 0,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'NN',
          'fldunits': ''
        },
        {
          'fldsname': 'plal',
          'fldfname': 'Preset Low Alarm',
          'fldtype': 'dbvar',
          'fldmodify': 'YY',
          'flddbname': 'TEMPPLAL',
          'flddbaddr': '-',
          'flddbrwdi': '-',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YY',
          'fldunits': 'C'
        },
        {
          'fldsname': 'pllm',
          'fldfname': 'Preset Low Limit',
          'fldtype': 'dbvar',
          'fldmodify': 'YY',
          'flddbname': 'TEMPPLLM',
          'flddbaddr': '-',
          'flddbrwdi': '-',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YY',
          'fldunits': 'C'
        },
        {
          'fldsname': 'tact',
          'fldfname': 'Actual Temperature',
          'fldtype': 'dbvar',
          'fldmodify': 'YY',
          'flddbname': 'TEMPTACT',
          'flddbaddr': '-',
          'flddbrwdi': '-',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YY',
          'fldunits': 'C'
        },
        {
          'fldsname': 'tout',
          'fldfname': 'Output Temperature',
          'fldtype': 'dbvar',
          'fldmodify': 'YY',
          'flddbname': 'TEMPTOUT',
          'flddbaddr': 'DM110',
          'flddbrwdi': 'R0',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YY',
          'fldunits': 'C'
        },
        {
          'fldsname': 'phlm',
          'fldfname': 'Preset High Limit',
          'fldtype': 'dbvar',
          'fldmodify': 'YY',
          'flddbname': 'TEMPPHLM',
          'flddbaddr': '-',
          'flddbrwdi': '-',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YY',
          'fldunits': 'C'
        },
        {
          'fldsname': 'phal',
          'fldfname': 'Preset High Alarm',
          'fldtype': 'dbvar',
          'fldmodify': 'YY',
          'flddbname': 'TEMPPHAL',
          'flddbaddr': '-',
          'flddbrwdi': '-',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YY',
          'fldunits': 'C'
        }
      ]
    },
    {
      'objno': 6,
      'objitem': 1,
      'objaddr': 'trpt',
      'objname': 'Report',
      'objtype': 'report',
      'objdesc': 'Temperature Report',
      'objfield': [
        {
          'fldsname': 'hal1',
          'fldfname': 'High Alarm Temperature 1',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hlm1',
          'fldfname': 'High Limit Temperature 1',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'act1',
          'fldfname': 'Actual Temperature 1',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'llm1',
          'fldfname': 'Low Limit Temperature 1',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'lal1',
          'fldfname': 'Low Alarm Temperature 1',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hal2',
          'fldfname': 'High Alarm Temperature 2',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hlm2',
          'fldfname': 'High Limit Temperature 2',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'act2',
          'fldfname': 'Actual Temperature 2',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'llm2',
          'fldfname': 'Low Limit Temperature 2',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'lal2',
          'fldfname': 'Low Alarm Temperature 2',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hal3',
          'fldfname': 'High Alarm Temperature 3',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hlm3',
          'fldfname': 'High Limit Temperature 3',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'act3',
          'fldfname': 'Actual Temperature 3',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'llm3',
          'fldfname': 'Low Limit Temperature 3',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'lal3',
          'fldfname': 'Low Alarm Temperature 3',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hal4',
          'fldfname': 'High Alarm Temperature 4',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hlm4',
          'fldfname': 'High Limit Temperature 4',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'act4',
          'fldfname': 'Actual Temperature 4',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'llm4',
          'fldfname': 'Low Limit Temperature 4',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'lal4',
          'fldfname': 'Low Alarm Temperature 4',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hal5',
          'fldfname': 'High Alarm Temperature 5',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hlm5',
          'fldfname': 'High Limit Temperature 5',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'act5',
          'fldfname': 'Actual Temperature 5',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'llm5',
          'fldfname': 'Low Limit Temperature 5',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'lal5',
          'fldfname': 'Low Alarm Temperature 5',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hal6',
          'fldfname': 'High Alarm Temperature 6',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'hlm6',
          'fldfname': 'High Limit Temperature 6',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'act6',
          'fldfname': 'Actual Temperature 6',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'llm6',
          'fldfname': 'Low Limit Temperature 6',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        },
        {
          'fldsname': 'lal6',
          'fldfname': 'Low Alarm Temperature 6',
          'fldtype': 'longint',
          'fldmodify': 'YN',
          'flddbname': '',
          'flddbaddr': '',
          'flddbrwdi': '',
          'flddbtype': 'L',
          'fldsubno': 0,
          'flddecim': 1,
          'fldmaxval': 1000,
          'fldminval': 0,
          'fldtrendt': '',
          'flddisplt': '',
          'flddtype': 'YN',
          'fldunits': 'C'
        }
      ]
    }
  ],
  'config': [ ],
  'objecttext': [
    {
      'objnotxt': 1,
      'fldidtxt': 'alrm',
      'fldvtype': 'nonzerobit',
      'fldvtext': {
        'itemid': '0',
        'valuetext': {
          'valuec': '0',
          'valuedesc': 'Temperature 1 Alarm',
          'valuewd': '0',
          'valuebt': '0',
          'valuecat': 'alarm'
        },
        'valuetext': {
          'valuec': '1',
          'valuedesc': 'Temperature 2 Alarm',
          'valuewd': '0',
          'valuebt': '1',
          'valuecat': 'alarm'
        },
        'valuetext': {
          'valuec': '2',
          'valuedesc': 'Temperature 3 Alarm',
          'valuewd': '0',
          'valuebt': '2',
          'valuecat': 'alarm'
        },
        'valuetext': {
          'valuec': '3',
          'valuedesc': 'Temperature 4 Alarm',
          'valuewd': '0',
          'valuebt': '3',
          'valuecat': 'alarm'
        },
        'valuetext': {
          'valuec': '4',
          'valuedesc': 'Temperature 5 Alarm',
          'valuewd': '0',
          'valuebt': '4',
          'valuecat': 'alarm'
        },
        'valuetext': {
          'valuec': '5',
          'valuedesc': 'Temperature 6 Alarm',
          'valuewd': '0',
          'valuebt': '5',
          'valuecat': 'alarm'
        }
      }
    }
  ]
}

export default {
  data() {
    return {
      title: 'Home',
      data1: {
        objects2: [],
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
      const r = Object.keys(this.data2.Status.AlarmDetails[0]).map(key => {
        return { text: key, value: key }
      })
      r[0].align = 'left'
      return r
    },
  },
  watch: {
    'data1.Objects': {
      immediate: true,
      handler() {
        this.data1.Objects.forEach(obj => {
          const info = (this.configuration || configuration).objects.find(item => item.objaddr === obj.ObjectName)
          this.$set(obj, 'info', info)
          this.$set(obj, 'displayName', info.objname)
        })
        this.data1.objects2 = this.data1.Objects
      }
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
  },
  methods: {
    getFldDisplayName1(fldName) {
      const fld = this.object.info.objfield.find(item => item.fldsname === fldName)
      return fld.fldfname
    },
    getFldFormattedValue1(fldName, val) {
      const fld = this.object.info.objfield.find(item => item.fldsname === fldName)
      return `${val.toFixed(fld.flddecim)} ${fld.fldunits}`
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
