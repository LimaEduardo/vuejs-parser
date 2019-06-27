<template>
  <v-layout>
    <v-icon
      @click.stop="openMenu"
    >
      menu
    </v-icon>
  </v-layout>
</template>

<script>
import {EventBus} from './EventBus.js'

export default {
  name: 'Menu',
  components: {
  },
  data () {
    return {
      isMenuOpen: false,
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ],
      right: null
    }
  },
  methods: {
    openMenu() {
      this.isMenuOpen = !this.isMenuOpen
      EventBus.$emit("OPEN-MENU", this.isMenuOpen)
    }
  }
}
</script>
