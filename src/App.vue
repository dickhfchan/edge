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
    <v-list class="pa-0">
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar>
          <img src="https://randomuser.me/api/portraits/men/85.jpg" />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>John Leider</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon dark @click.native.stop="mini = !mini">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-list class="pt-0" dense>
      <v-divider></v-divider>
      <v-list-tile v-for="item in items" :key="item.title">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
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
         { title: 'Home', icon: 'dashboard' },
         { title: 'About', icon: 'question_answer' }
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
