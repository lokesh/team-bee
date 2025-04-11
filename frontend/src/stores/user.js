import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUserId: null
  }),

  actions: {
    setUserId(userId) {
      this.currentUserId = userId
      localStorage.setItem('teamBeeUserId', JSON.stringify(userId))
    },

    clearUser() {
      this.currentUserId = null
      localStorage.removeItem('teamBeeUserId')
    },

    async loadUsers() {
      try {
        console.log('Fetching users from API...')
        const response = await fetch('/api/users')
        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        
        const responseText = await response.text()
        console.log('Raw response text:', responseText)
        
        try {
          const data = JSON.parse(responseText)
          console.log('Parsed JSON data:', data)
          this.users = data
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError)
          console.error('Failed to parse text:', responseText)
          throw parseError
        }
      } catch (error) {
        console.error('Error loading users:', error)
        throw error
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