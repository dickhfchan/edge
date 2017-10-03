export default [
  { path: '/login', name: 'login', component: resolve => require(['../views/Login.vue'], resolve) },
  { path: '/datathread', name: 'datathread', component: resolve => require(['../views/Datathread.vue'], resolve) },
  { path: '/globalVariable', name: 'globalVariable', component: resolve => require(['../views/GlobalVariable.vue'], resolve) },
  { path: '/program', name: 'program', component: resolve => require(['../views/Program.vue'], resolve) },
  { path: '/timer', name: 'timer', component: resolve => require(['../views/Timer.vue'], resolve) },
  { path: '/user', name: 'user', component: resolve => require(['../views/User.vue'], resolve) },
  //
  { path: '*', redirect: { name: 'datathread' } }
]
