<template>
  	<div class="main-component-container">
    <div class="main-component-item">
      <generic-component v-if="currentComponent != null" :name="currentComponent" :key="componentKey"/>
      <login-modal v-if="showLoginModal"/>
    </div>
  </div>
</template>

<script>
import {EventBus} from './EventBus.js'
import GenericComponent from './GenericComponent'
import LoginModal from './LoginModal'
import { setTimeout } from 'timers';


export default {
  name: 'MainComponent',
  components: {
    GenericComponent,
    LoginModal
  },
  data () {
    return {
    	showList: true,
			showRegisterStudent: false,
			showRegisterProject: false,
      showRegisterClass: false,
      currentComponent: null,
      componentKey: 0,
      showLoginModal: false
    }
  },
  mounted() {
    EventBus.$on('SHOW', (payload) => {
    	this.showList = payload
    })
    EventBus.$on('SHOW-REGISTER', (payload) => {
      setTimeout(() => {
        this.currentComponent = payload
        console.log(this.currentComponent)
      },100)
      this.currentComponent = null
    })
    EventBus.$on('CANCEL-ACTION', (payload) => {
      this.currentComponent = null
    })
    EventBus.$on('SHOW-MODAL', (payload) => {
      this.showLoginModal = payload.showModal
    })
  }
}
</script>

<style>

.main-component-container {
  width: 800px;
  height: 400px;
}

.main-component-item {
  background-color: white;
}

</style>