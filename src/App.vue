<template>
<v-app id="app" standalone>
  <v-navigation-drawer
    temporary
    v-model="drawer"
    :mini-variant.sync="mini"
    light
    overflow
    absolute
  >
    <v-list class="pt-0" dense>
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
      right: null
    }
  }
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

</style>
