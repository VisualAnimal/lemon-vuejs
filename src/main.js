// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Vant from "vant"
import 'vant/lib/index.css';


// import NutUI from "@nutui/nutui";
// import "@nutui/nutui/dist/style.css";



const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(NutUI)
app.use(Vant)
app.use(router)

app.mount('#app')
