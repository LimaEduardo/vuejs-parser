<template>
    <v-layout>
      <v-navigation-drawer
        v-model="openMenu"
        absolute
        temporary
        clipped
        class="text-xs-center blue darken-3"

      >
        <v-expansion-panel class="full-height">
            <v-expansion-panel-content
              v-for="(item,i) in items"
              :key="i"
              hide-actions
              class="blue darken-3 "
            >
            <template v-slot:header>
              <v-btn flat big class="white--text ">{{item.title}}</v-btn>
            </template>
            <v-card class="blue darken-2 text-xs-center">
              <div v-for="(child, ic) in item.child" :key="ic">
                <v-btn flat big class="white--text " @click="callViewList(item.title, child, item.render)">{{child}}</v-btn>
              </div>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-navigation-drawer>
    </v-layout>
</template>

<script>
import {EventBus} from './EventBus.js'


export default {
  name: 'Drawer',
  components: {
  },
  data () {
    return {
      openMenu: false,
      items: [
        { title: 'Projetos', child: ['Novo', 'Visualizar'], render: 'register-project'},
        { title: 'Alunos', child: ['Novo', 'Visualizar'], render: 'register-student'},
        { title: 'Grupos', child: ['Novo', 'Visualizar'], render: 'register-group'},
        { title: 'Aulas', child: ['Novo', 'Visualizar'], render: 'register-class'},
        { title: 'Publicações', child: ['Novo', 'Visualizar'], render: 'register-publication'},
        { title: 'Contato', child: ['Novo', 'Visualizar'], render: 'CONTATO'},
      ],
      right: null
    }
  },
  methods: {
    callViewList(title, child, render){
      if(child === 'Visualizar') {
        EventBus.$emit('SHOW-REGISTER-Alunos', false)
        EventBus.$emit('SHOW-REGISTER-Projetos', false)
        EventBus.$emit('SHOW-REGISTER-Aulas', false)
        EventBus.$emit("TOP", true, title, child)
      } else {
        EventBus.$emit("SHOW-REGISTER", render)
      }
      
      // else if(title == 'Alunos'){
      //   EventBus.$emit("TOP", false, title, child)
      //   EventBus.$emit('SHOW-REGISTER-'+title, true)
      // } else if(title == 'Projetos') {
      //   EventBus.$emit("TOP", false, title, child)
      //   EventBus.$emit('SHOW-REGISTER-'+title, true)
      // }
    }
  },
  mounted() {
    EventBus.$on('OPEN-MENU', (payload) => {
      console.log("ae disgraca")
      this.openMenu = payload
    })
  },
}
</script>

<style>
  .full-height {
    height: 100%;
  }
</style>

