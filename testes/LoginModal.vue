<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <v-flex xs12 class="text-xs-center">
                <span> <p class="title"> Acesse a sua conta </p> </span>
              </v-flex>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
               <v-flex xs12>
                  <v-text-field
                    label="Email"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    label="Senha"
                  ></v-text-field>
                </v-flex>

                <v-flex xs12  class="text-xs-right">
                  <a href="#">Esqueci minha senha</a>
                </v-flex>

            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div class="container-button">
                <v-flex xs12>
                  <v-btn color="success" block >Success</v-btn>
                </v-flex>
              </div>

              <div class="container-button">
                <v-flex xs12  class="text-xs-center">
                  <a href="#">Ainda não é cadastrado?</a>
                </v-flex>
              </div>

            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script>
import {EventBus} from './EventBus.js'

export default {
  name: "LoginModal",
  methods: {
    closeModal(){
      EventBus.$emit("SHOW-MODAL", {showModal: true})
    }
  }
}
</script>

<style>
.title {
  color: #516a94;
}

.container-button {
  padding: 5px;
}
  .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 25px;

}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

