let customServerBaseUrl
try {
  customServerBaseUrl = window.serverBaseUrl
} catch (e) {
}

const config = {
  isDevelopment: false,
  isCROS: false,
  // follow will be enabled when isCROS
  CROS: {
    CSRFTokenRequired: true,
    updateCSRFTokenIn: 5 * 60 * 1000 // ms
  },
  //
  clientBaseUrl: '/',
  serverBaseUrl: customServerBaseUrl || 'http://dev4.neshmobilog.com:48080/api', // 'http://54.255.227.246:8080/api', // 'http://dev4.neshmobilog.com:48080/api', // 'http://127.0.0.1:8081/api',
  clientLoginUrl: null,
}
switch (process.env.NODE_ENV) {
  case 'production':
    Object.assign(config, {
    })
    break
  case 'development':
    Object.assign(config, {
      isDevelopment: true,
    })
    break
}
export default config
