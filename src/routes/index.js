export default [
  { path: '/home', name: 'home', component: resolve => require(['../views/Home.vue'], resolve) },
  //
  { path: '*', redirect: { name: 'home' } }
]
