import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { visible } from './directives/visible'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.directive('visible', visible)

app.mount('#app')
