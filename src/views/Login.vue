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

        <!-- <md-card class="login-card">
          <md-card-header>
            <div class="md-title">{{$t('brand')}}</div>
            <div class="md-subhead">{{$t('loginSubtitle')}}</div>
          </md-card-header>

          <md-card-content>
            <form novalidate @submit.stop.prevent="submit">
              <md-input-container :class="fields.name.getValidationClass()">
                <md-icon>person</md-icon>
                <label>{{fields.name.text}}</label>
                <md-input v-model="fields.name.value" :required="fields.name.required"></md-input>
                <template v-if="fields.name.isValidationErrorsVisible()">
                  <span class="md-error" v-for="error in fields.name.errors">{{error.message}}</span>
                </template>
              </md-input-container>
              <md-input-container md-has-password :class="fields.password.getValidationClass()">
                <md-icon>lock</md-icon>
                <label>{{fields.password.text}}</label>
                <md-input v-model="fields.password.value" type="password" :required="fields.password.required"></md-input>
                <template v-if="fields.password.isValidationErrorsVisible()">
                  <span class="md-error" v-for="error in fields.password.errors">{{error.message}}</span>
                </template>
              </md-input-container>

              <md-input-container>
                <label for="langSelect">{{$t('language')}}</label>
                <md-select name="lang" id="langSelect" v-model="lang">
                  <md-option value="en">{{$t('Englsih')}}</md-option>
                  <md-option value="zh-cn">{{$t('simplifiedChinese')}}</md-option>
                  <md-option value="zh-tw">{{$t('traditionalChinese')}}</md-option>
                </md-select>
              </md-input-container>

              <md-button type="submit" class="md-raised md-primary m-a-0">{{$t('signIn')}}</md-button>
              <div class="m-t grey" v-if="$store.state.builtAt">
                <small>Built at: {{$store.state.builtAt}}</small>
              </div>
            </form>

          </md-card-content>
        </md-card> -->
    </form>
  </div>
</template>
<script>
import DataSource from '../DataSource.js'

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
        const dt = new DataSource()
        dt.type = 'services'
        dt.username = username
        dt.password = password
        dt.onlogin = data => {
          if (data.hasOwnProperty('errc')) {
            window.alert('Login failed')
          } else {
            this.$store.state.user = {
              name: username,
              username,
              info: data
            }
            this.$store.state.authenticated = true
            this.$router.push({name: 'datathread'})
          }
          dt.close()
        }
        dt.connect()
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
