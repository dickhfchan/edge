export default [
  { path: '/datathread', name: 'datathread', component: resolve => require(['../views/Datathread.vue'], resolve) },
  { path: '/globalVariable', name: 'globalVariable', component: resolve => require(['../views/GlobalVariable.vue'], resolve) },
  //
  { path: '*', redirect: { name: 'datathread' } }
]
