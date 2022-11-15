import {createApp} from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import Maska from "maska";


const app = createApp(App)
    .use(Maska)
    .mount('#app')
