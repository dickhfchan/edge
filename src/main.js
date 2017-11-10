// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// packages
import 'babel-polyfill'
import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import Vuetify from 'vuetify'
// vue-data-validator
import * as VueDataValidator from 'vue-data-validator'
// files
import config from '@/config.js'
import App from './App'
import store from './store/index.js'
import routes from './routes/index.js'
import { initAxios, initVDV, initRouter, registerPreventURLChange } from '@/utils.js'
import LoadingBlock from './components/LoadingBlock.vue'
import DataSource from './DataSource'
//
Vue.config.productionTip = config.isDevelopment
Vue.config.debug = config.isDevelopment
Vue.config.devtools = config.isDevelopment
// axios
initAxios(axios, Vue, store, config)

// Vuetify
Vue.use(Vuetify)

// VDV
initVDV(VueDataValidator, store, Vue)

// router
const router = initRouter(Router, Vue, store, config, routes)

//
registerPreventURLChange(Vue, router)

//
Vue.component('LoadingBlock', LoadingBlock)

// gloabl mixins
Vue.mixin({
  methods: {
    $newService(func) {
      console.log('new services connect, func is follow')
      console.log(func)
      const dt = new DataSource()
      if (!this.datasources) {
        this.datasources = []
      }
      this.datasources.push(dt)

      dt.type = 'services'
      dt.func = func
      return new Promise((resolve, reject) => {
        dt.ongetdata = data => {
          console.log('data is follow')
          console.log(data)
          dt.close()
          //
          const result = data
          if (!result || result.errc > 0) {
            Vue.alert((result && result.errt) || `Failed: ${JSON.stringify(result)}`)
            console.log(result)
            reject(result)
          } else {
            resolve(result)
          }
        }
        dt.connect()
      })
    },
    $newHistoricalData(func, callback) {
      console.log('new historicaldata connect, func is follow')
      console.log(func)
      const dt = new DataSource()
      if (!this.datasources) {
        this.datasources = []
      }
      this.datasources.push(dt)
      dt.type = 'historicaldata'
      dt.func = func
      dt.ongetdata = data => {
        console.log('data is follow')
        console.log(data)
        callback(data)
      }
      dt.connect()
    }
  },
  beforeDestroy() {
    if (this.datasources) {
      this.datasources.forEach(dt => dt.close())
    }
  },
})

// start
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
