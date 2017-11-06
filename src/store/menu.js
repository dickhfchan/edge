export default [
  { text: 'Data Thread', icon: 'dashboard', route: {name: 'datathread'} },
  { text: 'Global Variable', route: {name: 'globalVariable'} },
  { text: 'Program', route: {name: 'program'} },
  { text: 'Timer', route: {name: 'timer'} },
  // { text: 'Reports', children: [
  //   {text: 'Alarm Log', route: {name: 'alarmLog'}}
  // ]},
  { text: 'User', route: {name: 'user'}, isAllowed: (store) => store.state.user.name === 'root' },
]
