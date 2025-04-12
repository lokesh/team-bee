import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { visible } from './directives/visible'
// import eventBus from './event-bus'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// app.use(eventBus)
app.directive('visible', visible)

app.mount('#app')
