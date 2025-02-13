import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Swal from 'sweetalert2'

Vue.config.productionTip = false

new Vue({
  vuetify,
  Swal,
  render: h => h(App)
}).$mount('#app')
