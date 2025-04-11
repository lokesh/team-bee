import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import GameView from '@/views/GameView.vue'
import LoginView from '@/views/LoginView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/game',
    name: 'Game',
    component: GameView,

    /* Req user to have been picked */
    beforeEnter: (to, from, next) => {
      if (!store.state.userId) {
        next({ name: 'Login' });
      } else {
        next();
      }
    },
  },
]

const router = new VueRouter({
  routes
})

export default router
