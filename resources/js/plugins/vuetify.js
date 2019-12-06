import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar'

import es from 'vuetify/es5/locale/es'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  },
})
Vue.use(VuetifyToast)

export default new Vuetify({
  lang: {
    locales: { es },
    current: 'es',
  },
})
