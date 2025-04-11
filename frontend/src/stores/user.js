import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUserId: null
  }),

  actions: {
    setUserId(userId) {
      this.currentUserId = userId
    },

    async loadUsers() {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/users')
        this.users = await response.json()
      } catch (error) {
        console.error('Error loading users:', error)
      }
    }
  },

  getters: {
    currentUser: (state) => {
      return state.users.find(user => user.id === state.currentUserId)
    },

    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    }
  }
}) 