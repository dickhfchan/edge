<template>
  <div class="login">
    <form class="card-holder" novalidate @submit.stop.prevent="submit">
        <v-card class="login-card">
         <v-card-title primary-title>
           <div>
             <h3 class="headline mb-1">{{$store.state.brand}}</h3>
             <div class="">{{$store.state.loginSubtitle}}</div>
           </div>
         </v-card-title>
         <v-card-text>
           <v-text-field
              label="User Name"
              v-model="username"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              type="password"
              label="Password"
              v-model="password"
              :rules="[rules.required]"
             ></v-text-field>
           <v-btn primary dark block type="submit">Sign In</v-btn>
         </v-card-text>
       </v-card>
    </form>
  </div>
</template>
<script>
import {addHours} from 'date-functions'
export default {
  // components:
  data() {
    return {
      username: null,
      password: null,
      rules: {
        required: (value) => !!value || 'Required',
      },
    }
  },
  methods: {
    submit() {
      const {username, password} = this
      if (username && password) {
        this.$store.dispatch('login', {username, password}).then(() => {
          const userStore = {
            username,
            password,
            expired_at: addHours(new Date(), this.$store.state.userRemember).getTime(),
          }
          window.localStorage.setItem('user', JSON.stringify(userStore))
          this.$router.push({name: 'datathread'})
        }).catch(() => {
          this.$alert('Login failed')
        })
      }
    }
  },
}
</script>
<style lang="scss">
.login{
  display: flex;
  flex: 1;
  justify-content: center;
  padding-top: 100px;
}
.login-card{
  width: 350px;
}
</style>
