import Vue from 'vue'
import Vuex from 'vuex'
// import config from '../config.js'
import urls from './modules/urls.js'
import menu from './menu'
// import createLogger from '@/../node_modules/vuex/src/plugins/logger.js'
import DataSource from '../DataSource.js'
import {addHours} from 'date-functions'

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
    menu,
    brand: 'Neuron',
    loginSubtitle: 'Sign in to start your session',
    rules: {
      required: value => (value == null || value === '') ? 'Required' : true,
    },
    userLevels: {
      '0': ' VIEW',
      '1': ' OPERATOR',
      '2': ' DATA ENTRY',
      '3': ' MAINTENANCE',
      '4': ' SUPERVISOR',
      '5': ' ENGINEER',
      '6': ' DESIGNER',
      '7': ' MANAGER',
      '-1': ' ALL'
    },
    userRemember: 8, // hours
    datepickerOption: {
      type: 'min',
      week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      format: 'YYYY-MM-DD HH:mm'
    },
  },
  mutations: {
    initialized(state, val) { state.initialized = val },
  },
  actions: {
    login({state}, {username, password}) {
      return new Promise((resolve, reject) => {
        const dt = new DataSource()
        dt.type = 'services'
        dt.username = username
        dt.password = password
        dt.onlogin = data => {
          if (data.hasOwnProperty('errc')) {
            reject(new Error('login failed'))
          } else {
            state.user = {
              name: username,
              username,
              info: data
            }
            state.authenticated = true
            resolve(data)
          }
          dt.close()
        }
        dt.connect()
      })
    },
    autoExtendUserRememberTime({state}) {
      const obj = JSON.parse(window.localStorage.getItem('user'))
      const t = state.userRemember * 3600 * 1000
      if (obj.expired_at - new Date().getTime() < t) {
        obj.expired_at = addHours(new Date(), state.userRemember).getTime()
        window.localStorage.setItem('user', JSON.stringify(obj))
      }
    },
  },
  // strict: config.isDevelopment
  // plugins: config.isDevelopment ? [createLogger()] : []
})
export default store
