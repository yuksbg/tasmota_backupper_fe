import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import FontAwesomeIcon from './helpers/fontawesome-icons'

import "./assets/css/site.less";

import moshaToast from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'


createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(moshaToast)
    .use(
        VueTippy,
        // optional
        {
          directive: 'tippy', // => v-tippy
          component: 'tippy', // => <tippy/>
          componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
          defaultProps: {
            placement: 'auto-end',
            allowHTML: true,
            arrow: false,
          }, // => Global default options * see all props
        }
      )
    .mount('#app')
