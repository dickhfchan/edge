<template>
  <v-dialog v-model="visible" persistent width="50%">
    <v-card>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <div class="w-100">
                <p>
                  {{note}}
                </p>
                <v-text-field v-model="value"></v-text-field>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1" flat @click.native="cancel">Cancel</v-btn>
        <v-btn class="blue--text darken-1" flat @click.native="ok">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  // components:
  data() {
    return {
      visible: false,
      note: null,
      value: '',
    }
  },
  methods: {
    ok() {
      this.visible = false
      this.resolve(this.value)
    },
    cancel() {
      this.visible = false
      this.reject()
    },
  },
  created() {
    const Vue = this.$root.constructor
    // register prompt
    Vue.prompt = Vue.prototype.$prompt = (note, value) => {
      return new Promise((resolve, reject) => {
        window.setTimeout(() => {
          this.note = note || 'Plesse input'
          this.value = value || ''
          this.visible = true
        }, 100)
        this.resolve = resolve
        this.reject = reject
      })
    }
  },
}
</script>
<style lang="scss">
</style>
