import Vue from 'vue'
import Vuex from 'vuex'
import config from '../config.js'
import urls from './modules/urls.js'
// import createLogger from '@/../node_modules/vuex/src/plugins/logger.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    urls,
  },
  state: {
    initialized: false,
    builtAt: window.builtAt,
    brand: 'Edge',
  },
  mutations: {
    initialized(state, val) { state.initialized = val },
  },
  actions: {
  },
  strict: config.isDevelopment
  // plugins: config.isDevelopment ? [createLogger()] : []
})
export default store
