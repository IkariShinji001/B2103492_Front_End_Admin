import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const toastOptions = {
    position: "top-right",
    timeout: 3000,
};
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


const app = createApp(App)

app.use(Quasar, { plugins: {}}).use(Toast, toastOptions).use(router)

app.mount('#app')
