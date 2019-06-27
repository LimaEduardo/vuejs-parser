<template>
  <div class="elevation-20 generic-component-container">
    <v-flex>
      <h2 class="table-title">{{this.title}}</h2>
    </v-flex>
    <v-divider class="generic-component-divider"/>
    <v-form ref="form">
      <v-container grid-list-xl>
        <v-layout>
          <v-flex v-for="(layout,index) in body" :key=index v-bind="{'layout.layoutSize' : true}">
            <div v-for="field in LayoutFields(layout)" :key="field.label">
              <component :is="field.fieldType" v-model="fieldsValues[field.id]" :label="field.label" :required="field.required" :items="field.items"/>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-divider class="generic-component-divider"/>
    <v-flex xs12>
      <v-layout class="generic-component-actions">
        <v-btn v-for="action in actions" :color="action.color" :key="action.onClick" v-on:click="HandleFunctionCall(action.onClick)" >{{action.label}}</v-btn>
      </v-layout>
    </v-flex>
  </div>
</template>

<script>
import {EventBus} from './EventBus.js'
import { VTextField, VSelect } from 'vuetify/lib'
import axios from 'axios'

import {API_URL} from '../config/config'


export default {
  name: 'GenericComponent',
  components: {
    VTextField,
    VSelect
  },
  props: {
    name: String
  },
  data () {
    return {
      title: '',
      actions: [],
      body: [],
      fieldsValues: {}
    }
  },
  methods: {
    LayoutFields(layout) {
      return layout["layoutContent"]
    },
    HandleFunctionCall(functionName) {
      this[functionName]()
    },
    SayHello(){
      console.log("HelloWorld")
    },
    Cancel(){
      EventBus.$emit("CANCEL-ACTION", {})
    },
    SendReq(){
      const url = `${API_URL}`+ this.endpoint
      const reqBody = this.fieldsValues
      console.log(url)
      console.log(reqBody)
      // axios.post(url, reqBody).then((response) => {
      //   console.log("reponse")
      //   //Emitir mensagem de sucesso para o usuário
      // }).catch((error) => {
      //   console.log(error)
      //   //Emitir mensagem de erro para o usuário
      // })
    }
  },
  created() {
    let pagefile = require(`./componentsInfo/${this.name}.json`)
    this.title = pagefile["title"]
    this.actions = pagefile["actions"]
    this.body = pagefile["body"]
    this.endpoint = pagefile["endpoint"]

    this.body.forEach((element) => {
      element['layoutContent'].forEach((content) => {
        this.fieldsValues[content.id] = null
      })
    })
  },
  mounted() {
  },
}
</script>

<style>
  .table-title {
    text-align: center;
  }
  .generic-component-actions{
    display: flex;
    justify-content: center;
  }

  .generic-component-container{
    padding: 30px;
  }

  .generic-component-divider{
    margin-top: 20px;
    margin-bottom: 20px
  }

</style>