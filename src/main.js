import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routes'

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const options = {
    // You can set your default options here
};

const pinia = createPinia()

const app = createApp(App)

app.use(Toast, options);

app.use(pinia)
app.use(router)
app.mount('#app')
