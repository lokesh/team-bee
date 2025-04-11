import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

/* Custom directives */
Vue.directive('visible', (el, binding) => {
    el.style.visibility = binding.value ? 'visible' : 'hidden'
});

/* Vue config */

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
