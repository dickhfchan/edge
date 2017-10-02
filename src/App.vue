<template>
<v-app id="app" standalone toolbar class="flex flex-col">
  <!-- initialization -->
  <div class="absolute-backdrop center-wrapper" v-if="!$store.state.initialized">
    <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
  </div>
  <!-- initialized -->
  <template v-else>
    <router-view v-if="$route.name==='login'"></router-view>
    <template v-else-if="$store.state.authenticated">
      <!-- menu with sub menu -->
      <!-- <v-navigation-drawer
         v-model="drawer"
         :mini-variant="mini"
         overflow
         absolute
      >
        <v-list dense>
          <v-list-tile v-if="mini" @click.native.stop="mini = !mini">
            <v-list-tile-action>
              <v-icon light>chevron_right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" />
            </v-list-tile-avatar>
          </v-list-title>
          <v-list-tile v-for="item in items" :key="item.title" :href="item.route && $router.resolve(item.route).href" @click.prevent="item.route && $router.push(item.route)">
            <v-list-tile-action>
              <v-icon>{{ item.icon || 'panorama_fish_eye' }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer> -->
      <!-- left sidebar -->
      <v-navigation-drawer
        temporary
        v-model="drawer"
        :mini-variant="mini"
        overflow
        absolute
        class="sidebar"
      >
        <div class="site-brand">
          {{$store.state.brand}}
        </div>
        <v-list class="pt-0" dense>
          <v-list-tile v-for="item in items" :key="item.title" v-if="!item.isAllowed || item.isAllowed()"
            :href="item.route && $router.resolve(item.route).href" @click.prevent="item.route && $router.push(item.route)"
          >
            <v-list-tile-action>
              <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <!-- right sidebar -->
      <v-navigation-drawer
        temporary
        v-model="rightDrawer"
        light
        overflow
        absolute
        right
        class="right-sidebar"
      >
        <v-toolbar class="cyan">
          <v-icon>person</v-icon>
          <v-toolbar-title class="white--text">Profile</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="rightDrawer=false">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="pa-3">
          <div class="user-info">
            <b>Name</b> <span>{{state.user.username}}</span>
            <br>
            <b>Default level</b> <span>{{userLevels[state.user.info.defl]}}</span>
            <br>
            <b>Allowed level</b> <span>{{state.user.info.alwl.map(v => v.atxt).join(', ')}}</span>
          </div>
          <div class="">
            <v-btn light class="ml-0" @click.native.stop="changePasswordVisible=!changePasswordVisible">Change Password</v-btn>
          </div>
          <form @submit.prevent="changePassword" class="change-password" v-show="changePasswordVisible">
            <v-text-field
              type="password"
              label="Old Password"
              v-model.trim="oldPassword"
              :rules="[rules.required]"
             ></v-text-field>
             <v-text-field
               type="password"
               label="New Password"
               v-model.trim="newPassword"
               :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                type="password"
                label="Confirm New Password"
                v-model.trim="newPassword2"
                :rules="[rules.required]"
               ></v-text-field>
               <v-btn primary dark class="ml-0" type="submit">Save</v-btn>
          </form>
           <div class="">
             <v-btn warning dark class="ml-0" @click.native="logout">Logout</v-btn>
           </div>
        </div>
      </v-navigation-drawer>

      <v-toolbar fixed class="cyan" dark>
        <v-toolbar-side-icon @click.native.stop="drawer=!drawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{$store.state.brand}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat @click.native.stop="rightDrawer=!rightDrawer">{{state.user.username}}</v-btn>
      </v-toolbar>
      <main class="flex-1">
        <router-view></router-view>
      </main>
    </template>
  </template>
  <!-- alert -->
  <v-dialog v-model="alert.visible" lazy absolute>
    <v-card>
      <v-card-text>{{alert.content}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat class="green--text darken-1" @click.native="alert.visible = false">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- confirm -->
  <v-dialog v-model="confirm.visible" lazy absolute>
     <v-card>
       <v-card-title>
         <div class="headline">{{confirm.title}}</div>
       </v-card-title>
       <v-card-text>{{confirm.content}}</v-card-text>
       <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn class="orange--text darken-1" flat="flat" @click.native="confirm.cancel">Cancel</v-btn>
         <v-btn class="teal--text darken-1" flat="flat" @click.native="confirm.ok">OK</v-btn>
       </v-card-actions>
     </v-card>
   </v-dialog>
   <!-- prompt -->
   <Prompt></Prompt>
</v-app>
</template>

<script>
import {newService} from '@/utils.js'
import Prompt from '@/components/Prompt'

export default {
  name: 'app',
  components: {Prompt},
  data () {
    return {
      drawer: false,
      rightDrawer: false,
      items: [
        { title: 'Data Thread', icon: 'dashboard', route: {name: 'datathread'} },
        { title: 'Global Variable', route: {name: 'globalVariable'} },
        { title: 'Program', route: {name: 'program'} },
        { title: 'User', route: {name: 'user'}, isAllowed: () => this.$store.state.user.name === 'root' },
      ],
      mini: false,
      right: null,
      // right sidebar
      userLevels: this.$store.state.userLevels,
      changePasswordVisible: false,
      oldPassword: null,
      newPassword: null,
      newPassword2: null,
      rules: {
        required: (value) => !!value || 'Required',
      },
      // globale
      alert: {
        visible: false,
        content: null,
      },
      confirm: {
        visible: false,
        title: null,
        content: null,
        cancel() {
          this.visible = false
          this.reject()
        },
        ok() {
          this.visible = false
          this.resolve()
        },
      }
    }
  },
  computed: {
    state() { return this.$store.state },
  },
  methods: {
    logout() {
      window.localStorage.removeItem('user')
      this.state.authenticated = null
      this.$router.push({name: 'login'})
      this.state.user = null
    },
    changePassword() {
      const {oldPassword, newPassword, newPassword2} = this
      if (!oldPassword || !newPassword || !newPassword2) {
        this.$alert('Required field can\'t be empty')
        return
      }
      if (newPassword !== newPassword2) {
        this.$alert('The password confirmation does not match')
        return
      }
      newService({func: 3, name: this.$store.state.user.username, pass: oldPassword, npwd: newPassword}).then(r => {
        console.log(r)
        if (r.err > 0) {
          this.$alert('The change password operation failed')
        } else {
          this.$alert('The password is successfully changed')
          this.changePasswordVisible = false
          this.oldPassword = null
          this.newPassword = null
          this.newPassword2 = null
          const userStore = {
            username: this.state.user.username,
            password: newPassword,
          }
          window.localStorage.setItem('user', JSON.stringify(userStore))
        }
      })
    },
  },
  created() {
    // init
    const t = window.localStorage.getItem('user')
    const user = t && JSON.parse(t)
    const goLoginPage = () => {
      if (this.$route.name !== 'login') {
        this.$router.push({name: 'login'})
      }
    }
    let prm
    if (this.$route.name === 'login') {
      prm = Promise.resolve()
    } else {
      prm = user ? this.$store.dispatch('login', user) : Promise.reject(new Error('no user info'))
    }
    prm.catch(() => {
      goLoginPage()
    }).then(() => {
      this.$store.state.initialized = true
    })
    //
    const Vue = this.$root.constructor
    // register alert
    Vue.alert = Vue.prototype.$alert = (content) => {
      window.setTimeout(() => {
        this.alert.content = content
        this.alert.visible = true
      }, 100)
    }
    // register confirm
    Vue.confirm = Vue.prototype.$confirm = (content, title = 'Confirm') => {
      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          this.confirm.content = content
          this.confirm.visible = true
        }, 100)
        this.confirm.resolve = resolve
        this.confirm.reject = reject
      })
    }
  },
}
</script>

<style lang="scss">
// <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
// <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">
@import "../node_modules/material-design-icons/iconfont/material-icons.css";
@import "../node_modules/vuetify/dist/vuetify.min.css";
@import "./assets/css/layer.scss";
@import "./assets/css/helper.scss";
// font
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
body{
  font-family: 'Open Sans', sans-serif;
}
.application--light .navigation-drawer.sidebar{
  background-color: #00bcd4;
}
.sidebar{
  .site-brand{
    text-align: center;
    font-size: 40px;
    padding: 20px 0;
    background-color: #fff;
  }
  .list__tile__title{
    font-size: 15px;
  }
}


html{
  overflow: hidden;
}
html, body, #app{
  width: 100%;
  height: 100%;
}
#app{
  > .toolbar{
    position: relative;
  }
  > main{
    padding: 0;
    overflow: auto;
  }
}
.sidebar.navigation-drawer{
  ul.list{
    background: #00bcd4;
    a.list__tile{
      color: #fff;
    }
  }
}
.right-sidebar{
  .toolbar{
    .icon, .btn__content .icon{
      color: #fff;
    }
  }
  .user-info{
    line-height: 28px;
    b{
      margin-right: 16px;
    }
    span{
    }
  }
  form.change-password{
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin: 16px 0;
    padding-bottom: 16px;
  }
}
</style>
