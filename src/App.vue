<template>
<v-app id="app" standalone>
  <!-- initialization -->
  <div class="absolute-backdrop center-wrapper" v-if="!$store.state.initialized">
    <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
  </div>
  <!-- initialized -->
  <template v-else>
    <router-view v-if="$route.name==='login'"></router-view>
    <template v-else-if="$store.state.authenticated">
      <v-navigation-drawer
        class="pb-0"
        persistent
        absolute
        height="100%"
        clipped
        enable-resize-watcher
        v-model="drawer"
      >
        <v-list dense>
          <v-list-tile v-for="item in items" :key="item.title" :href="item.route && $router.resolve(item.route).href" @click.prevent="item.route && $router.push(item.route)">
            <v-list-tile-action>
              <v-icon>{{ item.icon || 'panorama_fish_eye' }}</v-icon>
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
         { title: 'Data Thread', route: {name: 'datathread'} },
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
    this.$store.dispatch('init', this)
    //
    const Vue = this.$root.constructor
    // register alert
    Vue.alert = Vue.prototype.$alert = (content) => {
      this.alert.content = content
      this.alert.visible = true
    }
    // register confirm
    Vue.confirm = Vue.prototype.$confirm = (content, title = 'Confirm') => {
      this.confirm.content = content
      this.confirm.visible = true
      return new Promise((resolve, reject) => {
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
html{
  overflow: hidden;
}
body{
  font-family: 'Open Sans', sans-serif;
}

</style>
