import Vue from 'vue'
import Vuex from 'vuex'
// import config from '../config.js'
import urls from './modules/urls.js'
// import createLogger from '@/../node_modules/vuex/src/plugins/logger.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    urls,
  },
  state: {
    initialized: false,
    user: null,
    authenticated: false,
    builtAt: window.builtAt,
    brand: 'Edge',
    loginSubtitle: 'Sign in to start your session',
  },
  mutations: {
    initialized(state, val) { state.initialized = val },
  },
  actions: {
    async init({dispatch, commit, state}, vm) {
      // router ready
      await new Promise((resolve, reject) => {
        vm.$router.onReady(resolve)
      })
      vm.$router.push({name: 'login'})
      state.initialized = true
    },
    logout({commit, state}) {
      state.authenticated = false
      state.user = null
    },
  },
  // strict: config.isDevelopment
  // plugins: config.isDevelopment ? [createLogger()] : []
})
export default store
