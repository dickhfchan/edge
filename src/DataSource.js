export default class DataSource {
  wsUri = 'ws://54.169.111.193:7681/';
  websocket;
  type = 'datathread'; // datathread/configuration
  func; // for services
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
      switch (this.type) {
        case 'datathread':
          if (i > 1) {
            if (i % 2 === 1) {
              this.ongetdata1 && this.ongetdata1(data)
            } else {
              this.ongetdata2 && this.ongetdata2(data)
            }
          }
          break
        case 'configuration':
          this.ongetdata && this.ongetdata(data)
          break
        case 'services':
          if (i === 0) {
            var txt1 = JSON.stringify(this.func)
            this.send(txt1)
          } else if (i === 1) {
            this.ongetdata && this.ongetdata(data)
          }
          break
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
  send(msg) {
    return this.websocket.send(msg)
  }
}
