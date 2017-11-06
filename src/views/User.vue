<template>
  <v-layout row wrap class="use view-page ma-3">
    <v-flex xs12 class="mb-1 flex-align-center">
      <v-btn class="ml-0" @click="newItem">New</v-btn>
    </v-flex>
    <v-flex xs12>
      <Datatable
        :headers="headers"
        :items="rows"
        class="elevation-1"
      >
        <tbody slot="tbody">
          <tr v-for="(row, i) in rows">
            <td v-for="col in headers" class="text-xs-left">
              <template v-if="col.value !== 'actions'">
                {{row[col.value]}}
              </template>
              <template v-else>
                <v-btn error small class="" @click="remove(row, i)">
                  Remove
                </v-btn>
                <v-progress-circular v-if="row.removing" indeterminate class="primary--text" :size="20"></v-progress-circular>

                <v-btn small class="ml-0" @click="edit(row, i)">
                  Edit
                </v-btn>
              </template>
            </td>
          </tr>
        </tbody>
      </Datatable>
    </v-flex>

    <!-- user add and edit dialog -->
    <v-dialog v-model="userForm.visible" persistent content-class="userFormDialog">
      <v-card>
        <v-card-title>
          <span class="headline">{{userForm.mode==='add'?'Add':'Edit'}} User</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="User Name" required v-model="userForm.data.name" :rules="[rules.required]" :disabled="userForm.mode==='edit'"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password" required v-model="userForm.data.password" :rules="[rules.required]"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Confirm Password" type="password" required v-model="userForm.data.confirmPassword" :rules="[rules.required]"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Timeout" type="number" required v-model="userForm.data.timeout" :rules="[rules.required]"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-bind:items="userLevelsArr"
                  v-model="userForm.data.allowedLevel"
                  item-text="text"
                  item-value="value"
                  multiple
                  label="Allowed level"
                  bottom
                ></v-select>
              </v-flex>
              <!-- <v-flex xs12>
                <v-select
                  v-bind:items="userLevelsArr"
                  v-model="userForm.data.noOfAllowedLevel"
                  :rules="[rules.required]"
                  item-text="text"
                  item-value="value"
                  label="No of allowed level"
                  bottom
                ></v-select>
              </v-flex> -->
              <v-flex xs12>
                <v-select
                  v-bind:items="userLevelsArrDefault"
                  v-model="userForm.data.defaultLevel"
                  :rules="[rules.required]"
                  item-text="text"
                  item-value="value"
                  label="Default level"
                  bottom
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-progress-circular v-if="saving" indeterminate class="primary--text" :size="20"></v-progress-circular>
          <v-btn class="blue--text darken-1" flat @click.native="userForm.visible = false">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>
<script>
import DataSource from '@/DataSource'
import Datatable from '../components/Datatable.vue'
import { newService } from '@/utils.js'

export default {
  components: { Datatable },
  data() {
    const userLevels = this.$store.state.userLevels
    const userLevelsArr = []
    for (var key in userLevels) {
      userLevelsArr.push({
        value: parseInt(key),
        text: userLevels[key],
      })
    }
    return {
      title: 'User',
      loading: true,
      rows: [],
      headers: [
        {text: 'Name', value: 'name', align: 'left', sortAble: false},
        {text: 'Actions', value: 'actions', align: 'left', sortAble: false},
      ],
      saving: false,
      succeeded: false,
      userLevels,
      userLevelsArr,
      userForm: {
        mode: null,
        visible: false,
        data: {},
      },
      rules: {
        required: (value) => !!value || 'Required',
      },
    }
  },
  computed: {
    userLevelsArrDefault() {
      try {
        return this.userLevelsArr.filter(v => this.userForm.data.allowedLevel.includes(v.value))
      } catch (e) {
        return []
      }
    },
  },
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      document.title = this.title
    })
  },
  methods: {
    getData() {
      newService({func: 4}).then(data => {
        this.rows = data.user.map(name => {
          return {name, removing: false}
        })
      })
    },
    newItem() {
      this.userForm.mode = 'add'
      this.userForm.visible = true
      this.userForm.data = {
        name: '',
        timeout: '0',
        password: '',
        confirmPassword: '',
        defaultLevel: null,
        allowedLevel: [],
      }
    },
    edit(row, i) {
      newService({func: 5, name: row.name}).then(data => {
        this.userForm.mode = 'edit'
        this.userForm.visible = true
        this.userForm.data = {
          name: data.usrn,
          timeout: data.tout.toString(),
          password: '',
          confirmPassword: '',
          defaultLevel: data.defl.toString(),
          // noOfAllowedLevel: data.nalw.toString(),
          allowedLevel: data.alwl.map(v => v.toString()),
        }
      })
    },
    save() {
      if (this.saving) {
        return
      }
      const input = this.userForm.data
      const {mode} = this.userForm
      let valid = true
      for (var key in input) {
        if (input[key] == null || input[key] === '') {
          valid = false
          break
        }
      }
      if (!valid) {
        this.$alert('Required field can\'t be empty')
        return
      }
      if (input.password !== input.confirmPassword) {
        this.$alert('The password confirmation does not match')
        return
      }
      this.saving = true
      const data = {func: 6, cusr: mode === 'add' ? 1 : 0, name:input.name, pass: input.password, tout: parseInt(input.timeout),
        defl: parseInt(input.defaultLevel), nalw: input.allowedLevel.length, alwl: input.allowedLevel.map(v => parseInt(v))
      }
      newService(data).then(result => {
        if (!result || result.errc > 0) {
          this.$alert((result && result.errt) || `Save failed: ${JSON.stringify(result)}`)
          console.log(result)
        } else {
          this.userForm.visible = false
          this.getData()
        }
        this.saving = false
      })
    },
    remove(row, i) {
      this.$confirm('Are you sure to remove the user?').then(() => {
        row.removing = true
        newService({func: 7, name: row.name}).then(() => {
          row.removing = false
          this.rows.splice(i, 1)
        })
      })
    },
  },
}
</script>
<style lang="scss">
.user.view-page{

}
.userFormDialog{
  width: 90%!important;
  max-width: 600px!important;
}
</style>
