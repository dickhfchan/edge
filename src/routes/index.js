export default [
  { path: '/datathread', name: 'datathread', component: resolve => require(['../views/Datathread.vue'], resolve) },
  //
  { path: '*', redirect: { name: 'datathread' } }
]
