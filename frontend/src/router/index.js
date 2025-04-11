import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores'
import GameView from '@/views/GameView.vue'
import LoginView from '@/views/LoginView.vue'

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
    beforeEnter: (to, from) => {
      const store = useStore()
      if (!store.userId) {
        return { name: 'Login' }
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
