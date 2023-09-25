// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import Vant from "vant"
import 'vant/lib/index.css';
import { Tab } from 'vant';
import { Tabs } from 'vant';
import { Sidebar } from 'vant';
import { SidebarItem } from 'vant';
import { Sticky } from 'vant';
import { Icon } from 'vant';
import { Tag } from 'vant';
import { Card } from 'vant';


// import NutUI from "@nutui/nutui";
// import "@nutui/nutui/dist/style.css";



const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(NutUI)
app.use(Tab)
app.use(Tabs)
app.use(Sidebar)
app.use(SidebarItem)
app.use(Sticky)
app.use(Icon)
app.use(Tag)
app.use(Card)
app.use(router)

app.mount('#app')
