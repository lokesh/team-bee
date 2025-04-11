import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
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
      const userStore = useUserStore()
      if (!userStore.currentUserId) {
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
