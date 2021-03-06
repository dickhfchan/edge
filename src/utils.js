import { titleCase, studlyCase } from 'helper-js'
import Vue from 'vue'
import DataSource from './DataSource.js'

export function initAxios(axios, Vue, store, config) {
  const axiosInstance = axios.create({
    baseURL: store.state.urls.server.base,
    timeout: 20000, // 20 seconds
    // withCredentials: config.isCROS
  })
  Vue.Axios = axios
  Vue.http = Vue.prototype.$http = axiosInstance
}

export function initVDV(VueDataValidator, store, Vue) {
  Vue.use(VueDataValidator.validator)
  Object.assign(Vue.validator.rules, VueDataValidator.rules)
  Object.assign(Vue.validator.messages, VueDataValidator.enMessages)
  Vue.validator.validClass = 'valid'
  Vue.validator.invalidClass = 'md-input-invalid'
}

export function initRouter(Router, Vue, store, config, routes) {
  Vue.use(Router)
  const router = new Router({
    mode: 'history',
    base: config.clientBaseUrl,
    routes
  })
  return router
}

export function axiosNamedPost(name, url, query) {
  if (!this._axiosNamedPostStore) {
    this._axiosNamedPostStore = {}
  }
  // cancel prev request
  if (this._axiosNamedPostStore[name]) {
    this._axiosNamedPostStore[name]()
    delete this._axiosNamedPostStore[name]
  }
  // CancelToken
  const Axios = this.$root.constructor.Axios
  const CancelToken = Axios.CancelToken
  return this.$http.post(url, query, {
    cancelToken: new CancelToken((c) => {
      this._axiosNamedPostStore[name] = c
    })
  })
}

export function initColumns(vm, columns) {
  // auto generate column display name
  for (const col of columns) {
    if (!col.text) {
      vm.$set(col, 'text', titleCase(col.name))
    }
    if (col.visible == null) {
      vm.$set(col, 'visible', true)
    }
    if (col.sortAble == null) {
      vm.$set(col, 'sortAble', true)
    }
    if (col.type == null) {
      vm.$set(col, 'type', 'default')
    }
    // if (!col.width) {
    //   const len = col.text.length
    //   vm.$set(col, 'width', `${len > 3 ? (100 + (len - 6) * 5) : '60'}px`)
    // }
  }
}

export function initRows(vm, rows, columns, table) {
  if (table) {
    if (table.sortBy) {
      sortRows({name: table.sortBy, type: table.sortType}, rows, columns)
    }
  }
  for (const row of rows) {
    if (row.visible == null) {
      vm.$set(row, 'visible', true)
    }
    if (row.checked == null) {
      vm.$set(row, 'checked', false)
    }
    for (const col of columns) {
      if (col.valueProcessor) {
        row[col.name] = col.valueProcessor({value: row[col.name], column: col, row, rows})
      }
    }
  }
}

export function getRowData(row, cols) {
  const item = {}
  cols.forEach(col => {
    item[col.name] = row[col.name]
  })
  return item
}

export function sortRows(event, rows, columns) {
  const col = columns.find(col => col.name === event.name)
  const sortBy = col.sortBy || event.name
  if (col.locale) {
    rows.sort((a, b) => (a[sortBy] || '').substr(1).localeCompare((b[sortBy] || '').substr(1)))
  } else {
    rows.sort((a, b) => {
      const aa = a[sortBy]
      const bb = b[sortBy]
      if (aa < bb) {
        return -1
      } else if (aa === bb) {
        return 0
      } else {
        return 1
      }
    })
  }
  if (event.type === 'desc') {
    rows.reverse()
  }
}

export function generateExcel(JSONData, FileName, ShowLabel) {
  // 先转化json
  var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData
  var excel = '<table>'
  // 生成表头
  var row = '<tr>'
  for (let i = 0; i < ShowLabel.length; i++) {
    row += '<td>' + ShowLabel[i] + '</td>'
  }
  excel += row + '</tr>'
  // 循环生成表身
  for (let i = 0; i < arrData.length; i++) {
    row = '<tr>'
    for (var j in arrData[i]) {
      //                    var name = arrData[i][index].name === "." ? "" : arrData[i][index].name;
      var td = arrData[i][j]
      row += '<td>' + td + '</td>'
    }
    excel += row + '</tr>'
  }
  excel += '</table>'
  var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>"
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel'
  excelFile += '; charset=UTF-8">'
  excelFile += '<head>'
  excelFile += '<!--[if gte mso 9]>'
  excelFile += '<xml>'
  excelFile += '<x:ExcelWorkbook>'
  excelFile += '<x:ExcelWorksheets>'
  excelFile += '<x:ExcelWorksheet>'
  excelFile += '<x:Name>'
  excelFile += 'sheet'
  excelFile += '</x:Name>'
  excelFile += '<x:WorksheetOptions>'
  excelFile += '<x:DisplayGridlines/>'
  excelFile += '</x:WorksheetOptions>'
  excelFile += '</x:ExcelWorksheet>'
  excelFile += '</x:ExcelWorksheets>'
  excelFile += '</x:ExcelWorkbook>'
  excelFile += '</xml>'
  excelFile += '<![endif]-->'
  excelFile += '</head>'
  excelFile += '<body>'
  excelFile += excel
  excelFile += '</body>'
  excelFile += '</html>'
  var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile)
  var link = document.createElement('a')
  link.href = uri
  link.style = 'visibility:hidden'
  link.download = FileName + '.xls'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * [newDate description]
 * @param  {[type]} str [format: yyyy-MM-dd HH:mm:ss]
 * @return [type]       [description]
 */
export function newDate(str) {
  const t = str.split(' ')
  const args = t[0].split('-').map(v => parseInt(v))
  args[1]-- // convert month to 0 -11
  t[1].split(':').forEach(v => { args.push(parseInt(v)) })
  return new Date(...args)
}

export function sortRowsByProp(rows, prop) {
  rows.sort((a, b) => {
    const aProp = a[prop]
    const bProp = b[prop]
    if (aProp < bProp) {
      return -1
    }
    if (aProp > bProp) {
      return 1
    }
    // equal
    return 0
  })
}

export function exportExcel(rows, columns, title) {
  const cols = columns.filter(col => col.exportAble !== false && col.visible !== false)
  const data = rows.map(row => {
    const r = []
    cols.forEach(col => {
      const val = row[col.name]
      r.push(col.formatter ? col.formatter(val) : val)
    })
    return r
  })
  const titleLabels = cols.map(col => col.text)
  generateExcel(data, title, titleLabels)
}

// http
const storeOfCancelOldRequest = {}
export function cancelOldRequest(name) {
  const cancel = storeOfCancelOldRequest[name]
  if (cancel) {
    cancel()
    delete storeOfCancelOldRequest[name]
  }
}
export function namedHttpGet(name, url, options0) {
  cancelOldRequest(name)
  const CancelToken = Vue.Axios.CancelToken
  const http = Vue.http
  const options = Object.assign({}, options0 || {})
  options.cancelToken = new CancelToken((c) => { storeOfCancelOldRequest[name] = c })
  return http.get(url, options)
}

export function registerPreventURLChange(Vue, router) {
  let preventRouter = false
  const msg0 = `It looks like you have been editing something.
If you leave before saving, your changes will be lost.`
  let msg
  router.beforeEach((to, from, next) => {
    if (preventRouter) {
      if (window.confirm(msg || msg0)) {
        Vue.allowURLChange()
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  })
  const beforeunload = (e) => {
    var confirmationMessage = msg || msg0
    e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    return confirmationMessage;              // Gecko, WebKit, Chrome <34
  }
  Vue.preventURLChange = Vue.prototype.$preventURLChange = (msg2) => {
    if (msg2 != null) {
      msg = msg2
    }
    if (!preventRouter) {
      preventRouter = true
      window.addEventListener("beforeunload", beforeunload)
    }
  }
  Vue.allowURLChange = Vue.prototype.$allowURLChange = () => {
    preventRouter = false
    window.removeEventListener("beforeunload", beforeunload)
  }
}
export function secondsFormat (seconds) {
  const m0 = seconds / 60
  const h = Math.floor(m0 / 60)
  const m = Math.floor(m0 % 60)
  const hh = h < 10 ? `0${h}` : h.toString()
  const mm = m < 10 ? `0${m}` : m.toString()
  return `${hh}:${mm}`
}

export function timeToSeconds (time) {
  const [h, m] = time.split(':')
  return h * 3600 + m * 60
}
export function minutesFormat (mins) {
  const h = Math.floor(mins / 60)
  const m = Math.floor(mins % 60)
  const hh = h < 10 ? `0${h}` : h.toString()
  const mm = m < 10 ? `0${m}` : m.toString()
  return `${hh}:${mm}`
}

export function timeToMinutes (time) {
  const [h, m] = time.split(':').map(v => parseInt(v))
  return h * 60 + m
}

export const numDayMapping = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
}

export function numToDay(num) {
  return numDayMapping[num.toString()]
}

export function dayToNum(day) {
  for (const key in numDayMapping) {
    if (numDayMapping[key] === day) {
      return key
    }
  }
}

export function cloneObjByKeys(obj, keys) {
  const r = {}
  for (const key of keys) {
    r[key] = obj[key]
  }
  return r
}

export const monthDetails = {
  "Jan": {
    "name": "January",
    "short": "Jan",
    "number": 1,
    "days": 31
  },
  "Feb": {
    "name": "February",
    "short": "Feb",
    "number": 2,
    "days": 28
  },
  "Mar": {
    "name": "March",
    "short": "Mar",
    "number": 3,
    "days": 31
  },
  "Apr": {
    "name": "April",
    "short": "Apr",
    "number": 4,
    "days": 30
  },
  "May": {
    "name": "May",
    "short": "May",
    "number": 5,
    "days": 31
  },
  "Jun": {
    "name": "June",
    "short": "Jun",
    "number": 6,
    "days": 30
  },
  "Jul": {
    "name": "July",
    "short": "Jul",
    "number": 7,
    "days": 31
  },
  "Aug": {
    "name": "August",
    "short": "Aug",
    "number": 8,
    "days": 31
  },
  "Sep": {
    "name": "September",
    "short": "Sep",
    "number": 9,
    "days": 30
  },
  "Oct": {
    "name": "October",
    "short": "Oct",
    "number": 10,
    "days": 31
  },
  "Nov": {
    "name": "November",
    "short": "Nov",
    "number": 11,
    "days": 30
  },
  "Dec": {
    "name": "December",
    "short": "Dec",
    "number": 12,
    "days": 31
  }
}

export function numToMon(num) {
  return Object.values(monthDetails)[num - 1].name
}

export function monToNum(name) {
  const reg = new RegExp(name, 'i')
  let i = 0
  for (const item of Object.values(monthDetails)) {
    if (item.name.search(reg) === 0) {
      return i + 1
    }
    i++
  }
}

export function compareNumberArray(a1, a2) {
  const len = a1.length > a2.length ? a1.length : a2.length
  for (let i = 0; i < len; i++) {
    const n1 = a1[i] || 0
    const n2 = a2[i] || 0
    if (n1 !== n2) {
      return n1 - n2
    }
  }
  return 0
}

// format: 2017-11-24 00:56
export function resolveDate(date) {
  date = date || ''
  const r = {
    year: date.substr(0, 4),
    month: date.substr(5, 2),
    date: date.substr(8, 2),
    hour: date.substr(11, 2),
    minute: date.substr(14, 2),
  }
  for (const key in r) {
    r[key] = parseInt(r[key])
  }
  return r
}
