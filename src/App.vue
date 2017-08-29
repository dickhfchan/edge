<template>
<v-app id="app" standalone toolbar>
  <!-- initialization -->
  <div class="absolute-backdrop center-wrapper" v-if="!$store.state.initialized">
    <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
  </div>
  <!-- initialized -->
  <template v-else>
    <router-view v-if="$route.name==='login'"></router-view>
    <template v-else-if="$store.state.authenticated">
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
        <v-list class="pt-0" dense dark>
          <v-list-tile v-for="item in items" :key="item.title"
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

      <v-toolbar fixed class="cyan" dark>
        <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{$store.state.brand}}</v-toolbar-title>
      </v-toolbar>
      <main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
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
         <v-btn class="yellow--text darken-1" flat="flat" @click.native="confirm.cancel">Cancel</v-btn>
         <v-btn class="green--text darken-1" flat="flat" @click.native="confirm.ok">OK</v-btn>
       </v-card-actions>
     </v-card>
   </v-dialog>
</v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      drawer: null,
      items: [
         { title: 'Data Thread', icon: 'dashboard', route: {name: 'datathread'} },
         { title: 'Global Variable', route: {name: 'globalVariable'} },
         { title: 'Program', route: {name: 'program'} },
      ],
      mini: false,
      right: null,
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
      window.setTimeout(() => {
        this.confirm.content = content
        this.confirm.visible = true
        return new Promise((resolve, reject) => {
          this.confirm.resolve = resolve
          this.confirm.reject = reject
        })
      }, 100)
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
</style>
