<template>
  <v-navigation-drawer
    temporary
    :value="value" @input="$emit('input', $event)"
    :mini-variant="mini"
    overflow
    absolute
    class="sidebar"
  >
    <div class="site-brand">
      {{$store.state.brand}}
    </div>
    <v-list class="pt-0" dense>

      <v-list-group v-for="item in menu" :value="item.active" v-bind:key="item.text" v-if="!item.isAllowed || item.isAllowed()">
        <v-list-tile slot="item" :href="item.route && $router.resolve(item.route).href" @click.prevent="item.route && $router.push(item.route)">
          <v-list-tile-action>
            <v-icon dark>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="item.children && item.children.length">
            <v-icon dark>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <template v-if="item.children && item.children.length">
          <v-list-tile v-for="subItem in item.children" v-bind:key="subItem.text" v-if="!subItem.isAllowed || subItem.isAllowed()" :href="subItem.route && $router.resolve(subItem.route).href" @click.prevent="subItem.route && $router.push(subItem.route)">
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.text }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon dark>{{ subItem.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list-group>

    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    value: {},
  },
  data() {
    return {
      // drawer: false,
      mini: false,
      menu: [
        { text: 'Data Thread', icon: 'dashboard', route: {name: 'datathread'} },
        { text: 'Global Variable', route: {name: 'globalVariable'} },
        { text: 'Program', route: {name: 'program'} },
        { text: 'Timer', route: {name: 'timer'} },
        { text: 'Reports', children: [
          {text: 'Alarm Log'}
        ]},
        { text: 'User', route: {name: 'user'}, isAllowed: () => this.$store.state.user.name === 'root' },
      ],
    }
  }
}
</script>

<style lang="scss">
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
.sidebar.navigation-drawer{
  ul.list{
    background: #00bcd4;
    a.list__tile{
      color: #fff;
    }
  }
}
</style>
