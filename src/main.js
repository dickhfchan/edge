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

// start
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
